// Projects Repository — Implementation Guide (no code, only steps)
//
// Goal: Implement CRUD for `Project` using Prisma (MySQL).
//
// 1) Schema & relations (Prisma)
//    - Add models to `prisma/schema.prisma` (research: Prisma relations, 1:N):
//      model Project { id Int @id @default(autoincrement()); name String; description String?; ownerId Int; tasks Task[]; createdAt DateTime @default(now()); updatedAt DateTime @updatedAt }
//      model Task    { id Int @id @default(autoincrement()); title String; done Boolean @default(false); projectId Int; project Project @relation(fields: [projectId], references: [id]); createdAt DateTime @default(now()); updatedAt DateTime @updatedAt }
//      - Consider unique constraint: @@unique([ownerId, name]) to prevent duplicate names per owner.
//      - Migrate: `npx prisma migrate dev -n "projects_tasks_init"`.
//
// 2) Repository responsibilities (what to implement)
//    - createProject({ name, description, ownerId }) → returns created project
//    - getProjectById(id, { includeTasks? })
//    - listProjects({ ownerId?, search?, orderByCreatedAtDesc? }) with pagination (skip/take)
//    - updateProject(id, { name?, description? })
//    - deleteProject(id) → also decide on cascading: delete tasks or block if tasks exist
//    - countProjects({ ownerId? }) for pagination metadata
//
// 3) Prisma queries to research
//    - Filtering with where: { ownerId, name: { contains: search, mode: 'insensitive' } }
//    - Include relations: include: { tasks: true }
//    - Pagination: skip, take; total count via prisma.project.count
//    - Transactions if needed: prisma.$transaction([...]) for delete with related tasks
//
// 4) Data validation
//    - Validate inputs with your existing validators pattern (see auth.validators.ts)
//    - Enforce length limits (e.g., name <= 120 chars) and trim strings
//
// 5) Errors & not found
//    - Throw domain errors aligned with `apps/api/src/errors.ts` (research: how NotFound/BadRequest are handled now)
//
// 6) RBAC hooks (used by controller)
//    - Accept `currentUser` context or expose ownerId so controller can enforce: dev can only manage own projects; admin can manage all
//
// 7) Tests you should run manually
//    - Create → Read → Update → Delete roundtrip with MySQL running
//    - Attempt duplicate name per owner (should fail if you added unique)
//    - Pagination sanity: create 15 projects, list with take=10, then take=5
//
// 8) Performance notes
//    - Add index on Project.ownerId and Project.createdAt for listing by owner/date
//
// 9) Docs to update
//    - Add endpoints description to `apps/api/src/docs/begrippenlijst.md` or `learningpad.md`.
