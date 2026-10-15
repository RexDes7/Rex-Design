/**
 * Admin Backup Create API
 * POST /api/admin/backup/create — создать бэкап БД (JSON-дамп)
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createBackup } from '@/lib/backup'
import { logAdminAction, logSystemError } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const result = await createBackup()

    if (result.success) {
      void logAdminAction('Создан бэкап', {
        timestamp: result.metadata?.timestamp,
        size: result.metadata?.sizeBytes,
        manual: true,
      })

      return NextResponse.json({
        success: true,
        backupPath: result.backupPath,
        metadata: result.metadata,
        message: 'Backup created successfully',
      })
    }

    void logSystemError('Не удалось создать бэкап', { error: result.error })
    return NextResponse.json(
      { success: false, error: 'Backup creation failed', message: result.error },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error creating backup:', error)
    void logSystemError('Ошибка создания бэкапа', {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json(
      { success: false, error: 'Failed to create backup' },
      { status: 500 }
    )
  }
}
