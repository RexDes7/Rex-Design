/**
 * Карточка проекта — тёмная, с моно-метаданными и стрелкой.
 * Варианты: standard | wide | compact | hero (magazine-сетка на #/cases).
 */
'use client'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/types'

export type CardVariant = 'standard' | 'wide' | 'compact' | 'hero'

export default function ProjectCard({
  project,
  variant = 'standard',
  index,
  onOpen,
}: {
  project: Project
  variant?: CardVariant
  index: number
  onOpen: (p: Project) => void
}) {
  const effectiveVariant = variant === 'standard' && project.wide ? 'wide' : variant

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
        'group relative flex cursor-pointer flex-col overflow-hidden border-2 border-ink bg-ink text-paper transition-all duration-300',
        'hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_#E63946]',
        'focus-visible:-translate-x-1 focus-visible:-translate-y-1 focus-visible:shadow-[8px_8px_0_#E63946]',
        effectiveVariant === 'wide' && 'sm:col-span-2',
        effectiveVariant === 'hero' && 'sm:col-span-2'
      )}
    >
      {/* Изображение */}
      <div
        className={cn(
          'relative w-full overflow-hidden border-b-2 border-ink bg-[#141414]',
          effectiveVariant === 'hero' ? 'aspect-[16/9]' : 'aspect-[4/3]'
        )}
      >
        <Image
          src={project.image}
          alt={project.imageAlt || project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-90"
        />
        {/* Индекс */}
        <span className="absolute left-3 top-3 font-mono text-[11px] tracking-widest text-white/60">
          {String(index + 1).padStart(2, '0')}
        </span>
        {/* Стрелка */}
        <span
          className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center border-2 border-paper/0 bg-paper text-ink transition-all duration-300 group-hover:border-rex-red group-hover:bg-rex-red group-hover:text-white"
          aria-hidden="true"
        >
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
        </span>
        {/* Красная плашка featured */}
        {project.featured && (
          <span className="absolute right-3 top-3 bg-rex-red px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
            Featured
          </span>
        )}
      </div>

      {/* Текст */}
      <div className="flex grow flex-col gap-2 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/55">
            <span className="h-1.5 w-1.5 rounded-full bg-rex-red" aria-hidden="true" />
            {project.category}
          </span>
          <span className="font-mono text-[11px] text-white/55">{project.year}</span>
        </div>
        <h3 className="font-display text-xl font-semibold uppercase leading-[1.05] tracking-tight text-paper sm:text-2xl">
          {project.title}
        </h3>
        <p
          className={cn(
            'text-sm leading-relaxed text-white/60',
            effectiveVariant === 'compact' && 'line-clamp-2'
          )}
        >
          {project.description}
        </p>
      </div>
    </article>
  )
}
