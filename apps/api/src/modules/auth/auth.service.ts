import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Prisma client
const prisma = new PrismaClient();

/**
 * JWT Payload Interface
 * Defines what data is stored in the JWT token
 */
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  iat?: number; // issued at
  exp?: number; // expires at
}

/**
 * Token Response Interface
 * Defines the structure of token response
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

/**
 * Authentication Service
 * Handles all JWT token operations and user authentication logic
 * 
 * Why separate service from controller?
 * - Single Responsibility: Service only handles authentication logic
 * - Reusability: Can be used in multiple controllers
 * - Testability: Easy to unit test authentication logic
 * - Maintainability: Centralized authentication logic
 */
export class AuthService {
  
  /**
   * Generate JWT access token
   * 
   * @param user - User object containing id, email, and role
   * @returns string - JWT access token
   */
  static generateAccessToken(user: { id: number; email: string; role: string }): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'righthand-ops-hub',
      audience: 'righthand-ops-hub-users'
    });
  }

  /**
   * Generate JWT refresh token
   * Refresh tokens are used to get new access tokens without re-login
   * 
   * @param user - User object containing id, email, and role
   * @returns string - JWT refresh token
   */
  static generateRefreshToken(user: { id: number; email: string; role: string }): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'righthand-ops-hub',
      audience: 'righthand-ops-hub-refresh'
    });
  }

  /**
   * Generate both access and refresh tokens
   * 
   * @param user - User object
   * @returns TokenResponse - Object containing both tokens and metadata
   */
  static generateTokens(user: { id: number; email: string; role: string }): TokenResponse {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    
    // Calculate expiration time in seconds
    const expiresIn = this.getTokenExpirationTime(JWT_EXPIRES_IN);

    return {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer'
    };
  }

  /**
   * Verify JWT token
   * 
   * @param token - JWT token to verify
   * @returns JWTPayload - Decoded token payload
   * @throws Error if token is invalid or expired
   */
  static verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'righthand-ops-hub',
        audience: ['righthand-ops-hub-users', 'righthand-ops-hub-refresh']
      }) as JWTPayload;

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  /**
   * Extract token from Authorization header
   * 
   * @param authHeader - Authorization header value
   * @returns string - Extracted token
   * @throws Error if header format is invalid
   */
  static extractTokenFromHeader(authHeader: string): string {
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new Error('Invalid authorization header format. Expected: Bearer <token>');
    }

    return parts[1];
  }

  /**
   * Refresh access token using refresh token
   * 
   * @param refreshToken - Valid refresh token
   * @returns TokenResponse - New access and refresh tokens
   */
  static async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    try {
      // Verify refresh token
      const decoded = this.verifyToken(refreshToken);
      
      // Get user from database to ensure they still exist
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      return this.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role
      });

    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Get token expiration time in seconds
   * 
   * @param expiresIn - JWT expires in string (e.g., '24h', '7d')
   * @returns number - Expiration time in seconds
   */
  private static getTokenExpirationTime(expiresIn: string): number {
    const timeUnits: { [key: string]: number } = {
      's': 1,
      'm': 60,
      'h': 3600,
      'd': 86400
    };

    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 86400; // Default to 24 hours
    }

    const [, value, unit] = match;
    return parseInt(value) * timeUnits[unit];
  }

  /**
   * Blacklist a token (for logout)
   * In a production app, you might want to store blacklisted tokens in Redis
   * 
   * @param token - Token to blacklist
   */
  static async blacklistToken(token: string): Promise<void> {
    // TODO: Implement token blacklisting
    // For now, we rely on short token expiration times
    // In production, you might want to:
    // 1. Store blacklisted tokens in Redis
    // 2. Check blacklist in middleware
    // 3. Implement token revocation
    console.log(`Token blacklisted: ${token.substring(0, 20)}...`);
  }

  /**
   * Get user from token
   * 
   * @param token - JWT token
   * @returns Promise<{ id: number; email: string; role: string }> - User object
   */
  static async getUserFromToken(token: string): Promise<{ id: number; email: string; role: string }> {
    const decoded = this.verifyToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
