from fastapi import FastAPI
from pydantic import BaseModel
import mysql.connector
import pandas as pd
import json
from datetime import datetime

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Asd123??",
    database="lovesync"
)

query = """
SELECT
  u.id,
  u.nombre,
  u.mail,
  u.fechaNacimiento,
  p.bio,
  p.edad,
  p.intereses
FROM usuarios u
JOIN perfil p ON u.id = p.user_id
"""

df = pd.read_sql(query, conn)
conn.close()

def build_intdo(row):
    bio = row["bio"] if row["bio"] else ""
    
    intereses = ""
    if row["intereses"]:
        intereses_list = json.loads(row["intereses"])
        intereses = " ".join(intereses_list)

    return f"{intereses} {bio}"

df["intdo"] = df.apply(build_intdo, axis=1)

# Resetear índices para asegurar que coincidan
df = df.reset_index(drop=True)
users_ml = df[["id", "nombre", "mail", "fechaNacimiento", "bio", "edad", "intereses", "intdo"]].reset_index(drop=True)

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

stop_words_es = ['el', 'la', 'los', 'las', 'de', 'y', 'a', 'en']

cv = CountVectorizer(
    max_features=100,
    stop_words=stop_words_es
)

user_vectors = cv.fit_transform(users_ml["intdo"].values.astype("U"))

# -------------------------
# Crear app FastAPI
# -------------------------
app = FastAPI()

# -------------------------
# Función para calcular edad
# -------------------------
def calcular_edad(fecha_nacimiento):
    """Calcula la edad basada en la fecha de nacimiento comparada con hoy"""
    if isinstance(fecha_nacimiento, str):
        fecha_nacimiento = datetime.strptime(fecha_nacimiento, "%Y-%m-%d").date()
    
    hoy = datetime.now().date()
    edad = hoy.year - fecha_nacimiento.year
    
    # Ajustar si aún no ha pasado el cumpleaños este año
    if (hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day):
        edad -= 1
    
    return edad

# -------------------------
# Esquema JSON de entrada
# -------------------------
class UserInput(BaseModel):
    bio: str
    intereses: list[str]

# -------------------------
# Endpoint de recomendación
# -------------------------
@app.post("/matches")
def get_matches(user: UserInput):
    nuevo_intdo = " ".join(user.intereses) + " " + user.bio
    new_vector = cv.transform([nuevo_intdo])

    sims = cosine_similarity(new_vector, user_vectors)[0]
    
    # Crear lista de matches con sus puntuaciones, filtrando score > 0
    matches = []
    for idx, score in enumerate(sims):
        if score > 0:
            # Obtener datos de forma segura
            row = users_ml.iloc[idx]
            
            # Obtener intereses como lista
            intereses_list = []
            try:
                if pd.notna(row["intereses"]) and row["intereses"]:
                    intereses_list = json.loads(row["intereses"])
            except Exception as e:
                print(f"Error parsing intereses for idx {idx}: {e}")
                intereses_list = []
            
            # Obtener bio
            bio = row["bio"] if pd.notna(row["bio"]) else ""
            
            # Calcular edad desde la fecha de nacimiento
            fecha_nacimiento = row["fechaNacimiento"]
            edad_calculada = calcular_edad(fecha_nacimiento)
            
            matches.append({
                "match_id": int(row["id"]),
                "match_nombre": str(row["nombre"]),
                "match_email": str(row["mail"]),
                "match_fechaNacimiento": str(row["fechaNacimiento"]),
                "match_bio": bio,
                "match_edad": edad_calculada,
                "match_intereses": intereses_list,
                "score": float(score)
            })
    
    # Ordenar por score descendente
    matches = sorted(matches, key=lambda x: x["score"], reverse=True)
    
    return {
        "total_matches": len(matches),
        "matches": matches
    }
