/**
 * JWT-аутентификация — паритет с lib/auth-simple.ts оригинала.
 * Поддерживает новый формат токена {userId, email} и легаси {sessionId, userId, email}.
 */
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface AuthPayload {
  userId: string
  email: string
}

/** Подписать JWT (24 часа) */
export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' })
}

/**
 * Проверить токен из заголовка `Authorization: Bearer <token>`.
 * Принимает также легаси-токены с `sessionId` (userId берётся из него при отсутствии).
 * Возвращает null, если токен отсутствует или невалиден.
 */
export function verifyToken(request: Request): AuthPayload | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.slice('Bearer '.length)
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    if (typeof payload === 'string') return null

    const record = payload as Record<string, unknown>
    const userId =
      typeof record.userId === 'string' && record.userId.length > 0
        ? record.userId
        : typeof record.sessionId === 'string' && record.sessionId.length > 0
          ? record.sessionId
          : null
    const email = typeof record.email === 'string' ? record.email : null
    if (!userId || !email) return null

    return { userId, email }
  } catch {
    return null
  }
}

/** Алиас verifyToken */
export function getAuthPayload(request: Request): AuthPayload | null {
  return verifyToken(request)
}

/**
 * Гард для админ-роутов: возвращает 401-ответ при отсутствии валидного токена
 * либо null, если авторизация пройдена.
 */
export function requireAuth(request: Request): NextResponse | null {
  const payload = verifyToken(request)
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Не авторизован' }, { status: 401 })
  }
  return null
}
