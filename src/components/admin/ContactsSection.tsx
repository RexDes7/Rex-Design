/**
 * Редактор контактов: email/телефон/telegram/behance/dribbble + аватар.
 */
'use client'

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Save, Upload } from 'lucide-react'
import { adminFetch } from './api'

const MAX_SIZE = 4 * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface ContactsForm {
  email: string
  phone: string
  telegram: string
  behance: string
  dribbble: string
  avatar: string
}

const EMPTY: ContactsForm = {
  email: '',
  phone: '',
  telegram: '',
  behance: '',
  dribbble: '',
  avatar: '',
}

export default function ContactsSection() {
  const [form, setForm] = useState<ContactsForm>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await adminFetch<{ success: boolean; data: Partial<ContactsForm> }>(
          '/api/admin/contacts'
        )
        if (!cancelled) {
          setForm({ ...EMPTY, ...res.data })
        }
      } catch (err) {
        if (!cancelled) {
          setMessage({
            type: 'error',
            text: err instanceof Error ? err.message : 'Не удалось загрузить контакты',
          })
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const set = (key: keyof ContactsForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === 'email') setEmailError('')
  }

  // Загрузка аватара: валидация → /api/admin/upload → URL в поле avatar
  const handleAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setMessage(null)
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setMessage({ type: 'error', text: 'Недопустимый формат. Разрешены JPG, PNG и WebP' })
      return
    }
    if (file.size > MAX_SIZE) {
      setMessage({ type: 'error', text: 'Файл больше 4 МБ' })
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await adminFetch<{ success: boolean; data: { url: string } }>(
        '/api/admin/upload',
        { method: 'POST', body: formData }
      )
      set('avatar')(res.data.url)
      setMessage({ type: 'success', text: 'Аватар загружен — не забудьте сохранить контакты' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Ошибка загрузки аватара' })
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)

    const email = form.email.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Укажите корректный email')
      return
    }

    setSaving(true)
    try {
      await adminFetch('/api/admin/contacts', {
        method: 'PUT',
        body: JSON.stringify({
          email,
          phone: form.phone.trim(),
          telegram: form.telegram.trim(),
          behance: form.behance.trim(),
          dribbble: form.dribbble.trim(),
          avatar: form.avatar,
        }),
      })
      setMessage({ type: 'success', text: 'Контакты обновлены' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Не удалось сохранить' })
    } finally {
      setSaving(false)
    }
  }

  const fields: Array<{ key: keyof ContactsForm; label: string; placeholder: string; type?: string; required?: boolean }> = [
    { key: 'email', label: 'Email', placeholder: 'hello@rex.design', type: 'email', required: true },
    { key: 'phone', label: 'Телефон', placeholder: '+7 (999) 123-45-67', type: 'tel' },
    { key: 'telegram', label: 'Telegram', placeholder: '@username' },
    { key: 'behance', label: 'Behance', placeholder: 'https://behance.net/username', type: 'url' },
    { key: 'dribbble', label: 'Dribbble', placeholder: 'https://dribbble.com/username', type: 'url' },
  ]

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a8f98]">
        Контактная информация и соцсети
      </p>

      {message && (
        <div
          role={message.type === 'error' ? 'alert' : 'status'}
          className={`mt-4 border-2 px-4 py-3 font-mono text-xs ${
            message.type === 'success'
              ? 'border-[#3a3f49] bg-[#16191f] text-[#E8E4DF]'
              : 'border-[#E63946] bg-[#E63946]/10 text-[#E63946]'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mt-6 space-y-5 border-2 border-[#2A2E36] bg-[#111318] p-5 transition-colors hover:border-[#3a3f49] sm:p-6">
        {loading ? (
          <p className="font-mono text-xs uppercase tracking-widest text-[#8a8f98]">Загрузка…</p>
        ) : (
          <>
            {fields.map((field) => (
              <div key={field.key}>
                <label
                  htmlFor={`contact-${field.key}`}
                  className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]"
                >
                  {field.label} {field.required && <span className="text-[#E63946]">*</span>}
                </label>
                <input
                  id={`contact-${field.key}`}
                  type={field.type ?? 'text'}
                  value={form[field.key]}
                  onChange={(e) => set(field.key)(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full border-2 border-[#2A2E36] bg-[#0A0A0A] px-3.5 py-2.5 text-sm text-[#E8E4DF] placeholder:text-[#5a5f68] focus:border-[#E63946] focus:outline-none"
                />
                {field.key === 'email' && emailError && (
                  <p className="mt-1.5 font-mono text-xs text-[#E63946]">{emailError}</p>
                )}
              </div>
            ))}

            {/* Аватар */}
            <div className="border-t-2 border-[#1c2027] pt-5">
              <p className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-[#8a8f98]">
                Аватар
              </p>
              {form.avatar ? (
                <div className="flex items-start gap-4">
                  <img
                    src={form.avatar}
                    alt="Текущий аватар"
                    className="h-28 w-28 border-2 border-[#2A2E36] object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => set('avatar')('')}
                    className="border-2 border-[#2A2E36] px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-[#8a8f98] transition-colors hover:border-[#E63946] hover:text-[#E63946]"
                  >
                    Убрать
                  </button>
                </div>
              ) : (
                <p className="font-mono text-xs text-[#5a5f68]">Аватар не загружен</p>
              )}

              <label
                htmlFor="contact-avatar"
                className="mt-4 flex w-fit cursor-pointer items-center gap-3 border-2 border-dashed border-[#2A2E36] bg-[#0A0A0A] px-4 py-3 font-mono text-xs uppercase tracking-widest text-[#8a8f98] transition-colors hover:border-[#E63946] hover:text-[#E63946]"
              >
                <Upload className="h-4 w-4" aria-hidden="true" />
                {form.avatar ? 'Заменить аватар' : 'Загрузить аватар'}
              </label>
              <input
                id="contact-avatar"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleAvatar}
                className="sr-only"
              />
              <p className="mt-2 font-mono text-[10px] text-[#5a5f68]">
                Отображается на странице «Обо мне». JPG, PNG или WebP, до 4 МБ.
              </p>
            </div>
          </>
        )}
      </div>

      <button
        type="submit"
        disabled={saving || loading}
        className="mt-6 flex items-center gap-2 border-2 border-[#E63946] bg-[#E63946] px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#c42b37] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save className="h-4 w-4" aria-hidden="true" />
        {saving ? 'Сохранение…' : 'Сохранить контакты'}
      </button>
    </form>
  )
}
