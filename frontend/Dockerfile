# frontend/Dockerfile
# Multi-stage build: compile React, then serve with nginx

# ---- Stage 1: builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# VITE_* variables are baked into the JS at build time.
# Defaults suit local docker-compose; production overrides them.
ARG VITE_BACKEND_URL=http://localhost:8080
ARG VITE_SOCKET_URL=http://localhost:8080

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Stage 2: nginx ----
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
