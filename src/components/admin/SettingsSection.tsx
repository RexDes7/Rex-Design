/**
 * Настройки: управление бэкапами — создание, список, восстановление.
 */
'use client'

import { useCallback, useEffect, useState } from 'react'
import { DatabaseBackup, RotateCcw, ShieldCheck } from 'lucide-react'
import {
  adminFetch,
  formatBytes,
  formatDateLong,
  type BackupEntry,
} from './api'
import ConfirmDialog from './ConfirmDialog'

interface CreateResult {
  timestamp: string
  projects: number
  pageviews: number
  sizeBytes: number
}

export default function SettingsSection() {
  const [backups, setBackups] = useState<BackupEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [restoring, setRestoring] = useState<string | null>(null)

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [created, setCreated] = useState<CreateResult | null>(null)
  const [confirming, setConfirming] = useState<BackupEntry | null>(null)

  const show = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    window.setTimeout(() => setMessage(null), 6000)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminFetch<{ success: boolean; backups: BackupEntry[] }>(
        '/api/admin/backup/list'
      )
      setBackups(res.backups ?? [])
    } catch (err) {
      show('error', err instanceof Error ? err.message : 'Не удалось загрузить список бэкапов')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleCreate = async () => {
    setCreating(true)
    setMessage(null)
    try {
      const res = await adminFetch<{
        success: boolean
        metadata: { timestamp: string; projects: number; pageviews: number; sizeBytes: number }
      }>('/api/admin/backup/create', { method: 'POST' })
      setCreated(res.metadata)
      show('success', 'Бэкап успешно создан')
      await load()
    } catch (err) {
      show('error', err instanceof Error ? err.message : 'Ошибка создания бэкапа')
    } finally {
      setCreating(false)
    }
  }

  const handleRestore = async () => {
    if (!confirming) return
    const target = confirming
    setRestoring(target.timestamp)
    setMessage(null)
    try {
      await adminFetch('/api/admin/backup/restore', {
        method: 'POST',
        body: JSON.stringify({ timestamp: target.timestamp }),
      })
      setConfirming(null)
      show('success', 'Данные успешно восстановлены из бэкапа')
    } catch (err) {
      setConfirming(null)
      show('error', err instanceof Error ? err.message : 'Ошибка восстановления бэкапа')
    } finally {
      setRestoring(null)
    }
  }

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a8f98]">
        Управление бэкапами и настройками системы
      </p>

      {message && (
        <div
          role={message.type === 'error' ? 'alert' : 'status'}
          className={`mt-4 border-2 px-4 py-3 font-mono text-xs ${
            message.type === 'success'
              ? 'border-[#3a3f49] bg-[#16191f] text-[#E8E4DF]'
              : 'border-[#E63946] bg-[#E63946]/10 text-[#E63946]'
          }`}
        >
          {message.text}
        </div>
      )}

      <section className="mt-6 border-2 border-[#2A2E36] bg-[#111318] p-5 transition-colors hover:border-[#3a3f49] sm:p-6" aria-labelledby="backup-heading">
        <h2
          id="backup-heading"
          className="flex items-center gap-3 font-display text-2xl font-semibold uppercase text-[#E8E4DF]"
        >
          Управление бэкапами
          <span className="block h-2.5 w-2.5 bg-[#E63946]" aria-hidden="true" />
        </h2>

        <button
          type="button"
          onClick={handleCreate}
          disabled={creating}
          className="mt-5 flex items-center gap-2 border-2 border-[#E63946] bg-[#E63946] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#c42b37] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <DatabaseBackup className="h-4 w-4" aria-hidden="true" />
          {creating ? 'Создание бэкапа…' : 'Создать бэкап'}
        </button>

        <p className="mt-3 flex items-start gap-2 font-mono text-[11px] leading-relaxed text-[#8a8f98]">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3a3f49]" aria-hidden="true" />
          Автоматические бэкапы создаются ежедневно в 03:00 UTC. Хранятся последние 7 бэкапов.
        </p>

        {/* Результат ручного создания */}
        {created && (
          <div className="mt-5 border-2 border-[#E63946] bg-[#E63946]/[0.06] p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#E63946]">
              Последний созданный бэкап
            </p>
            <dl className="mt-2 grid gap-x-6 gap-y-1.5 font-mono text-xs text-[#E8E4DF] sm:grid-cols-2">
              <div className="flex justify-between gap-4">
                <dt className="text-[#8a8f98]">Дата</dt>
                <dd>{formatDateLong(created.timestamp)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#8a8f98]">Размер</dt>
                <dd>{formatBytes(created.sizeBytes)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#8a8f98]">Проектов</dt>
                <dd>{created.projects}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#8a8f98]">Просмотров</dt>
                <dd>{created.pageviews}</dd>
              </div>
            </dl>
          </div>
        )}
      </section>

      {/* Список бэкапов */}
      <section className="mt-6" aria-labelledby="backups-list-heading">
        <h3
          id="backups-list-heading"
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a8f98]"
        >
          Доступные бэкапы
        </h3>

        <div className="mt-3 border-2 border-[#2A2E36] bg-[#111318]">
          {loading ? (
            <p className="p-6 font-mono text-xs uppercase tracking-widest text-[#8a8f98]">Загрузка…</p>
          ) : backups.length === 0 ? (
            <p className="p-6 font-mono text-xs uppercase tracking-widest text-[#8a8f98]">
              Нет доступных бэкапов
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-[#2A2E36] font-mono text-[10px] uppercase tracking-widest text-[#8a8f98]">
                    <th className="px-4 py-3 font-medium">Дата</th>
                    <th className="px-4 py-3 font-medium">Размер</th>
                    <th className="px-4 py-3 font-medium">Записей</th>
                    <th className="px-4 py-3 font-medium">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.map((backup) => (
                    <tr
                      key={backup.timestamp}
                      className="border-b border-[#1c2027] transition-colors hover:bg-[#16191f]"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#E8E4DF]">
                        {formatDateLong(backup.timestamp)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#8a8f98]">
                        {formatBytes(backup.size)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#8a8f98]">
                        {Object.entries(backup.counts)
                          .map(([key, value]) => `${value} ${key}`)
                          .join(' · ')}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setConfirming(backup)}
                          disabled={restoring !== null}
                          className="flex items-center gap-1.5 border-2 border-[#2A2E36] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-[#E8E4DF] transition-colors hover:border-[#E63946] hover:text-[#E63946] disabled:opacity-50"
                        >
                          <RotateCcw className="h-3 w-3" aria-hidden="true" />
                          {restoring === backup.timestamp ? 'Восстановление…' : 'Восстановить'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {confirming && (
        <ConfirmDialog
          title="Восстановление бэкапа"
          message={`Восстановить бэкап от ${formatDateLong(confirming.timestamp)}? Текущие данные будут заменены.`}
          confirmLabel="Восстановить"
          cancelLabel="Отмена"
          onConfirm={handleRestore}
          onCancel={() => setConfirming(null)}
        />
      )}
    </div>
  )
}
