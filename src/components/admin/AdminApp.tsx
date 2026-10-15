/**
 * Админ-панель REX DESIGN (#/admin) — тёмная, красные акценты, JetBrains Mono.
 *
 * Корневой компонент: auth-гейт (verify по токену из localStorage) + раскладка
 * (фиксированный сайдбар + sticky-хедер) + внутренний переключатель секций
 * (без роутинга — панель живёт на hash-роуте #/admin внутри SPA).
 */
'use client'

import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Palette,
  Mail,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { adminFetch, clearAuth, getToken, setAuth, setUnauthorizedHandler } from './api'
import LoginScreen from './LoginScreen'
import DashboardSection from './DashboardSection'
import ProjectsSection from './ProjectsSection'
import ContactsSection from './ContactsSection'
import AnalyticsSection from './AnalyticsSection'
import LogsSection from './LogsSection'
import SettingsSection from './SettingsSection'

type SectionId = 'dashboard' | 'projects' | 'contacts' | 'analytics' | 'logs' | 'settings'

const SECTIONS: Array<{ id: SectionId; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Панель', icon: LayoutDashboard },
  { id: 'projects', label: 'Проекты', icon: Palette },
  { id: 'contacts', label: 'Контакты', icon: Mail },
  { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
  { id: 'logs', label: 'Логи', icon: ScrollText },
  { id: 'settings', label: 'Настройки', icon: Settings },
]

type AuthStatus = 'checking' | 'login' | 'panel'

/** Ленивая инициализация: без токена — сразу экран входа (панель монтируется только на клиенте, hash-роут) */
function initialStatus(): AuthStatus {
  if (typeof window !== 'undefined' && !getToken()) return 'login'
  return 'checking'
}

export default function AdminApp() {
  const [status, setStatus] = useState<AuthStatus>(initialStatus)
  const [email, setEmail] = useState('')
  const [section, setSection] = useState<SectionId>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Проверка токена при монтировании (ленивый инициализатор уже отвёл случай «нет токена»)
  useEffect(() => {
    const token = getToken()
    if (!token) return
    let cancelled = false
    fetch('/api/admin/auth/verify', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
      .then(async (res) => {
        if (cancelled) return
        if (res.ok) {
          const data = (await res.json()) as { user?: { email?: string } }
          setEmail(data.user?.email ?? '')
          setStatus('panel')
        } else {
          clearAuth()
          setStatus('login')
        }
      })
      .catch(() => {
        if (!cancelled) {
          clearAuth()
          setStatus('login')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  // 401 в любом admin-запросе → сброс токена и экран входа
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAuth()
      setStatus('login')
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  const handleLoginSuccess = (token: string, userEmail: string) => {
    setAuth(token)
    setEmail(userEmail)
    setSection('dashboard')
    setStatus('panel')
  }

  const handleLogout = async () => {
    try {
      await adminFetch('/api/admin/auth/logout', { method: 'POST' })
    } catch {
      // даже при ошибке сети — чистим локальное состояние
    }
    clearAuth()
    setEmail('')
    setSection('dashboard')
    setStatus('login')
  }

  if (status === 'checking') {
    return (
      <div className="grid min-h-screen place-items-center p-8">
        <div className="border-2 border-[#2A2E36] bg-[#111318] p-10 text-center">
          <span className="mx-auto block h-6 w-6 animate-pulse bg-[#E63946]" aria-hidden="true" />
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#8a8f98]">
            REX / admin — проверка доступа…
          </p>
        </div>
      </div>
    )
  }

  if (status === 'login') {
    return <LoginScreen onSuccess={handleLoginSuccess} />
  }

  const currentTitle = SECTIONS.find((s) => s.id === section)?.label ?? 'Панель'

  const nav = (
    <nav aria-label="Разделы админ-панели" className="flex-1 space-y-1 px-3 py-4">
      {SECTIONS.map((item) => {
        const active = section === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setSection(item.id)
              setSidebarOpen(false)
            }}
            aria-current={active ? 'page' : undefined}
            className={`flex w-full items-center gap-3 border-2 px-3 py-2.5 text-left font-mono text-xs uppercase tracking-widest transition-colors ${
              active
                ? 'border-[#E63946] bg-[#E63946]/10 text-[#E63946]'
                : 'border-transparent text-[#8a8f98] hover:border-[#2A2E36] hover:text-[#E8E4DF]'
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </button>
        )
      })}
    </nav>
  )

  const sidebarInner = (
    <>
      <div className="flex items-center gap-3 border-b-2 border-[#2A2E36] px-5 py-5">
        <span className="block h-6 w-6 bg-[#E63946]" aria-hidden="true" />
        <span className="font-display text-xl font-bold uppercase leading-none text-[#E8E4DF]">
          REX
        </span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[#8a8f98]">
          / admin
        </span>
      </div>
      {nav}
      <div className="border-t-2 border-[#2A2E36] px-5 py-4">
        <p className="truncate font-mono text-[10px] text-[#5a5f68]" title={email}>
          {email}
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-2 border-2 border-[#2A2E36] px-3 py-2.5 font-mono text-[11px] uppercase tracking-widest text-[#8a8f98] transition-colors hover:border-[#E63946] hover:text-[#E63946]"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          Выход
        </button>
      </div>
    </>
  )

  return (
    <div className="admin-root flex min-h-screen">
      {/* Сайдбар — десктоп */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r-2 border-[#2A2E36] bg-[#0D0F13] lg:flex">
        {sidebarInner}
      </aside>

      {/* Сайдбар — мобильный оверлей */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Меню админ-панели">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-60 flex-col border-r-2 border-[#2A2E36] bg-[#0D0F13]">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Закрыть меню"
              className="absolute right-3 top-4 border-2 border-[#2A2E36] p-1.5 text-[#8a8f98] transition-colors hover:border-[#E63946] hover:text-[#E63946]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            {sidebarInner}
          </aside>
        </div>
      )}

      {/* Контент */}
      <div className="flex min-h-screen w-full flex-col lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b-2 border-[#2A2E36] bg-[#0A0A0A]/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Открыть меню"
            className="border-2 border-[#2A2E36] p-2 text-[#E8E4DF] transition-colors hover:border-[#E63946] hover:text-[#E63946] lg:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
          <h1 className="flex items-center gap-3 font-display text-xl font-bold uppercase tracking-wide text-[#E8E4DF]">
            {currentTitle}
            <span className="hidden h-2.5 w-2.5 bg-[#E63946] sm:block" aria-hidden="true" />
          </h1>
          <a
            href="#/"
            className="ml-auto font-mono text-[11px] uppercase tracking-widest text-[#8a8f98] transition-colors hover:text-[#E63946]"
          >
            ← На сайт
          </a>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6 lg:p-8">
          {section === 'dashboard' && <DashboardSection />}
          {section === 'projects' && <ProjectsSection />}
          {section === 'contacts' && <ContactsSection />}
          {section === 'analytics' && <AnalyticsSection />}
          {section === 'logs' && <LogsSection />}
          {section === 'settings' && <SettingsSection />}
        </main>
      </div>
    </div>
  )
}
