/**
 * Промо-попап — логика портирована 1:1 с оригинала:
 * 1) 'first' — через 30с после загрузки (1 раз/сессия, сброс при возврате на главную)
 * 2) 'second' — после 2 мин неактивности (1 раз/сессию)
 * 3) 'recurring' — каждые 10 мин неактивности
 * Уважает data-modal-open (модал проекта) и событие rex:activity.
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { navigateTo } from '@/lib/use-hash-route'
import { Sparkle } from './decor'

const STORAGE_KEY_30S = 'rex_popup_30s_shown'
const STORAGE_KEY_2MIN = 'rex_popup_2min_shown'

const FIRST_POPUP_DELAY = 30000 // 30 секунд
const SECOND_POPUP_INACTIVITY = 120000 // 2 минуты
const RECURRING_POPUP_INACTIVITY = 600000 // 10 минут
const INACTIVITY_CHECK_INTERVAL = 10000 // проверка каждые 10с

type PopupType = 'first' | 'second' | 'recurring'

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [popupType, setPopupType] = useState<PopupType>('first')
  const lastActivityRef = useRef<number>(Date.now())
  const firstPopupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inactivityCheckerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const routeRef = useRef<string>('')

  // Текущий hash-роут (вместо usePathname)
  useEffect(() => {
    routeRef.current = window.location.hash || '#/'
    const onHash = () => {
      routeRef.current = window.location.hash || '#/'
      lastActivityRef.current = Date.now()
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Реакция на активность (открытие модала, отправка формы)
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now()
    }
    window.addEventListener('rex:activity', handleActivity)
    return () => window.removeEventListener('rex:activity', handleActivity)
  }, [])

  // Первый попап: 30с после монтирования. На главной — сброс флагов.
  useEffect(() => {
    if (routeRef.current === '#/' || routeRef.current === '' || routeRef.current === '#') {
      sessionStorage.removeItem(STORAGE_KEY_30S)
      sessionStorage.removeItem(STORAGE_KEY_2MIN)
    }
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY_30S)
    if (alreadyShown) return

    firstPopupTimerRef.current = setTimeout(() => {
      if (document.body.hasAttribute('data-modal-open')) return
      setPopupType('first')
      setIsOpen(true)
      sessionStorage.setItem(STORAGE_KEY_30S, 'true')
    }, FIRST_POPUP_DELAY)

    return () => {
      if (firstPopupTimerRef.current) clearTimeout(firstPopupTimerRef.current)
    }
  }, [])

  // Проверка неактивности каждые 10с
  useEffect(() => {
    inactivityCheckerRef.current = setInterval(() => {
      if (isOpen) return
      if (document.body.hasAttribute('data-modal-open')) return

      const now = Date.now()
      const inactiveFor = now - lastActivityRef.current
      const shown2min = sessionStorage.getItem(STORAGE_KEY_2MIN)

      if (!shown2min && inactiveFor >= SECOND_POPUP_INACTIVITY) {
        setPopupType('second')
        setIsOpen(true)
        sessionStorage.setItem(STORAGE_KEY_2MIN, 'true')
        lastActivityRef.current = now
      } else if (shown2min && inactiveFor >= RECURRING_POPUP_INACTIVITY) {
        setPopupType('recurring')
        setIsOpen(true)
        lastActivityRef.current = now
      }
    }, INACTIVITY_CHECK_INTERVAL)

    return () => {
      if (inactivityCheckerRef.current) clearInterval(inactivityCheckerRef.current)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    lastActivityRef.current = Date.now()
  }

  if (!isOpen) return null

  const content = {
    first: {
      title: 'Обсудим ваш проект?',
      text: 'Расскажите о задаче — отвечу в течение 24 часов с предварительной оценкой и планом работы.',
    },
    second: {
      title: 'Ещё подумываете?',
      text: 'Если есть вопросы или нужны уточнения — напишите, помогу разобраться без обязательств.',
    },
    recurring: {
      title: 'Я всё ещё на связи',
      text: 'Свободен для новых проектов. Напишите — обсудим детали и сроки.',
    },
  }[popupType]

  return (
    <div
      className="fixed inset-0 z-[400] flex items-end justify-center bg-ink/60 p-4 backdrop-blur-[2px] sm:items-center"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
    >
      <div
        className="card-rex-flat hard-shadow relative w-full max-w-md p-7 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          aria-label="Закрыть"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center border-2 border-ink bg-paper transition-colors hover:bg-rex-red hover:border-rex-red hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <Sparkle className="absolute -left-4 -top-4 float-slow text-rex-red" size={30} />
        <p className="mono-label text-rex-gray">REX / {popupType === 'first' ? 'hello' : popupType === 'second' ? 'вопросы' : 'на связи'}</p>

        <h3 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.02] tracking-tight">
          {content.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">{content.text}</p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              handleClose()
              navigateTo('/contact')
            }}
            className="btn-rex flex-1 justify-center"
          >
            Начать проект <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={handleClose} className="btn-rex-ghost flex-1 justify-center">
            Позже
          </button>
        </div>
      </div>
    </div>
  )
}
