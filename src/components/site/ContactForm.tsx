/**
 * Форма брифа — логика портирована 1:1 с оригинала:
 * имя, email/@telegram (валидация), бюджет (4 варианта + свой ввод),
 * описание (1000 символов со счётчиком), POST /api/contacts, событие rex:activity.
 */
'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trackFormSubmission } from '@/lib/api'
import type { ValidationErrors } from '@/lib/types'

interface ContactFormData {
  name: string
  contact: string
  budget: string
  description: string
}

export default function ContactForm({ onSubmit }: { onSubmit?: (data: ContactFormData) => void }) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    contact: '',
    budget: '1000-5000',
    description: '',
  })
  const [customBudget, setCustomBudget] = useState('')
  const [showCustomBudget, setShowCustomBudget] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validateField = (name: keyof ContactFormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Имя обязательно'
        break
      case 'contact':
        if (!value.trim()) return 'Контакт обязателен'
        if (!value.startsWith('@') && !validateEmail(value))
          return 'Введите корректный email или Telegram (@username)'
        break
      case 'description':
        if (!value.trim()) return 'Описание проекта обязательно'
        if (value.length > 1000) return 'Описание не должно превышать 1000 символов'
        break
    }
    return undefined
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === 'budget') {
      if (value === 'Индивидуальный') {
        setShowCustomBudget(true)
        setFormData((prev) => ({ ...prev, [name]: '' }))
      } else {
        setShowCustomBudget(false)
        setCustomBudget('')
        setFormData((prev) => ({ ...prev, [name]: value }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    if (touched[name]) {
      const error = validateField(name as keyof ContactFormData, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleCustomBudgetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d+$/.test(value)) {
      setCustomBudget(value)
      setFormData((prev) => ({ ...prev, budget: value }))
    }
  }

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const value = formData[name as keyof ContactFormData]
    const error = validateField(name as keyof ContactFormData, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const newErrors: ValidationErrors = {}
    Object.keys(formData).forEach((key) => {
      const error = validateField(
        key as keyof ContactFormData,
        formData[key as keyof ContactFormData]
      )
      if (error) newErrors[key as keyof ValidationErrors] = error
    })
    setErrors(newErrors)
    setTouched({ name: true, contact: true, budget: true, description: true })

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      setSubmitMessage(null)
      try {
        trackFormSubmission('contact-form', formData.name, formData.contact, formData.description)

        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.contact,
            message: `Budget: ${formData.budget}\n\n${formData.description}`,
          }),
        })
        const data = await response.json()

        if (data.success) {
          window.dispatchEvent(new CustomEvent('rex:activity'))
          setSubmitMessage({
            type: 'success',
            text: 'Сообщение отправлено! Свяжусь с вами в ближайшее время.',
          })
          setFormData({ name: '', contact: '', budget: '1000-5000', description: '' })
          setTouched({})
          setShowCustomBudget(false)
          setCustomBudget('')
          onSubmit?.(formData)
        } else {
          setSubmitMessage({
            type: 'error',
            text: data.error || 'Ошибка отправки. Попробуйте позже.',
          })
        }
      } catch {
        setSubmitMessage({
          type: 'error',
          text: 'Ошибка отправки. Проверьте подключение к интернету.',
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {submitMessage && (
        <div
          role="status"
          className={cn(
            'flex items-start gap-3 border-2 px-4 py-3 text-sm font-medium',
            submitMessage.type === 'success'
              ? 'border-ink bg-[#eaf6ec] text-[#1d5c2d]'
              : 'border-rex-red bg-[#fdeaea] text-rex-red-dark'
          )}
        >
          {submitMessage.type === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <span>{submitMessage.text}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="name" className="mono-label">
            Имя <span className="text-rex-red">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            className={cn('input-rex', errors.name && touched.name && 'input-rex-error')}
            placeholder="Как к вам обращаться"
            autoComplete="name"
          />
          {errors.name && touched.name && (
            <p className="text-xs font-medium text-rex-red-dark">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact" className="mono-label">
            Email / Telegram <span className="text-rex-red">*</span>
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            onBlur={() => handleBlur('contact')}
            className={cn('input-rex', errors.contact && touched.contact && 'input-rex-error')}
            placeholder="email@example.com или @username"
            autoComplete="email"
          />
          {errors.contact && touched.contact && (
            <p className="text-xs font-medium text-rex-red-dark">{errors.contact}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="budget" className="mono-label">
          Бюджет
        </label>
        <div className="relative">
          <select
            id="budget"
            name="budget"
            value={showCustomBudget ? 'Индивидуальный' : formData.budget}
            onChange={handleChange}
            className="input-rex cursor-pointer appearance-none pr-10"
          >
            <option value="1000-5000">1 000 — 5 000 ₽</option>
            <option value="5000-10000">5 000 — 10 000 ₽</option>
            <option value="10000-50000">10 000 — 50 000 ₽</option>
            <option value="Индивидуальный">Индивидуальный</option>
          </select>
          <span
            className="pointer-events-none absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 border-b-2 border-r-2 border-ink"
            style={{ transform: 'translateY(-70%) rotate(45deg)' }}
            aria-hidden="true"
          />
        </div>
        {showCustomBudget && (
          <input
            type="text"
            value={customBudget}
            onChange={handleCustomBudgetChange}
            className="input-rex mt-2"
            placeholder="Введите сумму в рублях"
            autoFocus
            inputMode="numeric"
          />
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="mono-label">
          О проекте <span className="text-rex-red">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={() => handleBlur('description')}
          className={cn(
            'input-rex min-h-[140px] resize-y',
            errors.description && touched.description && 'input-rex-error'
          )}
          placeholder="Расскажите о вашем проекте — что нужно сделать, какие цели, сроки..."
          rows={6}
        />
        <div className="flex min-h-[16px] justify-end">
          {errors.description && touched.description ? (
            <p className="text-xs font-medium text-rex-red-dark">{errors.description}</p>
          ) : (
            <p className="font-mono text-[11px] text-rex-gray">
              {formData.description.length}/1000
            </p>
          )}
        </div>
      </div>

      <button type="submit" className="btn-rex w-full justify-center sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-paper border-t-transparent"
              aria-hidden="true"
            />
            Отправка...
          </>
        ) : (
          <>
            Отправить заявку
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  )
}
