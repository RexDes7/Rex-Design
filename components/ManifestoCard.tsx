import { ManifestoPrinciple } from '@/types/manifesto';
import styles from '@/styles/ManifestoCard.module.css';

export interface ManifestoCardProps {
  principle: ManifestoPrinciple;
}

export default function ManifestoCard({ principle }: ManifestoCardProps) {
  const { number, title, description } = principle;

  return (
    <div className={styles.manifestoCard}>
      <span className={styles.number}>
        {number}
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
