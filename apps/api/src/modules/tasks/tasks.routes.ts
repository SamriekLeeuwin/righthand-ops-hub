// Tasks Routes — Wiring Guide (no code, only steps)
//
// Goal: Register nested tasks routes under /projects/:projectId.
//
// Steps
// 1) Export a function registerTaskRoutes(server)
// 2) All routes should use `authGuard` and role checks similar to Projects
// 3) Map routes → controller handlers:
//    - POST   /projects/:projectId/tasks                  → createTaskHandler (admin, editor)
//    - GET    /projects/:projectId/tasks                  → listTasksHandler (admin, editor, viewer)
//    - GET    /projects/:projectId/tasks/:taskId          → getTaskHandler (admin, editor, viewer)
//    - PATCH  /projects/:projectId/tasks/:taskId          → updateTaskHandler (admin, editor)
//    - DELETE /projects/:projectId/tasks/:taskId          → deleteTaskHandler (admin)
// 4) Register from central routes index so server picks them up
