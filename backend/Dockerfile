# backend/Dockerfile
# Stage: build the runtime image for the Express API

FROM node:20-alpine

# Working directory inside the container
WORKDIR /app

# Copy dependency manifests first (enables Docker layer caching)
COPY package*.json ./

# Install all dependencies cleanly from the lockfile
RUN npm ci

# Copy the application code
COPY backend ./backend

# Port the Express server listens on
EXPOSE 8000

# Start the backend
CMD ["node", "backend/server.js"]
