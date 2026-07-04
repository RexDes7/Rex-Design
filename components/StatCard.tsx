import styles from '@/styles/StatCard.module.css';

export interface StatCardProps {
  value: string;
  label: string;
  description?: string;
  variant?: 'default' | 'dark';
}

export default function StatCard({
  value,
  label,
  description,
  variant = 'default',
}: StatCardProps) {
  return (
    <article
      className={`${styles.card} ${
        variant === 'dark' ? styles.dark : ''
      }`}
    >
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
      {description && <p className={styles.description}>{description}</p>}
    </article>
  );
}
