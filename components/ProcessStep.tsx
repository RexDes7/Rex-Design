import styles from '@/styles/ProcessStep.module.css';

export interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
  duration?: string;
  isLast?: boolean;
}

export default function ProcessStep({
  number,
  title,
  description,
  duration,
  isLast = false,
}: ProcessStepProps) {
  return (
    <div className={styles.step}>
      <div className={styles.left}>
        <div className={styles.numberWrap}>
          <span className={styles.number}>{number}</span>
        </div>
        {!isLast && <div className={styles.line} aria-hidden="true" />}
      </div>
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{title}</h3>
          {duration && <span className={styles.duration}>{duration}</span>}
        </div>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
