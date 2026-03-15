FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Wystawiamy port Vite
EXPOSE 5173
# Flaga --host jest kluczowa w Dockerze dla Vite
CMD ["npm", "start"]