/**
 * Log Archive API
 * POST /api/admin/logs/archive — ручная архивация (удаление) старых логов
 * GET /api/admin/logs/archive — статус архивации/крона
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { logAdminAction } from '@/lib/logger'

export const dynamic = 'force-dynamic'

const LAST_ARCHIVE_KEY = 'last_log_archive'

export async function POST(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const body = await request.json().catch(() => ({}))
    const daysOld = Number(body?.daysOld) > 0 ? Number(body.daysOld) : 90

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const deleted = await db.log.deleteMany({
      where: { createdAt: { lt: cutoffDate } },
    })

    const lastArchive = new Date().toISOString()
    await db.content.upsert({
      where: { key: LAST_ARCHIVE_KEY },
      update: { value: JSON.stringify({ lastArchive, deleted: deleted.count, daysOld }) },
      create: { key: LAST_ARCHIVE_KEY, value: JSON.stringify({ lastArchive, deleted: deleted.count, daysOld }) },
    })

    void logAdminAction('Архивация логов', { daysOld, deleted: deleted.count, cutoffDate: cutoffDate.toISOString() })

    return NextResponse.json({
      success: true,
      deleted: deleted.count,
      message: `Successfully archived ${deleted.count} logs older than ${daysOld} days`,
    })
  } catch (error) {
    console.error('Error archiving logs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to archive logs' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const content = await db.content.findUnique({ where: { key: LAST_ARCHIVE_KEY } })

    let lastArchive: string | null = null
    if (content) {
      try {
        const parsed = JSON.parse(content.value)
        lastArchive = typeof parsed?.lastArchive === 'string' ? parsed.lastArchive : null
      } catch {
        lastArchive = null
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        lastArchive,
        scheduled: true,
        schedule: 'daily 03:00 UTC',
      },
    })
  } catch (error) {
    console.error('Error getting archive status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get archive status' },
      { status: 500 }
    )
  }
}
