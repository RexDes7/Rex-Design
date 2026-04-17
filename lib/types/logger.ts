/**
 * Logger Service Types
 * 
 * Type definitions for system logging and audit trail services.
 */

import type {
  Log,
  ArchivedLog,
  LogType,
  LogSeverity,
  LogFilter,
  CreateLogInput
} from '../db/schema';

// ============================================================================
// Logger Service Interface
// ============================================================================

export interface LoggerService {
  // Log actions
  logAdminAction(action: AdminAction): Promise<void>;
  logSystemError(error: SystemError): Promise<void>;
  logSecurityEvent(event: SecurityEvent): Promise<void>;
  
  // Query logs
  getLogs(filter: LogFilter): Promise<LogEntry[]>;
  searchLogs(query: string, filter?: LogFilter): Promise<LogEntry[]>;
  
  // Maintenance
  archiveLogs(beforeDate: Date): Promise<number>;
  deleteLogs(beforeDate: Date): Promise<number>;
}

// ============================================================================
// Action Types
// ============================================================================

export type ActionType =
  | 'login'
  | 'logout'
  | 'create_project'
  | 'update_project'
  | 'delete_project'
  | 'reorder_projects'
  | 'update_content'
  | 'update_contact_info'
  | 'upload_image'
  | 'delete_image'
  | 'create_backup'
  | 'restore_backup'
  | 'archive_logs'
  | 'view_analytics'
  | 'view_logs'
  | 'mark_submission_read';

export type SecurityEventType =
  | 'failed_login'
  | 'rate_limit_exceeded'
  | 'invalid_token'
  | 'unauthorized_access'
  | 'csrf_validation_failed'
  | 'suspicious_activity';

// ============================================================================
// Log Entry Types
// ============================================================================

export interface AdminAction {
  userId: string;
  action: ActionType;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface SystemError {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: Date;
}

export interface SecurityEvent {
  type: SecurityEventType;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface LogEntry {
  id: string;
  type: LogType;
  severity: LogSeverity;
  message: string;
  details: Record<string, any> | null;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

// ============================================================================
// Log Query Types
// ============================================================================

export interface LogQuery extends LogFilter {
  limit?: number;
  offset?: number;
  sortBy?: 'timestamp' | 'severity';
  sortOrder?: 'asc' | 'desc';
}

export interface LogSearchOptions {
  query: string;
  fields?: ('message' | 'details')[];
  caseSensitive?: boolean;
  exactMatch?: boolean;
}

// ============================================================================
// Log Statistics Types
// ============================================================================

export interface LogStats {
  total: number;
  byType: { type: LogType; count: number }[];
  bySeverity: { severity: LogSeverity; count: number }[];
  byUser: { userId: string; userEmail: string; count: number }[];
  recentErrors: LogEntry[];
  recentSecurityEvents: LogEntry[];
}

export interface LogTrend {
  period: string;
  total: number;
  byType: { type: LogType; count: number }[];
  bySeverity: { severity: LogSeverity; count: number }[];
}

// ============================================================================
// Audit Trail Types
// ============================================================================

export interface AuditTrail {
  resource: string;
  resourceId: string;
  changes: AuditChange[];
}

export interface AuditChange {
  timestamp: Date;
  userId: string;
  userEmail: string;
  action: ActionType;
  before?: Record<string, any>;
  after?: Record<string, any>;
  diff?: FieldDiff[];
}

export interface FieldDiff {
  field: string;
  oldValue: any;
  newValue: any;
}

// ============================================================================
// Log Formatting Types
// ============================================================================

export interface LogFormatter {
  /**
   * Format log entry for display
   */
  format(log: LogEntry): string;
  
  /**
   * Format log entry as JSON
   */
  toJSON(log: LogEntry): string;
  
  /**
   * Format log entry for export
   */
  toCSV(log: LogEntry): string;
}

export interface LogFormatOptions {
  includeTimestamp?: boolean;
  includeUserId?: boolean;
  includeIpAddress?: boolean;
  includeDetails?: boolean;
  timestampFormat?: string;
}

// ============================================================================
// Log Retention Types
// ============================================================================

export interface RetentionPolicy {
  /**
   * Number of days to keep logs before archiving
   */
  archiveAfterDays: number;
  
  /**
   * Number of days to keep archived logs before deletion
   */
  deleteAfterDays: number;
  
  /**
   * Whether to compress archived logs
   */
  compressArchived: boolean;
}

export interface ArchiveResult {
  archivedCount: number;
  deletedCount: number;
  archivedSize: number;
  timestamp: Date;
}

// ============================================================================
// Log Alert Types
// ============================================================================

export interface LogAlert {
  id: string;
  name: string;
  condition: AlertCondition;
  actions: AlertAction[];
  enabled: boolean;
}

export interface AlertCondition {
  severity?: LogSeverity[];
  type?: LogType[];
  pattern?: string; // Regex pattern to match in message
  threshold?: number; // Number of occurrences
  timeWindow?: number; // Time window in minutes
}

export interface AlertAction {
  type: 'email' | 'webhook' | 'notification';
  config: Record<string, any>;
}

export interface AlertTrigger {
  alert: LogAlert;
  logs: LogEntry[];
  triggeredAt: Date;
}

// ============================================================================
// Log Context Types
// ============================================================================

export interface LogContext {
  requestId?: string;
  sessionId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  [key: string]: any;
}

export interface StructuredLog {
  timestamp: Date;
  level: LogSeverity;
  message: string;
  context: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

// ============================================================================
// Log Export Types
// ============================================================================

export interface LogExport {
  format: 'json' | 'csv' | 'txt';
  logs: LogEntry[];
  filename: string;
  generatedAt: Date;
  filter?: LogFilter;
}

export interface LogExportOptions {
  format: 'json' | 'csv' | 'txt';
  filter?: LogFilter;
  includeArchived?: boolean;
  compress?: boolean;
}

// ============================================================================
// Log Monitoring Types
// ============================================================================

export interface LogMonitor {
  /**
   * Start monitoring logs
   */
  start(): void;
  
  /**
   * Stop monitoring logs
   */
  stop(): void;
  
  /**
   * Subscribe to log events
   */
  subscribe(callback: (log: LogEntry) => void): () => void;
  
  /**
   * Get current monitoring status
   */
  getStatus(): MonitorStatus;
}

export interface MonitorStatus {
  isRunning: boolean;
  startedAt?: Date;
  logsProcessed: number;
  alertsTriggered: number;
  lastError?: string;
}

// ============================================================================
// Performance Logging Types
// ============================================================================

export interface PerformanceLog {
  operation: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface PerformanceMetrics {
  operation: string;
  count: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  p50: number;
  p95: number;
  p99: number;
}
