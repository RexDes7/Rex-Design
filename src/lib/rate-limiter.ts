/**
 * Простой in-memory rate limiter (окно фиксированной длительности).
 * Живёт в globalThis, чтобы переживать HMR в dev-режиме.
 */
interface RateLimitEntry {
  count: number
  resetAt: number
}

const globalStore = globalThis as unknown as {
  __rexRateLimiter?: Map<string, RateLimitEntry>
}

const store: Map<string, RateLimitEntry> = globalStore.__rexRateLimiter ?? new Map()
globalStore.__rexRateLimiter = store

export interface RateLimitResult {
  allowed: boolean
  retryAfterSec?: number
}

/**
 * Проверить лимит для ключа (например `login:${ip}`).
 * @param key уникальный ключ (ip + действие)
 * @param limit максимум запросов за окно
 * @param windowMs длительность окна, мс
 */
export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 15 * 60 * 1000
): RateLimitResult {
  const now = Date.now()

  // Лёгкая уборка, чтобы карта не росла бесконечно
  if (store.size > 1000) {
    for (const [k, entry] of store) {
      if (entry.resetAt <= now) store.delete(k)
    }
  }

  const entry = store.get(key)
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  entry.count += 1
  if (entry.count > limit) {
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) }
  }
  return { allowed: true }
}

/**
 * Сбросить счётчик для ключа (например, после успешного входа —
 * удачные попытки не должны вести к блокировке).
 */
export function resetRateLimit(key: string): void {
  store.delete(key)
}
