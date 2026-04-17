'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Project } from '@/types/project';
import styles from '@/styles/ProjectCard.module.css';

export interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
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
    variant = 'standard',
  } = project;

  const cardClasses = [
    styles.projectCard,
    wide ? styles.wide : '',
    featured ? styles.featured : '',
    variant === 'featured' ? styles.featured : '',
    variant === 'dark' ? styles.dark : '',
  ].filter(Boolean).join(' ');

  return (
    <article 
      className={cardClasses}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className={styles.imageContainer}>
        {!imageLoaded && (
          <div className={styles.imageSkeleton} aria-hidden="true" />
        )}
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes={wide ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          className={`${styles.projectImage} ${imageLoaded ? styles.imageLoaded : styles.imageLoading}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        
        <div className={styles.metadata}>
          <span className={styles.badge}>{category}</span>
          <span className={styles.badge}>{year}</span>
        </div>
      </div>
    </article>
  );
}
