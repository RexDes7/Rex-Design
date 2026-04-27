import FantasyLayout from '@/components/fantasy/FantasyLayout';
import styles from '@/styles/fantasy/AppPages.module.css';

export default function ItemBuilderPage() {
  return (
    <FantasyLayout
      title="Item Builder"
      description="Create balanced magical items with form fields, rarity settings, and an elegant preview panel."
    >
      <section className={`${styles.pageBody} ${styles.itemGrid}`}>
        <form className={styles.panel}>
          <p className={styles.kicker}>Relic forge</p>
          <h2>Create item</h2>
          <div className={styles.fieldGroup}>
            <label className={styles.field}>
              <span>Item name</span>
              <input defaultValue="Lantern of the Quiet Star" />
            </label>
            <label className={styles.field}>
              <span>Rarity</span>
              <select defaultValue="Rare"><option>Common</option><option>Uncommon</option><option>Rare</option><option>Legendary</option></select>
            </label>
            <label className={styles.field}>
              <span>Primary stat</span>
              <input defaultValue="Wisdom +2" />
            </label>
            <label className={styles.field}>
              <span>Description</span>
              <textarea defaultValue="A hooded lantern whose antique flame reveals hidden inscriptions on worn stone." />
            </label>
          </div>
          <button className={styles.button} type="button">Save relic</button>
        </form>

        <aside className={styles.preview}>
          <p className={styles.kicker}>Preview</p>
          <div className={styles.itemSigil} aria-hidden="true">✦</div>
          <h2>Lantern of the Quiet Star</h2>
          <p className={styles.muted}>Rare wondrous item · Wisdom +2 · Attunement required</p>
          <p>A warm off-white manuscript card framed with thin antique gold lines and calm spacing.</p>
        </aside>
      </section>
    </FantasyLayout>
  );
}
