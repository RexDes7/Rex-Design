/**
 * Общие хелперы админ-панели: авторизованный fetch, токен, форматтеры, типы.
 * Все запросы к /api/admin/* идут через adminFetch (Bearer + обработка 401).
 */
'use client'

export const TOKEN_KEY = 'auth-token'

/** Ошибка API с HTTP-статусом (message — человекочитаемый текст из ответа) */
export class AdminApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'AdminApiError'
    this.status = status
  }
}

// Глобальный обработчик 401 (регистрирует AdminApp — сброс токена + экран входа)
let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(fn: (() => void) | null) {
  unauthorizedHandler = fn
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

/** Сохранить токен: localStorage + cookie (паритет с оригиналом) */
export function setAuth(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=86400; samesite=lax`
  } catch {
    // localStorage недоступен (приватный режим) — работаем только по cookie
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; samesite=lax`
  } catch {
    // ignore
  }
}

/**
 * Авторизованный fetch для админ-API.
 * - добавляет Authorization: Bearer
 * - для строкового body ставит Content-Type: application/json
 * - при !res.ok бросает AdminApiError с текстом из {error}|{message}
 * - при 401 дёргает unauthorizedHandler (выход на экран входа)
 */
export async function adminFetch<T = Record<string, unknown>>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers ?? undefined)
  const token = getToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
  })

  const data: unknown = await res.json().catch(() => ({}))

  if (!res.ok) {
    if (res.status === 401 && unauthorizedHandler) unauthorizedHandler()
    const d = data as { error?: unknown; message?: unknown }
    const message =
      (typeof d?.error === 'string' && d.error) ||
      (typeof d?.message === 'string' && d.message) ||
      `Ошибка запроса (${res.status})`
    throw new AdminApiError(message, res.status)
  }

  return data as T
}

// ============================================================================
// Типы (сырые ответы API)
// ============================================================================

/** Сырой проект из API (categories/images — JSON-строки, wide/featured — 0|1) */
export interface AdminProject {
  id: string
  title: string
  description: string
  category: string
  categories: string | null
  year: string
  image: string
  imageAlt?: string
  image_alt?: string
  images: string | null
  wide: number
  featured: number
  displayOrder?: number
  display_order?: number
  createdAt?: string
  updatedAt?: string
}

export interface LogEntry {
  id: number
  type: string
  message: string
  details: string | null
  severity: string
  createdAt: string
}

export interface BackupEntry {
  timestamp: string
  filename: string
  size: number
  counts: {
    users: number
    projects: number
    content: number
    pageviews: number
    clicks: number
    formSubmissions: number
  }
}

export interface StatsData {
  totalProjects: number
  pageviewsLast30Days: number
  recentPageviews: Array<{ path: string; timestamp: string }>
}

export interface PeriodCount {
  period: string
  count: number
}

export interface PageviewsData {
  stats: { total: number; unique: number; byPeriod: PeriodCount[] }
  uniqueVisitors: number
  topPages: Array<{ path: string; count: number }>
}

export interface ClicksData {
  stats: { total: number; byElement: Array<{ elementId: string; count: number }>; byPeriod: PeriodCount[] }
  ctr?: number
}

export interface SubmissionItem {
  id: number
  formId: string | null
  name: string
  email: string
  message: string
  read: number
  createdAt: string
}

export interface SubmissionsData {
  stats: { total: number; byPeriod: PeriodCount[]; recent: SubmissionItem[] }
  conversionRate: number
}

export const PROJECT_CATEGORIES = [
  'Брендинг',
  'Веб-Дизайн',
  'Типографика',
  'UI/UX',
  'Инфографика',
  'Полиграфия',
  'Иллюстрация',
  'Анимация',
] as const

// ============================================================================
// Парсеры и форматтеры
// ============================================================================

/** Безопасно распарсить JSON-массив из строк БД (categories/images) */
export function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === 'string')
  } catch {
    // ignore
  }
  return []
}

/** Дата-время в ru-RU: «17.02.2026, 14:05» */
export function formatDateTime(iso: string | Date): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Дата-время с секундами для логов */
export function formatDateTimeSec(iso: string | Date): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/** Полная дата для бэкапов: «17 февраля 2026, 03:00» */
export function formatDateLong(iso: string | Date): string {
  return new Date(iso).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Размер файла: Б / КБ / МБ / ГБ */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 Б'
  const units = ['Б', 'КБ', 'МБ', 'ГБ']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / Math.pow(1024, i)
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10
  return `${rounded} ${units[i]}`
}

/** YYYY-MM-DD для input[type=date] (локальная зона) */
export function toDateInput(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
