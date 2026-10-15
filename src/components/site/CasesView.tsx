/**
 * Портфолио (#/cases) — горизонтальные автоленты карточек по категориям.
 * Каждый ряд — своя категория, лента медленно движется по ширине экрана
 * (чередование направлений, пауза при наведении). Клик по карточке
 * открывает кейс в виде стопки перелистываемых карточек (ProjectModal).
 * Принцип категорий сохранён: чипы-фильтры + сортировка как в оригинале.
 */
'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowDownWideNarrow, ArrowRight, FolderX, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { fetchProjects } from '@/lib/api'
import { portfolioCategories } from '@/lib/data'
import type { Project, SortMode } from '@/lib/types'
import SectionLabel from './SectionLabel'

const SORT_LABELS: Record<SortMode, string> = {
  popular: 'Популярные',
  newest: 'Сначала новые',
  oldest: 'Сначала старые',
  recent: 'По дате добавления',
}

function projectCategories(p: Project): string[] {
  return p.categories.length ? p.categories : [p.category]
}

/** Сортировка списка проектов — чистая функция для стабильной мемоизации */
function sortProjects(list: Project[], mode: SortMode): Project[] {
  const arr = [...list]
  switch (mode) {
    case 'popular':
      arr.sort((a, b) => Number(b.featured) - Number(a.featured) || a.displayOrder - b.displayOrder)
      break
    case 'newest':
      arr.sort((a, b) => Number(b.year) - Number(a.year) || a.displayOrder - b.displayOrder)
      break
    case 'oldest':
      arr.sort((a, b) => Number(a.year) - Number(b.year) || a.displayOrder - b.displayOrder)
      break
    case 'recent':
      arr.sort((a, b) => b.id.localeCompare(a.id))
      break
  }
  return arr
}

/** Карточка кейса внутри ленты */
function MarqueeCard({
  project,
  index,
  onOpen,
}: {
  project: Project
  index: number
  onOpen: (p: Project) => void
}) {
  const handleOpen = () => {
    window.dispatchEvent(new CustomEvent('rex:activity'))
    onOpen(project)
  }
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleOpen()
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKey}
      aria-label={`Открыть проект: ${project.title}`}
      className={cn(
        'group relative flex w-64 shrink-0 cursor-pointer select-none flex-col overflow-hidden border-2 border-ink bg-ink text-paper transition-all duration-300 sm:w-72 lg:w-80',
        'focus-visible:-translate-y-1 focus-visible:shadow-[6px_6px_0_#E63946] hover:-translate-y-1 hover:shadow-[6px_6px_0_#E63946]'
      )}
    >
      {/* Изображение */}
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b-2 border-ink bg-[#141414]">
        <Image
          src={project.image}
          alt={project.imageAlt || project.title}
          fill
          sizes="(max-width: 640px) 90vw, 320px"
          className="object-cover transition-all duration-500 group-hover:scale-[1.05] group-hover:opacity-90"
        />
        <span className="absolute left-2.5 top-2.5 font-mono text-[10px] tracking-widest text-white/60">
          {String(index + 1).padStart(2, '0')}
        </span>
        {project.featured && (
          <span className="absolute right-2.5 top-2.5 bg-rex-red px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
            Featured
          </span>
        )}
        <span
          className="absolute bottom-2.5 right-2.5 grid h-9 w-9 place-items-center border-2 border-paper/0 bg-paper text-ink transition-all duration-300 group-hover:border-rex-red group-hover:bg-rex-red group-hover:text-white"
          aria-hidden="true"
        >
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>

      {/* Текст */}
      <div className="flex grow flex-col gap-1.5 p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/55">
            <span className="h-1.5 w-1.5 rounded-full bg-rex-red" aria-hidden="true" />
            {project.category}
          </span>
          <span className="font-mono text-[10px] text-white/55">{project.year}</span>
        </div>
        <h3 className="line-clamp-2 font-display text-lg font-semibold uppercase leading-[1.05] tracking-tight text-paper">
          {project.title}
        </h3>
      </div>
    </article>
  )
}

/** Ряд-лента одной категории */
function CategoryRow({
  category,
  projects,
  reverse,
  onOpenProject,
}: {
  category: string
  projects: Project[]
  reverse: boolean
  onOpenProject: (p: Project) => void
}) {
  // Длительность прокрутки зависит от числа карточек — движение всегда спокойное
  const duration = Math.max(45, projects.length * 16)

  // Копия списка для бесшовного цикла: track = [контент][контент], -50% сдвига
  const copy = (copyIndex: number) => (
    <div className="flex shrink-0 gap-5 pr-5 sm:gap-6 sm:pr-6" aria-hidden={copyIndex === 1}>
      {projects.map((p, i) => (
        <MarqueeCard key={`${copyIndex}-${p.id}`} project={p} index={i} onOpen={onOpenProject} />
      ))}
    </div>
  )

  return (
    <section className="py-8 sm:py-10" aria-label={`Категория: ${category}`}>
      {/* Заголовок ряда */}
      <div className="container-rex mb-5 flex items-end justify-between gap-4 border-b-2 border-ink/15 pb-3">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display text-2xl font-bold uppercase leading-none tracking-tight sm:text-3xl lg:text-4xl">
            {category}
          </h2>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-rex-red">
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>
        <span className="hidden font-mono text-[11px] uppercase tracking-widest text-ink/45 sm:block">
          {projects.length % 2 === 1 ? '⟶' : '⟵'} автопрокрутка
        </span>
      </div>

      {/* Лента */}
      <div
        className={cn(
          'marquee-fade marquee-paused overflow-hidden py-2',
          reverse ? 'marquee-reverse' : undefined
        )}
      >
        <div className="marquee-track" style={{ '--marquee-speed': `${duration}s` } as React.CSSProperties}>
          {copy(0)}
          {copy(1)}
        </div>
      </div>
    </section>
  )
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
      for (const c of projectCategories(p)) {
        map[c] = (map[c] || 0) + 1
      }
    }
    return map
  }, [projects])

  const rows = useMemo(() => {
    const present = portfolioCategories.filter(
      (cat) => cat !== 'Все проекты' && (counts[cat] ?? 0) > 0
    )
    const filtered =
      activeCategory === 'Все проекты' ? present : present.filter((c) => c === activeCategory)
    return filtered.map((cat) => ({
      category: cat,
      projects: sortProjects(
        projects.filter((p) => projectCategories(p).includes(cat)),
        sortMode
      ),
    }))
  }, [projects, counts, activeCategory, sortMode])

  return (
    <main>
      {/* Шапка страницы */}
      <section className="container-rex pb-8 pt-14 sm:pb-10 sm:pt-20">
        <SectionLabel number="01" text="Портфолио" />
        <h1 className="mt-6 font-display text-[12vw] font-bold uppercase leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
          Избранные работы{' '}
          <span className="text-rex-red">по направлениям</span>
        </h1>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/70">
          Каждое направление — отдельная лента. Нажмите на карточку, чтобы
          листать кейс как стопку: свайп, стрелки или кнопки.
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

      {/* Ленты по категориям */}
      {loading ? (
        <div className="flex items-center justify-center gap-3 border-2 border-dashed border-ink/25 py-24">
          <Loader2 className="h-5 w-5 animate-spin text-rex-red" />
          <span className="font-mono text-sm text-rex-gray">Загружаю проекты...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center gap-4 border-b-2 border-dashed border-ink/25 px-8 py-24 text-center">
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
        <div className="divide-y-2 divide-ink/10">
          {rows.map((row, i) => (
            <CategoryRow
              key={row.category}
              category={row.category}
              projects={row.projects}
              reverse={i % 2 === 1}
              onOpenProject={onOpenProject}
            />
          ))}
        </div>
      )}

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
