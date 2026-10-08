# Etapa 1: Construcción de React con Vite
FROM node:22 AS build-stage
WORKDIR /app

# Argumento que vendrá en tiempo de construcción
ARG DEPLOY_ENV=dev

# Copiar archivos y dependencias
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Compilar la aplicación React según el entorno
RUN if [ "$DEPLOY_ENV" = "prod" ]; then \
      npm run build:prod; \
    else \
      npm run build:dev; \
    fi

# Etapa 2: Servir con Apache
FROM php:apache

# Habilitar mod_rewrite en Apache
RUN a2enmod rewrite

# Copiar el build de React desde la etapa anterior a la carpeta de Apache
# Vite genera en /dist, no en /dist/DASHBOARD/browser/
COPY --from=build-stage /app/dist/ /var/www/html/

# Copiar archivo .htaccess con reglas para SPA (Single Page Application)
COPY .docker/apache/.htaccess /var/www/html/.htaccess

# Ajustar permisos
RUN chown -R www-data:www-data /var/www/html/*

# Asegurar que Apache sirva el index.html correctamente
RUN echo "DirectoryIndex index.html" >> /etc/apache2/apache2.conf

# Exponer el puerto 80
EXPOSE 80