/**
 * Контакты (#/contact) — hero, форма брифа + сайдбар:
 * прямые контакты (динамические), время ответа, цитата Джобса.
 */
'use client'

import { useEffect, useState } from 'react'
import { Clock, Mail, Phone, Quote, Send, ArrowUpRight } from 'lucide-react'
import { fetchContacts, FALLBACK_CONTACTS } from '@/lib/api'
import type { ContactsInfo } from '@/lib/types'
import SectionLabel from './SectionLabel'
import ContactForm from './ContactForm'
import { Sparkle, Halftone } from './decor'

export default function ContactView() {
  const [contacts, setContacts] = useState<ContactsInfo>(FALLBACK_CONTACTS)

  useEffect(() => {
    fetchContacts().then(setContacts)
  }, [])

  const telegramHandle = (contacts.telegram || '@RLC_W').replace('https://t.me/', '')
  const telegramUrl = `https://t.me/${telegramHandle.replace('@', '')}`

  return (
    <main>
      {/* Hero */}
      <section className="container-rex pb-12 pt-14 sm:pb-16 sm:pt-20">
        <SectionLabel number="01" text="Контакты" />
        <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
          <h1 className="max-w-3xl font-display text-[11vw] font-bold uppercase leading-[0.92] tracking-tight sm:text-7xl">
            Давайте создадим что-то{' '}
            <span className="text-rex-red">стоящее</span>
          </h1>
          <div className="flex items-center gap-3 border-2 border-ink bg-ink px-4 py-2.5 text-paper">
            <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-rex-red" aria-hidden="true" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-widest">
              Свободен для новых проектов
            </span>
          </div>
        </div>
      </section>

      {/* Форма + сайдбар */}
      <section className="container-rex grid gap-8 pb-20 sm:pb-28 lg:grid-cols-[1fr_400px]">
        {/* Форма */}
        <div className="card-rex-flat hard-shadow relative overflow-hidden p-6 sm:p-10">
          <Halftone className="pointer-events-none absolute -right-6 -top-6 opacity-[0.08]" color="#0A0A0A" size={10} />
          <p className="mono-label mb-2 text-rex-gray">Бриф</p>
          <h2 className="mb-8 font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
            Расскажите о проекте
          </h2>
          <ContactForm />
        </div>

        {/* Сайдбар */}
        <aside className="space-y-6">
          {/* Прямые контакты */}
          <div className="border-2 border-ink bg-paper-dark p-6">
            <p className="mono-label mb-4 text-rex-gray">Прямые контакты</p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${contacts.email}`}
                  className="group flex items-center gap-3 border-2 border-ink bg-paper p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#E63946]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center bg-ink text-paper transition-colors group-hover:bg-rex-red">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-rex-gray">
                      Email
                    </span>
                    <span className="block truncate text-sm font-semibold">{contacts.email}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 border-2 border-ink bg-paper p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#E63946]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center bg-ink text-paper transition-colors group-hover:bg-rex-red">
                    <Send className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-rex-gray">
                      Telegram
                    </span>
                    <span className="block text-sm font-semibold">{telegramHandle}</span>
                  </span>
                </a>
              </li>
              {contacts.phone && (
                <li>
                  <a
                    href={`tel:${contacts.phone.replace(/[^+\d]/g, '')}`}
                    className="group flex items-center gap-3 border-2 border-ink bg-paper p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#E63946]"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center bg-ink text-paper transition-colors group-hover:bg-rex-red">
                      <Phone className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-mono text-[10px] uppercase tracking-widest text-rex-gray">
                        Телефон
                      </span>
                      <span className="block text-sm font-semibold">{contacts.phone}</span>
                    </span>
                  </a>
                </li>
              )}
              <li>
                <a
                  href={contacts.behance || 'https://www.behance.net/aa0af6c1'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 border-2 border-ink bg-paper p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#E63946]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center bg-ink text-paper transition-colors group-hover:bg-rex-red">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-rex-gray">
                      Behance
                    </span>
                    <span className="block text-sm font-semibold">Портфолио на Behance</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Время ответа */}
          <div className="flex items-start gap-4 border-2 border-ink bg-ink p-6 text-paper">
            <span className="grid h-11 w-11 shrink-0 place-items-center border-2 border-rex-red text-rex-red">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-xl font-semibold uppercase leading-tight">
                Быстрый ответ
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-paper/65">
                Обычно отвечаю в течение 24 часов. Если задача срочная —
                напишите в Telegram, там быстрее.
              </p>
            </div>
          </div>

          {/* Цитата Джобса */}
          <blockquote className="relative border-2 border-ink bg-paper p-6 pt-9">
            <span className="absolute -top-5 left-5 grid h-10 w-10 place-items-center border-2 border-ink bg-rex-red text-white">
              <Quote className="h-4 w-4" />
            </span>
            <p className="font-hand text-2xl leading-snug text-ink/90">
              Дизайн — это не то, как это выглядит. Дизайн — это то, как это работает.
            </p>
            <footer className="mt-4 font-mono text-[11px] uppercase tracking-widest text-rex-gray">
              — Стив Джобс
            </footer>
            <Sparkle className="absolute -bottom-3 -right-3 text-rex-red" size={26} />
          </blockquote>
        </aside>
      </section>
    </main>
  )
}
