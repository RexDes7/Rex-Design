import FantasyLayout from '@/components/fantasy/FantasyLayout';
import styles from '@/styles/fantasy/AppPages.module.css';

const items = [
  ['Quiet Star Lantern', 'Rare relic', '120'],
  ['Emberkeep Tileset', 'Map pack', '80'],
  ['Silver Oath Armor', 'Character gear', '160'],
  ['Vault of Whispers', 'Adventure module', '220'],
  ['Moonlit Bestiary', 'Library tome', '95'],
  ['Antique Dice Set', 'Table accessory', '45'],
];

export default function MarketplacePage() {
  return (
    <FantasyLayout
      title="Marketplace"
      description="Clean product cards and restrained filters for items, maps, modules, and tomes."
    >
      <section className={styles.pageBody}>
        <div className={styles.filters}>
          {['All', 'Items', 'Maps', 'Tomes', 'Modules'].map((filter) => <button className={styles.filter} key={filter}>{filter}</button>)}
        </div>
        <div className={styles.marketGrid}>
          {items.map(([name, type, price]) => (
            <article className={styles.marketCard} key={name}>
              <div className={styles.itemSigil} aria-hidden="true">✦</div>
              <p className={styles.kicker}>{type}</p>
              <h3>{name}</h3>
              <div className={styles.price}>{price} gold</div>
            </article>
          ))}
        </div>
      </section>
    </FantasyLayout>
  );
}
