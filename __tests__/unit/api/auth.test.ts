/**
 * Unit Tests for Authentication API Endpoints
 * 
 * Tests the login and logout endpoints for correct behavior,
 * cookie handling, and error responses.
 * 
 * Requirements: 1.2, 1.4
 * 
 * @jest-environment node
 */

import { NextRequest } from 'next/server';
import { POST as loginPOST } from '@/app/api/admin/auth/login/route';
import { POST as logoutPOST } from '@/app/api/admin/auth/logout/route';
import { authService } from '@/lib/services/auth.service';

// Mock the auth service
jest.mock('@/lib/services/auth.service', () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn()
  }
}));

describe('Authentication API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/admin/auth/login', () => {
    it('should return 400 when email is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ password: 'test123' })
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('VALIDATION_REQUIRED_FIELD');
      expect(data.error.message).toContain('Email and password are required');
    });

    it('should return 400 when password is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com' })
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error.code).toBe('VALIDATION_REQUIRED_FIELD');
    });

    it('should return 401 when credentials are invalid', async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      });

      const request = new NextRequest('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        })
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error.code).toBe('AUTH_INVALID_CREDENTIALS');
      expect(authService.login).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
    });

    it('should return 200 and set HTTP-only cookie on successful login', async () => {
      const mockToken = 'mock-jwt-token-12345';
      (authService.login as jest.Mock).mockResolvedValue({
        success: true,
        token: mockToken
      });

      const request = new NextRequest('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'baracuda.max1@gmail.com',
          password: 'Raf070100'
        })
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Login successful');

      // Check cookie is set
      const cookie = response.cookies.get('auth-token');
      expect(cookie).toBeDefined();
      expect(cookie?.value).toBe(mockToken);
      expect(cookie?.httpOnly).toBe(true);
      expect(cookie?.sameSite).toBe('strict');
      expect(cookie?.path).toBe('/');
    });

    it('should set secure flag in production environment', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const mockToken = 'mock-jwt-token-12345';
      (authService.login as jest.Mock).mockResolvedValue({
        success: true,
        token: mockToken
      });

      const request = new NextRequest('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'baracuda.max1@gmail.com',
          password: 'Raf070100'
        })
      });

      const response = await loginPOST(request);
      const cookie = response.cookies.get('auth-token');

      expect(cookie?.secure).toBe(true);

      // Restore environment
      process.env.NODE_ENV = originalEnv;
    });

    it('should return 500 on internal error', async () => {
      (authService.login as jest.Mock).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123'
        })
      });

      const response = await loginPOST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error.code).toBe('INTERNAL_ERROR');
    });
  });

  describe('POST /api/admin/auth/logout', () => {
    it('should call authService.logout with token from cookie', async () => {
      const mockToken = 'mock-jwt-token-12345';
      (authService.logout as jest.Mock).mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/admin/auth/logout', {
        method: 'POST',
        headers: {
          Cookie: `auth-token=${mockToken}`
        }
      });

      const response = await logoutPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Logout successful');
      expect(authService.logout).toHaveBeenCalledWith(mockToken);
    });

    it('should clear auth-token cookie', async () => {
      const mockToken = 'mock-jwt-token-12345';
      (authService.logout as jest.Mock).mockResolvedValue(undefined);

      const request = new NextRequest('http://localhost:3000/api/admin/auth/logout', {
        method: 'POST',
        headers: {
          Cookie: `auth-token=${mockToken}`
        }
      });

      const response = await logoutPOST(request);

      // Check that cookie is deleted (Next.js sets it to empty with past expiry)
      const cookie = response.cookies.get('auth-token');
      expect(cookie).toBeDefined();
      expect(cookie?.value).toBe('');
      expect(cookie?.expires).toEqual(new Date(0));
    });

    it('should succeed even without a token', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/auth/logout', {
        method: 'POST'
      });

      const response = await logoutPOST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(authService.logout).not.toHaveBeenCalled();
    });

    it('should succeed even if logout service fails', async () => {
      const mockToken = 'mock-jwt-token-12345';
      (authService.logout as jest.Mock).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/admin/auth/logout', {
        method: 'POST',
        headers: {
          Cookie: `auth-token=${mockToken}`
        }
      });

      const response = await logoutPOST(request);
      const data = await response.json();

      // Should still return success and clear cookie
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      
      // Cookie should still be cleared (Next.js sets it to empty with past expiry)
      const cookie = response.cookies.get('auth-token');
      expect(cookie).toBeDefined();
      expect(cookie?.value).toBe('');
      expect(cookie?.expires).toEqual(new Date(0));
    });
  });
});
