import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../modules/auth/auth.service.js';

/**
 * JWT Authentication Middleware
 * 
 * This middleware verifies JWT tokens and adds user information to the request object
 * It should be used on protected routes that require authentication
 * 
 * How it works:
 * 1. Extracts token from Authorization header
 * 2. Verifies token signature and expiration
 * 3. Adds user information to request object
 * 4. Allows request to continue or returns 401 if invalid
 */

/**
 * Authentication middleware function
 * 
 * @param request - Fastify request object
 * @param reply - Fastify reply object
 * @returns Promise<void>
 */
export async function authGuard(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    // Get Authorization header
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      reply.code(401).send({ 
        error: 'Authorization header is required',
        message: 'Please provide a valid JWT token in the Authorization header'
      });
      return;
    }

    // Extract token from header
    const token = AuthService.extractTokenFromHeader(authHeader);
    
    // Verify token and get user information
    const user = await AuthService.getUserFromToken(token);
    
    // Add user information to request object
    // This allows route handlers to access user data
    (request as any).user = user;
    
    // Request can continue to the route handler
    // No need to call reply.send() - just return to continue
    
  } catch (error) {
    // Handle different types of authentication errors
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        reply.code(401).send({ 
          error: 'Token expired',
          message: 'Your session has expired. Please login again.'
        });
      } else if (error.message.includes('Invalid')) {
        reply.code(401).send({ 
          error: 'Invalid token',
          message: 'The provided token is invalid. Please login again.'
        });
      } else if (error.message.includes('User not found')) {
        reply.code(401).send({ 
          error: 'User not found',
          message: 'The user associated with this token no longer exists.'
        });
      } else {
        reply.code(401).send({ 
          error: 'Authentication failed',
          message: 'Unable to authenticate request. Please login again.'
        });
      }
    } else {
      reply.code(500).send({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred during authentication.'
      });
    }
  }
}

/**
 * Optional authentication middleware
 * 
 * This middleware tries to authenticate the user but doesn't fail if no token is provided
 * Useful for routes that work for both authenticated and anonymous users
 * 
 * @param request - Fastify request object
 * @param reply - Fastify reply object
 * @returns Promise<void>
 */
export async function optionalAuthGuard(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      // No token provided - that's okay for optional auth
      (request as any).user = null;
      return;
    }

    // Try to authenticate
    const token = AuthService.extractTokenFromHeader(authHeader);
    const user = await AuthService.getUserFromToken(token);
    
    (request as any).user = user;
    
  } catch (error) {
    // Authentication failed, but that's okay for optional auth
    (request as any).user = null;
  }
}

/**
 * Role-based authorization middleware factory
 * 
 * Creates middleware that checks if the authenticated user has the required role
 * 
 * @param requiredRoles - Array of roles that are allowed to access the route
 * @returns Middleware function
 */
export function requireRoles(requiredRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      const user = (request as any).user;
      
      if (!user) {
        reply.code(401).send({ 
          error: 'Authentication required',
          message: 'You must be logged in to access this resource.'
        });
        return;
      }

      if (!requiredRoles.includes(user.role)) {
        reply.code(403).send({ 
          error: 'Insufficient permissions',
          message: `This resource requires one of the following roles: ${requiredRoles.join(', ')}. Your role: ${user.role}`
        });
        return;
      }

      // User has required role - continue
      
    } catch (error) {
      reply.code(500).send({ 
        error: 'Authorization error',
        message: 'An error occurred while checking permissions.'
      });
    }
  };
}

/**
 * Admin-only middleware
 * Shortcut for requiring admin role
 */
export const requireAdmin = requireRoles(['admin']);

/**
 * Admin or moderator middleware
 * Shortcut for requiring admin or moderator role
 */
export const requireAdminOrModerator = requireRoles(['admin', 'moderator']);

/**
 * Authenticated user middleware
 * Shortcut for requiring any authenticated user
 */
export const requireAuth = authGuard;
