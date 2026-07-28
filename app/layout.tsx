import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import MainLayoutWrapper from '@/components/MainLayoutWrapper'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { generateOrganizationSchema, generateWebSiteSchema, generatePersonSchema } from './schema'

// Disable caching for dynamic data
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  preload: true,
})

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://rex-dsgn.vercel.app'),
  title: {
    default: 'REX DESIGN - Дизайн студия | Брендинг, Веб-дизайн, Типографика',
    template: '%s | REX DESIGN',
  },
  description: 'Дизайнер Рафаэль Апарян (REX DESIGN, Ульяновск). Брендинг, веб-дизайн, типографика, UI/UX, инфографика, полиграфия. 150+ проектов с 2020 года. Открыт к новым проектам.',
  keywords: [
    'дизайн студия',
    'веб дизайн',
    'брендинг',
    'типографика',
    'UI/UX дизайн',
    'дизайн логотипа',
    'фирменный стиль',
    'дизайн сайта',
    'графический дизайн',
    'инфографика',
    'дизайн визиток',
    'полиграфия',
    'rex design',
    'рекс дизайн',
    'дизайнер',
    'портфолио дизайнера',
  ],
  authors: [{ name: 'Апарян Рафаэль', url: 'https://rex-dsgn.vercel.app' }],
  creator: 'REX DESIGN',
  publisher: 'REX DESIGN',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://rex-dsgn.vercel.app',
    siteName: 'REX DESIGN',
    title: 'REX DESIGN — дизайнер Рафаэль Апарян | Брендинг, Веб-дизайн',
    description: '150+ проектов с 2020 года. Брендинг, веб-дизайн, типографика, UI/UX. Дизайнер из Ульяновска для вашего бизнеса.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'REX DESIGN - Профессиональная дизайн студия',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REX DESIGN - Дизайн студия',
    description: 'Профессиональная дизайн студия. Брендинг, веб-дизайн, типографика, UI/UX.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://rex-dsgn.vercel.app',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();
  const personSchema = generatePersonSchema();

  return (
    <html lang="ru" className={`${plusJakarta.variable} ${inter.variable} ${jetbrains.variable}`}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>
        <AnalyticsTracker />
        <MainLayoutWrapper>
          {children}
        </MainLayoutWrapper>
      </body>
    </html>
  )
}
