'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Project } from '@/types/project';
import styles from '@/styles/ProjectCard.module.css';

export interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  variant?: 'hero' | 'standard' | 'wide' | 'compact';
  index?: number;
}

export default function ProjectCard({
  project,
  onClick,
  variant = 'standard',
  index = 0,
}: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const {
    title,
    description,
    category,
    year,
    image,
    imageAlt,
    wide = false,
    featured = false,
  } = project;

  // Effective variant: 'hero' wins, then featured → 'hero'-like, else keep given
  const effectiveVariant = featured && variant === 'standard' ? 'wide' : variant;

  const cardClasses = [
    styles.projectCard,
    styles[`variant_${effectiveVariant}`],
    wide ? styles.wide : '',
    featured ? styles.featured : '',
  ].filter(Boolean).join(' ');

  return (
    <article
      className={cardClasses}
      onClick={onClick}
      style={{ '--card-index': index } as React.CSSProperties}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Открыть проект: ${title}`}
    >
      <div className={styles.imageContainer}>
        {!imageLoaded && (
          <div className={styles.imageSkeleton} aria-hidden="true" />
        )}
        <Image
          src={image}
          alt={imageAlt || title}
          fill
          sizes={
            effectiveVariant === 'hero'
              ? '(max-width: 768px) 100vw, 100vw'
              : effectiveVariant === 'wide'
              ? '(max-width: 768px) 100vw, 66vw'
              : '(max-width: 768px) 100vw, 33vw'
          }
          className={`${styles.projectImage} ${
            imageLoaded ? styles.imageLoaded : styles.imageLoading
          }`}
          onLoad={() => setImageLoaded(true)}
          priority={effectiveVariant === 'hero'}
        />
        <div className={styles.imageOverlay} aria-hidden="true" />

        <div className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          {category}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.metaRow}>
          <span className={styles.year}>{year}</span>
          <span className={styles.viewCta} aria-hidden="true">
            <span className="material-symbols-outlined">arrow_outward</span>
          </span>
        </div>
        <h3 className={styles.title}>{title}</h3>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
      </div>
    </article>
  );
}
