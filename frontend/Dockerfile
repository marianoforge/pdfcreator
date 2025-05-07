# Etapa de construcción
FROM node:16-alpine as build

WORKDIR /app

# Copiar archivos de configuración del proyecto
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY eslint.config.js ./
COPY tailwind.config.js ./
COPY index.html ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY src/ ./src/
COPY public/ ./public/

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar configuración de Nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copiar archivos estáticos de la etapa de construcción
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puertos
EXPOSE 80 443

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"] 