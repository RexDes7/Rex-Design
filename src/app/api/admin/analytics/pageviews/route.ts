/**
 * Page Views Analytics API
 * GET /api/admin/analytics/pageviews?startDate&endDate&path&groupBy=day|week|month
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

    const where: Prisma.PageviewWhereInput = {}
    if (query.startDate || query.endDate) {
      where.timestamp = {
        ...(query.startDate ? { gte: query.startDate } : {}),
        ...(query.endDate ? { lte: query.endDate } : {}),
      }
    }
    if (query.path) where.path = query.path

    const [total, uniqueIpGroups, rows, pathGroups] = await Promise.all([
      db.pageview.count({ where }),
      db.pageview.groupBy({ by: ['ip'], where: { ...where, NOT: { ip: null } } }),
      db.pageview.findMany({ where, select: { timestamp: true } }),
      db.pageview.groupBy({
        by: ['path'],
        where,
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 10,
      }),
    ])

    const unique = uniqueIpGroups.length
    const uniqueVisitors = unique

    const byPeriod = groupByPeriod(
      rows.map(r => r.timestamp),
      query.groupBy
    )

    const topPages = pathGroups.map(g => ({ path: g.path, count: g._count.path }))

    return NextResponse.json({
      success: true,
      data: {
        stats: { total, unique, byPeriod },
        uniqueVisitors,
        topPages,
      },
    })
  } catch (error) {
    console.error('Error fetching page view analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page view analytics' },
      { status: 500 }
    )
  }
}
