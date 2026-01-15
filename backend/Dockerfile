FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock.json primero (mejor cache)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto (ajusta al que uses)
EXPOSE 3001

# Comando de arranque
CMD ["node", "server.js"]

