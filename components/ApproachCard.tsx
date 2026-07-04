'use client';

import styles from '@/styles/ApproachCard.module.css';

export interface ApproachCardProps {
  number: string;
  title: string;
  description: string;
  icon: string;
  index?: number;
}

export default function ApproachCard({
  number,
  title,
  description,
  icon,
  index = 0,
}: ApproachCardProps) {
  return (
    <article
      className={styles.card}
      style={{ '--card-index': index } as React.CSSProperties}
    >
      <div className={styles.topRow}>
        <div className={styles.iconWrap}>
          <span className="material-symbols-outlined" aria-hidden="true">
            {icon}
          </span>
        </div>
        <span className={styles.number}>{number}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </article>
  );
}
