import FantasyLayout from '@/components/fantasy/FantasyLayout';
import styles from '@/styles/fantasy/AppPages.module.css';

const categories = ['Spells', 'Monsters', 'Lore', 'Rules', 'Campaign notes'];
const references = ['Casting time: one action', 'Range: sixty feet', 'Duration: concentration', 'Components: spoken vow'];

export default function LibraryPage() {
  return (
    <FantasyLayout
      title="Library"
      description="A text-focused manuscript reading interface with categories, tabs, and reference notes."
    >
      <section className={`${styles.pageBody} ${styles.libraryGrid}`}>
        <aside className={styles.panel}>
          <p className={styles.kicker}>Categories</p>
          <div className={styles.categoryList}>
            {categories.map((category) => <div className={styles.categoryItem} key={category}>{category}</div>)}
          </div>
        </aside>

        <article className={styles.readingPanel}>
          <div className={styles.tabs}>
            {['Overview', 'Effects', 'Notes'].map((tab) => <button className={styles.tab} key={tab}>{tab}</button>)}
          </div>
          <p className={styles.kicker}>Illuminated entry</p>
          <h2>Ward of the Gilded Door</h2>
          <p className={styles.readingText}>
            This spell seals an ancient threshold with an antique gold sigil visible only by warm candlelight.
            The interface keeps the reading field quiet, spacious, and focused on long-form tabletop reference text.
          </p>
          <p className={styles.readingText}>
            Marginalia, rules, and campaign lore are separated into clear panels so the library feels like a premium
            digital spellbook rather than a cluttered game screen.
          </p>
        </article>

        <aside className={styles.panel}>
          <p className={styles.kicker}>Reference</p>
          {references.map((reference) => <div className={styles.propertyRow} key={reference}><span>Detail</span>{reference}</div>)}
        </aside>
      </section>
    </FantasyLayout>
  );
}
