# Development stage - NestJS dev server with watch mode
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Expose API port
EXPOSE 4500

# Start NestJS in development mode with watch/hot reload
CMD ["npm", "run", "start:dev"]
