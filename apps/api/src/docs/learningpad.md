#  Learning Log — RightHand Ops Hub

This document tracks my personal learning journey while building the **RightHand Ops Hub** project.  
The goal is to reflect on what I’ve learned so far and show progress over time.

---

##  Phase 1 — Foundation (Server + Databases + Health Checks)

###  What I Did
- Set up a Node.js + TypeScript backend with Fastify.
- Created a project structure with clear separation of concerns.
- Connected MySQL (structured data) and MongoDB (logs/events).
- Ran databases locally using Docker Compose (instead of installing manually).
- Configured `.env` files for environment variables.
- Integrated Prisma ORM and ran my first migration.
- Built and tested a `/healthz` endpoint to check if MySQL + MongoDB are alive.
- Cleaned up the Git repository with `.gitignore`.

###  What I Learned
- **Node.js**: JavaScript can run outside the browser as a backend runtime.
- **Fastify**: A fast, lightweight alternative to Express for APIs.
- **package.json**: Defines dependencies, scripts, and metadata for Node projects.
- **.env files**: Keep secrets/config out of code safer & flexible.
- **Docker Hub**: A registry where prebuilt container images (MySQL, MongoDB) are stored.
- **Docker Compose**: Start multiple containers (databases) with one command → reproducible environment.
- **Container Image**: A blueprint for a container; contains everything needed to run a service.
- **MySQL vs MongoDB**:  
  - MySQL → relational tables with strong structure (users, projects, tasks).  
  - MongoDB → flexible JSON-like documents (logs, audit events).  
- **Prisma ORM**: Maps database tables to objects, with migrations to evolve schema safely.
- **Health checks**: Show service status (`ok` vs `degraded`) → essential for monitoring in production.
- **Git best practices**: Don’t commit `node_modules`, `.env`, or build outputs → use `.gitignore`.

###  Already Knew Before This Project
- **JWT (JSON Web Tokens)**: used for stateless authentication, consists of header, payload, and signature.  
- **Role-Based Access Control (RBAC)**: assigning roles (admin/dev/viewer) to users to manage access rights. 
-  

### 🔹 Reflection
- I can now make up **databases + backend** in minutes with Docker and configs.  
- I understand the **difference between structured data (MySQL) and flexible data (Mongo)**.  
- I see why professional apps always include **health endpoints** and proper **repo hygiene**.  
- My repo is cleaner, my setup is professional, and I’m ready to add **real features**.

---

## 🔒 Phase 2 — Next Steps (Authentication & Users)

### 🔹 Goals
- Implement user registration & login with JWT.
- Store hashed passwords (bcrypt/argon2).
- Use my knowledge of JWT + RBAC to protect routes with Auth & Role middleware.
- Document endpoints clearly.

### 🔹 What I Need to Learn Next
- Password hashing best practices (bcrypt vs argon2).  
- Refresh token rotation strategies.  
- Standard HTTP status codes for auth errors.  

---

##  Overall Takeaways So Far
- Backend development is not just code → it’s about **architecture, security, observability, and DevOps mindset**.  
- Using containers and configs makes projects **portable, secure, and scalable**.  
- A clean repo and clear docs are just as important as working code.  
