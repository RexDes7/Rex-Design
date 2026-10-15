/**
 * Public Contacts API
 * GET /api/contacts — контактная информация (без авторизации)
 * POST /api/contacts — отправка контактной формы (rate limit 5/15мин на IP)
 */
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendContactEmail } from '@/lib/email'
import { checkRateLimit } from '@/lib/rate-limiter'
import { logAction } from '@/lib/logger'
import { getClientIp } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

const FALLBACK_CONTACTS = {
  email: 'hello@arhiv24.com',
  telegram: 'https://t.me/RLC_W',
  behance: 'https://behance.net/arhiv24',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET() {
  try {
    const content = await db.content.findUnique({ where: { key: 'contacts' } })
    if (!content) {
      return NextResponse.json({ success: true, data: FALLBACK_CONTACTS })
    }

    const contacts = JSON.parse(content.value)
    return NextResponse.json({ success: true, data: contacts })
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)

    const rate = checkRateLimit(`contact:${ip}`, 5, 15 * 60 * 1000)
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Слишком много сообщений. Попробуйте позже.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec ?? 900) } }
      )
    }

    const body = await request.json()
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const message = typeof body?.message === 'string' ? body.message.trim() : ''

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Имя должно содержать от 2 до 100 символов' },
        { status: 400 }
      )
    }
    if (email.length < 5 || email.length > 200 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Введите корректный email' },
        { status: 400 }
      )
    }
    if (message.length < 5 || message.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Сообщение должно содержать от 5 до 5000 символов' },
        { status: 400 }
      )
    }

    // Сохраняем заявку в БД
    await db.formSubmission.create({
      data: { formId: 'contact-form', name, email, message },
    })

    // Пытаемся отправить письмо (не блокирует ответ при неудаче)
    try {
      await sendContactEmail({ name, email, message })
    } catch (mailError) {
      console.error('Error sending contact email:', mailError)
    }

    void logAction('admin_action', 'Новое сообщение из контактной формы', { name, email, ip })

    return NextResponse.json({
      success: true,
      message: 'Сообщение отправлено! Свяжусь с вами в ближайшее время.',
    })
  } catch (error) {
    console.error('Error sending contact form:', error)
    return NextResponse.json(
      { success: false, error: 'Не удалось отправить сообщение' },
      { status: 500 }
    )
  }
}
