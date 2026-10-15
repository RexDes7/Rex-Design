/**
 * REX DESIGN — SPA на единственном маршруте `/`.
 * Hash-навигация: #/ главная, #/cases портфолио, #/about обо мне,
 * #/contact контакты, #/admin админ-панель.
 */
'use client'

import { useEffect, useState } from 'react'
import { useHashRoute, ROUTE_TITLES } from '@/lib/use-hash-route'
import { trackPageview } from '@/lib/api'
import type { Project } from '@/lib/types'
import Navigation from '@/components/site/Navigation'
import Footer from '@/components/site/Footer'
import HomeView from '@/components/site/HomeView'
import CasesView from '@/components/site/CasesView'
import AboutView from '@/components/site/AboutView'
import ContactView from '@/components/site/ContactView'
import ProjectModal from '@/components/site/ProjectModal'
import PromoPopup from '@/components/site/PromoPopup'
import AdminApp from '@/components/admin/AdminApp'

export default function Page() {
  const { route } = useHashRoute()
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  // Заголовок документа — SEO/UX паритет с оригиналом
  useEffect(() => {
    document.title = ROUTE_TITLES[route] || ROUTE_TITLES['/']
  }, [route])

  // Трекинг просмотров (кроме админки) — как AnalyticsTracker оригинала
  useEffect(() => {
    if (route === '/admin') return
    trackPageview(route)
  }, [route])

  // Админ-панель — отдельный корень (тёмная тема, без шапки/футера сайта)
  if (route === '/admin') {
    return (
      <div className="admin-root min-h-screen bg-[#0A0A0A] text-[#E8E4DF]">
        <AdminApp />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      {/* Зерно бумаги поверх всего сайта */}
      <div className="noise-overlay" aria-hidden="true" />

      <Navigation route={route} />

      {route === '/' && <HomeView onOpenProject={setActiveProject} />}
      {route === '/cases' && <CasesView onOpenProject={setActiveProject} />}
      {route === '/about' && <AboutView />}
      {route === '/contact' && <ContactView />}

      <Footer />
      <PromoPopup />

      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </div>
  )
}
