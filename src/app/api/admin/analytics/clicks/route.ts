/**
 * Clicks Analytics API
 * GET /api/admin/analytics/clicks?startDate&endDate&groupBy&elementId
 * При указании elementId дополнительно возвращает ctr (клики/просмотры, %)
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { parseAnalyticsQuery, groupByPeriod } from '@/lib/analytics'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const query = parseAnalyticsQuery(request.url)

    const where: Prisma.ClickWhereInput = {}
    if (query.startDate || query.endDate) {
      where.createdAt = {
        ...(query.startDate ? { gte: query.startDate } : {}),
        ...(query.endDate ? { lte: query.endDate } : {}),
      }
    }

    const [total, elementGroups, rows] = await Promise.all([
      db.click.count({ where }),
      db.click.groupBy({
        by: ['elementId'],
        where,
        _count: { elementId: true },
        orderBy: { _count: { elementId: 'desc' } },
      }),
      db.click.findMany({ where, select: { createdAt: true } }),
    ])

    const byElement = elementGroups.map(g => ({ elementId: g.elementId, count: g._count.elementId }))
    const byPeriod = groupByPeriod(
      rows.map(r => r.createdAt),
      query.groupBy
    )

    // CTR для конкретного элемента: клики / просмотры страниц, где он кликнулся
    let ctr: number | undefined
    if (query.elementId) {
      const elementClicks = await db.click.count({ where: { elementId: query.elementId } })
      const clickedPaths = await db.click.findMany({
        where: { elementId: query.elementId },
        select: { path: true },
        distinct: ['path'],
      })
      const paths = clickedPaths.map(p => p.path).filter((p): p is string => p !== null)

      if (paths.length > 0) {
        const impressions = await db.pageview.count({ where: { path: { in: paths } } })
        if (impressions > 0) {
          ctr = Math.round((elementClicks / impressions) * 1000) / 10
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: { total, byElement, byPeriod },
        ...(ctr !== undefined ? { ctr } : {}),
      },
    })
  } catch (error) {
    console.error('Error fetching click analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch click analytics' },
      { status: 500 }
    )
  }
}
