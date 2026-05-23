export interface Project {
  id: string
  title: string
  description: string
  category: 'Веб-Дизайн' | 'Брендинг' | 'Типографика' | 'UI/UX' | 'Инфографика' | 'Полиграфия' | 'Иллюстрация' | 'Анимация'
  categories?: string[] // Multiple categories support
  year: string
  image: string
  imageAlt: string
  wide?: boolean
  featured?: boolean // Yellow background
  variant?: 'standard' | 'featured' | 'dark'
}
