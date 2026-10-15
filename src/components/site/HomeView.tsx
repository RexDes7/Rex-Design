/**
 * Главная (#/) — 8 секций, паритет контента с оригиналом.
 * Визуал: пост-модерн по референсам — гранж-портрет в hero, marquee,
 * чёрная статистика, тёмные карточки работ, красный CTA-блок.
 */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, Clock, Mail, Phone, Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchProjects, fetchContacts, FALLBACK_CONTACTS } from '@/lib/api'
import type { Project, ContactsInfo } from '@/lib/types'
import { approachPrinciples, services, processSteps, testimonials, stats } from '@/lib/data'
import SectionLabel from './SectionLabel'
import ProjectCard from './ProjectCard'
import ContactForm from './ContactForm'
import { Sparkle, Crosshair, ScribbleUnderline, Halftone, MarkerArrow } from './decor'

export default function HomeView({ onOpenProject }: { onOpenProject: (p: Project) => void }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [contacts, setContacts] = useState<ContactsInfo>(FALLBACK_CONTACTS)

  useEffect(() => {
    fetchProjects().then(setProjects)
    fetchContacts().then(setContacts)
  }, [])

  // Избранные: сначала featured, затем остальные (до 4)
  const featured = [...projects]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.displayOrder - b.displayOrder)
    .slice(0, 4)

  return (
    <main>
      {/* ============================== 01 / HERO ============================== */}
      <section className="relative flex min-h-[88vh] flex-col justify-end overflow-hidden pb-14 sm:min-h-[calc(100vh-72px)] sm:justify-center sm:pb-0">
        {/* Гранж-портрет (референс 1) как фон шапки */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/assets/hero-portrait.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[66%_center]"
          />
          {/* Бумажная растяжка слева → право (десктоп) */}
          <div className="absolute inset-y-0 left-0 hidden w-[64%] bg-gradient-to-r from-paper via-paper to-transparent sm:block" />
          {/* Бумажная растяжка снизу-вверх (мобайл) */}
          <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-paper via-paper/92 to-transparent sm:hidden" />
          {/* Нижняя мягкая растяжка для стыка с marquee */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-paper to-transparent sm:h-36" />
        </div>

        {/* Декор */}
        <Crosshair className="absolute left-5 top-6 hidden text-ink/50 lg:block" size={30} />
        <Sparkle className="spin-slow absolute right-[38%] top-[12%] hidden text-rex-red md:block" size={34} />
        <Sparkle className="float-slow absolute bottom-[16%] right-[6%] text-ink/60" size={22} />

        {/* Вертикальные подписи справа (референс 2) */}
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex" aria-hidden="true">
          <span className="font-mono text-[11px] tracking-[0.3em] text-ink/45 [writing-mode:vertical-rl]">
            ИДЕИ / ФОРМЫ / СМЫСЛЫ
          </span>
          <span className="border-l-2 border-rex-red pl-2 font-display text-2xl font-semibold text-ink/30 [writing-mode:vertical-rl]">
            /26
          </span>
        </div>

        <div className="container-rex relative z-10">
          <p className="mono-label mb-5 text-ink/70">
            Графический <span className="text-rex-red">/</span> Веб <span className="text-rex-red">/</span> Печат{' '}
            <span className="text-rex-red">/</span> UI/UX <span className="text-rex-red">/</span> Анимация
          </p>

          <h1 className="font-display font-bold uppercase leading-[0.88] tracking-tight">
            <span className="block text-[17.5vw] sm:text-[13vw] lg:text-[10.5rem]">Рафаэль</span>
            <span className="relative block w-fit text-[17.5vw] text-outline sm:text-[13vw] lg:text-[10.5rem]">
              Апарян
              <Sparkle className="absolute -right-10 top-2 hidden h-auto w-8 text-rex-red sm:block sm:w-12 lg:w-14" />
            </span>
          </h1>

          <p className="mt-7 max-w-md text-base leading-relaxed text-ink/85 sm:text-lg">
            Дизайнер, который превращает идеи в визуальные решения.
            <span className="mt-1 block text-sm text-ink/60 sm:text-[15px]">
              Портфолио · 2020—2026
            </span>
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#/cases"
              className="btn-rex"
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })}
            >
              Перейти в портфолио <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#/about" className="link-arrow">
              Обо мне <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ==================== MARQUEE-ЛЕНТА ==================== */}
      <div className="marquee-paused relative overflow-hidden border-y-2 border-ink bg-rex-red py-3.5">
        <div className="marquee-track" style={{ ['--marquee-speed' as string]: '30s' }}>
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center" aria-hidden={n === 1}>
              {[
                'Брендинг', 'Веб-дизайн', 'Инфографика', '2D-анимация',
                'Полиграфия', 'Самописные сайты', 'UI/UX',
              ].map((s) => (
                <span key={s} className="flex items-center">
                  <span className="whitespace-nowrap px-6 font-display text-2xl font-semibold uppercase tracking-wide text-paper sm:text-3xl">
                    {s}
                  </span>
                  <Sparkle size={18} color="#E8E4DF" className="shrink-0" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ==================== СТАТИСТИКА (чёрная полоса) ==================== */}
      <section aria-label="Статистика" className="bg-ink text-paper">
        <div className="container-rex grid grid-cols-2 divide-x-2 divide-white/10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                'flex flex-col gap-1.5 px-4 py-8 sm:px-8 sm:py-12',
                i >= 2 && 'border-t-2 border-white/10 lg:border-t-0'
              )}
            >
              <span
                className={cn(
                  'font-display text-5xl font-bold leading-none tracking-tight sm:text-6xl',
                  i === 0 && 'text-rex-red'
                )}
              >
                {s.value}
              </span>
              <span className="mono-label mt-2 text-white/70">{s.label}</span>
              <span className="text-xs text-white/45">{s.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 02 / ОБО МНЕ (интро) ==================== */}
      <section className="container-rex py-20 sm:py-28">
        <SectionLabel number="02" text="Обо мне" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
          <h2 className="font-display text-[9vw] font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-[4.6rem]">
            Я — дизайнер, с которым{' '}
            <span className="relative inline-block whitespace-nowrap">
              говорят
              <ScribbleUnderline className="absolute -bottom-1 left-0" />
            </span>{' '}
            на одном языке.
          </h2>
          <div className="space-y-5">
            <p className="text-[15px] leading-relaxed text-ink/75">
              За 6 лет сделал 150+ проектов: от логотипов и айдентики до редизайна сайтов
              и маркетплейс-инфографики.
            </p>
            <a href="#/about" className="link-arrow">
              Узнать больше <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ==================== 03 / ИЗБРАННЫЕ РАБОТЫ ==================== */}
      <section className="container-rex py-16 sm:py-24" aria-label="Избранные работы">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel number="03" text="Избранные работы" />
            <h2 className="mt-6 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
              Работы<span className="text-rex-red">.</span>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-mono text-sm text-rex-gray">
              {String(featured.length).padStart(2, '0')} /{' '}
              {String(projects.length).padStart(2, '0')}
            </span>
            <a href="#/cases" className="link-arrow">
              Все проекты <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {featured.length === 0 ? (
          <div className="border-2 border-dashed border-ink/30 px-8 py-20 text-center">
            <p className="font-mono text-sm text-rex-gray">Проекты скоро появятся</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {featured.map((p, i) => (
              <ProjectCard
                key={p.id}
                project={p}
                index={i}
                variant={i === 0 ? 'hero' : 'standard'}
                onOpen={onOpenProject}
              />
            ))}
          </div>
        )}
      </section>

      {/* ==================== 04 / ПОДХОД (тёмная) ==================== */}
      <section className="relative overflow-hidden bg-ink py-20 text-paper sm:py-28" aria-label="Подход">
        <Sparkle className="absolute right-10 top-10 float-slow text-rex-red" size={40} />
        <div className="container-rex">
          <SectionLabel number="04" text="Подход" dark />
          <h2 className="mt-6 max-w-3xl font-display text-4xl font-bold uppercase leading-[0.98] tracking-tight sm:text-6xl">
            Как я <span className="text-rex-red">работаю</span>
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {approachPrinciples.map((a, i) => {
              const Icon = a.icon
              return (
                <article
                  key={a.number}
                  className={cn(
                    'group border-2 border-white/15 bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-rex-red hover:bg-white/[0.05] sm:p-8',
                    i === 1 && 'md:translate-y-6'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-outline-paper font-display text-6xl font-bold leading-none">
                      {a.number}
                    </span>
                    <span className="grid h-12 w-12 place-items-center border-2 border-rex-red bg-rex-red/10 text-rex-red transition-colors duration-300 group-hover:bg-rex-red group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-semibold uppercase leading-tight">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{a.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ==================== 05 / УСЛУГИ (таблица-список) ==================== */}
      <section className="container-rex py-20 sm:py-28" aria-label="Услуги">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel number="05" text="Услуги" />
            <h2 className="mt-6 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
              Услуги<span className="text-rex-red">.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink/60">
            Шесть направлений — от логотипа до сайта под ключ.
          </p>
        </div>

        <ul>
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <li key={s.title} className={cn(i === 0 && 'border-t-2', 'border-b-2 border-ink')}>
                <a
                  href="#/contact"
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 transition-colors duration-200 hover:bg-ink sm:grid-cols-[64px_72px_1fr_auto_48px] sm:gap-6 sm:py-6"
                >
                  <span className="hidden pl-2 font-mono text-xs text-rex-gray transition-colors group-hover:text-paper/50 sm:block">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="grid h-12 w-12 place-items-center border-2 border-ink transition-colors duration-200 group-hover:border-rex-red group-hover:bg-rex-red group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-xl font-semibold uppercase leading-tight tracking-tight transition-colors group-hover:text-paper sm:text-3xl">
                      {s.title}
                    </span>
                    <span className="mt-1 hidden max-w-lg text-[13px] leading-snug text-ink/60 transition-colors group-hover:text-paper/60 lg:block">
                      {s.description}
                    </span>
                  </span>
                  <span className="hidden font-mono text-[11px] uppercase tracking-widest text-rex-gray transition-colors group-hover:text-rex-red lg:block">
                    01 услуга
                  </span>
                  <ArrowUpRight className="h-6 w-6 shrink-0 transition-all duration-200 group-hover:rotate-45 group-hover:text-rex-red" />
                </a>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ==================== 06 / ПРОЦЕСС ==================== */}
      <section className="border-y-2 border-ink bg-paper-dark py-20 sm:py-28" aria-label="Процесс работы">
        <div className="container-rex grid gap-14 lg:grid-cols-[1fr_360px]">
          <div>
            <SectionLabel number="06" text="Процесс" />
            <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.98] tracking-tight sm:text-6xl">
              Пять шагов до результата
            </h2>

            <ol className="mt-12 space-y-0">
              {processSteps.map((step, i) => (
                <li key={step.number} className="relative flex gap-5 pb-10 last:pb-0 sm:gap-8">
                  {/* Рельса */}
                  {i < processSteps.length - 1 && (
                    <span
                      className="absolute left-[27px] top-14 h-[calc(100%-3.2rem)] w-0.5 bg-ink/20"
                      aria-hidden="true"
                    />
                  )}
                  <span className="grid h-14 w-14 shrink-0 place-items-center border-2 border-ink bg-paper font-display text-xl font-semibold transition-colors">
                    {step.number}
                  </span>
                  <div className="grow pt-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-2xl font-semibold uppercase tracking-tight">
                        {step.title}
                      </h3>
                      <span className="bg-rex-red px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
                        {step.duration}
                      </span>
                    </div>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/70">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Сайд-карточка */}
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="card-rex-flat hard-shadow relative overflow-hidden p-8">
              <Halftone className="pointer-events-none absolute -right-5 -top-5 opacity-[0.12]" color="#0A0A0A" size={9} />
              <p className="mono-label text-rex-gray">Процесс</p>
              <h3 className="mt-3 font-display text-3xl font-bold uppercase leading-tight">
                Прозрачный процесс работы
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                Вы всегда знаете, на каком этапе проект. Показываю промежуточные
                результаты и учитываю правки — до попадания в цель.
              </p>
              <div className="mt-6 space-y-3 border-t-2 border-ink/10 pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-rex-red" />
                  <span className="text-sm font-medium">Средний срок — 2–3 недели</span>
                </div>
                <div className="flex items-center gap-3">
                  <MarkerArrow className="h-5" />
                  <span className="text-sm font-medium">Правки включены в стоимость</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ==================== 07 / ОТЗЫВЫ ==================== */}
      <section className="container-rex py-20 sm:py-28" aria-label="Отзывы">
        <SectionLabel number="07" text="Отзывы" />
        <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.98] tracking-tight sm:text-6xl">
          Что говорят клиенты<span className="text-rex-red">.</span>
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className={cn(
                'card-rex relative flex flex-col gap-5 p-7',
                i === 0 && '-rotate-1',
                i === 1 && 'rotate-[0.75deg] md:translate-y-6',
                i === 2 && '-rotate-[0.5deg]'
              )}
            >
              <span className="font-display text-7xl font-bold leading-[0.5] text-rex-red" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote className="grow text-[15px] leading-relaxed text-ink/85">
                {t.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t-2 border-ink/10 pt-4">
                <span className="grid h-10 w-10 place-items-center bg-ink font-display text-lg font-semibold text-paper">
                  {t.author.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="font-mono text-[11px] text-rex-gray">{t.role}</p>
                </div>
                {t.project && (
                  <span className="ml-auto border border-ink/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-ink/60">
                    {t.project}
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ==================== 08 / КОНТАКТЫ (красный CTA) ==================== */}
      <section className="relative overflow-hidden border-y-2 border-ink bg-rex-red py-20 text-paper sm:py-28" aria-label="Контакты">
        <Sparkle className="absolute left-[6%] top-12 float-slow text-ink" size={38} />
        <Sparkle className="absolute bottom-14 right-[8%] float-slower text-paper/80" size={26} />
        <Crosshair className="absolute bottom-10 left-[42%] hidden text-paper/50 lg:block" size={34} />

        <div className="container-rex relative z-10 grid gap-12 lg:grid-cols-[1fr_460px] lg:items-start">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 bg-paper" aria-hidden="true" />
              <span className="mono-label text-paper/80">08 / Контакты</span>
            </div>
            <h2 className="mt-8 font-display text-[11vw] font-bold uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-[4.8rem]">
              Давайте создадим что-то запоминающееся
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-paper/90">
              Расскажите о задаче — отвечу в течение 24 часов с предварительной
              оценкой и планом работы.
            </p>

            <div className="mt-10 space-y-4">
              <a href={`mailto:${contacts.email}`} className="group flex w-fit items-center gap-4">
                <span className="grid h-11 w-11 place-items-center border-2 border-paper text-paper transition-colors group-hover:bg-ink group-hover:border-ink">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="font-mono text-sm tracking-wide text-paper underline-offset-4 group-hover:underline">
                  {contacts.email}
                </span>
              </a>
              <a
                href={`https://t.me/${(contacts.telegram || 'RLC_W').replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-fit items-center gap-4"
              >
                <span className="grid h-11 w-11 place-items-center border-2 border-paper text-paper transition-colors group-hover:bg-ink group-hover:border-ink">
                  <Send className="h-4 w-4" />
                </span>
                <span className="font-mono text-sm tracking-wide text-paper underline-offset-4 group-hover:underline">
                  {(contacts.telegram || '@RLC_W').replace('https://t.me/', '')}
                </span>
              </a>
              {contacts.phone && (
                <a href={`tel:${contacts.phone.replace(/[^+\d]/g, '')}`} className="group flex w-fit items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center border-2 border-paper text-paper transition-colors group-hover:bg-ink group-hover:border-ink">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-sm tracking-wide text-paper underline-offset-4 group-hover:underline">
                    {contacts.phone}
                  </span>
                </a>
              )}
            </div>
          </div>

          <div className="card-rex-flat hard-shadow p-6 text-ink sm:p-8">
            <p className="mono-label mb-5">Оставить заявку</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}
