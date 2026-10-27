# FleetCore - Backend Core API

FleetCore is a high-performance fleet management backend solution built with **NestJS**, **TypeORM**, and **PostgreSQL**. This microservice architecture implements robust JWT authentication, secure credential hashing, role-based access control (RBAC), and custom lifecycle interceptors.

---

## 🚀 Key Features Implemented

- **Enterprise Architecture:** Clean, modular NestJS structure using TypeScript.
- **Robust Security:** Credential hashing via `argon2` and session management with dynamic `Passport JWT`.
- **RBAC (Role-Based Access Control):** Global guard synchronization checking for `ADMIN`, `MANAGER`, and `TECHNICIAN` privileges.
- **Custom Decorators:** Implementation of `@Public()`, `@Roles()`, and `@CurrentUser()` for seamless controller parameters.
- **Smart Response Interceptor:** Custom `StatusTextInterceptor` that automatically translates numeric HTTP status codes into text format (`201` -> `"two zero one"`).
- **Hybrid Infrastructure:** Containerized environment orchestration using docker-compose and optimized multi-stage multi-platform multi-version `Dockerfile` targets under Node 22 Alpine.

---

## 🛠️ Tech Stack

- **Framework:** NestJS v10+
- **Language:** TypeScript
- **Database ORM:** TypeORM / PostgreSQL (`pg`)
- **Security & Auth:** Argon2 / Passport JWT
- **Validation:** Class-Validator / Class-Transformer

---

## 📋 Prerequisites

Before running the application, make sure you have installed:
- [Node.js v22+](https://nodejs.org)
- [Docker Desktop](https://docker.com)
- [NPM](https://npmjs.com)

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory and configure your credentials as follows:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=FleetCore2026!
DB_NAME=fleetcore
JWT_SECRET=4f78a2e1c3b9d8e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9
JWT_EXPIRES_IN=1h
API_KEYS=demo-key-partner-1,demo-key-partner-2
```

---

## 🐳 Deployment & Execution Guide

### Option A: Hybrid Development (Recommended for CLI debugging)
This options spins up the PostgreSQL instance inside Docker while executing the NestJS API locally on your host machine.

1. Set `DB_HOST=localhost` in your `.env` file.
2. Stop the local API container service if running:
   ```bash
   docker-compose stop api
   ```
3. Start the PostgreSQL instance:
   ```bash
   docker-compose up -d postgres-db
   ```
4. Run the NestJS application in development hot-reload mode:
   ```bash
   npm run start:dev
   ```

### Option B: Full Containerized Production
This option compiles and orchestrates the entire network stack inside Docker isolated bridge channels.

1. Set `DB_HOST=postgres-db` in your `.env` file.
2. Clear any conflicting networking states:
   ```bash
   docker-compose down
   ```
3. Rebuild and launch the stack in detached background mode:
   ```bash
   docker-compose up -d --build
   ```

---

## 🛡️ Core API Endpoints

All routes are prefixed with `/api/v1/`.

| Endpoint | Method | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | `@Public` | Registers a new application user profile. |
| `/auth/login` | `POST` | `@Public` | Validates credentials and returns an `accessToken`. |

---

## 📦 Project Structure

```text
src/
├── auth/
│   ├── decorators/      # @Public, @Roles, @CurrentUser
│   ├── dto/             # Input payload validation DTO schemas
│   ├── guards/          # JwtAuthGuard, RolesGuard
│   ├── strategies/      # Passport JWT validation strategy
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── common/
│   └── interceptors/    # StatusTextInterceptor
└── users/
    ├── entities/        # TypeORM Database Entities
    ├── enums/           # System Roles Enumerations
    ├── users.module.ts
    └── users.service.ts
```
