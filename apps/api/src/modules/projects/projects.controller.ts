// Projects Controller — Implementation Guide (no code, only steps)
//
// Goal: HTTP handlers for /projects CRUD with RBAC.
//
// Endpoints to implement
// - POST   /projects                → create
// - GET    /projects                → list (with pagination & filters)
// - GET    /projects/:id            → get by id
// - PATCH  /projects/:id            → update
// - DELETE /projects/:id            → delete
//
// Middleware to use
// - Reuse `authGuard` and `roleGuard` (see existing middleware dir)
// - RBAC policy:
//   - admin: full access
//   - editor/dev: can CRUD only where project.ownerId === currentUser.id
//   - viewer: read-only (list/get), but only own projects unless you decide otherwise
//
// Request validation
// - Use an input validator module (mirror `auth.validators.ts` style)
// - create: { name (required, <=120), description? (<=500) }
// - list: { search?, page?, pageSize?, order? }
// - update: { name?, description? }
// - id param: must be positive integer
//
// Response shapes
// - Align with existing response pattern in `auth.controller.ts` (status codes, error handling)
// - List responses should include { items, meta: { total, page, pageSize } }
//
// Implementation steps
// 1) Import repository methods from projects.repository
// 2) Get current user from request (from authGuard augmentation)
// 3) Enforce RBAC before calling repository (e.g., verify ownership unless admin)
// 4) Map repository results to HTTP responses; handle NotFound/BadRequest
// 5) Register routes in projects.routes.ts
//
// Manual tests
// - As admin: CRUD any project
// - As dev/editor: CRUD only your own; confirm 403 on others
// - As viewer: GETs succeed; POST/PATCH/DELETE return 403
