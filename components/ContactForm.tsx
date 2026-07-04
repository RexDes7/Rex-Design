'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import styles from '@/styles/ContactForm.module.css'
import { ContactFormData } from '@/types/form'
import { trackFormSubmission } from '@/components/AnalyticsTracker'

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void
}

interface ValidationErrors {
  name?: string
  contact?: string
  budget?: string
  description?: string
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
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
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateField = (name: keyof ContactFormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Имя обязательно'
        break
      case 'contact':
        if (!value.trim()) return 'Контакт обязателен'
        if (!value.startsWith('@') && !validateEmail(value)) {
          return 'Введите корректный email или Telegram (@username)'
        }
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
    setTouched({
      name: true,
      contact: true,
      budget: true,
      description: true,
    })

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true)
      setSubmitMessage(null)

      try {
        trackFormSubmission(
          'contact-form',
          formData.name,
          formData.contact,
          formData.description
        )

        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.contact,
            message: `Budget: ${formData.budget}\n\n${formData.description}`
          })
        })

        const data = await response.json()

        if (data.success) {
          setSubmitMessage({ type: 'success', text: 'Сообщение отправлено! Свяжусь с вами в ближайшее время.' })

          setFormData({
            name: '',
            contact: '',
            budget: '1000-5000',
            description: '',
          })
          setTouched({})
          setShowCustomBudget(false)
          setCustomBudget('')

          if (onSubmit) {
            onSubmit(formData)
          }
        } else {
          setSubmitMessage({ type: 'error', text: data.error || 'Ошибка отправки. Попробуйте позже.' })
        }
      } catch (error) {
        console.error('Form submission error:', error)
        setSubmitMessage({ type: 'error', text: 'Ошибка отправки. Проверьте подключение к интернету.' })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {submitMessage && (
        <div
          className={`${styles.message} ${
            submitMessage.type === 'success' ? styles.messageSuccess : styles.messageError
          }`}
          role="status"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {submitMessage.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{submitMessage.text}</span>
        </div>
      )}

      <div className={`${styles.field} ${styles.fieldRow}`}>
        <div className={styles.fieldInner}>
          <label htmlFor="name" className={styles.label}>
            Имя
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''}`}
            placeholder="Как к вам обращаться"
            autoComplete="name"
          />
          {errors.name && touched.name && (
            <span className={styles.error}>{errors.name}</span>
          )}
        </div>

        <div className={styles.fieldInner}>
          <label htmlFor="contact" className={styles.label}>
            Email / Telegram
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            onBlur={() => handleBlur('contact')}
            className={`${styles.input} ${errors.contact && touched.contact ? styles.inputError : ''}`}
            placeholder="email@example.com или @username"
            autoComplete="email"
          />
          {errors.contact && touched.contact && (
            <span className={styles.error}>{errors.contact}</span>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="budget" className={styles.label}>
          Бюджет
        </label>
        <div className={styles.selectWrap}>
          <select
            id="budget"
            name="budget"
            value={showCustomBudget ? 'Индивидуальный' : formData.budget}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="1000-5000">1 000 — 5 000 ₽</option>
            <option value="5000-10000">5 000 — 10 000 ₽</option>
            <option value="10000-50000">10 000 — 50 000 ₽</option>
            <option value="Индивидуальный">Индивидуальный</option>
          </select>
          <span className="material-symbols-outlined" aria-hidden="true">
            expand_more
          </span>
        </div>
        {showCustomBudget && (
          <input
            type="text"
            value={customBudget}
            onChange={handleCustomBudgetChange}
            className={`${styles.input} ${styles.customBudgetInput}`}
            placeholder="Введите сумму в рублях"
            autoFocus
          />
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          О проекте
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={() => handleBlur('description')}
          className={`${styles.textarea} ${errors.description && touched.description ? styles.inputError : ''}`}
          placeholder="Расскажите о вашем проекте — что нужно сделать, какие цели, сроки..."
          rows={6}
        />
        <div className={styles.textareaMeta}>
          {errors.description && touched.description ? (
            <span className={styles.error}>{errors.description}</span>
          ) : (
            <span className={styles.charCount}>
              {formData.description.length}/1000
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            Отправка...
          </>
        ) : (
          <>
            Отправить заявку
            <span className="material-symbols-outlined" aria-hidden="true">
              arrow_forward
            </span>
          </>
        )}
      </button>
    </form>
  )
}
