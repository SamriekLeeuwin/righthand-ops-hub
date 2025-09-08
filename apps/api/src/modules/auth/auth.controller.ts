import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthService } from './auth.service.js';
import { AuthenticatedRequest } from './Custom.Interface.js';

// Constants
const SALT_ROUNDS = 10;

// Prisma client instance
const prisma = new PrismaClient();

/**
 * Authentication Controller
 * Contains all the business logic for authentication operations
 * 
 * Why separate controller from routes?
 * - Separation of Concerns: Routes handle HTTP, controllers handle business logic
 * - Testability: Can test business logic without HTTP layer
 * - Reusability: Can use controller logic in other contexts (CLI, tests, etc.)
 * - Maintainability: Easier to modify business logic without touching routes
 */

/**
 * Register a new user
 * 
 * @param request - Fastify request object containing email and password
 * @param reply - Fastify reply object for sending response
 * @returns Promise<void>
 */
export async function registerUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    // Extract and validate input
    const { email, password } = request.body as { email: string; password: string };
    
    // Input validation
    if (!email || !password) {
      reply.code(400).send({ error: 'Email and password are required' });
      return;
    }

    // Additional validation (you could add more sophisticated validation here)
    if (password.length < 6) {
      reply.code(400).send({ error: 'Password must be at least 6 characters long' });
      return;
    }

    if (!isValidEmail(email)) {
      reply.code(400).send({ error: 'Please provide a valid email address' });
      return;
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() } // Normalize email to lowercase
    });
    
    if (existingUser) {
      reply.code(400).send({ error: 'User already exists' });
      return;
    }

    // Hash password
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Create new user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(), // Store email in lowercase for consistency
        password: hash,
        role: 'viewer'
      }
    });
    
    // Return success response
    reply.code(201).send({ 
      message: 'User created successfully',
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    reply.code(500).send({ error: 'Internal server error' });
  }
}

/**
 * Login user with email and password
 * 
 * @param request - Fastify request object containing email and password
 * @param reply - Fastify reply object for sending response
 * @returns Promise<void>
 */
export async function loginUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    // Extract credentials
    const { email, password } = request.body as { email: string; password: string };
    
    // Validate input
    if (!email || !password) {
      reply.code(400).send({ error: 'Email and password are required' });
      return;
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    // Security: Same error message for invalid email or password
    if (!user) {
      reply.code(401).send({ error: 'Invalid credentials' });
      return;
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      reply.code(401).send({ error: 'Invalid credentials' });
      return;
    }
    
    // Generate JWT tokens
    const tokens = AuthService.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() }
    });
    
    // Return success with tokens
    reply.send({ 
      message: 'Login successful',
      ...tokens,
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        lastLogin: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    reply.code(500).send({ error: 'Internal server error' });
  }
}

/**
 * Get current user profile
 * 
 * @param request - Fastify request object (should contain user info from JWT middleware)
 * @param reply - Fastify reply object for sending response
 * @returns Promise<void>
 */
export async function getCurrentUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    // Type guard: Check if user property exists (added by auth middleware)
    if (!('user' in request)) {
      reply.code(401).send({ 
        error: 'Authentication required',
        message: 'You must be logged in to access this resource.'
      });
      return;
    }
    
    // Now we know request has user property, safe to cast
    const user = (request as AuthenticatedRequest).user;
    
    if (!user) {
      reply.code(401).send({ 
        error: 'Authentication required',
        message: 'You must be logged in to access this resource.'
      });
      return;
    }
    
    // Get fresh user data from database
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!currentUser) {
      reply.code(404).send({ 
        error: 'User not found',
        message: 'The authenticated user no longer exists.'
      });
      return;
    }
    
    reply.send({ 
      message: 'User profile retrieved successfully',
      user: currentUser
    });
  } catch (error) {
    console.error('Get user error:', error);
    reply.code(500).send({ error: 'Internal server error' });
  }
}

/**
 * Logout user (invalidate token)
 * 
 * @param request - Fastify request object
 * @param reply - Fastify reply object for sending response
 * @returns Promise<void>
 */
export async function logoutUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.authorization;
    
    if (authHeader) {
      try {
        const token = AuthService.extractTokenFromHeader(authHeader);
        // Blacklist the token
        await AuthService.blacklistToken(token);
      } catch (error) {
        // Token extraction failed, but that's okay for logout
        console.log('Could not extract token for blacklisting:', error);
      }
    }
    
    reply.send({ 
      message: 'Logout successful',
      note: 'Please remove the token from your client-side storage'
    });
  } catch (error) {
    console.error('Logout error:', error);
    reply.code(500).send({ error: 'Internal server error' });
  }
}

/**
 * Refresh access token using refresh token
 * 
 * @param request - Fastify request object containing refresh token
 * @param reply - Fastify reply object for sending response
 * @returns Promise<void>
 */
export async function refreshToken(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const { refreshToken } = request.body as { refreshToken: string };
    
    if (!refreshToken) {
      reply.code(400).send({ 
        error: 'Refresh token is required',
        message: 'Please provide a valid refresh token.'
      });
      return;
    }
    
    // Generate new tokens using refresh token
    const tokens = await AuthService.refreshAccessToken(refreshToken);
    
    reply.send({
      message: 'Tokens refreshed successfully',
      ...tokens
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    
    if (error instanceof Error && error.message.includes('Invalid refresh token')) {
      reply.code(401).send({ 
        error: 'Invalid refresh token',
        message: 'The provided refresh token is invalid or expired. Please login again.'
      });
    } else {
      reply.code(500).send({ error: 'Internal server error' });
    }
  }
}

/**
 * Helper function to validate email format
 * 
 * @param email - Email string to validate
 * @returns boolean - true if valid email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Helper function to validate password strength
 * 
 * @param password - Password string to validate
 * @returns object - { isValid: boolean, errors: string[] }
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}