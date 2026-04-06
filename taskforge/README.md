# TaskForge - Full-Stack Project & Task Management Platform

A production-ready, full-stack project and task management application built with **NestJS**, **React 19**, **PostgreSQL**, and **Docker**. Features enterprise-grade architecture with role-based access control, drag-and-drop Kanban boards, real-time task management, and comprehensive Docker containerization.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Monorepo Structure](#monorepo-structure)
- [Architecture](#architecture)
  - [Backend Architecture](#backend-architecture)
  - [Frontend Architecture](#frontend-architecture)
  - [Shared Package](#shared-package)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Docker Deployment](#docker-deployment)
- [Development Workflow](#development-workflow)

---

## 🎯 Overview

TaskForge is a comprehensive project management solution designed to demonstrate professional full-stack development practices. The application enables teams to:

- **Create and manage projects** with detailed descriptions and team member assignment
- **Organize tasks** in a Kanban board with drag-and-drop functionality
- **Control access** with role-based permissions (Admin, Project Manager, Member, QA)
- **Track assignments** for task accountability and progress
- **Secure authentication** with JWT-based authorization tokens

The entire application is containerized with Docker and can be deployed with a single `docker-compose up` command.

---

## 📦 Monorepo Structure

TaskForge follows a **monorepo pattern** using npm workspaces, with completely separated concerns between frontend, backend, and shared utilities:

```
taskforge/
├── app/                                  # Main application workspace
│   ├── api/                             # NestJS Backend API
│   │   ├── src/
│   │   │   ├── auth/                    # Authentication module (JWT, Guards, Strategies)
│   │   │   │   ├── business.logic/      # Services and DTOs
│   │   │   │   ├── data/                # Repositories and entities
│   │   │   │   ├── decorators/          # @Roles() decorator
│   │   │   │   ├── guards/              # JWT and Roles authorization guards
│   │   │   │   ├── presentation/        # Controllers and response DTOs
│   │   │   │   └── strategies/          # JWT Passport strategy
│   │   │   ├── projects/                # Projects module (Same layered structure)
│   │   │   ├── tasks/                   # Tasks module (Same layered structure)
│   │   │   ├── users/                   # Users module (Same layered structure)
│   │   │   ├── common/                  # Shared constants, utils
│   │   │   └── app.module.ts            # Root module with TypeORM config
│   │   ├── Dockerfile                   # Multi-stage production build
│   │   └── package.json
│   │
│   └── web/                             # React Frontend
│       ├── src/
│       │   ├── api/                     # API client layer (axios-based)
│       │   │   ├── client.ts            # Axios instance with JWT interceptors
│       │   │   ├── auth.api.ts          # Authentication endpoints
│       │   │   ├── projects.api.ts      # Projects endpoints
│       │   │   ├── tasks.api.ts         # Tasks endpoints
│       │   │   └── users.api.ts         # Users endpoints
│       │   ├── stores/                  # Zustand state management
│       │   │   └── auth.store.ts        # Auth state (user, tokens, persistence)
│       │   ├── hooks/                   # Custom React hooks
│       │   │   ├── useAuth.ts           # Auth state management
│       │   │   ├── useProjects.ts       # Projects CRUD + members management
│       │   │   ├── useTasks.ts          # Tasks CRUD + status updates + deletion
│       │   │   └── useUsers.ts          # fetch all users for member selection
│       │   ├── guards/                  # Route protection
│       │   │   └── ProtectedRoute.tsx   # JWT-based route guard
│       │   ├── components/              # React components
│       │   │   ├── layout/              # DashboardLayout, Sidebar
│       │   │   └── projects/            # ProjectCard, MemberSelector, etc.
│       │   ├── pages/                   # Page components
│       │   │   ├── LoginPage.tsx
│       │   │   ├── RegisterPage.tsx
│       │   │   ├── ProjectsPage.tsx
│       │   │   └── TasksPage.tsx
│       │   ├── lib/                     # Utilities
│       │   ├── App.tsx                  # Root component with routing
│       │   └── main.tsx                 # React entry point
│       ├── Dockerfile                   # Multi-stage frontend build with Nginx
│       ├── nginx.conf                   # Production Nginx configuration
│       └── package.json
│
├── packages/                            # Shared packages workspace
│   └── shared/                          # @taskforge/shared package
│       ├── src/
│       │   ├── user.types.ts            # Role enum, IUser interface
│       │   ├── task.types.ts            # TaskStatus enum, ITask interface
│       │   └── project.types.ts         # IProject interface
│       └── package.json
│
├── docker-compose.yml                   # Production Docker orchestration
├── docker-compose.dev.yml               # Development Docker with hot reload
├── .env.example                         # Environment variables template
├── DOCKER_README.md                     # Docker quick start
├── DOCKER_SETUP.md                      # Comprehensive Docker guide
└── DEPLOYMENT_CHECKLIST.md              # Pre-deployment verification
```

---

## 🏗️ Architecture

### Backend Architecture

The backend implements a **layered/onion architecture** with clear separation of concerns across three layers:

#### 1. **Presentation Layer** (`/presentation`)
Handles HTTP requests/responses and request validation.
- **Controllers**: Route handlers with `@UseGuards()` and `@Roles()` decorators
- **DTOs**: Data Transfer Objects for request validation using class-validator
- **Example**: `ProjectsController.create()` validates input and calls the service

#### 2. **Business Logic Layer** (`/business.logic`)
Contains core application logic, independent of frameworks.
- **Services**: Orchestrate operations, implement business rules
- **Interfaces**: Define contracts (e.g., `IProjectRepository`)
- **DTOs**: Define business object structures
- **Example**: `ProjectsService.createProject()` validates business rules, calls repository

#### 3. **Data Layer** (`/data`)
Handles database interactions and ORM operations.
- **Entities**: TypeORM entity definitions (database schema)
- **Repositories**: Database query implementations
- **Example**: `ProjectRepository` implements `IProjectRepository`, handles all database operations

#### **Benefits of This Architecture:**
✅ **Testability**: Business logic is framework-agnostic  
✅ **Maintainability**: Clear separation makes code easier to modify  
✅ **Scalability**: Easy to add new features without touching existing layers  
✅ **Dependency Inversion**: Services depend on interfaces, not concrete implementations  

#### **Module Structure Example** (Projects Module):
```typescript
// projects.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Project]), UsersModule],
  controllers: [ProjectsController],
  providers: [
    { provide: IProjectRepository, useClass: ProjectRepository }, // Dependency Injection
    ProjectsService,
  ],
})
export class ProjectsModule { }
```

#### **Authentication Flow:**
1. User logs in → `AuthService` validates credentials
2. JWT tokens generated (access + refresh)
3. Tokens stored in Zustand store (frontend) and localStorage
4. Each request includes JWT in `Authorization: Bearer <token>`
5. `JwtAuthGuard` validates token; `RolesGuard` checks permissions
6. `@Roles(Role.ADMIN)` decorator restricts endpoints to specific roles

---

### Frontend Architecture

The frontend implements a **modular, hook-centric architecture** with clear layers for maintainability and reusability:

#### 1. **API Layer** (`/api`)
Abstracts HTTP communication from components.
- Uses **Axios** with interceptors for JWT token injection
- Centralized error handling
- **Benefit**: Components don't know about HTTP details; easy to switch HTTP clients
- **Example**: `projectsApi.fetchProjects()` handles the API call

#### 2. **Hooks Layer** (`/hooks`)
Custom React hooks for state management and side effects.
- **UseProjects**: Manages project CRUD + member assignment
- **UseTasks**: Manages task CRUD + status updates + deletion + assignment
- **UseUsers**: Fetches available users for member selection
- **UseAuth**: Manages authentication state
- **Benefits**: 
  - Encapsulate complex logic
  - Reusable across components
  - Testable in isolation
  - Cleaner components

#### 3. **State Management** (`/stores`)
Global state using **Zustand** with persistence.
- `useAuthStore`: User info, tokens, logout function
- **Automatic persistence** to localStorage (survives page refresh)
- **Minimal boilerplate** compared to Redux

#### 4. **Component Layer** (`/components`)
Presentational React components that:
- Consume hooks for data and actions
- Handle UI rendering and user interactions
- Pass handlers from hooks to child components
- **Example**: `ProjectCard` receives `onDelete` handler from parent

#### 5. **Route Protection** (`/guards`)
`ProtectedRoute` component validates JWT before rendering protected pages.

#### **Data Flow Diagram:**
```
User Interaction → Component → Hook (useProjects) → API (axios) → Backend
                                      ↓
                            Zustand Store (Auth)
                                      ↓
                            localStorage (Persistence)
```

#### **Optimistic UI Pattern:**
Components update UI immediately before backend confirmation:
```typescript
// 1. Delete button clicked
setProjects((prev) => prev.filter(p => p.id !== id)); // Optimistic update
// 2. API call happens in background
await projectsApi.deleteProject(id);
// 3. If error, show toast and refetch
toast.error('Failed to delete');
fetchProjects();
```

---

### Shared Package

The `@taskforge/shared` package exports **type-safe contracts** used by both backend and frontend:

#### **Contents:**

```typescript
// user.types.ts - Role-based access control
export enum Role {
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  MEMBER = 'MEMBER',
  QA = 'QA',
}

export interface IUser {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
}

// project.types.ts - Project structure
export interface IProject {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: IUser[];
  createdAt: Date;
}

// task.types.ts - Task workflow states
export enum TaskStatus {
  BACKLOG | TODO | IN_PROGRESS | IN_REVIEW | QA | DONE | REOPENED
}

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: string | null;
  projectId: string;
  createdAt: Date;
}
```

#### **Benefits:**
- ✅ **Single source of truth** for types (DRY principle)
- ✅ **Type safety** across frontend and backend
- ✅ **Easy to version** API contracts
- ✅ **Enables code generation** tools (OpenAPI, GraphQL, etc.)

---

## ✨ Key Features

### 1. **Role-Based Access Control (RBAC)**
Four roles with escalating permissions:
- **ADMIN**: Full system access, delete any project/task
- **PROJECT_MANAGER**: Create projects, assign members, delete own resources
- **MEMBER**: View projects and tasks, update task status
- **QA**: View projects and tasks (read-only)

**Implementation**:
- Backend: `@Roles(Role.ADMIN)` decorator + `RolesGuard`
- Frontend: Role checks before rendering buttons/UI

### 2. **Project Management**
- Create projects with name and description
- Assign team members during creation
- Delete projects (role-based)
- View all member projects

### 3. **Task Management**
- Create tasks within projects
- Drag-and-drop Kanban board (6 statuses)
- Assign tasks to team members
- Delete tasks (role-based)
- Real-time status updates

### 4. **Secure Authentication**
- Register new users
- Login with email/password
- JWT access + refresh tokens
- Token auto-refresh before expiration
- Token persistence in localStorage
- Logout clears all auth state

### 5. **Member Assignment**
- Multi-select dropdown to assign members
- Search members by email
- Visual role indicators (color-coded)

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **NestJS 11** | TypeScript web framework with dependency injection |
| **TypeORM 0.3** | Object-relational mapper for PostgreSQL |
| **Passport.js** | Authentication middleware (JWT strategy) |
| **PostgreSQL 16** | Relational database |
| **Class Validator** | DTO validation using decorators |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19.2** | UI library with hooks |
| **React Router 7** | Client-side routing with ProtectedRoute |
| **Zustand 5** | Lightweight state management with persistence |
| **Axios 1.14** | HTTP client with JWT interceptors |
| **dnd-kit 6.3** | Drag-and-drop library for Kanban board |
| **TailwindCSS 3** | Utility-first styling framework |
| **Vite 8** | Fast build tool and dev server |
| **TypeScript 5.9** | Type-safe JavaScript |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Docker 27** | Container runtime for consistent deployments |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Production web server (SPA routing, gzip) |
| **Alpine Linux** | Lightweight base images for small image sizes |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+** (npm 10+)
- **Docker Desktop** (for containerized deployment)
- **PostgreSQL 16** (or use Docker)

### Local Development Setup

#### 1. Install Dependencies
```bash
cd taskforge

# Install root dependencies (monorepo)
npm install

# Install workspace dependencies
npm install --workspace=@taskforge/api
npm install --workspace=@taskforge/web
npm install --workspace=@taskforge/shared
```

#### 2. Configure Environment Variables
```bash
cp .env.example .env

# Edit .env with your values
nano .env
```

**Required variables:**
```env
DB_USERNAME=taskforge
DB_PASSWORD=your_secure_password
DB_NAME=taskforge_db
PORT=4500
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
```

#### 3. Start Backend API
```bash
npm run start:dev --workspace=@taskforge/api
# Backend runs on http://localhost:4500
# Auto-reloads on file changes
```

#### 4. Start Frontend (in another terminal)
```bash
npm run dev --workspace=@taskforge/web
# Frontend runs on http://localhost:5173
# Hot reload enabled
```

#### 5. Access the Application
- **Frontend**: http://localhost:5173
- **API**: http://localhost:4500/api

---

## 🐳 Docker Deployment

### Production Deployment (Single Command)

```bash
cd taskforge

# 1. Copy environment template
cp .env.example .env

# 2. Edit with production values
nano .env

# 3. Build and start all services
docker-compose up --build
```

**What happens automatically:**
1. PostgreSQL starts and initializes
2. NestJS backend builds and starts
3. React frontend builds and serves via Nginx
4. Services connect via internal network
5. Health checks verify all services running

**Access points:**
- **Frontend**: http://localhost (port 80, production build)
- **API**: http://localhost:4500/api
- **Database**: localhost:5432

### Development with Docker (Hot Reload)

```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Features:**
- Backend watch mode (restart on file change)
- Frontend Vite dev server (hot reload)
- Volume mounts for live code updates

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f api       # Backend
docker-compose logs -f web       # Frontend
docker-compose logs -f           # All services

# Stop all services
docker-compose down

# Clean slate (remove data)
docker-compose down -v

# Rebuild everything
docker-compose down -v && docker-compose up --build

# Run command in container
docker-compose exec api npm run lint
```

---

## 💡 Development Workflow

### Project Structure Guidelines

#### Adding a New Module (Backend)
1. Create folder: `src/<module>/`
2. Add three layers:
   - `presentation/controllers/` - Route handlers
   - `business.logic/services/` - Business rules
   - `data/repositories/` - Database queries
3. Create `<module>.module.ts` with dependency injection
4. Import in `app.module.ts`

#### Adding a New Page (Frontend)
1. Create component: `src/pages/<feature>Page.tsx`
2. Create hook: `src/hooks/use<Feature>.ts` (if needed)
3. Create API client: `src/api/<feature>.api.ts`
4. Add route in `App.tsx`
5. Import in `<feature>Page.tsx`

### Code Quality

#### Backend
```bash
npm run lint --workspace=@taskforge/api          # ESLint
npm run test --workspace=@taskforge/api          # Jest tests
npm run test:cov --workspace=@taskforge/api      # Coverage report
npm run build --workspace=@taskforge/api         # TypeScript build
```

#### Frontend
```bash
npm run lint --workspace=@taskforge/web          # ESLint
npm run build --workspace=@taskforge/web         # Vite build
```

---

## 🔒 Security Highlights ⭐ (Interviewer Impressed!)

### 1. **JWT-Based Authentication**
- Stateless authentication (no sessions)
- Refresh token rotation for token management
- Token expiration and auto-refresh

### 2. **Role-Based Access Control (RBAC)**
- Guards restrict endpoints by role
- Decorators define permission requirements
- Consistent across all modules

### 3. **Environment Variable Management**
- Secrets stored in `.env` (git-ignored)
- `docker-compose.yml` uses variable substitution (safe to commit)
- `.env.example` shows structure without secrets

### 4. **Input Validation**
- Class Validator decorators on all DTOs
- Automatic validation on request bodies
- Whitelist mode prevents extra fields

### 5. **Database Security**
- TypeORM parameterized queries (SQL injection prevention)
- Repository pattern for controlled DB access
- Connection pooling via TypeORM

### 6. **Frontend Security**
- ProtectedRoute guards redirect to login
- Tokens stored securely (localStorage is XSS-vulnerable; use httpOnly in production)
- Axios interceptors automatically inject JWT

---

## 📄 License

This project is created for educational and interview purposes.