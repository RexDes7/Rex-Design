/**
 * Аналитика: фильтр дат/группировки, стат-карточки, CSS-графики
 * (просмотры по периодам, клики по элементам), таблица заявок.
 */
'use client'

import { useCallback, useEffect, useState } from 'react'
import { Eye, Users, MousePointerClick, Mail, TrendingUp, Filter } from 'lucide-react'
import {
  adminFetch,
  formatDateTime,
  toDateInput,
  type ClicksData,
  type PageviewsData,
  type SubmissionsData,
} from './api'

type GroupBy = 'day' | 'week' | 'month'

interface Filters {
  startDate: string
  endDate: string
  groupBy: GroupBy
}

function defaultFilters(): Filters {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return { startDate: toDateInput(start), endDate: toDateInput(end), groupBy: 'day' }
}

export default function AnalyticsSection() {
  const [draft, setDraft] = useState<Filters>(defaultFilters)
  const [applied, setApplied] = useState<Filters>(defaultFilters)

  const [pageviews, setPageviews] = useState<PageviewsData | null>(null)
  const [clicks, setClicks] = useState<ClicksData | null>(null)
  const [submissions, setSubmissions] = useState<SubmissionsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async (filters: Filters) => {
    setLoading(true)
    setError('')
    // endDate — конец суток, чтобы включать данные выбранного дня (включая сегодня)
    const params = new URLSearchParams({
      startDate: filters.startDate,
      endDate: `${filters.endDate}T23:59:59.999`,
      groupBy: filters.groupBy,
    })
    try {
      const [pv, cl, sb] = await Promise.all([
        adminFetch<{ success: boolean; data: PageviewsData }>(
          `/api/admin/analytics/pageviews?${params}`
        ),
        adminFetch<{ success: boolean; data: ClicksData }>(
          `/api/admin/analytics/clicks?${params}`
        ),
        adminFetch<{ success: boolean; data: SubmissionsData }>(
          `/api/admin/analytics/submissions?${params}`
        ),
      ])
      setPageviews(pv.data)
      setClicks(cl.data)
      setSubmissions(sb.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить аналитику')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load(applied)
  }, [applied, load])

  const applyFilters = () => {
    if (!draft.startDate || !draft.endDate) return
    setApplied({ ...draft })
  }

  /** Отметить заявку прочитанной/непрочитанной */
  const toggleRead = async (id: number, read: boolean) => {
    try {
      await adminFetch('/api/admin/analytics/submissions', {
        method: 'PATCH',
        body: JSON.stringify({ submissionId: id, read }),
      })
      setSubmissions((prev) =>
        prev
          ? {
              ...prev,
              stats: {
                ...prev.stats,
                recent: prev.stats.recent.map((s) => (s.id === id ? { ...s, read: read ? 1 : 0 } : s)),
              },
            }
          : prev
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось обновить статус заявки')
    }
  }

  const stats = [
    { label: 'Просмотры', value: pageviews?.stats.total ?? 0, icon: Eye },
    { label: 'Уникальные посетители', value: pageviews?.uniqueVisitors ?? 0, icon: Users },
    { label: 'Клики', value: clicks?.stats.total ?? 0, icon: MousePointerClick },
    { label: 'Заявки', value: submissions?.stats.total ?? 0, icon: Mail },
    {
      label: 'Конверсия',
      value: `${submissions?.conversionRate ?? 0}%`,
      icon: TrendingUp,
    },
  ]

  const byPeriod = pageviews?.stats.byPeriod ?? []
  const byElement = clicks?.stats.byElement ?? []
  const recent = submissions?.stats.recent ?? []

  return (
    <div>
      {/* Фильтры */}
      <div className="flex flex-wrap items-end gap-3 border-2 border-[#2A2E36] bg-[#111318] p-4 transition-colors hover:border-[#3a3f49] sm:gap-4">
        <div>
          <label
            htmlFor="analytics-start"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
          >
            С:
          </label>
          <input
            id="analytics-start"
            type="date"
            value={draft.startDate}
            onChange={(e) => setDraft((p) => ({ ...p, startDate: e.target.value }))}
            className="border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] focus:border-[#E63946] focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="analytics-end"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
          >
            По:
          </label>
          <input
            id="analytics-end"
            type="date"
            value={draft.endDate}
            onChange={(e) => setDraft((p) => ({ ...p, endDate: e.target.value }))}
            className="border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] focus:border-[#E63946] focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="analytics-group"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
          >
            Группировка
          </label>
          <select
            id="analytics-group"
            value={draft.groupBy}
            onChange={(e) => setDraft((p) => ({ ...p, groupBy: e.target.value as GroupBy }))}
            className="border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] focus:border-[#E63946] focus:outline-none"
          >
            <option value="day">День</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
          </select>
        </div>
        <button
          type="button"
          onClick={applyFilters}
          disabled={loading || !draft.startDate || !draft.endDate}
          className="flex items-center gap-2 border-2 border-[#E63946] bg-[#E63946] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#c42b37] disabled:opacity-60"
        >
          <Filter className="h-3.5 w-3.5" aria-hidden="true" />
          Применить
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 border-2 border-[#E63946] bg-[#E63946]/10 px-4 py-3 text-sm text-[#E63946]"
        >
          {error}
        </div>
      )}

      {/* Стат-карточки */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((card) => (
          <div
            key={card.label}
            className="border-2 border-[#2A2E36] bg-[#111318] p-4 transition-colors hover:border-[#E63946]"
          >
            <card.icon className="h-4 w-4 text-[#E63946]" aria-hidden="true" />
            <div className="mt-3 font-display text-3xl font-bold leading-none text-[#E8E4DF]">
              {loading ? '—' : card.value}
            </div>
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-widest text-[#8a8f98]">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* График: просмотры по периодам */}
      <section className="mt-8" aria-labelledby="chart-views-heading">
        <h2
          id="chart-views-heading"
          className="flex items-center gap-3 font-display text-2xl font-semibold uppercase text-[#E8E4DF]"
        >
          Просмотры
          <span className="block h-2.5 w-2.5 bg-[#E63946]" aria-hidden="true" />
        </h2>
        <div className="mt-4 border-2 border-[#2A2E36] bg-[#111318] p-4 sm:p-6">
          {byPeriod.length === 0 ? (
            <p className="py-8 text-center font-mono text-xs uppercase tracking-widest text-[#8a8f98]">
              Нет данных для отображения
            </p>
          ) : (
            <PeriodBarChart data={byPeriod} />
          )}
        </div>
      </section>

      {/* График: клики по элементам */}
      <section className="mt-8" aria-labelledby="chart-clicks-heading">
        <h2
          id="chart-clicks-heading"
          className="flex items-center gap-3 font-display text-2xl font-semibold uppercase text-[#E8E4DF]"
        >
          Клики по элементам
          <span className="block h-2.5 w-2.5 bg-[#E63946]" aria-hidden="true" />
        </h2>
        <div className="mt-4 border-2 border-[#2A2E36] bg-[#111318] p-4 sm:p-6">
          {byElement.length === 0 ? (
            <p className="py-8 text-center font-mono text-xs uppercase tracking-widest text-[#8a8f98]">
              Нет данных о кликах
            </p>
          ) : (
            <div className="space-y-2.5">
              {byElement.map((el) => {
                const max = Math.max(...byElement.map((x) => x.count), 1)
                const pct = Math.max((el.count / max) * 100, 2)
                return (
                  <div key={el.elementId} className="flex items-center gap-3">
                    <span className="w-36 shrink-0 truncate font-mono text-xs text-[#E8E4DF] sm:w-48">
                      {el.elementId}
                    </span>
                    <div className="h-5 flex-1 border-2 border-[#2A2E36] bg-[#0A0A0A]">
                      <div
                        className="h-full bg-[#E63946] transition-colors hover:bg-[#c42b37]"
                        style={{ width: `${pct}%` }}
                        title={`${el.elementId}: ${el.count}`}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right font-mono text-xs text-[#E8E4DF]">
                      {el.count}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Заявки */}
      <section className="mt-8" aria-labelledby="submissions-heading">
        <h2
          id="submissions-heading"
          className="flex items-center gap-3 font-display text-2xl font-semibold uppercase text-[#E8E4DF]"
        >
          Последние заявки
          <span className="block h-2.5 w-2.5 bg-[#E63946]" aria-hidden="true" />
        </h2>
        <div className="mt-4 overflow-x-auto border-2 border-[#2A2E36] bg-[#111318]">
          {recent.length === 0 ? (
            <p className="p-6 text-center font-mono text-xs uppercase tracking-widest text-[#8a8f98]">
              Заявок нет
            </p>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-[#2A2E36] font-mono text-[10px] uppercase tracking-widest text-[#8a8f98]">
                  <th className="px-4 py-3 font-medium">Дата</th>
                  <th className="px-4 py-3 font-medium">Имя</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Сообщение</th>
                  <th className="px-4 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr
                    key={s.id}
                    className={`border-b border-[#1c2027] transition-colors hover:bg-[#16191f] ${
                      s.read === 0 ? 'bg-[#E63946]/[0.04]' : ''
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#8a8f98]">
                      {formatDateTime(s.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-[#E8E4DF]">{s.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#8a8f98]">{s.email}</td>
                    <td className="max-w-xs truncate px-4 py-3 text-[#b6bac2]" title={s.message}>
                      {s.message}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleRead(s.id, s.read === 0)}
                        className={`border-2 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                          s.read === 0
                            ? 'border-[#E63946] text-[#E63946] hover:bg-[#E63946] hover:text-white'
                            : 'border-[#2A2E36] text-[#8a8f98] hover:border-[#E63946] hover:text-[#E63946]'
                        }`}
                      >
                        {s.read === 0 ? 'Новая · Прочитать' : 'Прочитана'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}

/**
 * Вертикальный бар-чарт на чистом CSS: высота = % от максимума,
 * hover-tooltip с количеством, подписи периодов повёрнуты при необходимости.
 */
function PeriodBarChart({ data }: { data: Array<{ period: string; count: number }> }) {
  const max = Math.max(...data.map((d) => d.count), 1)
  const rotated = data.length > 8
  // Показываем не более ~14 подписей, чтобы не сливались
  const labelEvery = Math.max(1, Math.ceil(data.length / 14))

  return (
    <div>
      <div className="flex h-48 items-end gap-1 sm:gap-1.5" role="img" aria-label="График просмотров по периодам">
        {data.map((item, i) => {
          const pct = (item.count / max) * 100
          const prev = i > 0 ? data[i - 1].count : item.count
          const trend = item.count > prev ? '▲' : item.count < prev ? '▼' : ''
          return (
            <div
              key={`${item.period}-${i}`}
              className="group relative flex h-full min-w-0 flex-1 flex-col justify-end"
              title={`${item.period}: ${item.count} ${trend}`.trim()}
            >
              <span
                className={`mb-1 text-center font-mono text-[9px] leading-none ${
                  item.count > 0 ? 'text-[#E8E4DF]' : 'text-transparent'
                }`}
              >
                {item.count}
              </span>
              <div
                className="w-full bg-[#E63946] transition-colors group-hover:bg-[#c42b37]"
                style={{ height: `${Math.max(pct, item.count > 0 ? 2 : 0.5)}%` }}
              />
            </div>
          )
        })}
      </div>
      {/* Подписи оси X */}
      <div className="mt-2 flex h-12 gap-1 overflow-hidden sm:gap-1.5" aria-hidden="true">
        {data.map((item, i) => (
          <div key={`label-${item.period}-${i}`} className="min-w-0 flex-1">
            {(i % labelEvery === 0 || i === data.length - 1) && (
              <span
                className={`block whitespace-nowrap font-mono text-[9px] text-[#5a5f68] ${
                  rotated ? 'origin-top-left -rotate-[52deg] translate-y-0.5' : ''
                }`}
              >
                {item.period}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
