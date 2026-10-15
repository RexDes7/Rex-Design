/**
 * Admin Backup Restore API
 * POST /api/admin/backup/restore — восстановить БД из бэкапа (транзакционно)
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { restoreBackup } from '@/lib/backup'
import { logAdminAction, logSystemError } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const body = await request.json()
    const timestamp = typeof body?.timestamp === 'string' ? body.timestamp : ''

    if (!timestamp) {
      return NextResponse.json(
        { success: false, error: 'Укажите timestamp бэкапа' },
        { status: 400 }
      )
    }

    const result = await restoreBackup(timestamp)

    if (result.success) {
      void logAdminAction('Восстановлен бэкап', { timestamp, restored: result.restored })

      return NextResponse.json({
        success: true,
        restored: result.restored,
        message: 'Backup restored successfully',
      })
    }

    void logSystemError('Не удалось восстановить бэкап', { timestamp, error: result.error })
    const notFound = result.error === 'Бэкап не найден'
    return NextResponse.json(
      { success: false, error: 'Backup restoration failed', message: result.error },
      { status: notFound ? 404 : 500 }
    )
  } catch (error) {
    console.error('Error restoring backup:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to restore backup' },
      { status: 500 }
    )
  }
}
