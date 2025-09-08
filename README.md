# RightHand Ops Hub

A learning + showcase project where I’m building a **mini-operations hub** step by step.  
Think of it as a lightweight mix of a **task manager, incident tracker, and automation tool** but with the main goal of showing how **real-world backends** actually work.

---

##  Why this project?
I didn’t just want to build “yet another CRUD app.”  
RightHand Ops Hub is designed to demonstrate that I can **take ownership** of a full-stack system: not just writing endpoints, but also thinking about architecture, security, and scalability.

It combines skills that companies actually look for:

-  **Authentication & roles** (users, admin/dev/viewer).  
- **Two databases**:  
  - MySQL for structured data (users, projects, tasks).  
  - MongoDB for logs and audit events.  
-  **DevOps mindset**: Docker Compose for a predictable dev environment.  
-  **Observability**: health checks, audit logging, and metrics.  
-  **Automation**: scraping and background jobs that generate tasks.  
-  **Simple dashboard**: basic UI with HTML/CSS/jQuery.

---

##  Tech Stack
- **Node.js + TypeScript** – backend foundation  
- **Fastify** – fast and lightweight web framework  
- **Prisma ORM** – type-safe queries for MySQL  
- **MySQL** – relational data (users, projects, tasks)  
- **MongoDB** – document store for logs and events  
- **Docker Compose** – local dev environment (MySQL + MongoDB)  
- **JWT** – authentication & authorization  
- **Puppeteer** – scraping & automation  
- **HTML, CSS, jQuery** – simple frontend  

---

##  Features (roadmap)
- [x] Health check endpoint (`/healthz`)  
- [x] MySQL & MongoDB integration  
- [ ] User registration & login with JWT  
- [ ] Role-based access control (admin/dev/viewer)  
- [ ] CRUD for projects & tasks  
- [ ] Audit logs stored in MongoDB  
- [ ] Simple dashboard (HTML/CSS/jQuery)  
- [ ] Automation via scraping (Puppeteer)  
- [ ] Metrics & observability  

---

##  Getting Started

### Prerequisites
- Node.js (v18+)  
- Docker + Docker Compose  
- Git  

### Setup
1. Clone the repo:  
   ```bash
   git clone https://github.com/SamriekLeeuwin/righthand-ops-hub.git
   cd righthand-ops-hub
