'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';
import SectionLabel from '@/components/SectionLabel';
import { FadeInWhenVisible } from '@/components/animations';
import { animationConfig } from '@/lib/animations/config';
import styles from './page.module.css';

import { Project } from '@/types/project';

type Category = 'Все проекты' | 'Веб-Дизайн' | 'Брендинг' | 'Типографика' | 'UI/UX' | 'Инфографика' | 'Полиграфия' | 'Иллюстрация' | 'Анимация';
type SortOption = 'popular' | 'newest' | 'oldest' | 'recently-added';

interface SortConfig {
  value: SortOption;
  label: string;
  shortLabel: string;
}

const SORT_OPTIONS: SortConfig[] = [
  { value: 'popular', label: 'Популярные', shortLabel: 'Популярные' },
  { value: 'newest', label: 'Сначала новые (по году)', shortLabel: 'Новые' },
  { value: 'oldest', label: 'Сначала старые (по году)', shortLabel: 'Старые' },
  { value: 'recently-added', label: 'По дате добавления', shortLabel: 'Недавно добавленные' },
];

interface ApiProject {
  id: string;
  title: string;
  description: string;
  category: Project['category'];
  categories?: string[] | string;
  year: string;
  image: string;
  image_alt?: string;
  imageAlt?: string;
  images?: string[] | string;
  wide?: boolean | number;
  featured?: boolean | number;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

function normalizeProject(p: ApiProject): Project & { createdAt?: string; displayOrder?: number; featuredRaw?: number } {
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
    category: p.category,
    categories: categories,
    year: p.year,
    image: p.image,
    imageAlt: p.image_alt || p.imageAlt || '',
    images: images,
    wide: Boolean(p.wide),
    featured: Boolean(p.featured),
    createdAt: p.created_at,
    displayOrder: p.display_order,
    featuredRaw: Number(p.featured) || 0,
  };
}

function sortProjects(
  projects: (Project & { createdAt?: string; displayOrder?: number; featuredRaw?: number })[],
  sort: SortOption
) {
  const arr = [...projects];
  switch (sort) {
    case 'popular':
      // Featured first, then by display_order
      return arr.sort((a, b) => {
        const aFeat = a.featuredRaw || 0;
        const bFeat = b.featuredRaw || 0;
        if (aFeat !== bFeat) return bFeat - aFeat;
        const aOrder = a.displayOrder || 0;
        const bOrder = b.displayOrder || 0;
        return bOrder - aOrder;
      });
    case 'newest':
      // By year descending (newest first)
      return arr.sort((a, b) => {
        const aYear = parseInt(a.year) || 0;
        const bYear = parseInt(b.year) || 0;
        return bYear - aYear;
      });
    case 'oldest':
      // By year ascending (oldest first)
      return arr.sort((a, b) => {
        const aYear = parseInt(a.year) || 0;
        const bYear = parseInt(b.year) || 0;
        return aYear - bYear;
      });
    case 'recently-added':
      // By created_at descending (most recently added first)
      return arr.sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });
    default:
      return arr;
  }
}

export default function CasesPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('Все проекты');
  const [projects, setProjects] = useState<(Project & { createdAt?: string; displayOrder?: number; featuredRaw?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('popular');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const normalizedProjects = data.data.map(normalizeProject);
          setProjects(normalizedProjects);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load projects:', error);
        setLoading(false);
      });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const sortedProjects = sortProjects(filteredProjects, sortOption);

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortOption)?.label || 'Популярные';

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
              Множество проектов за шесть лет: от айдентики для локальных
              брендов до веб-сайтов и инфографики для маркетплейсов. Каждый
              сделан под конкретную задачу и доведён до результата. Выбирайте
              направление или посмотрите все работы целиком.
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FILTER BAR (sticky) — categories + sort dropdown */}
      {/* ===================================================== */}
      <div className={styles.filterSticky}>
        <div className={styles.filterContainer}>
          <div className={styles.filterBarRow}>
            {/* Categories scroll */}
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

            {/* Sort dropdown */}
            <div className={styles.sortWrap} ref={sortDropdownRef}>
              <button
                className={`${styles.sortButton} ${sortDropdownOpen ? styles.sortButtonOpen : ''}`}
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                aria-label="Сортировка"
                aria-expanded={sortDropdownOpen}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  sort
                </span>
                <span className={styles.sortButtonText}>{currentSortLabel}</span>
                <span className={`${styles.sortChevron} ${sortDropdownOpen ? styles.sortChevronOpen : ''}`} aria-hidden="true">
                  <span className="material-symbols-outlined">expand_more</span>
                </span>
              </button>

              {sortDropdownOpen && (
                <div className={styles.sortDropdown} role="listbox">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      className={`${styles.sortOption} ${
                        sortOption === option.value ? styles.sortOptionActive : ''
                      }`}
                      onClick={() => {
                        setSortOption(option.value);
                        setSortDropdownOpen(false);
                      }}
                      role="option"
                      aria-selected={sortOption === option.value}
                    >
                      <span>{option.label}</span>
                      {sortOption === option.value && (
                        <span className="material-symbols-outlined" aria-hidden="true">
                          check
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* MAGAZINE GRID */}
      {/* ===================================================== */}
      <section className={styles.projectsSection}>
        <div className={styles.projectsContainer}>
          {sortedProjects.length > 0 ? (
            <div className={styles.projectsGrid}>
              {sortedProjects.map((project, i) => (
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
