/**
 * Просмотр кейса — стопка карточек (#/cases + главная).
 * Клик по кейсу открывает колоду: титульная карточка + все изображения галереи.
 * Перелистывание: свайп/перетаскивание верхней карточки, стрелки клавиатуры,
 * кнопки ◀ ▶ и сегменты прогресса. Зацикленный порядок, глубина стека — 3 карточки.
 * ESC закрывает, скролл тела блокируется (data-modal-open для PromoPopup).
 */
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Layers, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Project, Route } from '@/lib/types'
import { navigateTo } from '@/lib/use-hash-route'

type Card =
  | { kind: 'info'; project: Project }
  | { kind: 'image'; src: string; alt: string; number: number; total: number }

/** Порог свайпа и скорость для перелистывания */
const SWIPE_THRESHOLD = 70
const VELOCITY_THRESHOLD = 500
/** Скорость улетания карточки */
const EXIT_DISTANCE = 560

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const gallery = useMemo(
    () => (project.images.length > 0 ? project.images : project.image ? [project.image] : []),
    [project]
  )

  // Колода: титульная карточка + карточки галереи
  const cards = useMemo<Card[]>(() => {
    const list: Card[] = [{ kind: 'info', project }]
    gallery.forEach((src, i) =>
      list.push({
        kind: 'image',
        src,
        alt: project.imageAlt || project.title,
        number: i + 1,
        total: gallery.length,
      })
    )
    return list
  }, [project, gallery])

  const [[index, direction], setState] = useState<[number, number]>([0, 0])

  const paginate = useCallback(
    (delta: number) => {
      setState(([i]) => [(i + delta + cards.length) % cards.length, delta])
    },
    [cards.length]
  )

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

  // Клавиатура: ← → листают, ESC закрывает
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') paginate(1)
      if (e.key === 'ArrowLeft') paginate(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, paginate])

  // Драг верхней карточки: framer сам управляет x (drag), а MotionValue
  // через пружину — только для живого наклона во время перетаскивания.
  // ВАЖНО: rotate не участвует в animate/exit — иначе MotionValue из style
  // блокирует завершение exit-анимации и карточки копятся в DOM.
  const dragX = useMotionValue(0)
  const dragXSpring = useSpring(dragX, { stiffness: 220, damping: 24 })
  const liveRotate = useTransform(dragXSpring, [-260, 260], [-10, 10])

  const onDrag = useCallback(
    (_: unknown, info: { offset: { x: number } }) => dragX.set(info.offset.x),
    [dragX]
  )

  const onDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { x: offset } = info.offset
    const { x: velocity } = info.velocity
    dragX.set(0)
    if (offset < -SWIPE_THRESHOLD || velocity < -VELOCITY_THRESHOLD) {
      paginate(1)
    } else if (offset > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      paginate(-1)
    }
  }

  const goContact: Route = '/contact'
  const handleOrder = () => {
    onClose()
    navigateTo(goContact)
  }

  // Видимые карточки стека: верхняя + 2 позади
  const depth = Math.min(3, cards.length)
  const visibleCards = Array.from({ length: depth }, (_, d) => ({
    d,
    card: cards[(index + d) % cards.length],
  }))

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-paper"
      role="dialog"
      aria-modal="true"
      aria-label={`Проект: ${project.title}`}
    >
      <div className="noise-overlay" />

      {/* Верхняя панель */}
      <header className="relative z-[240] shrink-0 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
        <div className="container-rex flex items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="flex shrink-0 items-center gap-2 border-2 border-ink bg-ink px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-paper sm:px-3 sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-rex-red" aria-hidden="true" />
              {project.category}
            </span>
            <span className="hidden shrink-0 border-2 border-ink px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] sm:inline sm:px-3 sm:text-[11px]">
              {project.year}
            </span>
            <h2 className="truncate font-display text-base font-bold uppercase leading-none tracking-tight sm:text-2xl">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрыть проект"
            className="grid h-11 w-11 shrink-0 place-items-center border-2 border-ink bg-ink text-paper transition-colors hover:border-rex-red hover:bg-rex-red sm:h-12 sm:w-12"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Стек карточек */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-6 sm:py-8">
        <div className="pointer-events-none absolute left-1/2 top-4 hidden -translate-x-1/2 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40 md:flex">
          <Layers className="h-3.5 w-3.5" aria-hidden="true" />
          <span>листайте · свайп · ← →</span>
        </div>

        <div className="relative h-[min(60vh,580px)] w-[min(92vw,560px)] sm:h-[min(64vh,620px)]">
          {/* Карточки позади (d ≥ 1) */}
          {visibleCards
            .filter((v) => v.d > 0)
            .map(({ d, card }) => (
              <motion.div
                key={`back-${card.kind}-${card.kind === 'image' ? card.src : 'info'}-${d}`}
                className="absolute inset-0 cursor-default rounded-none border-2 border-ink bg-ink shadow-[8px_8px_0_rgba(230,57,70,0.35)]"
                initial={false}
                animate={{
                  scale: 1 - d * 0.05,
                  y: d * 16,
                  rotate: d === 1 ? 2.5 : -2,
                  opacity: 1,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                style={{ zIndex: 30 - d * 10 }}
                aria-hidden="true"
              >
                <CardFace card={card} dimmed />
              </motion.div>
            ))}

          {/* Верхняя карточка — перетаскиваемая */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              className="absolute inset-0 cursor-grab touch-pan-y border-2 border-ink bg-ink shadow-[10px_10px_0_#E63946] active:cursor-grabbing"
              style={{ zIndex: 30, rotate: liveRotate }}
              drag={cards.length > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDrag={onDrag}
              onDragEnd={onDragEnd}
              initial={{ x: 0, scale: 0.95, y: 16, opacity: 0 }}
              animate={{ x: 0, scale: 1, y: 0, opacity: 1 }}
              exit={{
                x: -direction * EXIT_DISTANCE,
                opacity: 0,
                transition: { duration: 0.32, ease: 'easeOut' },
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              role="group"
              aria-label={
                cards[index].kind === 'info'
                  ? 'Титульная карточка проекта'
                  : `Изображение ${(cards[index] as Extract<Card, { kind: 'image' }>).number} из ${(cards[index] as Extract<Card, { kind: 'image' }>).total}`
              }
            >
              <CardFace card={cards[index]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Нижняя панель: навигация + прогресс + CTA */}
      <footer className="relative z-[240] shrink-0 border-t-2 border-ink bg-paper/95 backdrop-blur-sm">
        <div className="container-rex flex flex-col items-center gap-3 py-3 sm:flex-row sm:justify-between">
          {/* Навигация и счётчик */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => paginate(-1)}
              disabled={cards.length === 1}
              aria-label="Предыдущая карточка"
              className="grid h-11 w-11 place-items-center border-2 border-ink bg-paper text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-30 sm:h-12 sm:w-12"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Прогресс просмотра">
              {cards.map((c, i) => (
                <button
                  key={`${c.kind}-${i}`}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Карточка ${i + 1}`}
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  className="group py-2"
                >
                  <span
                    className={cn(
                      'block h-1.5 w-5 transition-colors sm:w-6',
                      i === index ? 'bg-rex-red' : 'bg-ink/20 group-hover:bg-ink/50'
                    )}
                  />
                </button>
              ))}
            </div>

            <span className="min-w-[3.5rem] text-center font-mono text-xs font-semibold tracking-widest text-ink/70">
              {String(index + 1).padStart(2, '0')}/{String(cards.length).padStart(2, '0')}
            </span>

            <button
              onClick={() => paginate(1)}
              disabled={cards.length === 1}
              aria-label="Следующая карточка"
              className="grid h-11 w-11 place-items-center border-2 border-ink bg-paper text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-30 sm:h-12 sm:w-12"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* CTA */}
          <button onClick={handleOrder} className="btn-rex w-full sm:w-auto">
            Заказать проект <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  )
}

/** Лицо карточки стека */
function CardFace({ card, dimmed = false }: { card: Card; dimmed?: boolean }) {
  if (card.kind === 'info') {
    const p = card.project
    const galleryCount = p.images.length
    return (
      <div className="flex h-full flex-col bg-ink text-paper">
        {/* Обложка */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b-2 border-ink bg-[#141414]">
          <Image
            src={p.image}
            alt={p.imageAlt || p.title}
            fill
            sizes="(max-width: 640px) 92vw, 560px"
            className="object-cover"
            priority={!dimmed}
          />
          {p.featured && (
            <span className="absolute right-3 top-3 bg-rex-red px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
              Featured
            </span>
          )}
        </div>
        {/* Текст */}
        <div className="flex grow flex-col gap-3 overflow-hidden p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-rex-red" aria-hidden="true" />
              {p.category}
            </span>
            <span className="font-mono text-[10px] text-white/55 sm:text-[11px]">{p.year}</span>
          </div>
          <h3 className="line-clamp-3 font-display text-2xl font-bold uppercase leading-[0.98] tracking-tight sm:text-3xl">
            {p.title}
          </h3>
          <p className="line-clamp-4 text-sm leading-relaxed text-white/65 sm:text-[15px]">
            {p.description}
          </p>
          <div className="mt-auto flex items-center justify-between border-t-2 border-white/15 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50 sm:text-[11px]">
            <span>{galleryCount > 0 ? `${galleryCount} изображени${galleryCount === 1 ? 'е' : galleryCount < 5 ? 'я' : 'й'}` : 'кейс'}</span>
            <span className="flex items-center gap-1.5 text-rex-red">
              листайте <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Карточка-изображение: вся работа целиком (contain), тёмная подложка-рамка
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#141414]">
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5">
        <div className="relative h-full w-full">
          <Image
            src={card.src}
            alt={`${card.alt} — изображение ${card.number}`}
            fill
            sizes="(max-width: 640px) 92vw, 560px"
            className="object-contain"
          />
        </div>
      </div>
      {/* Номер и подпись */}
      <span className="absolute bottom-3 right-3 border-2 border-white/25 bg-ink/85 px-2 py-1 font-mono text-[10px] font-semibold tracking-widest text-white/80 sm:text-[11px]">
        {String(card.number).padStart(2, '0')} / {String(card.total).padStart(2, '0')}
      </span>
      <span className="absolute left-3 top-3 max-w-[65%] truncate font-mono text-[10px] uppercase tracking-[0.14em] text-white/50 sm:text-[11px]">
        {card.alt}
      </span>
    </div>
  )
}
