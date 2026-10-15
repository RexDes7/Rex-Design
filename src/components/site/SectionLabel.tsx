/**
 * Нумерованная метка секции: красный квадрат + номер + подпись (mono).
 */
'use client'

import { cn } from '@/lib/utils'

export default function SectionLabel({
  number,
  text,
  dark = false,
  className,
}: {
  number: string
  text: string
  dark?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="h-2.5 w-2.5 shrink-0 bg-rex-red" aria-hidden="true" />
      <span
        className={cn('mono-label', dark ? 'text-paper/60' : 'text-rex-gray')}
      >
        {number} / {text}
      </span>
      <span
        className={cn('h-px w-16 sm:w-24', dark ? 'bg-white/25' : 'bg-ink/25')}
        aria-hidden="true"
      />
    </div>
  )
}
