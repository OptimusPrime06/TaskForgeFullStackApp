# Development stage - NestJS dev server with watch mode
FROM node:20-alpine

# Copy shared package so it is accessible at /packages/shared
COPY packages/shared /packages/shared

WORKDIR /app

# Copy package files
COPY app/api/package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY app/api .

# Expose API port
EXPOSE 4500

# Start NestJS in development mode with watch/hot reload
CMD ["npm", "run", "start:dev"]
