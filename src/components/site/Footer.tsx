/**
 * Футер — чёрный, огромный outline-логотип, навигация, соцсети (динамические).
 */
'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, Send } from 'lucide-react'
import { fetchContacts, FALLBACK_CONTACTS } from '@/lib/api'
import type { ContactsInfo, Route } from '@/lib/types'
import { navigateTo } from '@/lib/use-hash-route'
import { Sparkle } from './decor'

export default function Footer() {
  const [contacts, setContacts] = useState<ContactsInfo>(FALLBACK_CONTACTS)

  useEffect(() => {
    fetchContacts().then(setContacts)
  }, [])

  const go = (r: Route) => {
    navigateTo(r)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  const telegramUrl = contacts.telegram?.startsWith('http')
    ? contacts.telegram
    : `https://t.me/${(contacts.telegram || 'RLC_W').replace('@', '')}`

  return (
    <footer className="mt-auto bg-ink text-paper">
      {/* Верхняя строка: все проекты + копирайт */}
      <div className="border-b border-white/15">
        <div className="container-rex flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={() => go('/cases')} className="group flex items-center gap-3">
            <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.1em] text-paper">
              Смотреть все проекты
            </span>
            <ArrowRight className="h-4 w-4 text-rex-red transition-transform duration-200 group-hover:translate-x-1.5" />
          </button>
          <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">
            REX / 2020—2026
          </p>
        </div>
      </div>

      {/* Гигантский лого */}
      <div className="container-rex relative select-none overflow-hidden py-10 sm:py-14">
        <h2 className="text-outline-paper whitespace-nowrap font-display text-[19vw] font-bold leading-[0.85] tracking-tight sm:text-[15vw] lg:text-[11rem]">
          REX DESIGN
        </h2>
        <Sparkle className="absolute right-6 top-8 float-slow text-rex-red" size={42} />
        <Sparkle className="absolute bottom-6 left-1/3 float-slower text-rex-red/70" size={22} />
      </div>

      {/* Колонки */}
      <div className="border-t border-white/15">
        <div className="container-rex grid gap-10 py-12 sm:grid-cols-3">
          <nav aria-label="Навигация в футере">
            <p className="mono-label mb-5 text-rex-red">Карта</p>
            <ul className="space-y-3">
              {(
                [
                  ['Главная', '/'],
                  ['Портфолио', '/cases'],
                  ['Обо мне', '/about'],
                  ['Контакты', '/contact'],
                ] as [string, Route][]
              ).map(([label, r]) => (
                <li key={r}>
                  <button
                    onClick={() => go(r)}
                    className="font-display text-xl uppercase text-paper/80 transition-colors hover:text-rex-red"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mono-label mb-5 text-rex-red">Социальные сети</p>
            <ul className="space-y-3">
              <li>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 border-b-2 border-white/20 pb-0.5 font-mono text-[13px] text-paper/80 transition-colors hover:border-rex-red hover:text-rex-red"
                >
                  <Send className="h-3.5 w-3.5" /> Telegram
                </a>
              </li>
              <li>
                <a
                  href={contacts.behance || 'https://www.behance.net/aa0af6c1'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 border-b-2 border-white/20 pb-0.5 font-mono text-[13px] text-paper/80 transition-colors hover:border-rex-red hover:text-rex-red"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" /> Behance
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contacts.email}`}
                  className="group inline-flex items-center gap-2 border-b-2 border-white/20 pb-0.5 font-mono text-[13px] text-paper/80 transition-colors hover:border-rex-red hover:text-rex-red"
                >
                  <ArrowUpRight className="h-3.5 w-3.5" /> {contacts.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="mono-label mb-5 text-rex-red">Статус</p>
            <div className="inline-flex items-center gap-3 border-2 border-white/20 px-4 py-3">
              <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-rex-red" />
              <span className="font-mono text-[13px] uppercase tracking-wide text-paper">
                Открыт к проектам
              </span>
            </div>
            <p className="mt-4 max-w-[260px] text-sm leading-relaxed text-white/50">
              Брендинг, веб-дизайн, инфографика и анимация. Из Ульяновска — по всему миру.
            </p>
          </div>
        </div>
      </div>

      {/* Нижняя строка */}
      <div className="border-t border-white/15">
        <div className="container-rex flex flex-col gap-3 py-5 text-[11px] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono uppercase tracking-wider text-white/40">
            © 2020–2026 REX DESIGN. Все права защищены.
          </p>
          <p className="font-mono uppercase tracking-wider text-white/40">
            Дизайн и разработка — Апарян Рафаэль
          </p>
          <button
            onClick={() => go('/admin')}
            className="w-fit font-mono text-[10px] uppercase tracking-[0.2em] text-white/25 transition-colors hover:text-rex-red"
            aria-label="Вход для администратора"
          >
            [ admin ]
          </button>
        </div>
      </div>
    </footer>
  )
}
