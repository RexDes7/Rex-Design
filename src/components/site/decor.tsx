/**
 * Декоративные пост-модерн элементы: звёзды, прицелы, скрабблы, скотч, гафтон.
 */
'use client'

import { cn } from '@/lib/utils'

/** Четырёхконечная звезда ✦ */
export function Sparkle({
  className,
  size = 28,
  color = 'currentColor',
}: {
  className?: string
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M12 1.5c.7 5.6 4.9 9.8 10.5 10.5-5.6.7-9.8 4.9-10.5 10.5C11.3 16.9 7.1 12.7 1.5 12 7.1 11.3 11.3 7.1 12 1.5Z"
        fill={color}
      />
    </svg>
  )
}

/** Крестик-прицел + */
export function Crosshair({
  className,
  size = 24,
  color = 'currentColor',
}: {
  className?: string
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2v20M2 12h20" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  )
}

/** Маркерное подчёркивание (hand-drawn scribble) */
export function ScribbleUnderline({ className, color = '#E63946' }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 220 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('h-[0.18em] w-full', className)}
    >
      <path
        d="M3 9 C 30 4, 55 12, 80 7 S 130 4, 155 9 S 195 6, 217 8"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
    </svg>
  )
}

/** Каракуля-обводка (круговой scribble вокруг) */
export function ScribbleCircle({ className, color = '#E63946' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 120 60" aria-hidden="true" className={cn('w-full', className)}>
      <path
        d="M8 34 C 12 12, 42 4, 66 7 C 92 10, 114 18, 110 36 C 106 52, 78 57, 54 54 C 30 51, 8 48, 12 30"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

/** Кусочек малярного скотча */
export function TapePiece({ className, color = 'rgba(214,209,199,0.9)' }: { className?: string; color?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('h-7 w-24 shadow-sm', className)}
      style={{
        backgroundColor: color,
        clipPath: 'polygon(2% 8%, 98% 0%, 100% 88%, 95% 100%, 4% 96%, 0% 20%)',
      }}
    />
  )
}

/** Гафтон-точки (полутон) */
export function Halftone({
  className,
  color = '#0A0A0A',
  size = 8,
}: {
  className?: string
  color?: string
  size?: number
}) {
  return (
    <svg aria-hidden="true" className={className} width="80" height="120" viewBox="0 0 80 120">
      <defs>
        <pattern id={`halftone-${color.replace('#', '')}`} width={size} height={size} patternUnits="userSpaceOnUse">
          <circle cx={size / 2} cy={size / 2} r={size / 5} fill={color} />
        </pattern>
      </defs>
      <rect width="80" height="120" fill={`url(#halftone-${color.replace('#', '')})`} />
    </svg>
  )
}

/** Зигзаг-молния */
export function Zigzag({ className, color = '#E63946' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true" className={cn('h-6 w-12', className)}>
      <path
        d="M4 24 L14 6 L24 22 L34 4 L44 20 L54 6"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

/** Стрелка-клякса (маркерная) для акцентов */
export function MarkerArrow({ className, color = '#0A0A0A' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 74 34" aria-hidden="true" className={cn('h-8 w-[74px]', className)}>
      <path
        d="M4 26 C 18 22, 38 20, 54 12 M54 12 l-10 1 M54 12 l-3 9"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
