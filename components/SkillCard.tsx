'use client';

import { Skill } from '@/types/skill';
import styles from '@/styles/SkillCard.module.css';

export interface SkillCardProps {
  skill: Skill;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const { name, description, variant, icon } = skill;
  return (
    <article
      className={`${styles.card} ${variant === 'dark' ? styles.dark : ''}`}
    >
      <div className={styles.iconWrap} aria-hidden="true">
        <span className="material-symbols-outlined">
          {icon || 'auto_awesome'}
        </span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </article>
  );
}
