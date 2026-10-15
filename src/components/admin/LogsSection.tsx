/**
 * Системные логи: фильтры (тип/важность/даты/поиск), чипы-счётчики важности,
 * таблица с раскрывающимися деталями, пагинация 50/стр, архивация.
 */
'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'
import { Filter, Archive, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import {
  adminFetch,
  formatDateTimeSec,
  type LogEntry,
} from './api'

interface LogsResponse {
  success: boolean
  data: {
    logs: LogEntry[]
    total: number
    page: number
    totalPages: number
    counts: { info: number; warning: number; error: number; critical: number }
  }
}

const TYPE_LABELS: Record<string, string> = {
  admin_action: 'Действие',
  system_error: 'Ошибка',
  security_event: 'Безопасность',
}

const SEVERITY_STYLES: Record<string, string> = {
  info: 'border-[#2A2E36] text-[#8a8f98]',
  warning: 'border-[#E6A23C] text-[#E6A23C]',
  error: 'border-[#E63946] text-[#E63946]',
  critical: 'border-[#ff1f30] bg-[#ff1f30] text-white',
}

const CHIP_STYLES: Record<string, string> = {
  info: 'border-[#2A2E36] text-[#8a8f98] hover:border-[#3a3f49]',
  warning: 'border-[#E6A23C] text-[#E6A23C] hover:bg-[#E6A23C]/10',
  error: 'border-[#E63946] text-[#E63946] hover:bg-[#E63946]/10',
  critical: 'border-[#ff1f30] text-[#ff1f30] hover:bg-[#ff1f30]/10',
}

export default function LogsSection() {
  const [data, setData] = useState<LogsResponse['data'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // Черновик фильтров (применяются кнопкой «Применить»)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [type, setType] = useState('')
  const [severity, setSeverity] = useState('')
  const [search, setSearch] = useState('')

  const [applied, setApplied] = useState({ startDate: '', endDate: '', type: '', severity: '', search: '' })
  const [page, setPage] = useState(1)

  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [archiving, setArchiving] = useState(false)

  const load = useCallback(
    async (filters: typeof applied, pageNum: number) => {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (filters.startDate) params.set('startDate', `${filters.startDate}T00:00:00.000`)
      // конец суток — чтобы «По: сегодня» включал сегодняшние логи
      if (filters.endDate) params.set('endDate', `${filters.endDate}T23:59:59.999`)
      if (filters.type) params.set('type', filters.type)
      if (filters.severity) params.set('severity', filters.severity)
      if (filters.search.trim()) params.set('search', filters.search.trim())
      params.set('page', String(pageNum))
      try {
        const res = await adminFetch<LogsResponse>(`/api/admin/logs?${params}`)
        setData(res.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить логи')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    load(applied, page)
  }, [applied, page, load])

  const applyFilters = () => {
    setPage(1)
    setApplied({ startDate, endDate, type, severity, search })
  }

  const setSeverityChip = (value: string) => {
    const next = severity === value ? '' : value
    setSeverity(next)
    setPage(1)
    setApplied({ startDate, endDate, type, severity: next, search })
  }

  const handleArchive = async () => {
    if (!window.confirm('Архивировать (удалить) логи старше 90 дней?')) return
    setArchiving(true)
    setNotice('')
    try {
      const res = await adminFetch<{ success: boolean; deleted: number }>(
        '/api/admin/logs/archive',
        { method: 'POST', body: JSON.stringify({ daysOld: 90 }) }
      )
      setNotice(`Архивировано записей: ${res.deleted}`)
      load(applied, page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось архивировать логи')
    } finally {
      setArchiving(false)
    }
  }

  const counts = data?.counts

  return (
    <div>
      {/* Фильтры */}
      <div className="border-2 border-[#2A2E36] bg-[#111318] p-4 transition-colors hover:border-[#3a3f49]">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="logs-start"
              className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
            >
              С:
            </label>
            <input
              id="logs-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] focus:border-[#E63946] focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="logs-end"
              className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
            >
              По:
            </label>
            <input
              id="logs-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] focus:border-[#E63946] focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="logs-type"
              className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
            >
              Тип
            </label>
            <select
              id="logs-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] focus:border-[#E63946] focus:outline-none"
            >
              <option value="">Все</option>
              <option value="admin_action">Действия админа</option>
              <option value="system_error">Системные ошибки</option>
              <option value="security_event">События безопасности</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="logs-severity"
              className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
            >
              Важность
            </label>
            <select
              id="logs-severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] focus:border-[#E63946] focus:outline-none"
            >
              <option value="">Все</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по ключевым словам…"
            aria-label="Поиск по логам"
            className="min-w-0 flex-1 border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] placeholder:text-[#5a5f68] focus:border-[#E63946] focus:outline-none"
          />
          <button
            type="button"
            onClick={applyFilters}
            disabled={loading}
            className="flex shrink-0 items-center justify-center gap-2 border-2 border-[#E63946] bg-[#E63946] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#c42b37] disabled:opacity-60"
          >
            <Filter className="h-3.5 w-3.5" aria-hidden="true" />
            Применить
          </button>
        </div>
      </div>

      {/* Чипы-счётчики важности */}
      {counts && (
        <div className="mt-4 flex flex-wrap gap-2">
          {(['info', 'warning', 'error', 'critical'] as const).map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverityChip(sev)}
              aria-pressed={severity === sev}
              className={`border-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                CHIP_STYLES[sev]
              } ${severity === sev ? 'bg-[#1c2027]' : ''}`}
            >
              {sev} · {counts[sev]}
            </button>
          ))}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="mt-4 border-2 border-[#3a3f49] bg-[#16191f] px-4 py-3 font-mono text-xs text-[#E8E4DF]"
        >
          {notice}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="mt-4 border-2 border-[#E63946] bg-[#E63946]/10 px-4 py-3 text-sm text-[#E63946]"
        >
          {error}
        </div>
      )}

      {/* Таблица */}
      <div className="mt-4 border-2 border-[#2A2E36] bg-[#111318]">
        {loading ? (
          <p className="p-6 font-mono text-xs uppercase tracking-widest text-[#8a8f98]">
            Загрузка логов…
          </p>
        ) : !data || data.logs.length === 0 ? (
          <p className="p-6 font-mono text-xs uppercase tracking-widest text-[#8a8f98]">
            Логи не найдены
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-[#2A2E36] font-mono text-[10px] uppercase tracking-widest text-[#8a8f98]">
                  <th className="px-4 py-3 font-medium">Время</th>
                  <th className="px-4 py-3 font-medium">Тип</th>
                  <th className="px-4 py-3 font-medium">Важность</th>
                  <th className="px-4 py-3 font-medium">Сообщение</th>
                  <th className="w-8 px-2 py-3" aria-label="Раскрыть детали" />
                </tr>
              </thead>
              <tbody>
                {data.logs.map((log) => {
                  const expanded = expandedId === log.id
                  return (
                    <Fragment key={log.id}>
                      <tr
                        onClick={() => setExpandedId(expanded ? null : log.id)}
                        className={`cursor-pointer border-b border-[#1c2027] transition-colors hover:bg-[#16191f] ${
                          expanded ? 'bg-[#16191f]' : ''
                        }`}
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#8a8f98]">
                          {formatDateTimeSec(log.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="border-2 border-[#2A2E36] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#b6bac2]">
                            {TYPE_LABELS[log.type] ?? log.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`border-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
                              SEVERITY_STYLES[log.severity] ?? SEVERITY_STYLES.info
                            }`}
                          >
                            {log.severity}
                          </span>
                        </td>
                        <td className="max-w-md truncate px-4 py-3 text-[#E8E4DF]" title={log.message}>
                          {log.message}
                        </td>
                        <td className="px-2 py-3">
                          <ChevronDown
                            className={`h-4 w-4 text-[#5a5f68] transition-transform ${
                              expanded ? 'rotate-180' : ''
                            }`}
                            aria-hidden="true"
                          />
                        </td>
                      </tr>
                      {expanded && (
                        <tr className="border-b border-[#1c2027] bg-[#0D0F13]">
                          <td colSpan={5} className="px-4 py-3">
                            <p className="font-mono text-[10px] uppercase tracking-widest text-[#8a8f98]">
                              Детали
                            </p>
                            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all font-mono text-xs leading-relaxed text-[#b6bac2]">
                              {prettyDetails(log.details)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Пагинация + архивация */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={loading || !data || data.page <= 1}
            className="flex items-center gap-1.5 border-2 border-[#2A2E36] px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-[#E8E4DF] transition-colors hover:border-[#E63946] hover:text-[#E63946] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Назад
          </button>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]">
            Страница {data?.page ?? '—'} из {data?.totalPages ?? '—'}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => (data && p < data.totalPages ? p + 1 : p))}
            disabled={loading || !data || data.page >= data.totalPages}
            className="flex items-center gap-1.5 border-2 border-[#2A2E36] px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-[#E8E4DF] transition-colors hover:border-[#E63946] hover:text-[#E63946] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Вперёд
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleArchive}
          disabled={archiving}
          className="flex items-center gap-2 border-2 border-[#2A2E36] px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-[#8a8f98] transition-colors hover:border-[#E63946] hover:text-[#E63946] disabled:opacity-60"
        >
          <Archive className="h-3.5 w-3.5" aria-hidden="true" />
          {archiving ? 'Архивация…' : 'Архивировать логи старше 90 дней'}
        </button>
      </div>
    </div>
  )
}

/** Детали лога: JSON → pretty, иначе как есть; пусто → «—» */
function prettyDetails(details: string | null): string {
  if (!details) return '—'
  try {
    const parsed = JSON.parse(details)
    return typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2)
  } catch {
    return details
  }
}
