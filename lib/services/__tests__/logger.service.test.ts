/**
 * Logger Service Unit Tests
 * 
 * Tests for the logger service functionality including:
 * - Admin action logging
 * - System error logging
 * - Security event logging
 * - Log querying and filtering
 * - Log searching
 * - Log archiving
 */

import { loggerService, LoggerServiceImpl } from '../logger.service';
import { getDatabase } from '../../db/client';
import type { AdminAction, SystemError, SecurityEvent } from '../../types/logger';

describe('Logger Service', () => {
  let db: any;
  const TEST_USER_ID = 'test-user-123';

  beforeAll(() => {
    db = getDatabase();
    
    // Create a test user for foreign key constraint
    db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash)
      VALUES (?, ?, ?)
    `).run(TEST_USER_ID, 'test@example.com', 'hash');
  });

  beforeEach(() => {
    // Clean up logs table before each test
    db.prepare('DELETE FROM logs').run();
    db.prepare('DELETE FROM archived_logs').run();
  });

  afterAll(() => {
    // Clean up test user
    db.prepare('DELETE FROM users WHERE id = ?').run(TEST_USER_ID);
  });

  describe('logAdminAction', () => {
    it('should log an admin action with all required fields', async () => {
      const action: AdminAction = {
        userId: TEST_USER_ID,
        action: 'create_project',
        resource: 'project',
        resourceId: 'proj-456',
        details: { title: 'Test Project' },
        timestamp: new Date()
      };

      await loggerService.logAdminAction(action);

      const logs = await loggerService.getLogs({});
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe('admin_action');
      expect(logs[0].severity).toBe('info');
      expect(logs[0].userId).toBe(TEST_USER_ID);
      expect(logs[0].details).toMatchObject({
        action: 'create_project',
        resource: 'project',
        resourceId: 'proj-456',
        title: 'Test Project'
      });
    });

    it('should format admin action message correctly', async () => {
      const action: AdminAction = {
        userId: TEST_USER_ID,
        action: 'delete_project',
        resource: 'project',
        resourceId: 'proj-789',
        timestamp: new Date()
      };

      await loggerService.logAdminAction(action);

      const logs = await loggerService.getLogs({});
      expect(logs[0].message).toContain('Admin action: delete_project');
      expect(logs[0].message).toContain('project (proj-789)');
    });
  });

  describe('logSystemError', () => {
    it('should log a system error with stack trace', async () => {
      const error: SystemError = {
        message: 'Database connection failed',
        stack: 'Error: Database connection failed\n    at ...',
        context: { database: 'admin.db' },
        timestamp: new Date()
      };

      await loggerService.logSystemError(error);

      const logs = await loggerService.getLogs({});
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe('system_error');
      expect(logs[0].severity).toBe('error');
      expect(logs[0].message).toBe('Database connection failed');
      expect(logs[0].details).toMatchObject({
        stack: expect.stringContaining('Error: Database connection failed'),
        database: 'admin.db'
      });
    });
  });

  describe('logSecurityEvent', () => {
    it('should log a security event with appropriate severity', async () => {
      const event: SecurityEvent = {
        type: 'failed_login',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        details: { email: 'test@example.com' },
        timestamp: new Date()
      };

      await loggerService.logSecurityEvent(event);

      const logs = await loggerService.getLogs({});
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe('security_event');
      expect(logs[0].severity).toBe('warning');
      expect(logs[0].ipAddress).toBe('192.168.1.1');
      expect(logs[0].userAgent).toBe('Mozilla/5.0');
    });

    it('should assign critical severity to suspicious activity', async () => {
      const event: SecurityEvent = {
        type: 'suspicious_activity',
        ipAddress: '10.0.0.1',
        userAgent: 'Bot',
        timestamp: new Date()
      };

      await loggerService.logSecurityEvent(event);

      const logs = await loggerService.getLogs({});
      expect(logs[0].severity).toBe('critical');
    });
  });

  describe('getLogs', () => {
    beforeEach(async () => {
      // Create test logs with specific timestamps by manually inserting
      const { randomUUID } = require('crypto');
      
      db.prepare(`
        INSERT INTO logs (id, type, severity, message, details, user_id, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        randomUUID(),
        'admin_action',
        'info',
        'Admin action: login on auth',
        JSON.stringify({ action: 'login', resource: 'auth' }),
        TEST_USER_ID,
        '2024-01-01T10:00:00.000Z'
      );

      db.prepare(`
        INSERT INTO logs (id, type, severity, message, details, user_id, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        randomUUID(),
        'admin_action',
        'info',
        'Admin action: create_project on project',
        JSON.stringify({ action: 'create_project', resource: 'project' }),
        TEST_USER_ID,
        '2024-01-02T10:00:00.000Z'
      );

      db.prepare(`
        INSERT INTO logs (id, type, severity, message, details, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        randomUUID(),
        'system_error',
        'error',
        'Test error',
        null,
        '2024-01-03T10:00:00.000Z'
      );
    });

    it('should return all logs in reverse chronological order', async () => {
      const logs = await loggerService.getLogs({});
      
      expect(logs).toHaveLength(3);
      // Logs should be ordered newest first
      // Since we created them with specific timestamps, check the order
      expect(logs[0].message).toContain('Test error'); // 2024-01-03
      expect(logs[1].details?.action).toBe('create_project'); // 2024-01-02
      expect(logs[2].details?.action).toBe('login'); // 2024-01-01
    });

    it('should filter logs by type', async () => {
      const logs = await loggerService.getLogs({ type: 'system_error' });
      
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe('system_error');
    });

    it('should filter logs by date range', async () => {
      const logs = await loggerService.getLogs({
        startDate: new Date('2024-01-02T00:00:00Z'),
        endDate: new Date('2024-01-03T23:59:59Z')
      });
      
      expect(logs).toHaveLength(2);
    });

    it('should filter logs by user ID', async () => {
      const logs = await loggerService.getLogs({ userId: TEST_USER_ID });
      
      expect(logs).toHaveLength(2);
      expect(logs[0].userId).toBe(TEST_USER_ID);
    });

    it('should filter logs by severity', async () => {
      const logs = await loggerService.getLogs({ severity: 'error' });
      
      expect(logs).toHaveLength(1);
      expect(logs[0].severity).toBe('error');
    });
  });

  describe('searchLogs', () => {
    beforeEach(async () => {
      await loggerService.logAdminAction({
        userId: TEST_USER_ID,
        action: 'create_project',
        resource: 'project',
        details: { title: 'Portfolio Website' },
        timestamp: new Date()
      });

      await loggerService.logAdminAction({
        userId: TEST_USER_ID,
        action: 'update_project',
        resource: 'project',
        details: { title: 'Mobile App' },
        timestamp: new Date()
      });

      await loggerService.logSystemError({
        message: 'Database connection timeout',
        timestamp: new Date()
      });
    });

    it('should search logs by keyword in message', async () => {
      const logs = await loggerService.searchLogs('Database');
      
      expect(logs).toHaveLength(1);
      expect(logs[0].message).toContain('Database');
    });

    it('should search logs by keyword in details', async () => {
      const logs = await loggerService.searchLogs('Portfolio');
      
      expect(logs).toHaveLength(1);
      expect(logs[0].details?.title).toBe('Portfolio Website');
    });

    it('should support case-insensitive search', async () => {
      const logs = await loggerService.searchLogs('database');
      
      expect(logs).toHaveLength(1);
    });

    it('should combine search with filters', async () => {
      const logs = await loggerService.searchLogs('project', {
        type: 'admin_action'
      });
      
      expect(logs).toHaveLength(2);
      expect(logs.every(log => log.type === 'admin_action')).toBe(true);
    });
  });

  describe('archiveLogs', () => {
    beforeEach(async () => {
      // Create old logs
      const oldDate = new Date('2023-01-01T10:00:00Z');
      await loggerService.logAdminAction({
        userId: TEST_USER_ID,
        action: 'login',
        resource: 'auth',
        timestamp: oldDate
      });

      // Manually update timestamp to be old
      db.prepare('UPDATE logs SET timestamp = ?').run(oldDate.toISOString());

      // Create recent log
      await loggerService.logAdminAction({
        userId: TEST_USER_ID,
        action: 'logout',
        resource: 'auth',
        timestamp: new Date()
      });
    });

    it('should archive logs older than specified date', async () => {
      const cutoffDate = new Date('2024-01-01T00:00:00Z');
      const archivedCount = await loggerService.archiveLogs(cutoffDate);
      
      expect(archivedCount).toBe(1);

      // Check that old log is removed from logs table
      const logs = await loggerService.getLogs({});
      expect(logs).toHaveLength(1);
      expect(logs[0].details?.action).toBe('logout');

      // Check that old log is in archived_logs table
      const archivedLogs = db.prepare('SELECT * FROM archived_logs').all();
      expect(archivedLogs).toHaveLength(1);
      expect(archivedLogs[0].details).toContain('login');
    });

    it('should return 0 when no logs to archive', async () => {
      const cutoffDate = new Date('2020-01-01T00:00:00Z');
      const archivedCount = await loggerService.archiveLogs(cutoffDate);
      
      expect(archivedCount).toBe(0);
    });
  });

  describe('deleteLogs', () => {
    beforeEach(async () => {
      // Create old logs
      const oldDate = new Date('2023-01-01T10:00:00Z');
      await loggerService.logAdminAction({
        userId: TEST_USER_ID,
        action: 'login',
        resource: 'auth',
        timestamp: oldDate
      });

      // Manually update timestamp
      db.prepare('UPDATE logs SET timestamp = ?').run(oldDate.toISOString());

      // Create recent log
      await loggerService.logAdminAction({
        userId: TEST_USER_ID,
        action: 'logout',
        resource: 'auth',
        timestamp: new Date()
      });
    });

    it('should delete logs older than specified date', async () => {
      const cutoffDate = new Date('2024-01-01T00:00:00Z');
      const deletedCount = await loggerService.deleteLogs(cutoffDate);
      
      expect(deletedCount).toBe(1);

      const logs = await loggerService.getLogs({});
      expect(logs).toHaveLength(1);
      expect(logs[0].details?.action).toBe('logout');
    });
  });
});

