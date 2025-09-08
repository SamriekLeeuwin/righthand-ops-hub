// Audit Routes — Wiring Guide (no code, only steps)
//
// Goal: Register /logs endpoint for audit reading.
//
// Steps
// 1) Export registerAuditRoutes(server)
// 2) Apply `authGuard` and `roleGuard` admin-only
// 3) GET /logs → audit.controller list handler
// 4) Add request schema; register in main routes index
