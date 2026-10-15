/**
 * Общий диалог подтверждения (острые углы, красная опасность).
 */
'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Esc — отмена
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm border-2 border-[#2A2E36] bg-[#111318] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#E63946]" aria-hidden="true" />
          <div>
            <h3 className="font-display text-lg font-semibold uppercase leading-tight text-[#E8E4DF]">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#8a8f98]">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 border-2 border-[#E63946] bg-[#E63946] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#c42b37]"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border-2 border-[#2A2E36] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-widest text-[#E8E4DF] transition-colors hover:border-[#E63946] hover:text-[#E63946]"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
