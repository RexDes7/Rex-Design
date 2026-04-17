import { Skill } from '@/types/skill';
import styles from '@/styles/SkillCard.module.css';

export interface SkillCardProps {
  skill: Skill;
}

export default function SkillCard({ skill }: SkillCardProps) {
  const { name, icon, description, variant = 'light' } = skill;

  return (
    <div className={`${styles.skillCard} ${variant === 'dark' ? styles.dark : ''}`}>
      {icon && (
        <span className={`material-symbols-outlined ${styles.icon}`}>
          {icon}
        </span>
      )}
      <span className={styles.name}>{name}</span>
      {description && (
        <p className={styles.description}>{description}</p>
      )}
    </div>
  );
}
