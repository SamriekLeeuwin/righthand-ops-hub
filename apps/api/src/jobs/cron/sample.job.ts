// Background Job (Cron) — Implementation Guide (no code, only steps)
//
// Goal: Run a periodic job (e.g., daily) that creates a project/task automatically.
//
// Option A) node-cron
// - Research: `node-cron` syntax (CRON expressions) and timezone handling.
// - Setup a scheduler that runs `0 8 * * *` (08:00 daily).
// - Inside job: call Prisma repo to insert a project/task if some condition is met.
// - Ensure idempotency: avoid duplicates by checking existing records (unique key or fingerprint).
// - Add logs via audit.service.
//
// Option B) simple setInterval (dev-only)
// - For learning: run every 60s; stop on SIGINT.
//
// Operational notes
// - Jobs should start only once per process (avoid in serverless contexts).
// - Add feature flag env `ENABLE_JOBS=true` to toggle.
// - Capture and report errors (avoid unhandled promise rejections).
