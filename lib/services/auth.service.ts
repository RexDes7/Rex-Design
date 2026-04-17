/**
 * Authentication Service
 * 
 * Handles user authentication, session management, and password hashing
 * for the admin panel.
 * 
 * Features:
 * - Password hashing with bcrypt (12 salt rounds)
 * - JWT token generation with 24-hour TTL
 * - Session verification and expiration checking
 * - Secure logout with session cleanup
 * 
 * Requirements: 1.2, 1.4, 1.5, 11.1
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { getDatabase } from '../db/client';
import type { AuthService, AuthResult, SessionData } from '../types/admin';
import type { User, Session } from '../db/schema';

// JWT secret - should be set via environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// Session TTL: 24 hours in milliseconds
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

// Bcrypt salt rounds (Requirement 11.1: >= 10, we use 12)
const SALT_ROUNDS = 12;

/**
 * Authentication Service Implementation
 */
class AuthServiceImpl implements AuthService {
  /**
   * Authenticate user with email and password
   * 
   * @param email - User email
   * @param password - Plain text password
   * @returns Authentication result with token if successful
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const db = getDatabase();
      
      // Find user by email
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
      
      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }
      
      // Create session
      const sessionId = randomUUID();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);
      
      // Generate JWT token
      const token = jwt.sign(
        {
          sessionId,
          userId: user.id,
          email: user.email
        },
        JWT_SECRET,
        {
          expiresIn: '24h'
        }
      );
      
      // Store session in database
      db.prepare(`
        INSERT INTO sessions (id, user_id, token, created_at, expires_at, last_activity)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        sessionId,
        user.id,
        token,
        now.toISOString(),
        expiresAt.toISOString(),
        now.toISOString()
      );
      
      return {
        success: true,
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }
  
  /**
   * Verify JWT token and return session data
   * 
   * @param token - JWT token
   * @returns Session data if valid, null otherwise
   */
  async verifySession(token: string): Promise<SessionData | null> {
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as {
        sessionId: string;
        userId: string;
        email: string;
      };
      
      const db = getDatabase();
      
      // Find session in database
      const session = db.prepare('SELECT * FROM sessions WHERE id = ? AND token = ?')
        .get(decoded.sessionId, token) as Session | undefined;
      
      if (!session) {
        return null;
      }
      
      // Parse dates
      const sessionData: SessionData = {
        userId: session.user_id,
        email: decoded.email,
        createdAt: new Date(session.created_at),
        expiresAt: new Date(session.expires_at)
      };
      
      // Check if session is expired
      if (this.isSessionExpired(sessionData)) {
        // Clean up expired session
        await this.logout(token);
        return null;
      }
      
      // Update last activity
      db.prepare('UPDATE sessions SET last_activity = ? WHERE id = ?')
        .run(new Date().toISOString(), session.id);
      
      return sessionData;
    } catch (error) {
      // Token verification failed or other error
      return null;
    }
  }
  
  /**
   * Terminate session and remove from database
   * 
   * @param token - JWT token
   */
  async logout(token: string): Promise<void> {
    try {
      const db = getDatabase();
      
      // Delete session from database
      db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    } catch (error) {
      console.error('Logout error:', error);
      // Don't throw - logout should always succeed from user perspective
    }
  }
  
  /**
   * Check if session has expired
   * 
   * @param session - Session data
   * @returns True if expired, false otherwise
   */
  isSessionExpired(session: SessionData): boolean {
    const now = new Date();
    return now >= session.expiresAt;
  }
}

// Export singleton instance
export const authService = new AuthServiceImpl();

/**
 * Hash a password using bcrypt with 12 salt rounds
 * Utility function for creating admin users
 * 
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 * Utility function for testing
 * 
 * @param password - Plain text password
 * @param hash - Bcrypt hash
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
