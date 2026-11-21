# backend/Dockerfile — production image for the Express API

FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Install production dependencies only (cached unless the lockfile changes)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY backend ./backend

# Run as the unprivileged "node" user that ships with the image
USER node

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT:-8000}/health || exit 1

CMD ["node", "backend/server.js"]
