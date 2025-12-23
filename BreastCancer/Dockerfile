# ---------- Build ----------
FROM node:18-alpine AS build

WORKDIR /app

# Copier uniquement les dépendances pour le cache Docker
COPY package.json .
COPY package-lock.json .

RUN npm install

# Copier le reste du projet
COPY . .

# ⚠️ CI FIX : on utilise Vite directement (PAS tsc)
RUN npx vite build

# ---------- Nginx ----------
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
