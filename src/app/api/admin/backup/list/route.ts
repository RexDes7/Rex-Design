/**
 * Admin Backup List API
 * GET /api/admin/backup/list — список бэкапов (новые сверху)
 */
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { listBackups } from '@/lib/backup'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const result = await listBackups()

    return NextResponse.json({
      success: true,
      backups: result.backups,
      count: result.backups.length,
    })
  } catch (error) {
    console.error('Error listing backups:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to list backups' },
      { status: 500 }
    )
  }
}
