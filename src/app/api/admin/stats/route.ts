/**
 * Admin Stats API
 * GET /api/admin/stats — статистика для дашборда
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const totalProjects = await db.project.count()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const pageviewsLast30Days = await db.pageview.count({
      where: { timestamp: { gte: thirtyDaysAgo } },
    })

    const recentPageviews = await db.pageview.findMany({
      orderBy: { timestamp: 'desc' },
      take: 5,
      select: { path: true, timestamp: true },
    })

    return NextResponse.json({
      success: true,
      data: {
        totalProjects,
        pageviewsLast30Days,
        recentPageviews,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 })
  }
}
