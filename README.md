# ❤️ LoveSync - Plataforma de Matchmaking Inteligente

Este proyecto implementa una arquitectura completa de microservicios para una aplicación de citas. Integra un Frontend moderno, un Backend robusto y un servicio de Inteligencia Artificial para recomendaciones personalizadas.

---

## 🚀 1. Ejecución Rápida con Docker (Recomendado)

Esta es la forma más sencilla de levantar todo el sistema (Base de datos, Backend, Frontend y Algoritmo) con un solo comando, sin instalar dependencias locales.

### Requisitos
- **Docker** y **Docker Compose** instalados.

### Pasos
1. Abre una terminal en la carpeta raíz del proyecto.
2. Construye y levanta los contenedores:

```bash
   docker-compose up -d
```

    Espera unos segundos a que todos los servicios arranquen.

    Importar Base de Datos:

        Conéctate a tu gestor de BD favorito (DBeaver, Workbench) usando:

            Host: localhost

            Puerto: 3306

            User/Pass: lovesync / Asd123??

        Ejecuta el script database.sql ubicado en la carpeta mysql/.

Accesos

    Frontend (Web): http://localhost:8080

    Backend (API Node): http://localhost:3001

    Algoritmo (API Python): http://localhost:8000/docs

    Base de Datos: Puerto 3306

📂 2. Estructura del Proyecto

El código se organiza en microservicios contenerizados:
Plaintext

lovesync/
│
├── docker-compose.yml       # Orquestador de todos los servicios
├── readme.md                # Este archivo
│
├── backend/                 # Lógica del Servidor y ML
│   ├── Dockerfile           # Imagen para Node.js
│   ├── Dockerfile.ml        # Imagen para Python (ML)
│   ├── server.js            # Servidor Express
│   ├── ml_api.py            # API FastAPI del algoritmo
│   ├── ml/                  # Modelos entrenados (.pkl)
│   └── ...
│
├── frontend/                # Interfaz de Usuario
│   ├── Dockerfile           # Imagen para React/Vite
│   ├── src/                 # Código fuente React
│   └── ...
│
└── mysql/                   # Persistencia de Datos
    └── database.sql         # Script inicial de la BD

🛠️ 3. Ejecución Manual (Modo Legacy / Desarrollo Local)

Si prefieres ejecutar cada servicio por separado en tu máquina (sin Docker), sigue estos pasos.

⚠️ Nota Importante: Si ejecutas localmente, debes cambiar la configuración de conexión a la base de datos en db.js y ml_api.py para que el host sea localhost en lugar de mysql.
Requisitos Previos

    Node.js y npm

    Miniconda (para el entorno de Python)

    MySQL Server corriendo localmente

A. Base de Datos (MySQL)

    Asegúrate de tener MySQL corriendo.

    Crea una base de datos llamada lovesync.

    Importa el archivo mysql/database.sql.

B. Backend (Node.js)

    Accede a la carpeta: cd backend

    Instala dependencias: npm install

    Inicia el servidor: node server.js

C. Backend de Machine Learning (Python + FastAPI)

Se requiere Miniconda para evitar conflictos.

    Crea/Activa el entorno (basado en requirementsConda.md):
    Bash

conda activate gpu_lab

Accede a la carpeta: cd backend

Instala las dependencias si no lo has hecho:
Bash

pip install -r requirements.txt

Ejecuta la API:
Bash

    uvicorn ml_api:app --reload --port 8000

D. Frontend (React)

    Accede a la carpeta: cd frontend

    Instala dependencias: npm install

    Inicia en modo desarrollo: npm run dev

📋 4. Orden Recomendado de Ejecución

Si no usas Docker, el orden estricto para evitar errores de conexión es:

    MySQL (Debe estar listo para recibir conexiones).

    Backend Node.js (Conecta con MySQL).

    Backend ML (Python) (Conecta con MySQL y carga modelos).

    Frontend (Interfaz para el usuario).
