/**
 * Дашборд: 3 стат-карточки + последние просмотры (ru-RU).
 */
'use client'

import { useEffect, useState } from 'react'
import { Palette, Eye, Activity, RefreshCw } from 'lucide-react'
import { adminFetch, formatDateTime, type StatsData } from './api'

export default function DashboardSection() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch<{ success: boolean; data: StatsData }>('/api/admin/stats')
      setStats(res.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить статистику')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const cards = [
    { label: 'Всего проектов', value: stats?.totalProjects ?? 0, icon: Palette },
    { label: 'Просмотры за 30 дней', value: stats?.pageviewsLast30Days ?? 0, icon: Eye },
    { label: 'Свежие', value: stats?.recentPageviews?.length ?? 0, icon: Activity },
  ]

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a8f98]">
          Обзор / статистика портфолио
        </p>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 border-2 border-[#2A2E36] px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[#E8E4DF] transition-colors hover:border-[#E63946] hover:text-[#E63946] disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          Обновить
        </button>
      </div>

      {error && (
        <div role="alert" className="mt-4 border-2 border-[#E63946] bg-[#E63946]/10 px-4 py-3 text-sm text-[#E63946]">
          {error}
        </div>
      )}

      {/* Стат-карточки */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="border-2 border-[#2A2E36] bg-[#111318] p-6 transition-colors hover:border-[#E63946]"
          >
            <card.icon className="h-5 w-5 text-[#E63946]" aria-hidden="true" />
            <div className="mt-4 font-display text-4xl font-bold leading-none text-[#E8E4DF]">
              {loading ? '—' : card.value}
            </div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Последние просмотры */}
      <section className="mt-8" aria-labelledby="recent-views-heading">
        <div className="flex items-center gap-3">
          <h2
            id="recent-views-heading"
            className="font-display text-2xl font-semibold uppercase text-[#E8E4DF]"
          >
            Последние просмотры
          </h2>
          <span className="block h-2.5 w-2.5 bg-[#E63946]" aria-hidden="true" />
        </div>

        <div className="mt-4 border-2 border-[#2A2E36] bg-[#111318]">
          {loading ? (
            <div className="p-6 font-mono text-xs uppercase tracking-widest text-[#8a8f98]">
              Загрузка…
            </div>
          ) : stats?.recentPageviews?.length ? (
            <ul className="divide-y-2 divide-[#1c2027]">
              {stats.recentPageviews.map((view, i) => (
                <li
                  key={`${view.path}-${view.timestamp}-${i}`}
                  className="flex flex-col gap-1 p-4 transition-colors hover:bg-[#16191f] sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-mono text-sm text-[#E8E4DF]">{view.path}</span>
                  <span className="font-mono text-xs text-[#8a8f98]">
                    {formatDateTime(view.timestamp)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 font-mono text-xs uppercase tracking-widest text-[#8a8f98]">
              Нет недавних просмотров
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
