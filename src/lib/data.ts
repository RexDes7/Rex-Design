/**
 * Статический контент сайта — паритет с lib/data.ts оригинала.
 * Иконки — lucide-react (в оригинале Material Symbols).
 */
import {
  Lightbulb, Sparkles, Handshake, Palette, BarChart3, Globe, Clapperboard, Code2, FileText,
  Camera, Coffee, Music, Plane, type LucideIcon,
} from 'lucide-react'

// ---------- Подход (Approach) ----------
export interface ApproachPrinciple {
  number: string
  title: string
  description: string
  icon: LucideIcon
}

export const approachPrinciples: ApproachPrinciple[] = [
  {
    number: '01',
    title: 'Стратегия раньше пикселей',
    description: 'Прежде чем рисовать, я изучаю бизнес, аудиторию и конкурентов. Так дизайн получается осмысленным и работает на результат.',
    icon: Lightbulb,
  },
  {
    number: '02',
    title: 'Ясность в каждой детали',
    description: 'Убираю лишнее, оставляю суть. Каждый элемент на странице работает на вашу цель.',
    icon: Sparkles,
  },
  {
    number: '03',
    title: 'Партнёрство в работе',
    description: 'Работаю как продакт-дизайнер вашего продукта: задаю вопросы, предлагаю решения, довожу до результата.',
    icon: Handshake,
  },
]

// ---------- Услуги ----------
export interface Service {
  icon: LucideIcon
  title: string
  description: string
}

export const services: Service[] = [
  {
    icon: Palette,
    title: 'Брендинг',
    description: 'Айдентика, логотип, фирменный стиль и гайдлайны для запоминающегося бренда.',
  },
  {
    icon: BarChart3,
    title: 'Инфографика',
    description: 'Визуализация данных и сложной информации для маркетплейсов и презентаций.',
  },
  {
    icon: Globe,
    title: 'Веб-дизайн',
    description: 'Лендинги, многостраничные сайты, дашборды — проектирование интерфейсов под задачу.',
  },
  {
    icon: Clapperboard,
    title: 'Покадровая 2D-анимация',
    description: 'Живая анимация для рекламы, контента и интерфейсов. Плавно, ритмично, в характер.',
  },
  {
    icon: Code2,
    title: 'Самописный сайт под ключ',
    description: 'Разработка сайтов с нуля на чистом коде. Без конструкторов, только ваш уникальный продукт.',
  },
  {
    icon: FileText,
    title: 'Полиграфия',
    description: 'Дизайн печатной продукции: визитки, листовки, баннеры, упаковка. Под ключ, до печати.',
  },
]

// ---------- Процесс ----------
export interface ProcessStepData {
  number: string
  title: string
  description: string
  duration: string
}

export const processSteps: ProcessStepData[] = [
  {
    number: '01',
    title: 'Бриф',
    description: 'Знакомимся, обсуждаем задачу, цели и сроки. Задаю уточняющие вопросы, чтобы точно понять контекст.',
    duration: '1–2 дня',
  },
  {
    number: '02',
    title: 'Исследование',
    description: 'Изучаю нишу, конкурентов, аудиторию. Формирую референсы и направление.',
    duration: '2–4 дня',
  },
  {
    number: '03',
    title: 'Концепция',
    description: 'Предлагаю 1–2 направления. Согласуем стиль, цвет, типографику. Правки до попадания.',
    duration: '3–5 дней',
  },
  {
    number: '04',
    title: 'Дизайн',
    description: 'Оттачиваю детали, собираю макеты, готовлю файлы. Вы видите процесс на каждом этапе.',
    duration: '1–3 недели',
  },
  {
    number: '05',
    title: 'Передача',
    description: 'Финальные файлы, исходники, гайдлайны. Сопровождение после сдачи проекта.',
    duration: '1–2 дня',
  },
]

// ---------- Отзывы ----------
export interface Testimonial {
  quote: string
  author: string
  role: string
  project?: string
}

export const testimonials: Testimonial[] = [
  {
    quote: 'Рафаэль сделал branding для нашего стартапа — попал в характер с первого концепта. Работать было легко, результат выше ожиданий.',
    author: 'Имя клиента',
    role: 'Основатель, стартап',
    project: 'Branding',
  },
  {
    quote: 'Сделал редизайн логотипа и айдентики. Чёткие сроки, понятная коммуникация, аккуратная передача файлов.',
    author: 'Имя клиента',
    role: 'Маркетинг-директор',
    project: 'Logo redesign',
  },
  {
    quote: 'Разработал инфографику для маркетплейса — продажи карточки выросли на 30%. Рекомендую как профи.',
    author: 'Имя клиента',
    role: 'Селлер, Ozon',
    project: 'Infographics',
  },
]

// ---------- Цифры ----------
export interface Stat {
  value: string
  label: string
  description?: string
}

export const stats: Stat[] = [
  { value: '150+', label: 'Проектов', description: 'С 2020 года' },
  { value: '6 лет', label: 'Опыта', description: 'В дизайне' },
  { value: '100+', label: 'Клиентов', description: 'Повторно обращаются' },
  { value: '8', label: 'Направлений', description: 'Дизайна' },
]

// ---------- Инструменты ----------
export interface Tool {
  name: string
  icon: LucideIcon
}

export const tools: Tool[] = [
  { name: 'Figma', icon: Sparkles },
  { name: 'Illustrator', icon: Palette },
  { name: 'Photoshop', icon: Camera },
  { name: 'After Effects', icon: Clapperboard },
  { name: 'InDesign', icon: FileText },
  { name: 'Webflow', icon: Globe },
  { name: 'Procreate', icon: Lightbulb },
  { name: 'Blender', icon: Code2 },
]

// ---------- Личное ----------
export interface FunFact {
  icon: LucideIcon
  title: string
  description: string
}

export const funFacts: FunFact[] = [
  { icon: Camera, title: 'Фотографирую', description: 'В свободное время — уличная и архитектурная съёмка.' },
  { icon: Coffee, title: 'Кофе с утра', description: 'Без чашки фильтра утро не начинается. Это почти ритуал.' },
  { icon: Music, title: 'Lo-fi в работе', description: 'Лучшие идеи приходят под дождь и J Dilla.' },
  { icon: Plane, title: 'Путешествия', description: 'Новые места = новые визуальные впечатления.' },
]

// ---------- Опыт ----------
export interface ExperienceItem {
  year: string
  title: string
  description: string
}

export const experience: ExperienceItem[] = [
  { year: '2020', title: 'Начало пути', description: 'Первые коммерческие заказы — логотипы, визитки, полиграфия.' },
  { year: '2022', title: 'Переход в веб-дизайн', description: 'Начинаю проектировать сайты и интерфейсы. Изучаю UX.' },
  { year: '2024', title: 'Расширение услуг', description: 'Добавляю инфографику для маркетплейсов и 2D-анимацию.' },
  { year: '2026', title: 'Сегодня', description: '150+ проектов, более 100 клиентов, фокус на брендинге и вебе.' },
]

// ---------- Навыки ----------
export interface Skill {
  name: string
  description: string
}

export const skills: Skill[] = [
  { name: 'Брендинг', description: 'Создание уникальной айдентики и фирменного стиля' },
  { name: 'Инфографика', description: 'Визуализация данных и сложной информации' },
  { name: 'Веб-дизайн', description: 'Проектирование современных интерфейсов' },
  { name: 'Покадровая 2D-анимация', description: 'Создание плавной анимации для проектов' },
  { name: 'Самописный сайт под ключ', description: 'Разработка сайтов с нуля на чистом коде' },
  { name: 'Полиграфия', description: 'Дизайн печатной продукции и макетов' },
]

// ---------- Категории портфолио (фильтр на #/cases) ----------
export const portfolioCategories = [
  'Все проекты',
  'Веб-Дизайн',
  'Брендинг',
  'Типографика',
  'UI/UX',
  'Инфографика',
  'Полиграфия',
  'Иллюстрация',
  'Анимация',
]
