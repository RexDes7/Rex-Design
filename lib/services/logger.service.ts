/**
 * Logger Service
 * 
 * Provides comprehensive logging functionality for the admin panel including:
 * - Admin action logging
 * - System error logging
 * - Security event logging
 * - Log querying with filtering and search
 * - Log archiving and retention management
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8
 */

import { randomUUID } from 'crypto';
import { getDatabase, execute, query, transaction } from '../db/client';
import type {
  Log,
  LogType,
  LogSeverity,
  LogFilter,
  CreateLogInput
} from '../db/schema';
import type {
  LoggerService,
  AdminAction,
  SystemError,
  SecurityEvent,
  LogEntry
} from '../types/logger';

/**
 * Logger Service Implementation
 * 
 * Handles all logging operations for the admin panel.
 * Logs are stored in the 'logs' table and can be archived to 'archived_logs'.
 */
class LoggerServiceImpl implements LoggerService {
  /**
   * Log an admin action
   * 
   * Records actions performed by administrators such as login, logout,
   * content changes, image uploads, etc.
   * 
   * @param action - Admin action details
   * @returns Promise that resolves when log is created
   * 
   * Validates: Requirements 8.1, 8.2
   */
  async logAdminAction(action: AdminAction): Promise<void> {
    const logInput: CreateLogInput = {
      type: 'admin_action',
      severity: 'info',
      message: this.formatAdminActionMessage(action),
      details: {
        action: action.action,
        resource: action.resource,
        resourceId: action.resourceId,
        ...action.details
      },
      user_id: action.userId,
      ip_address: undefined,
      user_agent: undefined
    };

    await this.createLog(logInput);
  }

  /**
   * Log a system error
   * 
   * Records system errors with stack traces for debugging and monitoring.
   * 
   * @param error - System error details
   * @returns Promise that resolves when log is created
   * 
   * Validates: Requirements 8.3
   */
  async logSystemError(error: SystemError): Promise<void> {
    const logInput: CreateLogInput = {
      type: 'system_error',
      severity: 'error',
      message: error.message,
      details: {
        stack: error.stack,
        ...error.context
      },
      user_id: undefined,
      ip_address: undefined,
      user_agent: undefined
    };

    await this.createLog(logInput);
  }

  /**
   * Log a security event
   * 
   * Records security-related events such as failed logins, rate limit
   * violations, invalid tokens, etc.
   * 
   * @param event - Security event details
   * @returns Promise that resolves when log is created
   * 
   * Validates: Requirements 8.1, 8.2
   */
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const severity = this.getSecurityEventSeverity(event.type);
    
    const logInput: CreateLogInput = {
      type: 'security_event',
      severity,
      message: this.formatSecurityEventMessage(event),
      details: {
        eventType: event.type,
        ...event.details
      },
      user_id: undefined,
      ip_address: event.ipAddress,
      user_agent: event.userAgent
    };

    await this.createLog(logInput);
  }

  /**
   * Get logs with optional filtering
   * 
   * Retrieves logs from the database with support for filtering by:
   * - Date range (startDate, endDate)
   * - Log type (admin_action, system_error, security_event)
   * - Severity level (info, warning, error, critical)
   * - User ID
   * 
   * Results are returned in reverse chronological order (newest first).
   * 
   * @param filter - Filter criteria
   * @returns Promise that resolves to array of log entries
   * 
   * Validates: Requirements 8.4, 8.5
   */
  async getLogs(filter: LogFilter = {}): Promise<LogEntry[]> {
    const conditions: string[] = [];
    const params: any[] = [];

    // Build WHERE clause based on filter
    if (filter.startDate) {
      conditions.push('timestamp >= ?');
      params.push(filter.startDate.toISOString());
    }

    if (filter.endDate) {
      conditions.push('timestamp <= ?');
      params.push(filter.endDate.toISOString());
    }

    if (filter.type) {
      conditions.push('type = ?');
      params.push(filter.type);
    }

    if (filter.severity) {
      conditions.push('severity = ?');
      params.push(filter.severity);
    }

    if (filter.userId) {
      conditions.push('user_id = ?');
      params.push(filter.userId);
    }

    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const sql = `
      SELECT 
        id,
        type,
        severity,
        message,
        details,
        user_id,
        ip_address,
        user_agent,
        timestamp
      FROM logs
      ${whereClause}
      ORDER BY timestamp DESC
    `;

    const rows = query<Log>(sql, params);
    return rows.map(this.mapLogToEntry);
  }

  /**
   * Search logs by keyword
   * 
   * Searches for logs containing the specified keyword in either the
   * message or details fields. Supports optional filtering.
   * 
   * @param searchQuery - Keyword to search for
   * @param filter - Optional filter criteria
   * @returns Promise that resolves to array of matching log entries
   * 
   * Validates: Requirements 8.6
   */
  async searchLogs(searchQuery: string, filter: LogFilter = {}): Promise<LogEntry[]> {
    const conditions: string[] = [];
    const params: any[] = [];

    // Add search condition
    conditions.push('(message LIKE ? OR details LIKE ?)');
    const searchPattern = `%${searchQuery}%`;
    params.push(searchPattern, searchPattern);

    // Add filter conditions
    if (filter.startDate) {
      conditions.push('timestamp >= ?');
      params.push(filter.startDate.toISOString());
    }

    if (filter.endDate) {
      conditions.push('timestamp <= ?');
      params.push(filter.endDate.toISOString());
    }

    if (filter.type) {
      conditions.push('type = ?');
      params.push(filter.type);
    }

    if (filter.severity) {
      conditions.push('severity = ?');
      params.push(filter.severity);
    }

    if (filter.userId) {
      conditions.push('user_id = ?');
      params.push(filter.userId);
    }

    const sql = `
      SELECT 
        id,
        type,
        severity,
        message,
        details,
        user_id,
        ip_address,
        user_agent,
        timestamp
      FROM logs
      WHERE ${conditions.join(' AND ')}
      ORDER BY timestamp DESC
    `;

    const rows = query<Log>(sql, params);
    return rows.map(this.mapLogToEntry);
  }

  /**
   * Archive logs older than specified date
   * 
   * Moves logs from the 'logs' table to the 'archived_logs' table.
   * This is used for log retention management.
   * 
   * @param beforeDate - Archive logs before this date
   * @returns Promise that resolves to number of logs archived
   * 
   * Validates: Requirements 8.7, 8.8
   */
  async archiveLogs(beforeDate: Date): Promise<number> {
    return transaction((db) => {
      // Insert logs into archived_logs table
      const insertSql = `
        INSERT INTO archived_logs (
          id, type, severity, message, details,
          user_id, ip_address, user_agent, timestamp
        )
        SELECT 
          id, type, severity, message, details,
          user_id, ip_address, user_agent, timestamp
        FROM logs
        WHERE timestamp < ?
      `;
      
      const insertResult = db.prepare(insertSql).run(beforeDate.toISOString());
      const archivedCount = insertResult.changes;

      // Delete archived logs from logs table
      if (archivedCount > 0) {
        const deleteSql = `
          DELETE FROM logs
          WHERE timestamp < ?
        `;
        db.prepare(deleteSql).run(beforeDate.toISOString());
      }

      return archivedCount;
    });
  }

  /**
   * Delete logs older than specified date
   * 
   * Permanently deletes logs from the 'logs' table.
   * Use with caution - this operation cannot be undone.
   * 
   * @param beforeDate - Delete logs before this date
   * @returns Promise that resolves to number of logs deleted
   */
  async deleteLogs(beforeDate: Date): Promise<number> {
    const sql = `
      DELETE FROM logs
      WHERE timestamp < ?
    `;
    
    const result = execute(sql, [beforeDate.toISOString()]);
    return result.changes;
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Create a log entry in the database
   * 
   * Note: user_id must be NULL or a valid user ID that exists in the users table
   * due to foreign key constraint. For system logs and security events, use NULL.
   */
  private async createLog(input: CreateLogInput): Promise<void> {
    const id = randomUUID();
    const timestamp = new Date().toISOString();
    const details = input.details ? JSON.stringify(input.details) : null;

    // Validate user_id exists if provided (for admin actions)
    // For system errors and security events, user_id should be NULL
    const userId = input.user_id || null;

    const sql = `
      INSERT INTO logs (
        id, type, severity, message, details,
        user_id, ip_address, user_agent, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    execute(sql, [
      id,
      input.type,
      input.severity,
      input.message,
      details,
      userId,
      input.ip_address || null,
      input.user_agent || null,
      timestamp
    ]);
  }

  /**
   * Format admin action message
   */
  private formatAdminActionMessage(action: AdminAction): string {
    const resourceInfo = action.resourceId 
      ? `${action.resource} (${action.resourceId})`
      : action.resource;
    
    return `Admin action: ${action.action} on ${resourceInfo}`;
  }

  /**
   * Format security event message
   */
  private formatSecurityEventMessage(event: SecurityEvent): string {
    return `Security event: ${event.type} from ${event.ipAddress}`;
  }

  /**
   * Get severity level for security event type
   */
  private getSecurityEventSeverity(type: string): LogSeverity {
    switch (type) {
      case 'failed_login':
        return 'warning';
      case 'rate_limit_exceeded':
        return 'warning';
      case 'invalid_token':
        return 'warning';
      case 'unauthorized_access':
        return 'error';
      case 'csrf_validation_failed':
        return 'error';
      case 'suspicious_activity':
        return 'critical';
      default:
        return 'warning';
    }
  }

  /**
   * Map database log row to LogEntry
   */
  private mapLogToEntry(log: Log): LogEntry {
    return {
      id: log.id,
      type: log.type,
      severity: log.severity,
      message: log.message,
      details: log.details ? JSON.parse(log.details) : null,
      userId: log.user_id || undefined,
      ipAddress: log.ip_address || undefined,
      userAgent: log.user_agent || undefined,
      timestamp: log.timestamp
    };
  }
}

// Export singleton instance
export const loggerService = new LoggerServiceImpl();

// Export class for testing
export { LoggerServiceImpl };

