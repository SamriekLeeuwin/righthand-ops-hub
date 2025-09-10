import fastify, { FastifyInstance } from "fastify";
import { authGuard, requireAdmin } from "../../middleware/authGuard";


// Audit Controller — Implementation Guide (no code, only steps)
//
// Goal: Expose GET /logs to list audit events for admins.
//
// Steps
// 1) Apply `authGuard` and `roleGuard` to enforce admin-only access
// 2) Validate query: { userId?, action?, from?, to?, limit?, cursor? }
// 3) Call audit.service listEvents; map to HTTP response with pagination
// 4) Ensure no sensitive data is leaked in responses


export async function auditValidator(fastify: FastifyInstance){


    fastify.get('/audit',{
        preHandler: [authGuard, requireAdmin],
        handler:
    }
}