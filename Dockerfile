# Dockerfile — cacei-frontend (Angular 21)
#
# Build multi-stage: compilamos el bundle estático con Node y lo servimos con
# Nginx. La imagen final NO lleva Node ni node_modules; solo HTML/JS/CSS + Nginx,
# quedando de decenas de MB en vez de cientos.

# ---------- Etapa 1: build ----------
# Angular 21 requiere Node >= 20.19 (usamos 22 LTS).
FROM node:22-alpine AS build

WORKDIR /app

# package.json + lock primero: la capa de "npm ci" se cachea mientras las
# dependencias no cambien, así los rebuilds por cambios de código no reinstalan.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build de producción. La salida (según angular.json, sin outputPath override)
# queda en dist/cacei-frontend/browser.
RUN npm run build

# ---------- Etapa 2: runtime ----------
FROM nginx:1.27-alpine

# Plantilla de Nginx: el destino del proxy /api es configurable por la variable
# BACKEND_URL. La imagen de nginx corre envsubst sobre los archivos de
# /etc/nginx/templates/*.template al arrancar. NGINX_ENVSUBST_FILTER limita la
# sustitución SOLO a BACKEND_URL, para no pisar las variables propias de nginx
# ($host, $uri, etc.).
COPY devops/default.conf.template /etc/nginx/templates/default.conf.template
ENV BACKEND_URL=http://api:9090
ENV NGINX_ENVSUBST_FILTER=BACKEND_URL

# Copiamos solo los estáticos compilados desde la etapa de build.
COPY --from=build /app/dist/cacei-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
