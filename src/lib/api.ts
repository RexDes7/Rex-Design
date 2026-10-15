/**
 * Клиентский API-слой + нормализация — паритет с оригинальным сайтом.
 */
import type { Project, RawProject, ContactsInfo } from './types'

/** Нормализация проекта из сырого ответа API (как в оригинальном page.tsx) */
export function normalizeProject(raw: RawProject): Project {
  let categories: string[] = []
  try {
    categories = raw.categories ? JSON.parse(raw.categories) : [raw.category]
  } catch {
    categories = [raw.category]
  }
  let images: string[] = []
  try {
    images = raw.images ? JSON.parse(raw.images) : []
  } catch {
    images = []
  }
  const cover = images.length > 0 ? images[0] : raw.image
  return {
    id: raw.id || raw._id || '',
    title: raw.title,
    description: raw.description,
    category: raw.category,
    categories: categories.length ? categories : [raw.category],
    year: String(raw.year),
    image: raw.image || cover,
    imageAlt: raw.imageAlt || raw.image_alt || raw.title,
    images: images.length ? images : raw.image ? [raw.image] : [],
    wide: Boolean(raw.wide),
    featured: Boolean(raw.featured),
    displayOrder: raw.displayOrder ?? raw.display_order ?? 0,
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch('/api/projects', { cache: 'no-store' })
    const json = await res.json()
    if (!json?.success || !Array.isArray(json.data)) return []
    return json.data.map((p: RawProject) => normalizeProject(p))
  } catch {
    return []
  }
}

export const FALLBACK_CONTACTS: ContactsInfo = {
  email: 'rafaelaparyan@yandex.ru',
  telegram: 'https://t.me/RLC_W',
  phone: '+7 (902) 212-10-44',
  behance: 'https://www.behance.net/arhiv24',
  dribbble: '',
  avatar: '',
}

export async function fetchContacts(): Promise<ContactsInfo> {
  try {
    const res = await fetch('/api/contacts', { cache: 'no-store' })
    const json = await res.json()
    if (json?.success && json.data) {
      return {
        email: json.data.email || FALLBACK_CONTACTS.email,
        telegram: json.data.telegram || FALLBACK_CONTACTS.telegram,
        phone: json.data.phone || FALLBACK_CONTACTS.phone,
        behance: json.data.behance || FALLBACK_CONTACTS.behance,
        dribbble: json.data.dribbble || '',
        avatar: json.data.avatar || '',
      }
    }
    return FALLBACK_CONTACTS
  } catch {
    return FALLBACK_CONTACTS
  }
}

/** Отправка pageview (для AnalyticsTracker) */
export function trackPageview(path: string) {
  fetch('/api/track/pageview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  }).catch(() => {})
}

/** Отправка клика */
export function trackClick(elementId: string, elementType: string, path: string) {
  fetch('/api/track/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ elementId, elementType, path }),
  }).catch(() => {})
}

/** Отправка данных формы */
export function trackFormSubmission(formId: string, name: string, email: string, message: string) {
  fetch('/api/track/submission', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formId, name, email, message }),
  }).catch(() => {})
}
