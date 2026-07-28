import type { Metadata } from 'next'
import { generateBreadcrumbSchema } from '@/app/schema'

const BASE_URL = 'https://rex-dsgn.vercel.app'

export const metadata: Metadata = {
  title: 'Портфолио — избранные работы дизайнера',
  description: 'Портфолио дизайнера Рафаэля Апаряна: брендинг, веб-дизайн, инфографика, типографика, полиграфия. 150+ проектов с 2020 года. Выберите направление или посмотрите все работы.',
  keywords: [
    'портфолио дизайнера',
    'кейсы дизайнера',
    'работы дизайнера',
    'брендинг портфолио',
    'веб-дизайн портфолио',
    'логотипы',
    'айдентика',
    'инфографика',
    'дизайн проекты',
    'rex design портфолио',
  ],
  openGraph: {
    title: 'Портфолио — REX DESIGN',
    description: '150+ проектов: брендинг, веб-дизайн, инфографика, типографика. Избранные работы дизайнера Рафаэля Апаряна.',
    url: `${BASE_URL}/cases`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Портфолио REX DESIGN' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Портфолио — REX DESIGN',
    description: '150+ проектов: брендинг, веб-дизайн, инфографика, типографика.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: `${BASE_URL}/cases`,
  },
}

export default function CasesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Главная', url: '/' },
    { name: 'Портфолио', url: '/cases' },
  ])

  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
