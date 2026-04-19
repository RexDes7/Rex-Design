'use client';

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import ManifestoCard from '@/components/ManifestoCard'
import ProjectCard from '@/components/ProjectCard'
import ProjectModal from '@/components/ProjectModal'
import ContactForm from '@/components/ContactForm'
import SpaceEffects from '@/components/SpaceEffects'
import { FadeInWhenVisible, AnimatedSection } from '@/components/animations'
import { manifestoPrinciples } from '@/lib/data'
import { animationConfig } from '@/lib/animations/config'
import { Project } from '@/types/project'
import styles from './page.module.css'

// Динамический импорт 3D компонента для оптимизации
const MetallicSphere = dynamic(() => import('@/components/MetallicSphere'), {
  ssr: false,
  loading: () => null
})

export default function Home() {
  const [fabBottom, setFabBottom] = useState('2rem')
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [contacts, setContacts] = useState({ email: '', phone: '', telegram: '' })

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer')
      if (!footer) return

      const footerRect = footer.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const fabHeight = 80 // 5rem = 80px
      const fabMargin = 32 // 2rem = 32px

      if (footerRect.top < windowHeight) {
        const overlap = windowHeight - footerRect.top
        setFabBottom(`${fabMargin + overlap}px`)
      } else {
        setFabBottom('2rem')
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    let isMounted = true;
    
    // Load projects from API
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        console.log('[HOME] API Response:', data);
        if (isMounted && data.success) {
          // Normalize imageAlt field and map to Project type
          const normalizedProjects: Project[] = data.data.map((p: any) => {
            // Parse images if it's a string
            let images = p.images;
            if (typeof images === 'string') {
              try {
                images = JSON.parse(images);
              } catch (e) {
                images = [];
              }
            }
            
            return {
              id: p.id,
              title: p.title,
              description: p.description,
              category: p.category as Project['category'],
              year: p.year,
              image: p.image,
              imageAlt: p.image_alt || p.imageAlt || '',
              images: images,
              wide: p.wide,
              featured: p.featured
            };
          });
          console.log('[HOME] Normalized projects:', normalizedProjects);
          setProjects(normalizedProjects);
        }
      })
      .catch(error => {
        console.error('[HOME] Failed to load projects:', error);
      });

    // Load contacts from API
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success) {
          setContacts({
            email: data.data.email || '',
            phone: data.data.phone || '',
            telegram: data.data.telegram || ''
          });
        }
      })
      .catch(error => {
        console.error('Failed to load contacts:', error);
      });
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Get featured projects (projects marked as featured)
  const featuredProjects = projects.filter(p => p.featured).slice(0, 6); // Максимум 6 избранных

  return (
    <main id="main-content" className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <SpaceEffects />
        <MetallicSphere />
        <div className={styles.heroContent}>
          <FadeInWhenVisible 
            variant="slideUp" 
            duration={animationConfig.durations.hero}
          >
            <h1 className={styles.heroTitle}>
              <strong>REX DESIGN</strong> <span className={styles.heroTitleLight}>- МЫ ЗАДАЕМ ТРЕНДЫ</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Лучшее качество для наших клиентов
            </p>
          </FadeInWhenVisible>
          <AnimatedSection staggerDelay={animationConfig.stagger.buttons}>
            <div className={styles.heroButtons}>
              <a href="/contact" className={styles.heroButton}>
                СДЕЛАТЬ ЗАКАЗ
              </a>
              <a href="/cases" className={`${styles.heroButton} ${styles.heroButtonSecondary}`}>
                ПОСМОТРЕТЬ ВСЕ РАБОТЫ
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Manifesto Section */}
      <FadeInWhenVisible variant="fadeIn" duration={animationConfig.durations.slow}>
        <section className={styles.manifestoSection}>
          <AnimatedSection 
            staggerDelay={animationConfig.stagger.cards}
            className={styles.manifestoGrid}
          >
            {manifestoPrinciples.map((principle) => (
              <FadeInWhenVisible 
                key={principle.title}
                variant="fadeIn"
                duration={animationConfig.durations.normal}
              >
                <ManifestoCard principle={principle} />
              </FadeInWhenVisible>
            ))}
          </AnimatedSection>
        </section>
      </FadeInWhenVisible>

      {/* Featured Projects Section */}
      <FadeInWhenVisible variant="slideUp" duration={animationConfig.durations.slow}>
        <section className={styles.projectsSection}>
          <div className={styles.container}>
            <div className={styles.projectsHeader}>
              <h2 className={styles.sectionTitle}>
                ИЗБРАННЫЕ ПРОЕКТЫ
              </h2>
              <a href="/cases" className={styles.allCasesButton}>
                ВСЕ КЕЙСЫ
              </a>
            </div>
            <AnimatedSection 
              staggerDelay={animationConfig.stagger.cards}
              className={styles.projectsGrid}
            >
              {featuredProjects.map((project) => (
                <FadeInWhenVisible 
                  key={project.id}
                  variant="slideUp"
                  duration={animationConfig.durations.normal}
                >
                  <ProjectCard 
                    project={project}
                    onClick={() => setSelectedProject(project)}
                  />
                </FadeInWhenVisible>
              ))}
            </AnimatedSection>
          </div>
        </section>
      </FadeInWhenVisible>

      {/* Contact Section */}
      <FadeInWhenVisible variant="fadeIn" duration={animationConfig.durations.slow}>
        <section className={styles.contactSection}>
          <div className={styles.container}>
            <div className={styles.contactLayout}>
              <div className={styles.contactInfo}>
                <h2 className={styles.contactTitle}>
                  ДАВАЙТЕ<br />
                  РАБОТАТЬ<br />
                  ВМЕСТЕ
                </h2>
                
                <div className={styles.contactDetails}>
                  <div className={styles.contactItem}>
                    <span className="material-symbols-outlined" aria-hidden="true">
                      mail
                    </span>
                    <div>
                      <p className={styles.contactLabel}>EMAIL</p>
                      <a href={`mailto:${contacts.email}`} className={styles.contactLink}>
                        {contacts.email || 'Loading...'}
                      </a>
                    </div>
                  </div>
                  
                  {contacts.phone && (
                    <div className={styles.contactItem}>
                      <span className="material-symbols-outlined" aria-hidden="true">
                        phone
                      </span>
                      <div>
                        <p className={styles.contactLabel}>ТЕЛЕФОН</p>
                        <a href={`tel:${contacts.phone.replace(/\D/g, '')}`} className={styles.contactLink}>
                          {contacts.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.contactFormWrapper}>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </FadeInWhenVisible>

      {/* FAB Button */}
      <button 
        className={styles.fab} 
        style={{ bottom: fabBottom }}
        aria-label="Quick contact"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          add
        </span>
      </button>

      {selectedProject && (
        <ProjectModal 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  )
}
