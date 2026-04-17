/**
 * Data Access Layer
 * 
 * This module provides data for the public-facing site.
 * 
 * NOTE: This data is now managed through the admin panel and stored in the database.
 * The admin panel uses lib/services/content.service.ts to read/write data.
 * 
 * For the public site, data is exported as static constants for optimal performance.
 * To update this data:
 * 1. Use the admin panel at /admin to modify projects, skills, and manifesto
 * 2. Changes are saved to the database (admin.db)
 * 3. The public site will need to be rebuilt to reflect changes
 * 
 * Future enhancement: Implement server-side data fetching to show real-time updates
 * without rebuilding the site.
 */

import { Project } from '@/types/project'
import { Skill } from '@/types/skill'
import { ManifestoPrinciple } from '@/types/manifesto'

// Projects data - managed through admin panel
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
  { name: 'БРЕНДИНГ', description: 'Создание уникальной айдентики и фирменного стиля' },
  { name: 'ИНФОГРАФИКА', description: 'Визуализация данных и сложной информации', variant: 'dark' },
  { name: 'ВЭБ-ДИЗАЙН', description: 'Проектирование современных интерфейсов' },
  { name: 'ПОКАДРОВАЯ 2D АНИМАЦИЯ', description: 'Создание плавной анимации для проектов' },
  { name: 'САМОПИСНЫЙ САЙТ ПОД КЛЮЧ', description: 'Разработка сайтов с нуля на чистом коде' },
  { name: 'ПОЛИГРАФИЯ', description: 'Дизайн печатной продукции и макетов', variant: 'dark' },
]

// Manifesto principles - managed through admin panel
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
