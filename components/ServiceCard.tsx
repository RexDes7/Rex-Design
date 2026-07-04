'use client';

import { useState } from 'react';
import styles from '@/styles/ServiceCard.module.css';

export interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  index?: number;
}

export default function ServiceCard({ icon, title, description, index = 0 }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      className={styles.card}
      style={{ '--card-index': index } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.iconWrap}>
        <span className="material-symbols-outlined" aria-hidden="true">
          {icon}
        </span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div
        className={styles.arrow}
        aria-hidden="true"
        data-hovered={hovered}
      >
        <span className="material-symbols-outlined">arrow_outward</span>
      </div>
    </article>
  );
}
