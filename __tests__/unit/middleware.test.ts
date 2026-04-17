/**
 * Unit Tests for Admin Route Protection Middleware
 * 
 * Tests the middleware that protects /admin/* routes by verifying
 * JWT tokens and redirecting unauthenticated users to login.
 * 
 * Requirements: 1.5, 1.6, 1.7
 * 
 * @jest-environment node
 */

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { middleware } from '@/middleware';

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

describe('Admin Route Protection Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Public routes', () => {
    it('should allow access to /admin/login without authentication', async () => {
      const request = new NextRequest('http://localhost:3000/admin/login');
      
      const response = await middleware(request);
      
      // Should proceed without redirect
      expect(response).toBeInstanceOf(NextResponse);
      expect(response.status).not.toBe(307); // Not a redirect
    });
  });

  describe('Protected routes without token', () => {
    it('should redirect to /admin/login when accessing /admin without token', async () => {
      const request = new NextRequest('http://localhost:3000/admin');
      
      const response = await middleware(request);
      
      expect(response.status).toBe(307); // Redirect status
      expect(response.headers.get('location')).toBe('http://localhost:3000/admin/login');
    });

    it('should redirect to /admin/login when accessing /admin/projects without token', async () => {
      const request = new NextRequest('http://localhost:3000/admin/projects');
      
      const response = await middleware(request);
      
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/admin/login');
    });

    it('should redirect to /admin/login when accessing nested admin routes without token', async () => {
      const request = new NextRequest('http://localhost:3000/admin/projects/123/edit');
      
      const response = await middleware(request);
      
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/admin/login');
    });
  });

  describe('Protected routes with valid token', () => {
    it('should allow access to /admin with valid token', async () => {
      const mockToken = 'valid-jwt-token';
      const mockDecoded = {
        sessionId: 'session-123',
        userId: 'user-123',
        email: 'admin@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600 // Expires in 1 hour
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const request = new NextRequest('http://localhost:3000/admin', {
        headers: {
          Cookie: `auth-token=${mockToken}`
        }
      });
      
      const response = await middleware(request);
      
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, JWT_SECRET);
      expect(response.status).not.toBe(307); // Not a redirect
    });

    it('should allow access to /admin/projects with valid token', async () => {
      const mockToken = 'valid-jwt-token';
      const mockDecoded = {
        sessionId: 'session-123',
        userId: 'user-123',
        email: 'admin@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const request = new NextRequest('http://localhost:3000/admin/projects', {
        headers: {
          Cookie: `auth-token=${mockToken}`
        }
      });
      
      const response = await middleware(request);
      
      expect(response.status).not.toBe(307);
    });
  });

  describe('Protected routes with expired token', () => {
    it('should redirect to /admin/login when token is expired', async () => {
      const mockToken = 'expired-jwt-token';
      const mockDecoded = {
        sessionId: 'session-123',
        userId: 'user-123',
        email: 'admin@example.com',
        exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const request = new NextRequest('http://localhost:3000/admin', {
        headers: {
          Cookie: `auth-token=${mockToken}`
        }
      });
      
      const response = await middleware(request);
      
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/admin/login');
    });
  });

  describe('Protected routes with invalid token', () => {
    it('should redirect to /admin/login when token verification fails', async () => {
      const mockToken = 'invalid-jwt-token';

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const request = new NextRequest('http://localhost:3000/admin', {
        headers: {
          Cookie: `auth-token=${mockToken}`
        }
      });
      
      const response = await middleware(request);
      
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/admin/login');
    });

    it('should redirect to /admin/login when token is malformed', async () => {
      const mockToken = 'malformed-token';

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('jwt malformed');
      });

      const request = new NextRequest('http://localhost:3000/admin/projects', {
        headers: {
          Cookie: `auth-token=${mockToken}`
        }
      });
      
      const response = await middleware(request);
      
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/admin/login');
    });
  });

  describe('Token expiration checking', () => {
    it('should check expiration time from JWT payload', async () => {
      const mockToken = 'valid-jwt-token';
      const futureExp = Math.floor(Date.now() / 1000) + 7200; // 2 hours from now
      const mockDecoded = {
        sessionId: 'session-123',
        userId: 'user-123',
        email: 'admin@example.com',
        exp: futureExp
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const request = new NextRequest('http://localhost:3000/admin', {
        headers: {
          Cookie: `auth-token=${mockToken}`
        }
      });
      
      const response = await middleware(request);
      
      // Should allow access since token is not expired
      expect(response.status).not.toBe(307);
    });

    it('should handle tokens without exp field', async () => {
      const mockToken = 'valid-jwt-token';
      const mockDecoded = {
        sessionId: 'session-123',
        userId: 'user-123',
        email: 'admin@example.com'
        // No exp field
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const request = new NextRequest('http://localhost:3000/admin', {
        headers: {
          Cookie: `auth-token=${mockToken}`
        }
      });
      
      const response = await middleware(request);
      
      // Should allow access since jwt.verify passed
      expect(response.status).not.toBe(307);
    });
  });
});
