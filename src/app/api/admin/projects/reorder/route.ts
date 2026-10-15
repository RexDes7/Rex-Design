/**
 * Projects Reorder API
 * POST /api/admin/projects/reorder — порядок проектов (drag-and-drop)
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { logAdminAction } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const body = await request.json()
    const order = body?.order

    if (!Array.isArray(order) || order.length === 0 || !order.every(id => typeof id === 'string')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order must be a non-empty array of project IDs',
        },
        { status: 400 }
      )
    }

    await db.$transaction(
      order.map((id: string, index: number) =>
        db.project.updateMany({ where: { id }, data: { displayOrder: index } })
      )
    )

    void logAdminAction('Изменён порядок проектов', { count: order.length })

    return NextResponse.json({
      success: true,
      message: 'Projects reordered successfully',
    })
  } catch (error) {
    console.error('Error reordering projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reorder projects' },
      { status: 500 }
    )
  }
}
