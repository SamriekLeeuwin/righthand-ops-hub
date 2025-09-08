// Tasks Controller — Implementation Guide (no code, only steps)
//
// Endpoints nested under projects
// - POST   /projects/:id/tasks           → create task in a project
// - GET    /projects/:id/tasks           → list tasks for a project
// - GET    /projects/:projectId/tasks/:taskId → get one
// - PATCH  /projects/:projectId/tasks/:taskId → update
// - DELETE /projects/:projectId/tasks/:taskId → delete
//
// RBAC
// - admin: full access
// - editor/dev: only within own projects
// - viewer: read-only within own projects
//
// Steps
// 1) Validate params (ids) and body
// 2) Load project or task; check ownership before acting
// 3) Call repository methods; map to HTTP responses
// 4) Emit audit logs for create/update/delete (see Audit module guide)
