/**
 * Auth Service Unit Tests
 * 
 * Tests for authentication service functionality including:
 * - Password hashing
 * - Login with valid/invalid credentials
 * - Session verification
 * - Session expiration
 * - Logout
 */

import { authService, hashPassword, verifyPassword } from '../auth.service';
import { getDatabase } from '../../db/client';
import type { User } from '../../db/schema';

describe('Auth Service', () => {
  let testUserId: string;
  let testUserEmail: string;
  let testUserPassword: string;
  let testUserPasswordHash: string;

  beforeAll(async () => {
    // Setup test user
    testUserId = 'test-user-id';
    testUserEmail = 'test@example.com';
    testUserPassword = 'TestPassword123!';
    testUserPasswordHash = await hashPassword(testUserPassword);

    const db = getDatabase();
    
    // Clean up any existing test user
    db.prepare('DELETE FROM users WHERE id = ?').run(testUserId);
    
    // Insert test user
    db.prepare(`
      INSERT INTO users (id, email, password_hash, created_at)
      VALUES (?, ?, ?, ?)
    `).run(testUserId, testUserEmail, testUserPasswordHash, new Date().toISOString());
  });

  afterAll(() => {
    // Clean up test data
    const db = getDatabase();
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(testUserId);
    db.prepare('DELETE FROM users WHERE id = ?').run(testUserId);
  });

  afterEach(() => {
    // Clean up sessions after each test
    const db = getDatabase();
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(testUserId);
  });

  describe('Password Hashing', () => {
    it('should hash passwords with bcrypt', async () => {
      const password = 'MySecurePassword123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);
    });

    it('should verify correct passwords', async () => {
      const password = 'MySecurePassword123';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect passwords', async () => {
      const password = 'MySecurePassword123';
      const hash = await hashPassword(password);
      
      const isValid = await verifyPassword('WrongPassword', hash);
      expect(isValid).toBe(false);
    });

    it('should use at least 10 salt rounds (Requirement 11.1)', async () => {
      const password = 'TestPassword';
      const hash = await hashPassword(password);
      
      // Bcrypt hash format: $2a$rounds$salt+hash
      // Extract rounds from hash
      const parts = hash.split('$');
      const rounds = parseInt(parts[2], 10);
      
      expect(rounds).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Login', () => {
    it('should successfully login with valid credentials', async () => {
      const result = await authService.login(testUserEmail, testUserPassword);
      
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should fail login with invalid email', async () => {
      const result = await authService.login('nonexistent@example.com', testUserPassword);
      
      expect(result.success).toBe(false);
      expect(result.token).toBeUndefined();
      expect(result.error).toBe('Invalid credentials');
    });

    it('should fail login with invalid password', async () => {
      const result = await authService.login(testUserEmail, 'WrongPassword');
      
      expect(result.success).toBe(false);
      expect(result.token).toBeUndefined();
      expect(result.error).toBe('Invalid credentials');
    });

    it('should create a session in database on successful login', async () => {
      const result = await authService.login(testUserEmail, testUserPassword);
      
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
      
      const db = getDatabase();
      const sessions = db.prepare('SELECT * FROM sessions WHERE user_id = ?').all(testUserId);
      
      expect(sessions.length).toBe(1);
    });
  });

  describe('Session Verification', () => {
    it('should verify valid session token', async () => {
      const loginResult = await authService.login(testUserEmail, testUserPassword);
      expect(loginResult.success).toBe(true);
      expect(loginResult.token).toBeDefined();
      
      const sessionData = await authService.verifySession(loginResult.token!);
      
      expect(sessionData).not.toBeNull();
      expect(sessionData?.userId).toBe(testUserId);
      expect(sessionData?.email).toBe(testUserEmail);
    });

    it('should return null for invalid token', async () => {
      const sessionData = await authService.verifySession('invalid-token');
      
      expect(sessionData).toBeNull();
    });

    it('should return null for non-existent session', async () => {
      // Create a valid JWT but without database session
      const jwt = require('jsonwebtoken');
      const fakeToken = jwt.sign(
        { sessionId: 'fake-id', userId: 'fake-user', email: 'fake@example.com' },
        process.env.JWT_SECRET || 'dev-secret-change-in-production',
        { expiresIn: '24h' }
      );
      
      const sessionData = await authService.verifySession(fakeToken);
      
      expect(sessionData).toBeNull();
    });

    it('should update last_activity on verification', async () => {
      const loginResult = await authService.login(testUserEmail, testUserPassword);
      expect(loginResult.token).toBeDefined();
      
      const db = getDatabase();
      const sessionBefore = db.prepare('SELECT last_activity FROM sessions WHERE user_id = ?')
        .get(testUserId) as { last_activity: string };
      
      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await authService.verifySession(loginResult.token!);
      
      const sessionAfter = db.prepare('SELECT last_activity FROM sessions WHERE user_id = ?')
        .get(testUserId) as { last_activity: string };
      
      expect(new Date(sessionAfter.last_activity).getTime())
        .toBeGreaterThan(new Date(sessionBefore.last_activity).getTime());
    });
  });

  describe('Session Expiration', () => {
    it('should detect expired sessions', () => {
      const expiredSession = {
        userId: 'test-user',
        email: 'test@example.com',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 48 hours ago
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000)  // 24 hours ago
      };
      
      const isExpired = authService.isSessionExpired(expiredSession);
      expect(isExpired).toBe(true);
    });

    it('should detect valid sessions', () => {
      const validSession = {
        userId: 'test-user',
        email: 'test@example.com',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      };
      
      const isExpired = authService.isSessionExpired(validSession);
      expect(isExpired).toBe(false);
    });

    it('should clean up expired session on verification', async () => {
      const loginResult = await authService.login(testUserEmail, testUserPassword);
      expect(loginResult.token).toBeDefined();
      
      const db = getDatabase();
      
      // Manually expire the session
      db.prepare('UPDATE sessions SET expires_at = ? WHERE user_id = ?')
        .run(new Date(Date.now() - 1000).toISOString(), testUserId);
      
      const sessionData = await authService.verifySession(loginResult.token!);
      
      expect(sessionData).toBeNull();
      
      // Verify session was deleted
      const sessions = db.prepare('SELECT * FROM sessions WHERE user_id = ?').all(testUserId);
      expect(sessions.length).toBe(0);
    });
  });

  describe('Logout', () => {
    it('should remove session from database', async () => {
      const loginResult = await authService.login(testUserEmail, testUserPassword);
      expect(loginResult.token).toBeDefined();
      
      const db = getDatabase();
      let sessions = db.prepare('SELECT * FROM sessions WHERE user_id = ?').all(testUserId);
      expect(sessions.length).toBe(1);
      
      await authService.logout(loginResult.token!);
      
      sessions = db.prepare('SELECT * FROM sessions WHERE user_id = ?').all(testUserId);
      expect(sessions.length).toBe(0);
    });

    it('should not throw error for invalid token', async () => {
      await expect(authService.logout('invalid-token')).resolves.not.toThrow();
    });

    it('should invalidate token after logout', async () => {
      const loginResult = await authService.login(testUserEmail, testUserPassword);
      expect(loginResult.token).toBeDefined();
      
      await authService.logout(loginResult.token!);
      
      const sessionData = await authService.verifySession(loginResult.token!);
      expect(sessionData).toBeNull();
    });
  });
});
