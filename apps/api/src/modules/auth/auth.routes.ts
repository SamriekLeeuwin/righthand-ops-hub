import { FastifyInstance } from 'fastify';
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

// Constants
const SALT_ROUNDS = 10;

// Prisma client instance
export const prisma = new PrismaClient();

/**
 * Authentication routes plugin
 * Handles user registration, login, and profile management
 */
export async function authRoutes(fastify: FastifyInstance) {
  
  /**
   * POST /api/auth/register
   * Register a new user
   * 
   * Body: { email: string, password: string }
   * Returns: { message: string, user: { id, email, role } }
   */
  fastify.post('/register', async (request, reply) => {
    try {
      const { email, password } = request.body as { email: string; password: string };
      
      // Validate input
      if (!email || !password) {
        return reply.code(400).send({ error: 'Email and password are required' });
      }
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        return reply.code(400).send({ error: 'User already exists' });
      }

      // Hash password
      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      
      // Create new user
      const user = await prisma.user.create({
        data: {
          email,
          password: hash,
          role: 'viewer'
        }
      });
      
      return reply.code(201).send({ 
        message: 'User created successfully',
        user: { id: user.id, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error('Registration error:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  /**
   * POST /api/auth/login
   * Login with email and password
   * 
   * Body: { email: string, password: string }
   * Returns: { message: string, token: string, user: { id, email, role } }
   */
  fastify.post('/login', async (request, reply) => {
    try {
      const { email, password } = request.body as { email: string; password: string };
      
      // Validate input
      if (!email || !password) {
        return reply.code(400).send({ error: 'Email and password are required' });
      }
      
      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
      if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }
      
      // TODO: Generate JWT token
      const token = 'jwt-token-here';
      
      return reply.send({ 
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error('Login error:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  /**
   * GET /api/auth/me
   * Get current user profile
   * 
   * Headers: { Authorization: "Bearer <token>" }
   * Returns: { user: { id, email, role } }
   */
  fastify.get('/me', async (request, reply) => {
    // TODO: Add JWT authentication middleware
    return reply.send({ message: 'Get current user - TODO: implement JWT auth' });
  });
}