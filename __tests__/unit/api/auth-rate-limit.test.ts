/**
 * Integration Tests for Login Rate Limiting
 * 
 * Tests the rate limiting functionality in the login endpoint
 * 
 * Requirements: 11.5, 11.6, 11.7
 * 
 * @jest-environment node
 */

import { POST } from '@/app/api/admin/auth/login/route';
import { NextRequest } from 'next/server';
import { clearAllRateLimits } from '@/lib/utils/rate-limiter';
import { getDatabase } from '@/lib/db/client';

// Mock the auth service to control login success/failure
jest.mock('@/lib/services/auth.service', () => ({
  authService: {
    login: jest.fn()
  }
}));

import { authService } from '@/lib/services/auth.service';

describe('Login Rate Limiting', () => {
  const mockAuthService = authService as jest.Mocked<typeof authService>;
  
  beforeEach(() => {
    // Clear rate limits before each test
    clearAllRateLimits();
    
    // Reset mock
    mockAuthService.login.mockReset();
  });

  function createLoginRequest(email: string, password: string, ipAddress: string = '192.168.1.1'): NextRequest {
    const request = new NextRequest('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': ipAddress,
        'user-agent': 'test-agent'
      },
      body: JSON.stringify({ email, password })
    });
    
    return request;
  }

  describe('Rate limiting enforcement', () => {
    it('should allow first 4 failed attempts without blocking', async () => {
      mockAuthService.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      });

      const ip = '192.168.1.1';

      // Make 4 failed attempts
      for (let i = 0; i < 4; i++) {
        const request = createLoginRequest('test@example.com', 'wrong', ip);
        const response = await POST(request);
        
        expect(response.status).toBe(401);
        
        const data = await response.json();
        expect(data.error.code).toBe('AUTH_INVALID_CREDENTIALS');
      }
    });

    it('should block IP after 5 failed attempts (Requirement 11.5)', async () => {
      mockAuthService.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      });

      const ip = '192.168.1.1';

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        const request = createLoginRequest('test@example.com', 'wrong', ip);
        await POST(request);
      }

      // 6th attempt should be blocked
      const request = createLoginRequest('test@example.com', 'wrong', ip);
      const response = await POST(request);
      
      expect(response.status).toBe(429);
      
      const data = await response.json();
      expect(data.error.code).toBe('AUTH_RATE_LIMIT_EXCEEDED');
      expect(data.error.message).toContain('Too many failed login attempts');
      expect(data.error.retryAfter).toBeDefined();
    });

    it('should include Retry-After header when blocked (Requirement 11.6)', async () => {
      mockAuthService.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      });

      const ip = '192.168.1.1';

      // Block the IP
      for (let i = 0; i < 5; i++) {
        const request = createLoginRequest('test@example.com', 'wrong', ip);
        await POST(request);
      }

      // Next attempt should include Retry-After header
      const request = createLoginRequest('test@example.com', 'wrong', ip);
      const response = await POST(request);
      
      const retryAfter = response.headers.get('Retry-After');
      expect(retryAfter).toBeDefined();
      expect(parseInt(retryAfter!)).toBeGreaterThan(0);
    });

    it('should warn user when approaching rate limit', async () => {
      mockAuthService.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      });

      const ip = '192.168.1.1';

      // Make 3 failed attempts
      for (let i = 0; i < 3; i++) {
        const request = createLoginRequest('test@example.com', 'wrong', ip);
        await POST(request);
      }

      // 4th attempt should include warning
      const request = createLoginRequest('test@example.com', 'wrong', ip);
      const response = await POST(request);
      const data = await response.json();
      
      expect(data.error.attemptsRemaining).toBe(1);
      expect(data.error.warning).toContain('1 attempt(s) remaining');
    });

    it('should clear rate limit on successful login', async () => {
      const ip = '192.168.1.1';

      // Make 3 failed attempts
      mockAuthService.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      });

      for (let i = 0; i < 3; i++) {
        const request = createLoginRequest('test@example.com', 'wrong', ip);
        await POST(request);
      }

      // Successful login
      mockAuthService.login.mockResolvedValue({
        success: true,
        token: 'valid-token'
      });

      const successRequest = createLoginRequest('test@example.com', 'correct', ip);
      const successResponse = await POST(successRequest);
      
      expect(successResponse.status).toBe(200);

      // Should be able to make more attempts now
      mockAuthService.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      });

      for (let i = 0; i < 4; i++) {
        const request = createLoginRequest('test@example.com', 'wrong', ip);
        const response = await POST(request);
        expect(response.status).toBe(401); // Not blocked
      }
    });

    it('should track different IPs independently', async () => {
      mockAuthService.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      });

      const ip1 = '192.168.1.1';
      const ip2 = '192.168.1.2';

      // Block IP1
      for (let i = 0; i < 5; i++) {
        const request = createLoginRequest('test@example.com', 'wrong', ip1);
        await POST(request);
      }

      // IP1 should be blocked
      const blockedRequest = createLoginRequest('test@example.com', 'wrong', ip1);
      const blockedResponse = await POST(blockedRequest);
      expect(blockedResponse.status).toBe(429);

      // IP2 should still work
      const ip2Request = createLoginRequest('test@example.com', 'wrong', ip2);
      const ip2Response = await POST(ip2Request);
      expect(ip2Response.status).toBe(401); // Not blocked, just invalid credentials
    });
  });

  describe('Failed login logging (Requirement 11.7)', () => {
    it('should log failed login attempts to database', async () => {
      mockAuthService.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      });

      const db = getDatabase();
      
      // Clear logs before test
      db.prepare('DELETE FROM logs').run();

      const request = createLoginRequest('test@example.com', 'wrong', '192.168.1.1');
      await POST(request);

      // Check that log was created
      const logs = db.prepare(`
        SELECT * FROM logs 
        WHERE type = 'security_event' 
        AND message = 'Failed login attempt'
      `).all();

      expect(logs.length).toBeGreaterThan(0);
      
      const log = logs[0] as any;
      expect(log.severity).toBe('warning');
      expect(log.ip_address).toBe('192.168.1.1');
      expect(log.user_agent).toBe('test-agent');
      
      const details = JSON.parse(log.details);
      expect(details.email).toBe('test@example.com');
      expect(details.reason).toBe('invalid_credentials');
    });

    it('should log rate limit exceeded events', async () => {
      mockAuthService.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      });

      const db = getDatabase();
      
      // Clear logs before test
      db.prepare('DELETE FROM logs').run();

      const ip = '192.168.1.1';

      // Make 5 failed attempts to trigger rate limit
      for (let i = 0; i < 5; i++) {
        const request = createLoginRequest('test@example.com', 'wrong', ip);
        await POST(request);
      }

      // Check that rate limit log was created
      const logs = db.prepare(`
        SELECT * FROM logs 
        WHERE type = 'security_event' 
        AND message = 'Rate limit exceeded'
      `).all();

      expect(logs.length).toBeGreaterThan(0);
      
      const log = logs[0] as any;
      expect(log.severity).toBe('error');
      expect(log.ip_address).toBe(ip);
      
      const details = JSON.parse(log.details);
      expect(details.reason).toBe('too_many_failed_attempts');
      expect(details.failed_attempts).toBe(5);
      expect(details.block_duration_minutes).toBe(15);
    });
  });

  describe('IP address extraction', () => {
    it('should extract IP from x-forwarded-for header', async () => {
      mockAuthService.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      });

      const db = getDatabase();
      db.prepare('DELETE FROM logs').run();

      const request = new NextRequest('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-forwarded-for': '203.0.113.1, 198.51.100.1',
          'user-agent': 'test-agent'
        },
        body: JSON.stringify({ email: 'test@example.com', password: 'wrong' })
      });

      await POST(request);

      const logs = db.prepare(`
        SELECT * FROM logs 
        WHERE type = 'security_event' 
        AND message = 'Failed login attempt'
      `).all();

      expect(logs.length).toBeGreaterThan(0);
      const log = logs[0] as any;
      expect(log.ip_address).toBe('203.0.113.1'); // First IP in the list
    });

    it('should extract IP from x-real-ip header', async () => {
      mockAuthService.login.mockResolvedValue({
        success: false,
        error: 'Invalid credentials'
      });

      const db = getDatabase();
      db.prepare('DELETE FROM logs').run();

      const request = new NextRequest('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-real-ip': '203.0.113.2',
          'user-agent': 'test-agent'
        },
        body: JSON.stringify({ email: 'test@example.com', password: 'wrong' })
      });

      await POST(request);

      const logs = db.prepare(`
        SELECT * FROM logs 
        WHERE type = 'security_event' 
        AND message = 'Failed login attempt'
      `).all();

      expect(logs.length).toBeGreaterThan(0);
      const log = logs[0] as any;
      expect(log.ip_address).toBe('203.0.113.2');
    });
  });
});
