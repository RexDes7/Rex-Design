'use client';

import { useState, useEffect } from 'react';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';
import styles from './page.module.css';

import { Project } from '@/types/project';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Category = 'Все Проекты' | 'Веб-Дизайн' | 'Брендинг' | 'Типографика' | 'UI/UX';

export default function CasesPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('Все Проекты');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    // Load projects from API
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
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
          setProjects(normalizedProjects);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load projects:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories: Category[] = [
    'Все Проекты',
    'Веб-Дизайн',
    'Брендинг',
    'Типографика',
    'UI/UX',
  ];

  const filteredProjects = activeFilter === 'Все Проекты'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  const handleFilterSelect = (category: Category) => {
    setActiveFilter(category);
    setIsFilterMenuOpen(false);
  };

  if (loading) {
    return (
      <main className={styles.casesPage}>
        <div className={styles.loadingState}>
          Загрузка проектов...
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className={styles.casesPage}>
      {/* Decorative Grid Lines */}
      <div className={styles.decorativeGridLeft} aria-hidden="true"></div>
      <div className={styles.decorativeGridRight} aria-hidden="true"></div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.headline}>
          КЕЙСЫ <span className={styles.accent}><span className={styles.yearFont}>2020-2026</span></span>
        </h1>
      </section>

      {/* Filter Bar */}
      <section className={`${styles.filterSection} ${isScrolled ? styles.hidden : ''}`}>
        <div className={styles.filterBar}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.filterButton} ${
                activeFilter === category ? styles.active : ''
              }`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Floating Filter Button */}
      <div className={`${styles.floatingFilterContainer} ${isScrolled ? styles.visible : ''}`}>
        <span className={styles.floatingFilterLabel}>КАТЕГОРИИ</span>
        <button
          className={styles.floatingFilterButton}
          onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
          aria-label="Открыть фильтры"
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>

      {/* Filter Menu Dropdown */}
      {isFilterMenuOpen && (
        <>
          <div 
            className={styles.filterMenuOverlay}
            onClick={() => setIsFilterMenuOpen(false)}
          />
          <div className={styles.filterMenu}>
            <div className={styles.filterMenuHeader}>
              <h3>Фильтры</h3>
              <button
                className={styles.closeButton}
                onClick={() => setIsFilterMenuOpen(false)}
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>
            <div className={styles.filterMenuList}>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${styles.filterMenuItem} ${
                    activeFilter === category ? styles.active : ''
                  }`}
                  onClick={() => handleFilterSelect(category)}
                >
                  {category}
                  {activeFilter === category && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Projects Grid */}
      <section className={styles.projectsSection}>
        <div className={styles.projectsGrid}>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              Проекты не найдены
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaHeadline}>
          ЕСТЬ ПРОЕКТ <span className={styles.accent}>ДЛЯ МЕНЯ?</span>
        </h2>
        <p className={styles.ctaText}>
          Готов обсудить ваш проект и предложить решение
        </p>
        <a href="/contact" className={styles.ctaButton}>
          СВЯЗАТЬСЯ
        </a>
      </section>

      {selectedProject && (
        <ProjectModal 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </main>
  );
}
