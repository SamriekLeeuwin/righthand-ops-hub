// Tasks Repository — Implementation Guide (no code, only steps)
//
// Goal: CRUD for `Task` linked to `Project` (1:N).
//
// Methods to implement
// - createTask({ projectId, title, done? }) → verify project exists & ownership
// - listTasks({ projectId, search?, done?, orderByCreatedAtDesc? })
// - getTaskById(id)
// - updateTask(id, { title?, done? })
// - deleteTask(id)
//
// Ownership & RBAC checks
// - Fetch task → derive project.ownerId → enforce same RBAC policy as Projects
//
// Prisma queries to research
// - Filtering by booleans and partial text (title contains)
// - Efficient lists with indexes on (projectId, createdAt)
//
// Validation
// - title required (<= 160 chars), trim
// - done defaults to false
//
// Edge cases to handle
// - Moving tasks between projects (optional): implement updateTaskProject(id, newProjectId)
// - Deleting a project should cascade or block if tasks exist → match your chosen policy
