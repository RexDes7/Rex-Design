import styles from '@/styles/TestimonialCard.module.css';

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  project?: string;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  project,
}: TestimonialCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.quoteMark} aria-hidden="true">
        <span className="material-symbols-outlined">format_quote</span>
      </div>
      <blockquote className={styles.quote}>{quote}</blockquote>
      <footer className={styles.footer}>
        <div className={styles.authorWrap}>
          <div className={styles.avatar} aria-hidden="true">
            {author.charAt(0)}
          </div>
          <div className={styles.authorInfo}>
            <cite className={styles.author}>{author}</cite>
            <span className={styles.role}>{role}</span>
          </div>
        </div>
        {project && <span className={styles.project}>{project}</span>}
      </footer>
    </article>
  );
}
