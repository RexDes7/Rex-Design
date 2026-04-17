import type { Metadata } from 'next'
import { Playfair_Display, Space_Grotesk } from 'next/font/google'
import './globals.css'
import MainLayoutWrapper from '@/components/MainLayoutWrapper'
import AnalyticsTracker from '@/components/AnalyticsTracker'

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
  metadataBase: new URL('https://rex-design.com'),
  title: {
    default: 'REX | Мы задаем тренды',
    template: '%s | REX',
  },
  description: 'REX DESIGN - Мы задаем тренды. Лучшее качество для наших клиентов.',
  keywords: ['design', 'portfolio', 'web design', 'branding', 'typography', 'UI/UX', 'rex design'],
  authors: [{ name: 'REX' }],
  creator: 'REX',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://rex-design.com',
    siteName: 'REX',
    title: 'REX | Мы задаем тренды',
    description: 'REX DESIGN - Мы задаем тренды. Лучшее качество для наших клиентов.',
    images: [
      {
        url: '/images/portrait.svg',
        width: 1200,
        height: 630,
        alt: 'REX - Мы задаем тренды',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REX | Мы задаем тренды',
    description: 'REX DESIGN - Мы задаем тренды. Лучшее качество для наших клиентов.',
    images: ['/images/portrait.svg'],
  },
  robots: {
    index: true,
    follow: true,
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
