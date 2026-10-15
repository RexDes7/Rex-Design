/**
 * CSRF-защита: токен из заголовка `x-csrf-token` сверяется с cookie `rex-csrf`.
 */
import { randomBytes, timingSafeEqual } from 'crypto'

export const CSRF_COOKIE = 'rex-csrf'
export const CSRF_HEADER = 'x-csrf-token'

/** Сгенерировать криптостойкий CSRF-токен */
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex')
}

function readCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('cookie')
  if (!cookieHeader) return null

  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=')
    if (separator === -1) continue
    const key = part.slice(0, separator).trim()
    if (key !== name) continue
    try {
      return decodeURIComponent(part.slice(separator + 1).trim())
    } catch {
      return part.slice(separator + 1).trim()
    }
  }
  return null
}

/**
 * Проверить CSRF-токен запроса: заголовок `x-csrf-token` должен совпадать
 * с cookie `rex-csrf`.
 */
export function validateCsrfToken(request: Request): boolean {
  const headerToken = request.headers.get(CSRF_HEADER)
  const cookieToken = readCookie(request, CSRF_COOKIE)
  if (!headerToken || !cookieToken) return false
  if (headerToken.length !== cookieToken.length) return false

  try {
    return timingSafeEqual(Buffer.from(headerToken), Buffer.from(cookieToken))
  } catch {
    return false
  }
}
