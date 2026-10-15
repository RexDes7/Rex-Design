/**
 * Шапка сайта — пост-модерн: sticky, бумага, рамка 2px, mono-навигация.
 */
'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Route } from '@/lib/types'
import { navigateTo } from '@/lib/use-hash-route'

const NAV_ITEMS: { label: string; route: Route }[] = [
  { label: 'Главная', route: '/' },
  { label: 'Портфолио', route: '/cases' },
  { label: 'Обо мне', route: '/about' },
  { label: 'Контакты', route: '/contact' },
]

export default function Navigation({ route }: { route: Route }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Блокировка скролла при открытом меню
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const go = (r: Route) => {
    setMenuOpen(false)
    navigateTo(r)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b-2 border-ink bg-paper transition-shadow duration-300',
          scrolled && 'shadow-[0_4px_0_rgba(10,10,10,0.08)]'
        )}
      >
        <div className="container-rex flex h-16 items-center justify-between gap-4 sm:h-[72px]">
          {/* Логотип */}
          <button
            onClick={() => go('/')}
            className="group flex items-center gap-2"
            aria-label="REX DESIGN — на главную"
          >
            <span className="relative grid h-8 w-8 place-items-center border-2 border-ink bg-ink">
              <span className="font-display text-lg leading-none text-paper">R</span>
              <span className="absolute -right-[3px] -top-[3px] h-2 w-2 bg-rex-red" />
            </span>
            <span className="font-display text-2xl font-semibold leading-none tracking-tight">
              REX<span className="text-rex-red">.</span>
              <sup className="ml-0.5 font-mono text-[9px] font-normal tracking-normal">®</sup>
            </span>
          </button>

          {/* Навигация — центр */}
          <nav aria-label="Основная навигация" className="hidden items-center gap-7 md:flex">
            {NAV_ITEMS.map((item) => {
              const active = route === item.route
              return (
                <button
                  key={item.route}
                  onClick={() => go(item.route)}
                  className={cn(
                    'group relative py-1 font-mono text-[13px] font-medium uppercase tracking-[0.1em] transition-colors',
                    active ? 'text-ink' : 'text-rex-gray hover:text-ink'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-0 h-[3px] bg-rex-red transition-all duration-300',
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </button>
              )
            })}
          </nav>

          {/* Правая часть: слоган + круглая кнопка */}
          <div className="flex items-center gap-5">
            <p className="hidden max-w-[210px] text-right font-mono text-[11px] leading-snug text-rex-gray lg:block">
              Дизайн, который работает на результат.
            </p>
            <button
              onClick={() => go('/contact')}
              aria-label="Заказать проект — перейти к контактам"
              className="group grid h-11 w-11 shrink-0 place-items-center rounded-full border-[1.5px] border-ink transition-all duration-200 hover:border-rex-red hover:bg-rex-red hover:text-white"
            >
              <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:rotate-45" />
            </button>

            {/* Бургер */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
              className="grid h-11 w-11 place-items-center border-2 border-ink transition-colors hover:bg-ink hover:text-paper md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное полноэкранное меню */}
      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col bg-ink transition-transform duration-400 md:hidden',
          menuOpen ? 'translate-y-0' : '-translate-y-full'
        )}
        aria-hidden={!menuOpen}
      >
        <div className="grid-paper flex flex-1 flex-col justify-center gap-1 px-8 pt-20">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.route}
              onClick={() => go(item.route)}
              className={cn(
                'group flex items-baseline gap-4 border-b border-white/10 py-4 text-left',
                !menuOpen && 'pointer-events-none'
              )}
            >
              <span className="font-mono text-xs text-rex-red">0{i + 1}</span>
              <span
                className={cn(
                  'font-display text-[13vw] font-semibold uppercase leading-[0.95] text-paper transition-colors sm:text-6xl',
                  route === item.route ? 'text-rex-red' : 'hover:text-rex-red'
                )}
              >
                {item.label}
              </span>
            </button>
          ))}
          <p className="mt-10 font-mono text-[11px] uppercase tracking-widest text-white/40">
            Дизайн, который работает на результат
          </p>
        </div>
      </div>
    </>
  )
}
