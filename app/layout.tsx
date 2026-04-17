import type { Metadata } from 'next'
import { Playfair_Display, Space_Grotesk } from 'next/font/google'
import './globals.css'
import MainLayoutWrapper from '@/components/MainLayoutWrapper'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { generateOrganizationSchema, generateWebSiteSchema } from './schema'

// Disable caching for dynamic data
export const fetchCache = 'force-no-store';
export const revalidate = 0;

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-headline',
  display: 'swap',
  preload: true,
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-numbers',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://rex-design-stodio.vercel.app'),
  title: {
    default: 'REX DESIGN - Дизайн студия | Брендинг, Веб-дизайн, Типографика',
    template: '%s | REX DESIGN',
  },
  description: 'Профессиональная дизайн студия REX DESIGN. Создаём брендинг, веб-дизайн, типографику, UI/UX. Портфолио работ с 2020 года. Качественный дизайн для вашего бизнеса.',
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
  authors: [{ name: 'Апарян Рафаэль', url: 'https://rex-design-stodio.vercel.app' }],
  creator: 'REX DESIGN',
  publisher: 'REX DESIGN',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://rex-design-stodio.vercel.app',
    siteName: 'REX DESIGN',
    title: 'REX DESIGN - Дизайн студия | Брендинг, Веб-дизайн, Типографика',
    description: 'Профессиональная дизайн студия. Создаём брендинг, веб-дизайн, типографику, UI/UX. Портфолио работ с 2020 года.',
    images: [
      {
        url: '/images/portrait.svg',
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
    images: ['/images/portrait.svg'],
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
    canonical: 'https://rex-design-stodio.vercel.app',
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

  return (
    <html lang="ru" className={`${playfairDisplay.variable} ${spaceGrotesk.variable}`}>
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
