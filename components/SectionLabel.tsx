import styles from '@/styles/SectionLabel.module.css';

export interface SectionLabelProps {
  children: React.ReactNode;
  number?: string;
}

export default function SectionLabel({ children, number }: SectionLabelProps) {
  return (
    <span className={styles.label}>
      {number && <span className={styles.number}>{number}</span>}
      <span className={styles.dot} aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}
