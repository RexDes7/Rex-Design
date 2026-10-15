/**
 * Form Submissions Analytics API
 * GET /api/admin/analytics/submissions?startDate&endDate&groupBy
 * PATCH /api/admin/analytics/submissions — отметить заявку прочитанной/непрочитанной
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

    const where: Prisma.FormSubmissionWhereInput = {}
    if (query.startDate || query.endDate) {
      where.createdAt = {
        ...(query.startDate ? { gte: query.startDate } : {}),
        ...(query.endDate ? { lte: query.endDate } : {}),
      }
    }

    const [total, rows, recent, pageviewCount] = await Promise.all([
      db.formSubmission.count({ where }),
      db.formSubmission.findMany({ where, select: { createdAt: true } }),
      db.formSubmission.findMany({ where, orderBy: { createdAt: 'desc' }, take: 20 }),
      db.pageview.count({
        where: {
          ...(query.startDate || query.endDate
            ? {
                timestamp: {
                  ...(query.startDate ? { gte: query.startDate } : {}),
                  ...(query.endDate ? { lte: query.endDate } : {}),
                },
              }
            : {}),
        },
      }),
    ])

    const byPeriod = groupByPeriod(
      rows.map(r => r.createdAt),
      query.groupBy
    )

    // Конверсия: заявки / просмотры страниц (%), 1 знак после запятой
    const conversionRate = pageviewCount > 0 ? Math.round((total / pageviewCount) * 1000) / 10 : 0

    return NextResponse.json({
      success: true,
      data: {
        stats: { total, byPeriod, recent },
        conversionRate,
      },
    })
  } catch (error) {
    console.error('Error fetching submission analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submission analytics' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const body = await request.json()

    if (body?.submissionId === undefined || body?.submissionId === null) {
      return NextResponse.json({ error: 'Invalid or missing submissionId' }, { status: 400 })
    }

    const submissionId = Number(body.submissionId)
    if (!Number.isInteger(submissionId) || submissionId < 1) {
      return NextResponse.json({ error: 'Invalid or missing submissionId' }, { status: 400 })
    }

    if (typeof body?.read !== 'boolean') {
      return NextResponse.json({ error: 'Invalid or missing read status' }, { status: 400 })
    }

    const existing = await db.formSubmission.findUnique({ where: { id: submissionId } })
    if (!existing) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    await db.formSubmission.update({
      where: { id: submissionId },
      data: { read: body.read ? 1 : 0 },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
  }
}
