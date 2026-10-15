/**
 * Общие помощники аналитики: парсинг фильтров и группировка по периодам.
 */
export type GroupBy = 'day' | 'week' | 'month'

export interface AnalyticsQuery {
  startDate?: Date
  endDate?: Date
  path?: string
  elementId?: string
  groupBy?: GroupBy
}

export function parseAnalyticsQuery(url: string): AnalyticsQuery {
  const { searchParams } = new URL(url)

  const query: AnalyticsQuery = {}

  const startDate = searchParams.get('startDate')
  if (startDate) {
    const d = new Date(startDate)
    if (!Number.isNaN(d.getTime())) query.startDate = d
  }

  const endDate = searchParams.get('endDate')
  if (endDate) {
    const d = new Date(endDate)
    if (!Number.isNaN(d.getTime())) query.endDate = d
  }

  const path = searchParams.get('path')
  if (path) query.path = path

  const elementId = searchParams.get('elementId')
  if (elementId) query.elementId = elementId

  const groupBy = searchParams.get('groupBy')
  if (groupBy === 'day' || groupBy === 'week' || groupBy === 'month') {
    query.groupBy = groupBy
  }

  return query
}

/** Ключ периода: day → 'YYYY-MM-DD', week → 'YYYY-Www', month → 'YYYY-MM' */
export function getPeriodKey(date: Date, groupBy: GroupBy): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')

  if (groupBy === 'month') return `${y}-${m}`
  if (groupBy === 'week') return `${y}-W${getIsoWeek(date)}`

  return `${y}-${m}-${d}`
}

/** Номер недели по ISO 8601 */
function getIsoWeek(date: Date): number {
  const utc = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const dayNum = utc.getUTCDay() || 7 // воскресенье = 7
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1))
  return Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

/** Группировка дат по периоду → отсортированный [{period, count}] */
export function groupByPeriod(
  dates: Date[],
  groupBy: GroupBy | undefined
): Array<{ period: string; count: number }> {
  if (!groupBy) return []

  const counts = new Map<string, number>()
  for (const date of dates) {
    const key = getPeriodKey(date, groupBy)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([period, count]) => ({ period, count }))
    .sort((a, b) => (a.period < b.period ? -1 : 1))
}

/** Клиентский IP из заголовков */
export function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
}
