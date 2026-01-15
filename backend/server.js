import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = "dev_secret_lovesync";

// Cache en memoria para matches por usuario
const matchesCache = new Map();

app.post("/api/register", async (req, res) => {
  const { name, email, password, birthdate, genero, genint, interests, bio } = req.body;

  if (!name || !email || !password || !birthdate || !genero || !genint) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    // Insertar en tabla usuarios
    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre, mail, passwd, fechaNacimiento) VALUES (?, ?, ?, ?)",
      [name, email, hash, birthdate]
    );

    const userId = result.insertId;

    // Calcular edad basado en fechaNacimiento
    const birthDate = new Date(birthdate);
    const today = new Date();
    let edad = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      edad--;
    }

    // Procesar intereses - puede ser string o array
    let interestsArray = [];
    if (interests) {
      if (typeof interests === "string") {
        try {
          interestsArray = JSON.parse(interests);
        } catch (e) {
          interestsArray = [interests];
        }
      } else if (Array.isArray(interests)) {
        interestsArray = interests;
      }
    }

    // Insertar en tabla perfil
    await db.execute(
      "INSERT INTO perfil (user_id, genero, genint, bio, intereses, ubicacion, LenguajeDelAmor, edad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        genero,
        genint,
        bio || null,
        JSON.stringify(interestsArray),
        "No especificada",
        "Tiempo de calidad",
        edad
      ]
    );

    res.json({ message: "Usuario registrado", userId, edad });
  } catch (err) {
    console.error("DETAILED ERROR:", err);
    
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email ya registrado" });
    }
    res.status(500).json({ error: "Error del servidor" });
  }
});


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    // 1. Asegúrate de pedir "passwd" que es el nombre en tu tabla
    const [rows] = await db.execute(
      "SELECT u.id, u.nombre, u.mail, u.passwd, u.fechaNacimiento, p.bio, p.edad, p.genero, p.genint, p.intereses FROM usuarios u LEFT JOIN perfil p ON p.user_id = u.id WHERE u.mail = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = rows[0];
    
    console.log(`🔑 Usuario encontrado en BD: id=${user.id}, mail=${user.mail}`);

    // 2. Usamos user.passwd (el nombre exacto de la columna en la DB)
    const validPassword = await bcrypt.compare(password, user.passwd);

    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    console.log(`✅ Token generado con userId: ${user.id}`);

  let interestsArray = [];

if (user.intereses !== null && user.intereses !== undefined) {
  // Caso 1: viene como string (JSON o texto plano)
  if (typeof user.intereses === "string") {
    try {
      const parsed = JSON.parse(user.intereses);
      interestsArray = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      interestsArray = user.intereses.trim() !== "" ? [user.intereses] : [];
    }
  }

  // Caso 2: ya es array (por ejemplo JSON desde MySQL)
  else if (Array.isArray(user.intereses)) {
    interestsArray = user.intereses;
  }

  // Caso 3: cualquier otro tipo inesperado
  else {
    interestsArray = [];
  }
}

  // 🔥 NUEVA: Hacer petición a localhost:8000/matches
  let matchesData = null;
try {
    // 1. Cambiamos 'localhost' por 'algorithm'
    // 2. Cambiamos '/matches' por '/recommend'
    const matchesResponse = await fetch("http://algorithm:8000/recommend", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio: user.bio || "",
        intereses: interestsArray
      })
    });
    
    // ... resto del código ...
    
    if (matchesResponse.ok) {
      matchesData = await matchesResponse.json();
      console.log("✅ Matches obtenidos del servidor Python:", matchesData);
      // 🔥 Guardar en cache en memoria
      matchesCache.set(user.id, matchesData.matches || []);
      console.log(`✅ Matches cacheados para user ${user.id}`);
    } else {
      console.warn("⚠️ Error fetching matches:", matchesResponse.status);
    }
  } catch (err) {
    console.warn("⚠️ No se pudo conectar a localhost:8000/matches:", err.message);
  }

  res.json({
    message: "Login correcto",
    token,
    user: {
      id: user.id,
      nombre: user.nombre, // Enviamos el nombre al frontend
      email: user.mail,
      cum: user.fechaNacimiento,
      bio: user.bio || null,
      intereses: JSON.stringify(interestsArray), // Siempre como JSON string
      idenGenero: user.genero || null,
      idenGenint: user.genint || null
    }
  });

  } catch (err) {
    // IMPORTANTE: Imprime el error en consola para saber qué falló exactamente
    console.error("Error en login:", err); 
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};

// Endpoint para actualizar perfil
app.put("/api/updateProfile", verifyToken, async (req, res) => {
  const { nombre, cumpl, genero, genint, interests, bio } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  try {
    // Parsear interests si viene como string
    let interestsArray = [];
    if (interests) {
      if (typeof interests === "string") {
        try {
          interestsArray = JSON.parse(interests);
        } catch (e) {
          interestsArray = [interests];
        }
      } else if (Array.isArray(interests)) {
        interestsArray = interests;
      }
    }

    // Actualizar tabla usuarios
    if (nombre || cumpl) {
      const updateUsuariosQuery = [];
      const updateUsuariosValues = [];

      if (nombre) {
        updateUsuariosQuery.push("nombre = ?");
        updateUsuariosValues.push(nombre);
      }
      if (cumpl) {
        updateUsuariosQuery.push("fechaNacimiento = ?");
        updateUsuariosValues.push(cumpl);
      }

      updateUsuariosValues.push(userId);

      await db.execute(
        `UPDATE usuarios SET ${updateUsuariosQuery.join(", ")} WHERE id = ?`,
        updateUsuariosValues
      );
    }

    // Actualizar tabla perfil
    if (genero || genint || interests || bio) {
      const updatePerfilQuery = [];
      const updatePerfilValues = [];

      if (genero) {
        updatePerfilQuery.push("genero = ?");
        updatePerfilValues.push(genero);
      }
      if (genint) {
        updatePerfilQuery.push("genint = ?");
        updatePerfilValues.push(genint);
      }
      if (interests) {
        updatePerfilQuery.push("intereses = ?");
        updatePerfilValues.push(JSON.stringify(interestsArray));
      }
      if (bio) {
        updatePerfilQuery.push("bio = ?");
        updatePerfilValues.push(bio);
      }

      updatePerfilValues.push(userId);

      await db.execute(
        `UPDATE perfil SET ${updatePerfilQuery.join(", ")} WHERE user_id = ?`,
        updatePerfilValues
      );
    }

    res.json({ message: "Perfil actualizado correctamente" });
  } catch (err) {
    console.error("Error al actualizar perfil:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Endpoint para obtener los matches del usuario
app.get("/api/matches", verifyToken, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  try {
    // Obtener todos los matches donde el usuario es user_id_1 o user_id_2
    const [matches] = await db.execute(
      `SELECT 
        CASE 
          WHEN user_id_1 = ? THEN user_id_2 
          ELSE user_id_1 
        END as matched_user_id,
        estado,
        fechaMatch
      FROM matches 
      WHERE (user_id_1 = ? OR user_id_2 = ?) 
        AND estado IN ('aceptado','pendiente')
      ORDER BY fechaActualizacion DESC`,
      [userId, userId, userId]
    );

    if (matches.length === 0) {
      return res.json({ matches: [] });
    }

    // Obtener datos de los usuarios con match
    const matchedUserIds = matches.map(m => m.matched_user_id);
    const placeholders = matchedUserIds.map(() => "?").join(",");

    const [users] = await db.execute(
      `SELECT u.id, u.nombre, p.bio, p.genero, p.intereses
       FROM usuarios u
       LEFT JOIN perfil p ON p.user_id = u.id
       WHERE u.id IN (${placeholders})`,
      matchedUserIds
    );

    res.json({ matches: users });
  } catch (err) {
    console.error("Error al obtener matches:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Endpoint para obtener usuarios disponibles (Discovery Mode)
app.get("/api/discovery", verifyToken, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  try {
    // 🔥 Primero, obtener matches del cache (servicio externo)
    let externalMatches = [];
    if (matchesCache.has(userId)) {
      const cached = matchesCache.get(userId);
      console.log(`📦 Usando matches cacheados para user ${userId}:`, cached.length);
      externalMatches = cached.map(match => ({
        id: match.match_id,
        nombre: match.match_nombre,
        email: match.match_email,
        fechaNacimiento: match.match_fechaNacimiento,
        genero: null, // Los datos del servicio externo no incluyen género
        bio: match.match_bio,
        intereses: match.match_intereses,
        avatar: null,
        compatibilityScore: match.score || 0,
        source: "external" // Marcamos como externo
      }));
    }

    // Obtener el perfil del usuario actual para filtrar por preferencias
    const [currentUserProfile] = await db.execute(
      `SELECT genint FROM perfil WHERE user_id = ?`,
      [userId]
    );

    const userGenint = currentUserProfile[0]?.genint || "todos";

    // Obtener usuarios de la BD (excluir actuales y con match)
    const [users] = await db.execute(
      `SELECT u.id, u.nombre, u.fechaNacimiento, p.genero, p.bio, p.intereses
       FROM usuarios u
       LEFT JOIN perfil p ON p.user_id = u.id
       WHERE u.id != ?
         AND u.id NOT IN (
           SELECT CASE 
             WHEN user_id_1 = ? THEN user_id_2 
             ELSE user_id_1 
           END
           FROM matches 
           WHERE (user_id_1 = ? OR user_id_2 = ?)
             AND estado IN ('aceptado', 'pendiente', 'rechazado')
         )
       ORDER BY u.id DESC
       LIMIT 50`,
      [userId, userId, userId, userId]
    );

    // Calcular compatibilidad para usuarios de BD
    const usersWithScore = users.map((user) => {
      let compatibilityScore = 50; // Base score

      // Filtrar por género de interés
      if (userGenint !== "todos" && user.genero !== userGenint) {
        compatibilityScore -= 30;
      }

      // Bonus si cumple el criterio de género
      if (userGenint === "todos" || user.genero === userGenint) {
        compatibilityScore += 10;
      }

      return {
        ...user,
        compatibilityScore: Math.max(0, Math.min(100, compatibilityScore)),
        source: "local" // Marcamos como local
      };
    });

    // 🔥 Combinar matches externos y locales, ordenados por score
    const allMatches = [...externalMatches, ...usersWithScore];
    allMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json({ users: allMatches });
  } catch (err) {
    console.error("Error al obtener usuarios para discovery:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Endpoint para hacer un match
app.post("/api/makeMatch", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { targetUserId } = req.body;

  console.log(`🔐 userId desde token: ${userId} (tipo: ${typeof userId})`);
  console.log(`🎯 targetUserId desde body: ${targetUserId} (tipo: ${typeof targetUserId})`);

  if (!userId || !targetUserId) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  if (userId === targetUserId) {
    return res.status(400).json({ error: "No puedes hacer match contigo mismo" });
  }

  try {
    // 🔥 Validar que targetUserId existe en la BD
    const currentUserIdNum = parseInt(userId, 10);
    const targetUserIdNum = parseInt(targetUserId, 10);
    
    console.log(`📊 currentUserIdNum: ${currentUserIdNum}, targetUserIdNum: ${targetUserIdNum}`);
    
    if (isNaN(currentUserIdNum) || isNaN(targetUserIdNum)) {
      return res.status(400).json({ error: "IDs de usuario inválidos" });
    }
    
    console.log(`🔍 Verificando si usuario ${targetUserIdNum} existe en BD...`);
    
    const [targetUserExists] = await db.execute(
      `SELECT id FROM usuarios WHERE id = ?`,
      [targetUserIdNum]
    );

    console.log(`✅ Resultado de búsqueda: ${targetUserExists.length} usuarios encontrados`);

    if (targetUserExists.length === 0) {
      console.warn(`⚠️ Usuario ${targetUserIdNum} no encontrado en BD (probablemente del servicio externo)`);
      return res.status(404).json({ error: "Usuario no encontrado en la BD" });
    }

    // Normalizamos para que user_id_1 sea siempre menor que user_id_2
    const user_id_1 = Math.min(currentUserIdNum, targetUserIdNum);
    const user_id_2 = Math.max(currentUserIdNum, targetUserIdNum);

    // Verificar que AMBOS usuarios existen en la BD (evita fallo de FK)
    const [foundBoth] = await db.execute(
      `SELECT id FROM usuarios WHERE id IN (?, ?)`,
      [user_id_1, user_id_2]
    );
    
    if (foundBoth.length < 2) {
      console.warn(`⚠️ Falta usuario en BD para ids: ${user_id_1}, ${user_id_2}`);
      return res.status(404).json({ error: "Alguno de los usuarios no existe en la base de datos" });
    }

    console.log(`🔁 Insertando match con user_id_1=${user_id_1} user_id_2=${user_id_2}`);

    // Verificar si ya existe un match
    const [existingMatch] = await db.execute(
      `SELECT * FROM matches WHERE user_id_1 = ? AND user_id_2 = ?`,
      [user_id_1, user_id_2]
    );

    if (existingMatch.length > 0) {
      const match = existingMatch[0];
      if (match.estado === "pendiente") {
        // El otro usuario ya hizo match, aceptamos
        await db.execute(
          `UPDATE matches SET estado = 'aceptado', quien_acepta = ? WHERE user_id_1 = ? AND user_id_2 = ?`,
          [userId, user_id_1, user_id_2]
        );
        return res.json({ message: "¡Match aceptado!", status: "accepted" });
      } else {
        return res.status(409).json({ error: "Ya existe un match con este usuario" });
      }
    }

    // Crear nuevo match con estado 'aceptado' automáticamente (para demo)
    await db.execute(
      `INSERT INTO matches (user_id_1, user_id_2, estado, quien_acepta) VALUES (?, ?, 'aceptado', ?)`,
      [user_id_1, user_id_2, userId]
    );

    res.json({ message: "¡Match aceptado automáticamente!", status: "accepted" });
  } catch (err) {
    console.error("Error al hacer match:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Endpoint para eliminar un match
app.delete("/api/deleteMatch", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { targetUserId } = req.body;

  if (!userId || !targetUserId) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    // Normalizamos para que user_id_1 sea siempre menor que user_id_2
    const user_id_1 = Math.min(userId, targetUserId);
    const user_id_2 = Math.max(userId, targetUserId);

    // Eliminar el match
    const [result] = await db.execute(
      `DELETE FROM matches WHERE user_id_1 = ? AND user_id_2 = ?`,
      [user_id_1, user_id_2]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Match no encontrado" });
    }

    res.json({ message: "Match eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar match:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.listen(3001, () => {
  console.log("Backend en http://localhost:3001");
});
