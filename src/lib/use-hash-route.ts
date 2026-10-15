/**
 * Hash-роутер: весь сайт живёт на маршруте `/` (ограничение песочницы).
 * Виды: #/ (главная), #/cases, #/about, #/contact, #/admin
 *
 * useSyncExternalStore: на сервере и при гидратации снимок всегда '/'
 * (hash не отправляется на сервер), после гидратации React сам подхватит
 * реальный hash — без hydration mismatch на прямых заходах с #/….
 */
'use client'

import { useCallback, useSyncExternalStore } from 'react'
import type { Route } from './types'

const KNOWN_ROUTES: Route[] = ['/', '/cases', '/about', '/contact', '/admin']

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#/, '') || '/'
  const path = clean.split('?')[0] || '/'
  const route = (KNOWN_ROUTES.includes(path as Route) ? path : '/') as Route
  return route
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener('hashchange', onStoreChange)
  return () => window.removeEventListener('hashchange', onStoreChange)
}

/** Клиентский снимок — текущий hash */
function getSnapshot(): Route {
  return parseHash(window.location.hash)
}

/** Серверный снимок — всегда главная (hash недоступен на сервере) */
function getServerSnapshot(): Route {
  return '/'
}

export function useHashRoute() {
  const route = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const navigate = useCallback((next: Route) => {
    window.location.hash = next === '/' ? '/' : next
  }, [])

  return { route, navigate }
}

export function navigateTo(next: Route) {
  window.location.hash = next === '/' ? '/' : next
}

/** Заголовки страниц — паритет с metadata оригинала */
export const ROUTE_TITLES: Record<Route, string> = {
  '/': 'REX DESIGN — Дизайн студия | Брендинг, Веб-дизайн, Типографика',
  '/cases': 'Портфолио — избранные работы дизайнера | REX DESIGN',
  '/about': 'Обо мне — дизайнер Рафаэль Апарян | REX DESIGN',
  '/contact': 'Контакты — заказать дизайн проект | REX DESIGN',
  '/admin': 'Административная панель | REX DESIGN',
}
