import { FastifyInstance } from 'fastify';
import { registerUser, loginUser, getCurrentUser, logoutUser, refreshToken } from './auth.controller.js';
import { authGuard } from '../../middleware/authGuard.js';
import { PrismaClient } from '@prisma/client';

// Constants
// SALT_ROUNDS determines how many times the password is hashed
// Higher number = more secure but slower
// 10 is a good balance between security and performance
const SALT_ROUNDS = 10;

// Prisma client instance
// This creates a connection to our MySQL database
// Prisma automatically generates TypeScript types from our schema.prisma
export const prisma = new PrismaClient();

/**
 * Authentication routes plugin
 * This is a Fastify plugin that contains all authentication-related endpoints
 * Plugins allow us to organize code into modules and register them with the main app
 * 
 * Why use plugins?
 * - Modularity: Each feature has its own file
 * - Reusability: Can be used in other projects
 * - Testability: Can test auth routes independently
 * - Teamwork: Different developers can work on different modules
 */
export async function authRoutes(fastify: FastifyInstance) {
  
  /**
   * POST /api/auth/register
   * Register a new user endpoint
   * 
   * Why POST? Because we're creating new data (user) on the server
   * POST requests can have a body with data, unlike GET requests
   * 
   * Body: { email: string, password: string }
   * Returns: { message: string, user: { id, email, role } }
   * 
   * Security considerations:
   * - Password is hashed before storing (never store plain text passwords)
   * - Email is validated and checked for duplicates
   * - User role defaults to 'viewer' (principle of least privilege)
   */
  // Register endpoint - delegates to controller
  fastify.post('/register', registerUser);

  /**
   * POST /api/auth/login
   * Login endpoint for existing users
   * 
   * Why POST? Because we're sending sensitive data (password) in the body
   * GET requests put data in the URL, which could be logged or cached
   * 
   * Body: { email: string, password: string }
   * Returns: { message: string, token: string, user: { id, email, role } }
   * 
   * Security considerations:
   * - Password is verified using bcrypt.compare (timing-safe comparison)
   * - Same error message for invalid email vs invalid password (prevents user enumeration)
   * - JWT token will be returned for authenticated requests
   */
  // Login endpoint - delegates to controller
  fastify.post('/login', loginUser);

  /**
   * GET /api/auth/me
   * Get current user profile endpoint
   * 
   * Why GET? We're retrieving data, not creating or modifying
   * 
   * Headers: { Authorization: "Bearer <token>" }
   * Returns: { user: { id, email, role } }
   * 
   * This endpoint will be protected by JWT middleware
   * The middleware will verify the token and add user info to the request
   */
  // Get current user endpoint - requires authentication
  fastify.get('/me', { preHandler: authGuard }, getCurrentUser);

  // Logout endpoint - requires authentication
  fastify.post('/logout', { preHandler: authGuard }, logoutUser);

  // Refresh token endpoint - no auth required (uses refresh token)
  fastify.post('/refresh', refreshToken);
}