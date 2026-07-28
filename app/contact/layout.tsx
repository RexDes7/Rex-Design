import type { Metadata } from 'next'
import { generateContactPageSchema, generateBreadcrumbSchema } from '@/app/schema'

const BASE_URL = 'https://rex-dsgn.vercel.app'

export const metadata: Metadata = {
  title: 'Контакты — заказать дизайн проект',
  description: 'Закажите дизайн проект: брендинг, веб-дизайн, типографика, инфографику. Рафаэль Апарян — открыт к новым проектам. Email, Telegram, телефон. Ответ в течение 24 часов.',
  keywords: [
    'заказать дизайн',
    'заказать логотип',
    'заказать брендинг',
    'заказать веб-дизайн',
    'услуги дизайнера',
    'нанять дизайнера',
    'дизайнер фрилансер',
    'контакты дизайнера',
    'rex design контакты',
  ],
  openGraph: {
    title: 'Контакты — заказать дизайн проект | REX DESIGN',
    description: 'Открыт к новым проектам. Брендинг, веб-дизайн, типографика. Ответ в течение 24 часов.',
    url: `${BASE_URL}/contact`,
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Контакты REX DESIGN' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Контакты — REX DESIGN',
    description: 'Закажите дизайн проект. Открыт к новым проектам.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: `${BASE_URL}/contact`,
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const contactSchema = generateContactPageSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Главная', url: '/' },
    { name: 'Контакты', url: '/contact' },
  ])

  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
