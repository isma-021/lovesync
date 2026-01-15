# Usamos una imagen ligera de Python
FROM python:3.10-slim

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias para compilar librerías científicas
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiamos primero los requerimientos para aprovechar la caché de Docker
COPY requirements.txt .

# Instalamos las librerías de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el código fuente y la carpeta ml (si existe)
COPY . .

# Exponemos el puerto de FastAPI
EXPOSE 8000

# Comando para arrancar la app
CMD ["uvicorn", "ml_api:app", "--host", "0.0.0.0", "--port", "8000"]
