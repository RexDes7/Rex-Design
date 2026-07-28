import type { Metadata } from 'next'
import { generatePersonSchema, generateBreadcrumbSchema, generateProfilePageSchema } from '@/app/schema'

const BASE_URL = 'https://rex-dsgn.vercel.app'

export const metadata: Metadata = {
  title: 'Обо мне — дизайнер Рафаэль Апарян',
  description: 'Рафаэль Апарян — мультидисциплинарный дизайнер из Ульяновска. 6 лет опыта, 150+ проектов. Брендинг, веб-дизайн, типографика, UI/UX. Личный подход к каждому проекту.',
  keywords: [
    'дизайнер Рафаэль Апарян',
    'обо мне дизайнер',
    'портфолио дизайнера Ульяновск',
    'графический дизайнер',
    'веб-дизайнер',
    'бренд-дизайнер',
    ' Rex Design',
    'дизайнер для бизнеса',
  ],
  openGraph: {
    title: 'Обо мне — Рафаэль Апарян, дизайнер | REX DESIGN',
    description: 'Мультидисциплинарный дизайнер из Ульяновска. 6 лет опыта, 150+ проектов. Брендинг, веб-дизайн, типографика.',
    url: `${BASE_URL}/about`,
    type: 'profile',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Рафаэль Апарян — дизайнер' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Обо мне — Рафаэль Апарян',
    description: 'Мультидисциплинарный дизайнер. 6 лет опыта, 150+ проектов.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const personSchema = generatePersonSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Главная', url: '/' },
    { name: 'Обо мне', url: '/about' },
  ])
  const profileSchema = generateProfilePageSchema()

  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
    </>
  )
}
