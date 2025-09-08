// Projects Routes — Wiring Guide (no code, only steps)
//
// Goal: Register /projects routes with Fastify.
//
// Steps
// 1) Export a function registerProjectsRoutes(server)
// 2) Inside, apply `authGuard` for all routes; apply `roleGuard` selectively
// 3) Map routes → controller handlers:
//    - POST   /projects                → createProjectHandler (admin, editor)
//    - GET    /projects                → listProjectsHandler (admin, editor, viewer)
//    - GET    /projects/:id            → getProjectHandler (admin, editor, viewer)
//    - PATCH  /projects/:id            → updateProjectHandler (admin, editor)
//    - DELETE /projects/:id            → deleteProjectHandler (admin)
// 4) Add schemas for validation (Fastify schema or Zod → JSON schema)
// 5) Finally, register this file from your main routes index (auth.routes.ts is a reference)
