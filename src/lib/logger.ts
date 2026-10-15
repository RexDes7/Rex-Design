/**
 * Логирование действий в БД (таблица Log).
 * Fire-and-forget: ошибки записи гасятся, чтобы не ломать основной поток запроса.
 */
import { db } from '@/lib/db'

export type LogType = 'admin_action' | 'system_error' | 'security_event'
export type LogSeverity = 'info' | 'warning' | 'error' | 'critical'

export async function logAction(
  type: LogType,
  message: string,
  details?: unknown,
  severity: LogSeverity = 'info'
): Promise<void> {
  try {
    await db.log.create({
      data: {
        type,
        message,
        details: details === undefined ? null : JSON.stringify(details),
        severity,
      },
    })
  } catch (error) {
    console.error('[logger] Failed to write log entry:', error)
  }
}

/** Удобные шорткаты */
export const logAdminAction = (message: string, details?: unknown) =>
  logAction('admin_action', message, details, 'info')

export const logSystemError = (message: string, details?: unknown) =>
  logAction('system_error', message, details, 'error')

export const logSecurityEvent = (message: string, details?: unknown) =>
  logAction('security_event', message, details, 'warning')
