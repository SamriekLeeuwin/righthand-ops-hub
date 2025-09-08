// Audit Logging Service — Implementation Guide (no code, only steps)
//
// Goal: Write security/ops events to MongoDB and expose read API for admins.
//
// 1) Mongo connection
//    - Reuse `apps/api/src/core/mongo.ts` to get a Mongo client/DB instance.
//    - Create collection `audit_logs` with indexes:
//      - { timestamp: -1 }
//      - { userId: 1, timestamp: -1 }
//      - { action: 1, timestamp: -1 }
//
// 2) Log shape (document)
//    {
//      _id, timestamp, userId?, role?, ip?, action, target?: { type, id },
//      metadata?: {}, userAgent?, success: boolean
//    }
//    - Research: OWASP logging guidelines (what to avoid: secrets, passwords)
//
// 3) Service methods
//    - logEvent({ action, userId?, role?, target?, metadata?, success, ip?, userAgent? })
//    - listEvents({ userId?, action?, from?, to?, limit?, cursor? }) → use pagination (limit + nextCursor)
//
// 4) Where to call logEvent
//    - Auth: login success/fail, register
//    - Projects: create/update/delete
//    - Tasks: create/update/delete
//
// 5) Reading logs (admin only)
//    - Controller + route: GET /logs with filters
//    - Enforce `roleGuard` admin
//
// 6) Testing
//    - Trigger a few actions (login, create project/task) then GET /logs
//    - Validate indexes are used (explain plans optional)
