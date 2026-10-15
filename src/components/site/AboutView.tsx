/**
 * Обо мне (#/about) — 9 секций, тексты портированы с оригинала.
 */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchContacts, FALLBACK_CONTACTS } from '@/lib/api'
import type { ContactsInfo } from '@/lib/types'
import { stats, skills, tools, funFacts, experience, processSteps } from '@/lib/data'
import SectionLabel from './SectionLabel'
import { Sparkle, Crosshair, TapePiece, ScribbleUnderline } from './decor'

export default function AboutView() {
  const [contacts, setContacts] = useState<ContactsInfo>(FALLBACK_CONTACTS)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    fetchContacts().then(setContacts)
  }, [])

  const avatar = contacts.avatar || '/uploads/1774918758766-photo_2026-03-20_18-07-21.jpg'

  return (
    <main className="overflow-x-clip">
      {/* ==================== 01 / HERO ==================== */}
      <section className="container-rex pb-16 pt-14 sm:pb-24 sm:pt-20">
        <SectionLabel number="01" text="Обо мне" />
        <div className="mt-8 grid items-start gap-12 lg:grid-cols-[1fr_420px]">
          <div>
            <h1 className="font-display text-[11vw] font-bold uppercase leading-[0.92] tracking-tight sm:text-7xl">
              Дизайнер,{' '}
              <span className="relative inline-block">
                который
                <ScribbleUnderline className="absolute -bottom-1 left-0" />
              </span>{' '}
              создаёт осознанно
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-ink/75">
              Меня зовут Рафаэль. Я мультидисциплинарный дизайнер из Ульяновска.
              Шесть лет создаю бренды, веб-интерфейсы и графику, которые работают
              на бизнес: привлекают клиентов и усиливают сообщение.
            </p>

            <dl className="mt-10 grid max-w-xl gap-px overflow-hidden border-2 border-ink bg-ink sm:grid-cols-3">
              <div className="bg-paper p-4">
                <dt className="mono-label text-rex-gray">Локация</dt>
                <dd className="mt-2 flex items-center gap-1.5 text-sm font-semibold">
                  <MapPin className="h-3.5 w-3.5 text-rex-red" /> Ульяновск
                </dd>
              </div>
              <div className="bg-paper p-4">
                <dt className="mono-label text-rex-gray">Опыт</dt>
                <dd className="mt-2 text-sm font-semibold">6 лет, 150+ проектов</dd>
              </div>
              <div className="bg-paper p-4">
                <dt className="mono-label text-rex-gray">Статус</dt>
                <dd className="mt-2 flex items-center gap-2 text-sm font-semibold">
                  <span className="pulse-dot h-2 w-2 rounded-full bg-rex-red" aria-hidden="true" />
                  Открыт к проектам
                </dd>
              </div>
            </dl>
          </div>

          {/* Портрет с «скотчем» */}
          <div className="relative mx-auto w-full max-w-[420px] rotate-1">
            <TapePiece className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 -rotate-3" />
            <div className="card-rex-flat hard-shadow-red relative aspect-[4/5] overflow-hidden">
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-paper-dark" aria-hidden="true" />
              )}
              <Image
                src={avatar}
                alt="Портрет дизайнера — Апарян Рафаэль"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 420px"
                className={cn(
                  'object-cover transition-all duration-700',
                  imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                )}
                onLoad={() => setImageLoaded(true)}
              />
              {/* Плашка-подпись */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t-2 border-ink bg-ink px-4 py-3 text-paper">
                <span className="font-display text-lg font-semibold uppercase">Апарян Рафаэль</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-rex-red">
                  Ведущий дизайнер
                </span>
              </div>
            </div>
            <Sparkle className="absolute -right-6 -top-6 float-slow text-rex-red" size={34} />
            <Crosshair className="absolute -bottom-7 -left-7 text-ink/50" size={26} />
          </div>
        </div>
      </section>

      {/* ==================== 02 / ИСТОРИЯ ==================== */}
      <section className="border-y-2 border-ink bg-paper-dark py-20 sm:py-28">
        <div className="container-rex grid gap-10 lg:grid-cols-[280px_1fr]">
          <SectionLabel number="02" text="История" />
          <div>
            <h2 className="font-display text-4xl font-bold uppercase leading-[0.98] tracking-tight sm:text-6xl">
              Как я пришёл <span className="text-rex-red">в дизайн</span>
            </h2>
            <div className="mt-8 grid max-w-3xl gap-6 text-[15px] leading-relaxed text-ink/80 md:grid-cols-3">
              <p>
                В 2020 году я начал с простых заказов — логотипы, визитки,
                полиграфия для малого бизнеса. Каждый проект учил видеть
                суть задачи: за запросом «нужен логотип» всегда стоит
                цель — чтобы бренд запомнили.
              </p>
              <p>
                Через пару лет увидел, что клиенты приходят из интернета —
                нужны сайты и интерфейсы. Начал проектировать сайты,
                изучать UX, делать интерфейсы. Параллельно расширил стек:
                инфографика для маркетплейсов, 2D-анимация, самописные
                сайты под ключ.
              </p>
              <p>
                Сегодня я работаю один. Вы общаетесь напрямую с человеком,
                который делает ваш проект — от первого наброска до финальных
                файлов. Полное внимание к каждой детали, без цепочки
                менеджеров между нами.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 03 / ОПЫТ ==================== */}
      <section className="container-rex py-20 sm:py-28">
        <SectionLabel number="03" text="Опыт" />
        <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.98] tracking-tight sm:text-6xl">
          Путь в вехах<span className="text-rex-red">.</span>
        </h2>

        <ol className="mt-12 grid gap-px overflow-hidden border-2 border-ink bg-ink md:grid-cols-4">
          {experience.map((item) => (
            <li key={item.year} className="group relative bg-paper p-6 transition-colors hover:bg-ink hover:text-paper">
              <span className="font-display text-5xl font-bold leading-none text-rex-red">
                {item.year}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold uppercase leading-tight">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65 transition-colors group-hover:text-paper/65">
                {item.description}
              </p>
              <span
                className="absolute right-4 top-4 h-2 w-2 bg-rex-red opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </li>
          ))}
        </ol>
      </section>

      {/* ==================== 04 / ЦИФРЫ ==================== */}
      <section className="bg-ink py-16 text-paper sm:py-20" aria-label="Цифры">
        <div className="container-rex grid grid-cols-2 gap-px overflow-hidden border-2 border-white/20 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                'flex flex-col gap-2 bg-ink p-6 sm:p-8',
                i === 0 && 'bg-[#111]'
              )}
            >
              <span className={cn('font-display text-5xl font-bold sm:text-6xl', i === 0 ? 'text-rex-red' : 'text-paper')}>
                {s.value}
              </span>
              <span className="mono-label text-white/60">{s.label}</span>
              <span className="text-xs text-white/40">{s.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 05 / НАВЫКИ ==================== */}
      <section className="container-rex py-20 sm:py-28">
        <SectionLabel number="05" text="Навыки" />
        <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.98] tracking-tight sm:text-6xl">
          Что я умею<span className="text-rex-red">.</span>
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, i) => (
            <article
              key={skill.name}
              className={cn(
                'card-rex-flat hard-shadow-sm p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[5px_5px_0_#E63946]',
                i % 3 === 1 && 'sm:rotate-[0.4deg]',
                i % 3 === 2 && 'sm:-rotate-[0.3deg]'
              )}
            >
              <span className="font-display text-3xl font-bold text-outline">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display text-2xl font-semibold uppercase leading-tight">
                {skill.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{skill.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== 06 / ИНСТРУМЕНТЫ ==================== */}
      <section className="border-y-2 border-ink bg-paper-dark py-16 sm:py-20">
        <div className="container-rex">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel number="06" text="Инструменты" />
              <h2 className="mt-6 font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
                Мой арсенал
              </h2>
            </div>
            <p className="max-w-xs text-sm text-ink/60">
              Ежедневный стек — от концепта до продакшена.
            </p>
          </div>
          <ul className="mt-10 flex flex-wrap gap-3">
            {tools.map((t) => {
              const Icon = t.icon
              return (
                <li
                  key={t.name}
                  className="group flex items-center gap-2.5 border-2 border-ink bg-paper px-4 py-3 transition-all duration-150 hover:-translate-y-0.5 hover:bg-ink hover:text-paper"
                >
                  <Icon className="h-4 w-4 text-rex-red" />
                  <span className="font-mono text-[13px] font-medium">{t.name}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* ==================== 07 / ПРОЦЕСС (компакт) ==================== */}
      <section className="container-rex py-20 sm:py-28">
        <SectionLabel number="07" text="Процесс" />
        <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.98] tracking-tight sm:text-6xl">
          Как устроена работа
        </h2>
        <ol className="mt-12 grid gap-px overflow-hidden border-2 border-ink bg-ink sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step) => (
            <li key={step.number} className="flex flex-col gap-2 bg-paper p-5 transition-colors hover:bg-ink hover:text-paper">
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl font-bold text-outline">{step.number}</span>
                <span className="bg-rex-red px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-white">
                  {step.duration}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold uppercase">{step.title}</h3>
              <p className="text-[13px] leading-relaxed text-ink/65 transition-colors group-hover:text-paper/65">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ==================== 08 / ЛИЧНОЕ ==================== */}
      <section className="container-rex pb-20 sm:pb-28">
        <SectionLabel number="08" text="Личное" />
        <h2 className="mt-6 font-display text-4xl font-bold uppercase leading-[0.98] tracking-tight sm:text-6xl">
          За пределами <span className="text-rex-red">Фигмы</span>
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {funFacts.map((f, i) => {
            const Icon = f.icon
            return (
              <article
                key={f.title}
                className={cn(
                  'card-rex-flat p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[5px_5px_0_#0A0A0A]',
                  i % 2 === 1 && 'sm:translate-y-4'
                )}
              >
                <span className="grid h-11 w-11 place-items-center border-2 border-ink bg-rex-red text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold uppercase">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{f.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* ==================== 09 / CTA ==================== */}
      <section className="relative overflow-hidden border-t-2 border-ink bg-rex-red py-16 text-paper sm:py-20">
        <Sparkle className="absolute right-[10%] top-8 float-slow text-ink" size={32} />
        <div className="container-rex flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mono-label mb-3 text-paper/80">09 / Контакт</p>
            <h2 className="font-display text-4xl font-bold uppercase leading-[0.95] sm:text-6xl">
              Давайте <span className="text-ink">поговорим</span>
            </h2>
          </div>
          <a href="#/contact" className="btn-rex border-paper shadow-[4px_4px_0_#0A0A0A] hover:bg-paper hover:text-ink hover:border-ink">
            Написать мне <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  )
}
