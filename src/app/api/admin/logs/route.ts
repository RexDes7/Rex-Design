/**
 * Admin Logs API
 * GET /api/admin/logs — логи с фильтрами и поиском (50/стр)
 * Query: startDate, endDate, type, severity, search, page
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import type { Prisma, Log } from '@prisma/client'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 50

const VALID_TYPES = ['admin_action', 'system_error', 'security_event']
const VALID_SEVERITIES = ['info', 'warning', 'error', 'critical']

export async function GET(request: Request) {
  try {
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized

    const { searchParams } = new URL(request.url)

    const startDateStr = searchParams.get('startDate')
    const endDateStr = searchParams.get('endDate')
    const type = searchParams.get('type')
    const severity = searchParams.get('severity')
    const search = searchParams.get('search')?.trim().toLowerCase() ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)

    // Фильтры уровня БД: дата + тип
    const where: Prisma.LogWhereInput = {}
    if (startDateStr || endDateStr) {
      const dateFilter: Prisma.DateTimeFilter = {}
      const start = startDateStr ? new Date(startDateStr) : null
      const end = endDateStr ? new Date(endDateStr) : null
      if (start && !Number.isNaN(start.getTime())) dateFilter.gte = start
      if (end && !Number.isNaN(end.getTime())) dateFilter.lte = end
      if (dateFilter.gte || dateFilter.lte) where.createdAt = dateFilter
    }
    if (type && VALID_TYPES.includes(type)) where.type = type

    const rows = await db.log.findMany({ where, orderBy: { createdAt: 'desc' } })

    // Поиск (регистронезависимый) по message + details — в JS, т.к. SQLite Prisma
    // не поддерживает mode: 'insensitive'
    const searched = search
      ? rows.filter(row => {
          const message = row.message.toLowerCase()
          const details = (row.details ?? '').toLowerCase()
          return message.includes(search) || details.includes(search)
        })
      : rows

    // Счётчики по severity (без фильтра по severity — для бейджей фильтра)
    const counts = { info: 0, warning: 0, error: 0, critical: 0 }
    for (const row of searched) {
      if (row.severity in counts) counts[row.severity as keyof typeof counts] += 1
    }

    // Фильтр по severity применяется к итоговому списку
    const filtered =
      severity && VALID_SEVERITIES.includes(severity)
        ? searched.filter(row => row.severity === severity)
        : searched

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const safePage = Math.min(page, totalPages)
    const logs: Log[] = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

    return NextResponse.json({
      success: true,
      data: {
        logs,
        total,
        page: safePage,
        totalPages,
        counts,
      },
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch logs' },
      { status: 500 }
    )
  }
}
