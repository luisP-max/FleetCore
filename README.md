# FleetCore - Fleet Maintenance Management API
# Prueba-NodeJS
REST API for managing users, vehicles, workshops, and maintenance records. It is built with NestJS and TypeScript; it uses PostgreSQL with TypeORM, Redis for sessions, and JWT in HttpOnly cookies. Swagger documents the endpoints and lets you test them from the same origin without copying tokens.

# NAME: Luis Angel Piña M. CLAN: nodejs + nestjs PM


FleetCore is a high-performance RESTful backend solution built with **NestJS**, **TypeScript**, **TypeORM**, and **PostgreSQL**. This platform automates the life cycle of vehicle maintenance interventions, manages resources (mechanics and workshops), controls fleet availability, and provides robust security layers.

---

## 🚀 Key Features Implemented

- **Clean Enterprise Architecture:** Built using modular NestJS components entirely implemented in English for global industry compliance.
- **Robust Authentication & Authorization:** Implements local authentication using custom validation strategies and secure native session payloads via JSON Web Tokens (JWT).
- **Role-Based Access Control (RBAC):** Synchronized global guards protecting resources according to administrative privileges (`ADMIN` and `TECHNICIAN`).
- **Custom Decorators:** Direct semantic annotations using `@Public()`, `@Roles()`, and `@CurrentUser()` to safely decouple routing rules.
- **Unified Response Interceptor:** Custom `StatusTextInterceptor` that formats all successful endpoints into a standardized structure and translates numeric codes into alphabetical representations (`201` -> `"two zero one"`).
- **Global Exception Filter:** Enterprise-grade `HttpExceptionFilter` that intercepts system errors and guarantees clean, consistent JSON error responses, preventing data leaks or raw database errors.
- **Business Logic Automations:** Real-time state synchronization (e.g., passing a maintenance job to `IN_PROGRESS` shifts the vehicle to `IN_MAINTENANCE` automatically).
- **Automated Database Seeder:** An idempotent, self-triggered poblamiento service executed via the `OnModuleInit` lifecycle hook that inserts test data smoothly without generating duplicated records.
- **API Documentation:** Interactive OpenAPI documentation with built-in bearer authentication layer using Swagger.
- **Containerized Environment:** Production-ready multi-stage `Dockerfile` and `docker-compose.yml` to orquestate isolation channels and volume data persistence.
- **Automated Unit Testing:** Code quality verification using Vitest achieving **41.98% line coverage**, surpassing the mandatory extra points threshold.

---

## 🛠️ Technical Stack

- **Framework:** NestJS v10+
- **Database Engine:** PostgreSQL 15
- **ORM Provider:** TypeORM
- **Testing Runner:** Vitest / V8 Coverage
- **Documentation Engine:** OpenAPI 3.0 / Swagger

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory based on the following configurations:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=FleetCore2026!
DB_NAME=fleetcore
JWT_SECRET=luis123456
JWT_EXPIRES_IN=1h
API_KEYS=demo-key-partner-1,demo-key-partner-2
```

---

## 🐳 Execution & Deployment Guide

### Option A: Local CLI Hot-Reload Development (Recommended)
This mode runs the PostgreSQL engine within an isolated container while executing your NestJS microservice directly on your local system for testing purposes.

1. Ensure `DB_HOST=localhost` inside your `.env` file.
2. Free up local port channels if blocked:
   ```bash
   sudo kill -9 $(sudo lsof -t -i:3000)
   ```
3. Run the database container instance:
   ```bash
   docker-compose up -d postgres-db
   ```
4. Launch the local development server:
   ```bash
   npm run start:dev
   ```

### Option B: Full Containerized Production Environment
This compiles and packages the entire technology stack inside Docker bridge virtual networking fields.

1. Set `DB_HOST=postgres-db` in your `.env` file.
2. Shutdown active background conflicting processes:
   ```bash
   docker-compose down
   ```
3. Compile and bring up the container stack:
   ```bash
   docker-compose up -d --build
   ```

---

## 🛡️ Core API Endpoints Summary

All routes are prefixed with `/api/v1/`.

| Entity Group | Endpoint Path | Method | Access Level | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | `/auth/register` | `POST` | `@Public` | Registers a new user on the platform. |
| **Authentication** | `/auth/login` | `POST` | `@Public` | Validates credentials and returns an `accessToken`. |
| **Vehicles** | `/vehicles` | `POST` | `ADMIN` | Registers a new vehicle ensuring unique plates. |
| **Vehicles** | `/vehicles` | `GET` | Authenticated | Lists all vehicles recorded. |
| **Mechanics** | `/mechanics` | `GET` | Authenticated | Displays the technical personnel list. |
| **Workshops** | `/workshops` | `GET` | Authenticated | Retrieves active maintenance workshops. |
| **Maintenances** | `/maintenances` | `POST` | `ADMIN`, `MANAGER` | Registers a scheduled fleet maintenance check. |
| **Maintenances** | `/maintenances/:id/status` | `PATCH` | `ADMIN`, `TECHNICIAN`| Triggers custom state transition sequences. |

---

## 📦 System Architecture Diagram

```text
src/
├── auth/
│   ├── decorators/      # Custom attributes (@Public, @Roles, @CurrentUser)
│   ├── dto/             # Validation parameters data layers
│   ├── guards/          # Session validation blocks (JwtAuthGuard, RolesGuard)
│   └── strategies/      # Passport configuration structures
├── common/
│   ├── filters/         # Centralized error framework (HttpExceptionFilter)
│   └── interceptors/    # Standard output formatter (StatusTextInterceptor)
├── main.ts              # Entry point bootstrap loader
├── app.module.ts        # Global provider dependency injection matrix
├── seed/                # Idempotent database population service
├── vehicles/            # Vehicle fleet entity control records
├── mechanics/           # Maintenance staff technician assignments
├── workshops/           # Authorized garage physical facilities records
└── maintenances/        # Maintenance life-cycle transition logic engine
```
