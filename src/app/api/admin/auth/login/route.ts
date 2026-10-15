/**
 * Admin Login API
 * POST /api/admin/auth/login — JWT-аутентификация (rate limit 5 попыток / 15 мин / IP)
 */
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { signToken } from '@/lib/auth'
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limiter'
import { logAdminAction, logSecurityEvent } from '@/lib/logger'
import { getClientIp } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)

    // Лимит на НЕУДАЧНЫЕ попытки входа (успешный вход сбрасывает счётчик)
    const rateKey = `login-fail:${ip}`
    const rate = checkRateLimit(rateKey, 5, 15 * 60 * 1000)
    if (!rate.allowed) {
      void logSecurityEvent('Превышен лимит попыток входа', { ip })
      return NextResponse.json(
        { success: false, error: 'Слишком много попыток входа. Попробуйте через 15 минут.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec ?? 900) } }
      )
    }

    const body = await request.json()
    const rawEmail = typeof body?.email === 'string' ? body.email.trim() : ''
    const email = rawEmail.toLowerCase()
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Укажите email и пароль' },
        { status: 400 }
      )
    }

    // Сперва точное совпадение, затем нормализованный к нижнему регистру email
    const user =
      (await db.user.findUnique({ where: { email: rawEmail } })) ??
      (email !== rawEmail ? await db.user.findUnique({ where: { email } }) : null)

    if (!user) {
      void logSecurityEvent('Неудачная попытка входа (пользователь не найден)', { email, ip })
      return NextResponse.json({ success: false, error: 'Неверный email или пароль' }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      void logSecurityEvent('Неудачная попытка входа (неверный пароль)', { email, ip })
      return NextResponse.json({ success: false, error: 'Неверный email или пароль' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, email: user.email })

    resetRateLimit(rateKey)
    void logAdminAction('Вход в админ-панель', { email, ip })

    return NextResponse.json({
      success: true,
      token,
      user: {
        email: user.email,
      },
    })
  } catch (error) {
    console.error('[LOGIN ERROR]:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Login failed: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    )
  }
}
