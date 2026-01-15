FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json primero (cache eficiente)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de Vite (normalmente 5173)
EXPOSE 8080

# Arrancar servidor de desarrollo
CMD ["npm", "run", "dev"]

