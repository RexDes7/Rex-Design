/**
 * Список проектов: порядок (вверх/вниз), создание, редактирование, удаление.
 */
'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Star } from 'lucide-react'
import {
  adminFetch,
  parseJsonArray,
  type AdminProject,
} from './api'
import ProjectForm from './ProjectForm'
import ConfirmDialog from './ConfirmDialog'

export default function ProjectsSection() {
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const [view, setView] = useState<'list' | 'form'>('list')
  const [editing, setEditing] = useState<AdminProject | null>(null)

  const [deleting, setDeleting] = useState<AdminProject | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [reorderId, setReorderId] = useState<string | null>(null)

  const showNotice = useCallback((text: string) => {
    setNotice(text)
    window.setTimeout(() => setNotice(''), 4000)
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await adminFetch<{ success: boolean; data: AdminProject[] }>('/api/admin/projects')
      const list = [...(res.data ?? [])].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      )
      setProjects(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить проекты')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Пересортировка: newOrder — массив id в новом порядке
  const reorder = async (list: AdminProject[], index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= list.length) return
    const next = [...list]
    const tmp = next[index]
    next[index] = next[target]
    next[target] = tmp
    setProjects(next)
    setReorderId(list[index].id)
    try {
      await adminFetch('/api/admin/projects/reorder', {
        method: 'POST',
        body: JSON.stringify({ order: next.map((p) => p.id) }),
      })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось изменить порядок')
      await load()
    } finally {
      setReorderId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await adminFetch(`/api/admin/projects/${deleting.id}`, { method: 'DELETE' })
      showNotice(`Проект «${deleting.title}» удалён`)
      setDeleting(null)
      await load()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Не удалось удалить проект')
      setDeleting(null)
    }
  }

  if (view === 'form') {
    return (
      <ProjectForm
        project={editing}
        onSaved={(msg) => {
          setView('list')
          setEditing(null)
          showNotice(msg)
          load()
        }}
        onCancel={() => {
          setView('list')
          setEditing(null)
        }}
      />
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a8f98]">
          {loading ? 'Загрузка…' : `${projects.length} проект(ов)`}
        </p>
        <button
          type="button"
          onClick={() => {
            setEditing(null)
            setView('form')
          }}
          className="flex items-center gap-2 border-2 border-[#E63946] bg-[#E63946] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#c42b37]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Создать проект
        </button>
      </div>

      {notice && (
        <div
          role="status"
          className="mt-4 border-2 border-[#E63946] bg-[#E63946]/10 px-4 py-3 font-mono text-xs text-[#E63946]"
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

      {/* Список */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="border-2 border-[#2A2E36] bg-[#111318] p-6 font-mono text-xs uppercase tracking-widest text-[#8a8f98]">
            Загрузка…
          </div>
        ) : projects.length === 0 ? (
          <div className="border-2 border-[#2A2E36] bg-[#111318] p-8 text-center">
            <p className="font-display text-xl uppercase text-[#E8E4DF]">Пока нет проектов</p>
            <p className="mt-2 font-mono text-xs text-[#8a8f98]">
              Создайте первый проект портфолио
            </p>
          </div>
        ) : (
          projects.map((project, index) => {
            const gallery = parseJsonArray(project.images)
            const thumb = project.image || gallery[0] || ''
            return (
              <article
                key={project.id}
                className="flex flex-col gap-4 border-2 border-[#2A2E36] bg-[#111318] p-4 transition-colors hover:border-[#E63946] sm:flex-row"
              >
                {/* Миниатюра */}
                <div className="h-28 w-full shrink-0 overflow-hidden border-2 border-[#2A2E36] sm:h-24 sm:w-40">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={project.image_alt || project.imageAlt || project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center font-mono text-[10px] uppercase text-[#5a5f68]">
                      нет фото
                    </div>
                  )}
                </div>

                {/* Инфо */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-display text-lg font-semibold uppercase leading-tight text-[#E8E4DF]">
                      {project.title}
                    </h3>
                    {project.featured === 1 && (
                      <span
                        className="flex items-center gap-1 border border-[#E63946] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#E63946]"
                        title="Избранный проект"
                      >
                        <Star className="h-3 w-3" aria-hidden="true" />
                        Избранное
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[#8a8f98]">
                    {project.category} • {project.year}
                  </p>
                  <p className="mt-2 line-clamp-1 text-sm text-[#b6bac2]">{project.description}</p>
                </div>

                {/* Действия */}
                <div className="flex shrink-0 flex-wrap items-start gap-2">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => reorder(projects, index, -1)}
                      disabled={index === 0 || reorderId === project.id}
                      aria-label={`Переместить «${project.title}» вверх`}
                      className="border-2 border-[#2A2E36] p-1.5 text-[#E8E4DF] transition-colors hover:border-[#E63946] hover:text-[#E63946] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => reorder(projects, index, 1)}
                      disabled={index === projects.length - 1 || reorderId === project.id}
                      aria-label={`Переместить «${project.title}» вниз`}
                      className="border-2 border-[#2A2E36] p-1.5 text-[#E8E4DF] transition-colors hover:border-[#E63946] hover:text-[#E63946] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(project)
                      setView('form')
                    }}
                    className="flex items-center gap-2 border-2 border-[#2A2E36] px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-[#E8E4DF] transition-colors hover:border-[#E63946] hover:text-[#E63946]"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Изменить
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError('')
                      setDeleting(project)
                    }}
                    aria-label={`Удалить «${project.title}»`}
                    className="flex items-center gap-2 border-2 border-[#2A2E36] px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-[#8a8f98] transition-colors hover:border-[#E63946] hover:text-[#E63946]"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Удалить
                  </button>
                </div>
              </article>
            )
          })
        )}
      </div>

      {deleting && (
        <ConfirmDialog
          title="Удаление проекта"
          message={`Удалить проект «${deleting.title}»? Действие необратимо.`}
          confirmLabel="Удалить"
          cancelLabel="Отмена"
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
      {deleteError && (
        <div
          role="alert"
          className="mt-4 border-2 border-[#E63946] bg-[#E63946]/10 px-4 py-3 text-sm text-[#E63946]"
        >
          {deleteError}
        </div>
      )}
    </div>
  )
}
