# TaskForge - Docker Setup Guide

## Prerequisites
- Docker Desktop installed (https://www.docker.com/products/docker-desktop)
- Docker Compose installed (usually comes with Docker Desktop)

## Quick Start

### 1. Build and Start All Services
From the `taskforge` directory, run:
```bash
docker-compose up --build
```

This command will:
- Build the backend Docker image
- Build the frontend Docker image
- Start PostgreSQL database
- Start the API server
- Start the frontend web server
- Set up networking between all services

### 2. Access the Application
- **Frontend**: http://localhost (on port 80)
- **API**: http://localhost:4500/api
- **Database**: localhost:5432 (from host machine)

### 3. First Time Setup (Initialize Database)

After starting the containers, you may need to run database migrations:

```bash
docker-compose exec api npm run typeorm migration:run
```

Or if using NestJS database initialization:
```bash
docker-compose exec api npm run seed
```

## Service Details

### Database (PostgreSQL)
- **Container**: taskforge-db
- **Port**: 5432 (internal), 5432 (exposed on host)
- **Credentials**:
  - User: `taskforge`
  - Password: `taskforge_secure_password`
  - Database: `taskforge_db`

### Backend API (NestJS)
- **Container**: taskforge-api
- **Port**: 4500
- **Depends on**: Database (waits for healthy status)
- **Health Check**: Yes (every 30 seconds)

### Frontend (React + Nginx)
- **Container**: taskforge-web
- **Port**: 80
- **Depends on**: API
- **Features**:
  - Nginx serving static React build
  - Gzip compression enabled
  - SPA routing support
  - API proxy to backend
  - Caching for static assets

## Common Commands

### View logs
```bash
docker-compose logs -f api          # Backend logs
docker-compose logs -f web          # Frontend logs
docker-compose logs -f db           # Database logs
docker-compose logs -f              # All logs
```

### Stop services
```bash
docker-compose down
```

### Stop and remove data (clean slate)
```bash
docker-compose down -v
```

### Rebuild everything
```bash
docker-compose down -v && docker-compose up --build
```

### Run commands in containers
```bash
docker-compose exec api npm run lint
docker-compose exec web npm run build
```

## Environment Configuration

### Setting Up Environment Variables (IMPORTANT! ⚠️)

Before running docker-compose, you must create a `.env` file in the `taskforge` directory:

**1. Copy the example file:**
```bash
cp .env.example .env
```

**2. Edit `.env` with your configuration:**
```env
DB_USERNAME=taskforge
DB_PASSWORD=your_secure_postgres_password_here
DB_NAME=taskforge_db
DB_PORT=5432
PORT=4500
JWT_SECRET=your_very_secure_jwt_secret_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
VITE_API_URL=http://localhost:4500/api
```

**3. Keep `.env` secret:**
- ⚠️ **NEVER commit `.env` to git** - it contains sensitive credentials
- The `.gitignore` file already excludes `.env`
- `.env.example` (without secrets) can be committed to show the structure

### Security Best Practices

✅ **What we do right:**
- Secrets stored in `.env` file (git-ignored)
- `docker-compose.yml` uses `env_file: - .env` to read variables at runtime
- Environment variables substituted via `${VARIABLE}` syntax
- Safe to commit docker-compose files (no hardcoded credentials)

❌ **What NOT to do:**
- Never hardcode passwords in docker-compose.yml
- Never commit .env file to version control
- Never paste secrets in Dockerfile

## Environment Variables

These are configured in `docker-compose.yml`. For production, update:
- `POSTGRES_PASSWORD` - Change to a strong password
- `JWT_SECRET` - Use a strong secret key
- `DATABASE_*` - Connection details (usually don't need changes)

## Troubleshooting

### "Port 80 already in use"
Change the port mapping in docker-compose.yml:
```yaml
web:
  ports:
    - "3000:80"  # Change 80 to 3000
```

### "Port 4500 already in use"
Change the port mapping in docker-compose.yml:
```yaml
api:
  ports:
    - "4501:4500"  # Change 4500 to 4501
```

### "Database connection refused"
Make sure the database container is healthy:
```bash
docker-compose logs db
```

### Frontend shows blank page
Check browser console for errors and verify API is running:
```bash
docker-compose logs api
```

### Rebuild without cache
```bash
docker-compose up --build --no-cache
```

## Production Considerations

1. **Secrets Management**: Use Docker secrets or environment files instead of hardcoding
2. **Database**: Back up `postgres_data` volume regularly
3. **SSL/TLS**: Add a reverse proxy (Traefik, Nginx) in front for HTTPS
4. **Resource Limits**: Add resource constraints to services
5. **Security**: Don't expose ports unnecessarily in production

## Architecture

```
┌─────────────────────────────────────────────────┐
│             Docker-Compose Network              │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────┐│
│  │    Nginx     │  │   NestJS     │  │  PG   ││
│  │  (Frontend)  │  │    (API)     │  │ (DB)  ││
│  │   Port 80    │  │  Port 4500   │  │P 5432││
│  │              │  │              │  │       ││
│  └────────┬─────┘  └─────┬────────┘  └───────┘│
│           │              │                     │
│           └──────────────┼─────────────────────┤
│                          │ Health checks       │
│           ┌──────────────┴─────────────────────┤
│           │                                    │
│      Shared Network: taskforge-network        │
└─────────────────────────────────────────────────┘

User → http://localhost → Nginx → Routes to:
  - Static assets (React build)
  - /api/* → NestJS API → PostgreSQL
```

## Next Steps

1. Deploy to a cloud provider (AWS ECS, Google Cloud Run, DigitalOcean App Platform)
2. Set up CI/CD pipeline to build images automatically
3. Use Docker Swarm or Kubernetes for orchestration
4. Implement monitoring and logging (ELK stack, Datadog, etc.)
