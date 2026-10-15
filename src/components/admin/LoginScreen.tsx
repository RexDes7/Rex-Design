/**
 * Экран входа в админ-панель — тёмная карточка по центру, mono-лейблы.
 * Поведение 1:1 с оригиналом: localStorage('auth-token') + cookie.
 */
'use client'

import { useState, type FormEvent } from 'react'
import { setAuth } from './api'

interface LoginScreenProps {
  onSuccess: (token: string, email: string) => void
}

export default function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean
        token?: string
        user?: { email?: string }
        error?: string
      }

      if (!response.ok || !data.success || !data.token) {
        setError(data.error || 'Неверный email или пароль')
        setIsLoading(false)
        return
      }

      setAuth(data.token)
      onSuccess(data.token, data.user?.email ?? email)
    } catch {
      setError('Ошибка сети. Проверьте соединение и попробуйте снова.')
      setIsLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Логотип */}
        <div className="mb-8 flex items-center gap-3">
          <span className="block h-8 w-8 bg-[#E63946]" aria-hidden="true" />
          <span className="font-display text-3xl font-bold uppercase tracking-wide text-[#E8E4DF]">
            REX
          </span>
          <span className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-[#8a8f98]">
            / admin
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-2 border-[#2A2E36] bg-[#111318] p-6 transition-colors focus-within:border-[#E63946] sm:p-8"
          noValidate
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8a8f98]">
            Вход в панель управления
          </p>

          {error && (
            <div
              role="alert"
              className="mt-4 border-2 border-[#E63946] bg-[#E63946]/10 px-3.5 py-2.5 font-mono text-xs leading-relaxed text-[#E63946]"
            >
              {error}
            </div>
          )}

          <div className="mt-5">
            <label
              htmlFor="admin-email"
              className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] placeholder:text-[#5a5f68] focus:border-[#E63946] focus:outline-none"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="admin-password"
              className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
            >
              Пароль
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] placeholder:text-[#5a5f68] focus:border-[#E63946] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full border-2 border-[#E63946] bg-[#E63946] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#c42b37] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Вход…' : 'Войти'}
          </button>
        </form>

        <a
          href="#/"
          className="mt-6 inline-block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98] transition-colors hover:text-[#E63946]"
        >
          ← На сайт
        </a>
      </div>
    </main>
  )
}
