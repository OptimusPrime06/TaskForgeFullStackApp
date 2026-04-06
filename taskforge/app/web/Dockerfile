# Development stage - Vite dev server
FROM node:20-alpine

# Copy shared package so it is accessible at /packages/shared
COPY packages/shared /packages/shared

WORKDIR /app

# Copy package files
COPY app/web/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY app/web .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server with host binding to allow external access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
