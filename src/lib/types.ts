/**
 * Общие типы (клиентские, нормализованные)
 * АПИ-слой отдаёт "сырые" поля (categories/images — JSON-строки, wide/featured — 0|1),
 * нормализация происходит в lib/api.ts — как в оригинале.
 */

export interface Project {
  id: string
  title: string
  description: string
  category: string
  categories: string[]
  year: string
  image: string
  imageAlt: string
  images: string[]
  wide: boolean
  featured: boolean
  displayOrder: number
}

/** Сырой проект как приходит из API (паритет с MongoDB-документом оригинала) */
export interface RawProject {
  _id?: string
  id: string
  title: string
  description: string
  category: string
  categories: string | null
  year: string | number
  image: string
  imageAlt?: string
  image_alt?: string
  images: string | null
  wide: number
  featured: number
  displayOrder?: number
  display_order?: number
}

export interface ContactsInfo {
  email: string
  telegram: string
  phone: string
  behance: string
  dribbble?: string
  avatar?: string
}

export type Route = '/' | '/cases' | '/about' | '/contact' | '/admin'

export type SortMode = 'popular' | 'newest' | 'oldest' | 'recent'

export interface ValidationErrors {
  name?: string
  contact?: string
  budget?: string
  description?: string
}
