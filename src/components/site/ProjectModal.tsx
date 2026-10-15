/**
 * Полноэкранный модал проекта с галереей и лайтбоксом.
 * Поведение портировано 1:1 с оригинала: ESC (сначала лайтбокс), блокировка
 * скролла, data-modal-open, плавающий CTA, скрытие CTA у футера.
 */
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Project, Route } from '@/lib/types'
import { navigateTo } from '@/lib/use-hash-route'

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const gallery =
    project.images.length > 0 ? project.images : project.image ? [project.image] : []

  // Блокировка скролла + атрибут для PromoPopup
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.setAttribute('data-modal-open', 'true')
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.removeAttribute('data-modal-open')
    }
  }, [])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  // ESC: сначала лайтбокс, потом модал
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) closeLightbox()
        else onClose()
      }
      if (lightboxIndex !== null && e.key === 'ArrowRight')
        setLightboxIndex((i) => (i === null ? null : (i + 1) % gallery.length))
      if (lightboxIndex !== null && e.key === 'ArrowLeft')
        setLightboxIndex((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, gallery.length, onClose, closeLightbox])

  // Плавающий CTA скрывается, когда виден нижний блок
  useEffect(() => {
    const sentinel = sentinelRef.current
    const cta = ctaRef.current
    if (!sentinel || !cta) return
    const io = new IntersectionObserver(
      ([entry]) => {
        cta.style.opacity = entry.isIntersecting ? '0' : '1'
        cta.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto'
      },
      { threshold: 0.2 }
    )
    io.observe(sentinel)
    return () => io.disconnect()
  }, [])

  const goContact: Route = '/contact'

  return (
    <div
      className="fixed inset-0 z-[200] overflow-y-auto bg-paper"
      role="dialog"
      aria-modal="true"
      aria-label={`Проект: ${project.title}`}
    >
      <div className="noise-overlay" />

      {/* Фиксированная кнопка закрытия */}
      <button
        onClick={onClose}
        aria-label="Закрыть проект"
        className="fixed right-4 top-4 z-[260] grid h-12 w-12 place-items-center border-2 border-ink bg-ink text-paper transition-colors hover:bg-rex-red hover:border-rex-red sm:right-6 sm:top-6"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Шапка модала */}
      <div className="container-rex pb-8 pt-20 sm:pt-24">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 border-2 border-ink bg-ink px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-paper">
            <span className="h-1.5 w-1.5 rounded-full bg-rex-red" aria-hidden="true" />
            {project.category}
          </span>
          <span className="border-2 border-ink px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em]">
            {project.year}
          </span>
        </div>
        <h2 className="font-display text-[11vw] font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
          {project.title}
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/80 sm:text-lg">
          {project.description}
        </p>
      </div>

      {/* Галерея */}
      <div className="container-rex space-y-6 pb-24">
        {gallery.map((img, i) => (
          <button
            key={`${img}-${i}`}
            onClick={() => setLightboxIndex(i)}
            className="group relative block w-full cursor-zoom-in border-2 border-ink bg-[#141414]"
            aria-label={`Открыть изображение ${i + 1} на весь экран`}
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={img}
                alt={`${project.imageAlt || project.title} — изображение ${i + 1}`}
                fill
                sizes="(max-width: 1280px) 100vw, 1440px"
                className="object-cover"
              />
            </div>
            <span className="absolute bottom-3 right-3 font-mono text-[11px] tracking-widest text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
              {String(i + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')} —
              увеличить
            </span>
          </button>
        ))}
      </div>

      {/* Нижний блок */}
      <div ref={sentinelRef} className="border-t-2 border-ink bg-ink py-14 text-paper">
        <div className="container-rex flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mono-label mb-3 text-rex-red">Понравился проект?</p>
            <p className="font-display text-3xl font-semibold uppercase leading-tight sm:text-4xl">
              Давайте создадим что-то похожее для вас.
            </p>
          </div>
          <button
            onClick={() => {
              onClose()
              navigateTo(goContact)
            }}
            className="btn-rex shrink-0 border-paper shadow-[4px_4px_0_rgba(230,57,70,0.9)] hover:shadow-[6px_6px_0_rgba(230,57,70,1)]"
          >
            Заказать проект <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Плавающий CTA */}
      <div
        ref={ctaRef}
        className="fixed bottom-6 left-1/2 z-[250] -translate-x-1/2 transition-opacity duration-300"
      >
        <button
          onClick={() => {
            onClose()
            navigateTo(goContact)
          }}
          className="btn-rex border-paper bg-rex-red shadow-[4px_4px_0_#0A0A0A] hover:bg-paper hover:text-ink hover:border-ink"
        >
          Заказать проект <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Лайтбокс */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-ink/95 p-4 sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр изображения"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label="Закрыть просмотр"
            className="absolute right-4 top-4 grid h-12 w-12 place-items-center border-2 border-paper/30 text-paper transition-colors hover:border-rex-red hover:bg-rex-red sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length))
            }}
            aria-label="Предыдущее изображение"
            className="absolute left-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center border-2 border-paper/30 text-paper transition-colors hover:border-rex-red hover:bg-rex-red sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightboxIndex((i) => (i === null ? null : (i + 1) % gallery.length))
            }}
            aria-label="Следующее изображение"
            className="absolute right-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center border-2 border-paper/30 text-paper transition-colors hover:border-rex-red hover:bg-rex-red sm:right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="relative h-full w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={gallery[lightboxIndex]}
              alt={`${project.imageAlt || project.title} — полноэкранный просмотр`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 font-mono text-xs tracking-widest text-white/60">
            <ArrowLeft className="h-3 w-3" />
            <span>
              {String(lightboxIndex + 1).padStart(2, '0')} /{' '}
              {String(gallery.length).padStart(2, '0')}
            </span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      )}
    </div>
  )
}
