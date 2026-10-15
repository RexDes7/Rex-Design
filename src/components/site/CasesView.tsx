/**
 * Портфолио (#/cases) — фильтры по категориям + сортировка + magazine-сетка.
 * Поведение портировано с оригинала: 9 категорий, счётчики, 4 режима сортировки,
 * варианты карточек hero/wide/compact/standard, пустое состояние.
 */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowDownWideNarrow, ArrowRight, FolderX, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchProjects } from '@/lib/api'
import { portfolioCategories } from '@/lib/data'
import type { Project, SortMode } from '@/lib/types'
import ProjectCard, { type CardVariant } from './ProjectCard'
import SectionLabel from './SectionLabel'

const SORT_LABELS: Record<SortMode, string> = {
  popular: 'Популярные',
  newest: 'Сначала новые',
  oldest: 'Сначала старые',
  recent: 'По дате добавления',
}

/** Вариант карточки в magazine-сетке — как в оригинале */
function getVariant(index: number): CardVariant {
  if (index === 0) return 'hero'
  if (index % 5 === 0) return 'wide'
  if (index % 3 === 2) return 'compact'
  return 'standard'
}

export default function CasesView({ onOpenProject }: { onOpenProject: (p: Project) => void }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Все проекты')
  const [sortMode, setSortMode] = useState<SortMode>('popular')

  useEffect(() => {
    fetchProjects().then((p) => {
      setProjects(p)
      setLoading(false)
    })
  }, [])

  const counts = useMemo(() => {
    const map: Record<string, number> = { 'Все проекты': projects.length }
    for (const p of projects) {
      for (const c of p.categories.length ? p.categories : [p.category]) {
        map[c] = (map[c] || 0) + 1
      }
    }
    return map
  }, [projects])

  const visible = useMemo(() => {
    let list = [...projects]
    if (activeCategory !== 'Все проекты') {
      list = list.filter((p) =>
        (p.categories.length ? p.categories : [p.category]).includes(activeCategory)
      )
    }
    switch (sortMode) {
      case 'popular':
        list.sort((a, b) => Number(b.featured) - Number(a.featured) || a.displayOrder - b.displayOrder)
        break
      case 'newest':
        list.sort((a, b) => Number(b.year) - Number(a.year) || a.displayOrder - b.displayOrder)
        break
      case 'oldest':
        list.sort((a, b) => Number(a.year) - Number(b.year) || a.displayOrder - b.displayOrder)
        break
      case 'recent':
        list.sort((a, b) => b.id.localeCompare(a.id))
        break
    }
    return list
  }, [projects, activeCategory, sortMode])

  return (
    <main>
      {/* Шапка страницы */}
      <section className="container-rex pb-10 pt-14 sm:pb-14 sm:pt-20">
        <SectionLabel number="01" text="Портфолио" />
        <h1 className="mt-6 font-display text-[12vw] font-bold uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
          Избранные работы{' '}
          <span className="text-rex-red">по направлениям</span>
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/70">
          Каждый проект — решённая бизнес-задача. Фильтруйте по направлению
          или смотрите всё подряд.
        </p>
      </section>

      {/* Липкая панель фильтров */}
      <div className="sticky top-16 z-40 border-y-2 border-ink bg-paper/95 backdrop-blur-sm sm:top-[72px]">
        <div className="container-rex flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Категории */}
          <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 py-1" role="tablist" aria-label="Фильтр по категориям">
            {portfolioCategories.map((cat) => {
              const active = activeCategory === cat
              const count = counts[cat] ?? 0
              if (cat !== 'Все проекты' && count === 0 && !loading) return null
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'shrink-0 border-2 px-3.5 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-all duration-150',
                    active
                      ? 'border-ink bg-ink text-paper'
                      : 'border-ink/25 text-ink/70 hover:border-ink hover:text-ink'
                  )}
                >
                  {cat}
                  <span className={cn('ml-1.5', active ? 'text-rex-red' : 'text-rex-gray')}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Сортировка */}
          <div className="relative shrink-0">
            <ArrowDownWideNarrow className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/60" />
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              aria-label="Сортировка проектов"
              className="w-full cursor-pointer appearance-none border-2 border-ink bg-paper py-2 pl-9 pr-8 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors hover:bg-ink hover:text-paper lg:w-auto"
            >
              {(Object.keys(SORT_LABELS) as SortMode[]).map((k) => (
                <option key={k} value={k}>
                  {SORT_LABELS[k]}
                </option>
              ))}
            </select>
            <span
              className="pointer-events-none absolute right-3 top-1/2 h-1.5 w-1.5 border-b-2 border-r-2 border-current"
              style={{ transform: 'translateY(-70%) rotate(45deg)' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Сетка проектов (magazine) */}
      <section className="container-rex py-12 sm:py-16" aria-label="Список проектов">
        {loading ? (
          <div className="flex items-center justify-center gap-3 border-2 border-dashed border-ink/25 py-24">
            <Loader2 className="h-5 w-5 animate-spin text-rex-red" />
            <span className="font-mono text-sm text-rex-gray">Загружаю проекты...</span>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-4 border-2 border-dashed border-ink/25 px-8 py-24 text-center">
            <FolderX className="h-10 w-10 text-ink/30" />
            <p className="font-display text-2xl font-semibold uppercase">Проекты не найдены</p>
            <p className="max-w-sm text-sm text-ink/60">
              В этой категории пока пусто. Попробуйте другой фильтр — или напишите,
              и я сделаю первый проект именно в этом стиле.
            </p>
            <button onClick={() => setActiveCategory('Все проекты')} className="btn-rex-ghost mt-2">
              Сбросить фильтр
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                variant={getVariant(i)}
                onOpen={onOpenProject}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t-2 border-ink bg-ink py-16 text-paper sm:py-20">
        <div className="container-rex flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mono-label mb-3 text-rex-red">Не нашли нужное?</p>
            <h2 className="font-display text-3xl font-semibold uppercase leading-tight sm:text-5xl">
              Давайте поговорим
            </h2>
          </div>
          <a href="#/contact" className="btn-rex border-paper shadow-[4px_4px_0_rgba(230,57,70,0.9)]">
            Обсудить проект <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  )
}
