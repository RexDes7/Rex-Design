/**
 * Нормализация входных данных проекта (categories/images хранятся JSON-строками).
 */

/** categories: массив → JSON-строка; строка → как есть; иначе [category] */
export function normalizeCategories(value: unknown, category: string): string {
  if (Array.isArray(value)) return JSON.stringify(value)
  if (typeof value === 'string' && value.trim().length > 0) return value
  return JSON.stringify([category])
}

/** images: массив → JSON-строка; строка → как есть; иначе '[]' */
export function normalizeImages(value: unknown): string {
  if (Array.isArray(value)) return JSON.stringify(value)
  if (typeof value === 'string' && value.trim().length > 0) return value
  return '[]'
}

/** imageAlt с поддержкой легаси-ключа image_alt */
export function pickImageAlt(body: Record<string, unknown>, fallback: string): string {
  const value = body.imageAlt ?? body.image_alt ?? fallback
  return typeof value === 'string' ? value : String(value ?? '')
}
