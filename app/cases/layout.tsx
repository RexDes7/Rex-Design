import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Проекты',
  description: 'Портфолио проектов: веб-дизайн, брендинг, типографика, UI/UX. Цифровой манифест брутального дизайна.',
  openGraph: {
    title: 'Проекты | АРХИВ-24',
    description: 'Портфолио проектов: веб-дизайн, брендинг, типографика, UI/UX.',
  },
}

export default function CasesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
