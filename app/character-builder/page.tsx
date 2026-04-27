import FantasyLayout from '@/components/fantasy/FantasyLayout';
import styles from '@/styles/fantasy/AppPages.module.css';

const abilities = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];
const inventory = ['Moonlit longsword', 'Sealed vellum map', 'Antique gold compass', 'Warm cloak'];

export default function CharacterBuilderPage() {
  return (
    <FantasyLayout
      title="Character Builder"
      description="A structured RPG workspace for race, class, abilities, preview, stats, and inventory."
    >
      <section className={`${styles.pageBody} ${styles.builderGrid}`}>
        <aside className={styles.panel}>
          <p className={styles.kicker}>Foundation</p>
          <h2>Race, class, abilities</h2>
          <div className={styles.optionList}>
            {['Moon Elf', 'Oathbound Paladin', 'Scholar Background'].map((option) => (
              <div className={styles.option} key={option}>{option}</div>
            ))}
          </div>
          <div className={styles.fieldGroup} style={{ marginTop: 18 }}>
            {abilities.map((ability) => (
              <label className={styles.field} key={ability}>
                <span>{ability}</span>
                <input defaultValue={ability === 'Charisma' ? '16' : '14'} aria-label={ability} />
              </label>
            ))}
          </div>
        </aside>

        <section className={styles.preview}>
          <p className={styles.kicker}>Live preview</p>
          <h2>Ser Aveline of Emberkeep</h2>
          <div className={styles.previewFigure} aria-hidden="true">♜</div>
          <p className={styles.muted}>A composed hero sheet preview with restrained ornament and clear readable hierarchy.</p>
        </section>

        <aside className={styles.panel}>
          <p className={styles.kicker}>Sheet</p>
          <h2>Stats and inventory</h2>
          <div className={styles.statGrid}>
            {['HP 38', 'AC 17', 'Speed 30', 'Level 5'].map((stat) => {
              const [label, value] = stat.split(' ');
              return (
                <div className={styles.statusCard} key={stat}>
                  <span>{label}</span>
                  <div className={styles.statValue}>{value}</div>
                </div>
              );
            })}
          </div>
          <div className={styles.inventoryList} style={{ marginTop: 18 }}>
            {inventory.map((item) => <div className={styles.inventoryItem} key={item}>{item}</div>)}
          </div>
        </aside>
      </section>
    </FantasyLayout>
  );
}
