'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';
import SectionLabel from '@/components/SectionLabel';
import { FadeInWhenVisible } from '@/components/animations';
import { animationConfig } from '@/lib/animations/config';
import styles from './page.module.css';

import { Project } from '@/types/project';

type Category = 'Все проекты' | 'Веб-Дизайн' | 'Брендинг' | 'Типографика' | 'UI/UX' | 'Инфографика' | 'Полиграфия' | 'Иллюстрация' | 'Анимация';

export default function CasesPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('Все проекты');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const normalizedProjects: Project[] = data.data.map((p: any) => {
            let images = p.images;
            if (typeof images === 'string') {
              try { images = JSON.parse(images) } catch { images = [] }
            }
            let categories = p.categories;
            if (typeof categories === 'string') {
              try { categories = JSON.parse(categories) } catch { categories = [p.category] }
            } else if (!categories) {
              categories = [p.category];
            }
            return {
              id: p.id,
              title: p.title,
              description: p.description,
              category: p.category as Project['category'],
              categories: categories,
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

  const categories: Category[] = [
    'Все проекты',
    'Веб-Дизайн',
    'Брендинг',
    'Типографика',
    'UI/UX',
    'Инфографика',
    'Полиграфия',
    'Иллюстрация',
    'Анимация',
  ];

  const filteredProjects = activeFilter === 'Все проекты'
    ? projects
    : projects.filter(project => {
        if (project.categories && Array.isArray(project.categories)) {
          return project.categories.includes(activeFilter);
        }
        return project.category === activeFilter;
      });

  // Determine magazine variant for each card based on index
  const getVariant = (index: number): 'hero' | 'wide' | 'standard' | 'compact' => {
    if (index === 0) return 'hero';
    if (index % 5 === 0 && index > 0) return 'wide';
    if (index % 3 === 2) return 'compact';
    return 'standard';
  };

  if (loading) {
    return (
      <main className={styles.casesPage}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner} aria-hidden="true" />
          <span>Загрузка проектов...</span>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className={styles.casesPage}>
      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.heroBlob} />
          <div className={styles.heroGrid} />
        </div>
        <div className={styles.heroContainer}>
          <FadeInWhenVisible variant="slideUp">
            <SectionLabel number="01">Портфолио · 2020—2026</SectionLabel>
          </FadeInWhenVisible>
          <FadeInWhenVisible variant="slideUp" delay={0.1}>
            <h1 className={styles.heroTitle}>
              Избранные работы
              <br />
              <span className={styles.accent}>по направлениям</span>
            </h1>
          </FadeInWhenVisible>
          <FadeInWhenVisible variant="slideUp" delay={0.2}>
            <p className={styles.heroSubtitle}>
              {projects.length} проектов за 6 лет — от логотипов и айдентики
              до веб-сайтов и инфографики для маркетплейсов. Выберите направление
              или посмотрите все работы.
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FILTER BAR (sticky) */}
      {/* ===================================================== */}
      <div className={styles.filterSticky}>
        <div className={styles.filterContainer}>
          <div className={styles.filterScroll}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.filterButton} ${
                  activeFilter === category ? styles.filterActive : ''
                }`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
                {activeFilter === category && (
                  <span className={styles.filterCount}>
                    {filteredProjects.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* MAGAZINE GRID */}
      {/* ===================================================== */}
      <section className={styles.projectsSection}>
        <div className={styles.projectsContainer}>
          {filteredProjects.length > 0 ? (
            <div className={styles.projectsGrid}>
              {filteredProjects.map((project, i) => (
                <FadeInWhenVisible
                  key={project.id}
                  variant="slideUp"
                  delay={(i % 3) * 0.08}
                >
                  <ProjectCard
                    project={project}
                    onClick={() => setSelectedProject(project)}
                    variant={getVariant(i)}
                    index={i}
                  />
                </FadeInWhenVisible>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <span className="material-symbols-outlined">search_off</span>
              </div>
              <h3 className={styles.emptyTitle}>Проекты не найдены</h3>
              <p className={styles.emptyText}>
                Попробуйте выбрать другую категорию.
              </p>
              <button
                className="btn btn-secondary"
                onClick={() => setActiveFilter('Все проекты')}
              >
                Сбросить фильтр
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================== */}
      {/* CTA */}
      {/* ===================================================== */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <FadeInWhenVisible variant="slideUp">
            <SectionLabel number="02">Контакты</SectionLabel>
          </FadeInWhenVisible>
          <FadeInWhenVisible variant="slideUp" delay={0.1}>
            <h2 className={styles.ctaTitle}>
              Не нашли нужное?
              <br />
              <span className={styles.accent}>Давайте поговорим</span>
            </h2>
          </FadeInWhenVisible>
          <FadeInWhenVisible variant="slideUp" delay={0.2}>
            <p className={styles.ctaText}>
              Я делаю проекты под ключ — от идеи до финальных файлов.
              Расскажите о задаче, и я предложу решение.
            </p>
          </FadeInWhenVisible>
          <FadeInWhenVisible variant="slideUp" delay={0.3}>
            <Link href="/contact" className="btn btn-primary">
              Начать проект
              <span className="material-symbols-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
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
  );
}
