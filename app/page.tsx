'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProjectCard from '@/components/ProjectCard'
import ProjectModal from '@/components/ProjectModal'
import ContactForm from '@/components/ContactForm'
import SectionLabel from '@/components/SectionLabel'
import ServiceCard from '@/components/ServiceCard'
import ProcessStep from '@/components/ProcessStep'
import TestimonialCard from '@/components/TestimonialCard'
import StatCard from '@/components/StatCard'
import ApproachCard from '@/components/ApproachCard'
import { FadeInWhenVisible, AnimatedSection } from '@/components/animations'
import { animationConfig } from '@/lib/animations/config'
import {
  approachPrinciples,
  services,
  processSteps,
  testimonials,
  stats,
} from '@/lib/data'
import { Project } from '@/types/project'
import styles from './page.module.css'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [contacts, setContacts] = useState({ email: '', phone: '', telegram: '' })

  useEffect(() => {
    let isMounted = true

    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success) {
          const normalizedProjects: Project[] = data.data.map((p: any) => {
            let images = p.images
            if (typeof images === 'string') {
              try { images = JSON.parse(images) } catch { images = [] }
            }
            return {
              id: p.id,
              title: p.title,
              description: p.description,
              category: p.category as Project['category'],
              categories: p.categories,
              year: p.year,
              image: p.image,
              imageAlt: p.image_alt || p.imageAlt || '',
              images: images,
              wide: p.wide,
              featured: p.featured
            }
          })
          setProjects(normalizedProjects)
        }
      })
      .catch(error => console.error('[HOME] Failed to load projects:', error))

    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success) {
          setContacts({
            email: data.data.email || '',
            phone: data.data.phone || '',
            telegram: data.data.telegram || '',
          })
        }
      })
      .catch(error => console.error('Failed to load contacts:', error))

    return () => { isMounted = false }
  }, [])

  // Featured projects: take up to 4
  const featuredProjects = projects.filter(p => p.featured).slice(0, 4)
  // Fallback to first 4 if no featured
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 4)
  const heroProject = displayProjects[0]
  const secondaryProjects = displayProjects.slice(1, 4)

  return (
    <main id="main-content" className={styles.main}>
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.heroBlob1} />
          <div className={styles.heroBlob2} />
          <div className={styles.heroGrid} />
        </div>

        <div className={styles.heroContainer}>
          <FadeInWhenVisible variant="slideUp" duration={animationConfig.durations.hero}>
            <div className={styles.heroContent}>
              <SectionLabel number="01">Портфолио · 2020—2026</SectionLabel>
              <h1 className={styles.heroTitle}>
                Дизайн, который<br />
                <span className={styles.heroAccent}>работает на бизнес</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Привет, я Рафаэль — мультидисциплинарный дизайнер. Создаю бренды,
                веб-интерфейсы и графику, которые решают задачи, а не просто
                красиво выглядят.
              </p>
              <div className={styles.heroCtas}>
                <Link href="/contact" className="btn btn-primary">
                  Начать проект
                  <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_forward
                  </span>
                </Link>
                <Link href="/cases" className="btn btn-secondary">
                  Смотреть работы
                </Link>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Hero project preview */}
          {heroProject && (
            <FadeInWhenVisible variant="slideUp" delay={0.15} duration={animationConfig.durations.slow}>
              <div className={styles.heroProjectWrap}>
                <ProjectCard
                  project={heroProject}
                  onClick={() => setSelectedProject(heroProject)}
                  variant="hero"
                  index={0}
                />
              </div>
            </FadeInWhenVisible>
          )}
        </div>

        {/* Stats strip */}
        <FadeInWhenVisible variant="fadeIn" duration={animationConfig.durations.slow}>
          <div className={styles.statsStrip}>
            <div className={styles.statsContainer}>
              {stats.map((stat, i) => (
                <div key={i} className={styles.statsItem}>
                  <span className={styles.statsValue}>{stat.value}</span>
                  <span className={styles.statsLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* ===================================================== */}
      {/* FRIENDLY INTRO */}
      {/* ===================================================== */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.introLayout}>
            <FadeInWhenVisible variant="slideUp">
              <SectionLabel number="02">Обо мне</SectionLabel>
            </FadeInWhenVisible>
            <div className={styles.introContent}>
              <FadeInWhenVisible variant="slideUp" delay={0.1}>
                <h2 className={styles.introHeading}>
                  Я не агентство.
                  <br />
                  Я — дизайнер, с которым
                  <br />
                  <span className={styles.accent}>говорят на одном языке</span>.
                </h2>
              </FadeInWhenVisible>
              <FadeInWhenVisible variant="slideUp" delay={0.2}>
                <p className={styles.introText}>
                  Шесть лет в дизайне, 50+ завершённых проектов — от логотипа для
                  локальной кофейни до редизайна сайта логистической компании.
                  Я работаю один, без менеджеров и junior-ов, поэтому вы общаетесь
                  напрямую с человеком, который делает ваш проект.
                </p>
              </FadeInWhenVisible>
              <FadeInWhenVisible variant="slideUp" delay={0.3}>
                <Link href="/about" className={styles.introLink}>
                  Больше обо мне
                  <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_forward
                  </span>
                </Link>
              </FadeInWhenVisible>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SELECTED WORKS */}
      {/* ===================================================== */}
      {secondaryProjects.length > 0 && (
        <section className={`${styles.section} ${styles.sectionSecondary}`}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <FadeInWhenVisible variant="slideUp">
                <SectionLabel number="03">Избранные работы</SectionLabel>
              </FadeInWhenVisible>
              <FadeInWhenVisible variant="slideUp" delay={0.1}>
                <h2 className={styles.sectionTitle}>
                  Кейсы, которыми<br />
                  <span className={styles.accent}>я горжусь</span>
                </h2>
              </FadeInWhenVisible>
              <FadeInWhenVisible variant="slideUp" delay={0.2}>
                <Link href="/cases" className={styles.sectionLink}>
                  Все проекты
                  <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_forward
                  </span>
                </Link>
              </FadeInWhenVisible>
            </div>

            <AnimatedSection
              staggerDelay={animationConfig.stagger.cards}
              className={styles.worksGrid}
            >
              {secondaryProjects.map((project, i) => (
                <FadeInWhenVisible
                  key={project.id}
                  variant="slideUp"
                  delay={i * 0.08}
                >
                  <ProjectCard
                    project={project}
                    onClick={() => setSelectedProject(project)}
                    variant="standard"
                    index={i + 1}
                  />
                </FadeInWhenVisible>
              ))}
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ===================================================== */}
      {/* APPROACH */}
      {/* ===================================================== */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FadeInWhenVisible variant="slideUp">
              <SectionLabel number="04">Подход</SectionLabel>
            </FadeInWhenVisible>
            <FadeInWhenVisible variant="slideUp" delay={0.1}>
              <h2 className={styles.sectionTitleDark}>
                Три принципа,<br />
                <span className={styles.accentOnDark}>которым я следую</span>
              </h2>
            </FadeInWhenVisible>
          </div>

          <AnimatedSection
            staggerDelay={animationConfig.stagger.cards}
            className={styles.approachGrid}
          >
            {approachPrinciples.map((principle, i) => (
              <FadeInWhenVisible
                key={principle.number}
                variant="slideUp"
                delay={i * 0.1}
              >
                <ApproachCard
                  number={principle.number}
                  title={principle.title}
                  description={principle.description}
                  icon={principle.icon}
                  index={i}
                />
              </FadeInWhenVisible>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ===================================================== */}
      {/* SERVICES */}
      {/* ===================================================== */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FadeInWhenVisible variant="slideUp">
              <SectionLabel number="05">Услуги</SectionLabel>
            </FadeInWhenVisible>
            <FadeInWhenVisible variant="slideUp" delay={0.1}>
              <h2 className={styles.sectionTitle}>
                Что я<br />
                <span className={styles.accent}>делаю</span>
              </h2>
            </FadeInWhenVisible>
          </div>

          <AnimatedSection
            staggerDelay={animationConfig.stagger.cards}
            className={styles.servicesGrid}
          >
            {services.map((service, i) => (
              <FadeInWhenVisible
                key={service.title}
                variant="slideUp"
                delay={i * 0.05}
              >
                <ServiceCard
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  index={i}
                />
              </FadeInWhenVisible>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PROCESS */}
      {/* ===================================================== */}
      <section className={`${styles.section} ${styles.sectionSecondary}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FadeInWhenVisible variant="slideUp">
              <SectionLabel number="06">Процесс</SectionLabel>
            </FadeInWhenVisible>
            <FadeInWhenVisible variant="slideUp" delay={0.1}>
              <h2 className={styles.sectionTitle}>
                Как мы<br />
                <span className={styles.accent}>будем работать</span>
              </h2>
            </FadeInWhenVisible>
          </div>

          <div className={styles.processLayout}>
            <FadeInWhenVisible variant="fadeIn">
              <div className={styles.processList}>
                {processSteps.map((step, i) => (
                  <ProcessStep
                    key={step.number}
                    number={step.number}
                    title={step.title}
                    description={step.description}
                    duration={step.duration}
                    isLast={i === processSteps.length - 1}
                  />
                ))}
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible variant="slideUp" delay={0.2}>
              <div className={styles.processAside}>
                <div className={styles.processAsideCard}>
                  <h3 className={styles.processAsideTitle}>
                    Не люблю сюрпризы
                    <br />в работе
                  </h3>
                  <p className={styles.processAsideText}>
                    Поэтому вы видите процесс на каждом этапе: от первого наброска
                    до финальных файлов. Без чёрных ящиков и «доверьтесь, я художник».
                  </p>
                  <div className={styles.processAsideMeta}>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      schedule
                    </span>
                    Средний срок проекта — 2–3 недели
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* TESTIMONIALS */}
      {/* ===================================================== */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <FadeInWhenVisible variant="slideUp">
              <SectionLabel number="07">Отзывы</SectionLabel>
            </FadeInWhenVisible>
            <FadeInWhenVisible variant="slideUp" delay={0.1}>
              <h2 className={styles.sectionTitle}>
                Что говорят<br />
                <span className={styles.accent}>клиенты</span>
              </h2>
            </FadeInWhenVisible>
          </div>

          <AnimatedSection
            staggerDelay={animationConfig.stagger.cards}
            className={styles.testimonialsGrid}
          >
            {testimonials.map((t, i) => (
              <FadeInWhenVisible
                key={i}
                variant="slideUp"
                delay={i * 0.1}
              >
                <TestimonialCard
                  quote={t.quote}
                  author={t.author}
                  role={t.role}
                  project={t.project}
                />
              </FadeInWhenVisible>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ===================================================== */}
      {/* CTA — dark section */}
      {/* ===================================================== */}
      <section className={styles.ctaSection}>
        <div className="container">
          <FadeInWhenVisible variant="slideUp">
            <div className={styles.ctaLayout}>
              <div className={styles.ctaLeft}>
                <SectionLabel number="08">Контакты</SectionLabel>
                <h2 className={styles.ctaTitle}>
                  Давайте создадим
                  <br />
                  что-то <span className={styles.ctaAccent}>запоминающееся</span>
                </h2>
                <p className={styles.ctaText}>
                  Открыт к новым проектам с 2020 года. Расскажите о задаче —
                  отвечу в течение 24 часов.
                </p>
                {contacts.email && (
                  <a href={`mailto:${contacts.email}`} className={styles.ctaEmail}>
                    {contacts.email}
                  </a>
                )}
              </div>
              <FadeInWhenVisible variant="slideUp" delay={0.15}>
                <div className={styles.ctaFormWrap}>
                  <ContactForm />
                </div>
              </FadeInWhenVisible>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  )
}
