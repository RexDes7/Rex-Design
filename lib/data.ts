/**
 * Data Access Layer (Editorial Light v2)
 *
 * Projects & skills & contacts are managed through the admin panel
 * (stored in MongoDB). Below are static constants for sections that
 * are not yet admin-managed: services, process, testimonials, stats, tools.
 */

import { Project } from '@/types/project'
import { Skill } from '@/types/skill'
import { ManifestoPrinciple } from '@/types/manifesto'

// Projects data - managed through admin panel (kept as fallback only)
export const projects: Project[] = [
  {
    id: 'project-1',
    title: 'ЦИФРОВОЙ БАНК',
    description: 'Редизайн мобильного приложения для современного банкинга',
    category: 'UI/UX',
    year: '2024',
    image: '/images/projects/project-1.jpg',
    imageAlt: 'Интерфейс мобильного банковского приложения',
    wide: true,
  },
  {
    id: 'project-2',
    title: 'БРЕНД КОФЕЙНИ',
    description: 'Фирменный стиль и айдентика для сети кофеен',
    category: 'Брендинг',
    year: '2024',
    image: '/images/projects/project-2.jpg',
    imageAlt: 'Логотип и фирменный стиль кофейни',
    wide: false,
    featured: true,
  },
  {
    id: 'project-3',
    title: 'ТИПОГРАФИКА 2024',
    description: 'Экспериментальный шрифтовой проект для цифровых медиа',
    category: 'Типографика',
    year: '2024',
    image: '/images/projects/project-3.jpg',
    imageAlt: 'Образцы экспериментальной типографики',
    wide: false,
  },
  {
    id: 'project-4',
    title: 'МАРКЕТПЛЕЙС',
    description: 'Веб-платформа для продажи цифровых товаров',
    category: 'Веб-Дизайн',
    year: '2023',
    image: '/images/projects/project-4.jpg',
    imageAlt: 'Главная страница маркетплейса',
    wide: false,
    featured: true,
  },
  {
    id: 'project-5',
    title: 'СТАРТАП РЕБРЕНДИНГ',
    description: 'Полный ребрендинг технологического стартапа',
    category: 'Брендинг',
    year: '2023',
    image: '/images/projects/project-5.jpg',
    imageAlt: 'Элементы фирменного стиля стартапа',
    wide: false,
  },
  {
    id: 'project-6',
    title: 'ДАШБОРД АНАЛИТИКИ',
    description: 'Интерфейс для визуализации больших данных',
    category: 'UI/UX',
    year: '2023',
    image: '/images/projects/project-6.jpg',
    imageAlt: 'Интерфейс дашборда с графиками и метриками',
    wide: true,
  },
]

// Skills data - managed through admin panel
export const skills: Skill[] = [
  { name: 'Брендинг', description: 'Создание уникальной айдентики и фирменного стиля' },
  { name: 'Инфографика', description: 'Визуализация данных и сложной информации', variant: 'dark' },
  { name: 'Веб-дизайн', description: 'Проектирование современных интерфейсов' },
  { name: 'Покадровая 2D-анимация', description: 'Создание плавной анимации для проектов' },
  { name: 'Самописный сайт под ключ', description: 'Разработка сайтов с нуля на чистом коде' },
  { name: 'Полиграфия', description: 'Дизайн печатной продукции и макетов', variant: 'dark' },
]

// Manifesto principles → re-used as "approach" cards
export const manifestoPrinciples: ManifestoPrinciple[] = [
  {
    number: '01',
    title: 'КАЧЕСТВО',
    description: 'Внимание к деталям и высокие стандарты',
    icon: 'verified',
  },
  {
    number: '02',
    title: 'ЧЕСТНОСТЬ',
    description: 'Прямота коммуникации и намерений',
    icon: 'check_box',
  },
  {
    number: '03',
    title: 'УСПЕХ',
    description: 'Результаты, которые превосходят ожидания',
    icon: 'trending_up',
  },
]

// ============================================================
// NEW DATA — Editorial Light v2
// ============================================================

// Approach principles (replaces manifesto on home — softer copy)
export interface ApproachPrinciple {
  number: string
  title: string
  description: string
  icon: string
}

export const approachPrinciples: ApproachPrinciple[] = [
  {
    number: '01',
    title: 'Стратегия раньше пикселей',
    description: 'Прежде чем рисовать, я изучаю бизнес, аудиторию и конкурентов. Так дизайн получается осмысленным и работает на результат.',
    icon: 'insights',
  },
  {
    number: '02',
    title: 'Ясность в каждой детали',
    description: 'Убираю лишнее, оставляю суть. Каждый элемент на странице работает на вашу цель.',
    icon: 'auto_awesome',
  },
  {
    number: '03',
    title: 'Партнёрство в работе',
    description: 'Работаю как продакт-дизайнер вашего продукта: задаю вопросы, предлагаю решения, довожу до результата.',
    icon: 'handshake',
  },
]

// Services — using existing 6 skills, formatted as services
export interface Service {
  icon: string
  title: string
  description: string
}

export const services: Service[] = [
  {
    icon: 'palette',
    title: 'Брендинг',
    description: 'Айдентика, логотип, фирменный стиль и гайдлайны для запоминающегося бренда.',
  },
  {
    icon: 'analytics',
    title: 'Инфографика',
    description: 'Визуализация данных и сложной информации для маркетплейсов и презентаций.',
  },
  {
    icon: 'web',
    title: 'Веб-дизайн',
    description: 'Лендинги, многостраничные сайты, дашборды — проектирование интерфейсов под задачу.',
  },
  {
    icon: 'animation',
    title: 'Покадровая 2D-анимация',
    description: 'Живая анимация для рекламы, контента и интерфейсов. Плавно, ритмично, в характер.',
  },
  {
    icon: 'code',
    title: 'Самописный сайт под ключ',
    description: 'Разработка сайтов с нуля на чистом коде. Без конструкторов, только ваш уникальный продукт.',
  },
  {
    icon: 'description',
    title: 'Полиграфия',
    description: 'Дизайн печатной продукции: визитки, листовки, баннеры, упаковка. Под ключ, до печати.',
  },
]

// Creative process (universal: Brief → Research → Concept → Design → Delivery)
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

// Testimonials (placeholders — TODO: replace with real)
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

// Stats
export interface Stat {
  value: string
  label: string
  description?: string
}

export const stats: Stat[] = [
  { value: '50+', label: 'Проектов', description: 'С 2020 года' },
  { value: '6 лет', label: 'Опыта', description: 'В дизайне' },
  { value: '20+', label: 'Клиентов', description: 'Повторно обращаются' },
  { value: '8', label: 'Направлений', description: 'Дизайна' },
]

// Tools
export interface Tool {
  name: string
  icon: string
}

export const tools: Tool[] = [
  { name: 'Figma', icon: 'design_services' },
  { name: 'Illustrator', icon: 'brush' },
  { name: 'Photoshop', icon: 'image' },
  { name: 'After Effects', icon: 'movie' },
  { name: 'InDesign', icon: 'menu_book' },
  { name: 'Webflow', icon: 'web' },
  { name: 'Procreate', icon: 'draw' },
  { name: 'Blender', icon: 'view_in_ar' },
]

// Fun facts
export interface FunFact {
  icon: string
  title: string
  description: string
}

export const funFacts: FunFact[] = [
  {
    icon: 'camera',
    title: 'Фотографирую',
    description: 'В свободное время — уличная и архитектурная съёмка.',
  },
  {
    icon: 'coffee',
    title: 'Кофе с утра',
    description: 'Без чашки фильтра утро не начинается. Это почти ритуал.',
  },
  {
    icon: 'music_note',
    title: 'Lo-fi в работе',
    description: 'Лучшие идеи приходят под дождь и J Dilla.',
  },
  {
    icon: 'flight',
    title: 'Путешествия',
    description: 'Новые места = новые визуальные впечатления.',
  },
]

// Experience timeline
export interface ExperienceItem {
  year: string
  title: string
  description: string
}

export const experience: ExperienceItem[] = [
  {
    year: '2020',
    title: 'Начало пути',
    description: 'Первые коммерческие заказы — логотипы, визитки, полиграфия.',
  },
  {
    year: '2022',
    title: 'Переход в веб-дизайн',
    description: 'Начинаю проектировать сайты и интерфейсы. Изучаю UX.',
  },
  {
    year: '2024',
    title: 'Расширение услуг',
    description: 'Добавляю инфографику для маркетплейсов и 2D-анимацию.',
  },
  {
    year: '2026',
    title: 'Сегодня',
    description: '50+ проектов, постоянные клиенты, фокус на брендинге и вебе.',
  },
]
