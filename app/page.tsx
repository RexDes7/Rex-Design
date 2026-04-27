import Link from 'next/link';
import FantasyLayout from '@/components/fantasy/FantasyLayout';
import styles from './page.module.css';

const features = [
  {
    title: 'Character Builder',
    href: '/character-builder',
    copy: 'Compose race, class, abilities, inventory, and stat blocks in a quiet grimoire-like workspace.',
  },
  {
    title: 'Map Editor',
    href: '/map-editor',
    copy: 'Lay out encounter rooms, relic markers, terrain, and campaign notes on a restrained tactical canvas.',
  },
  {
    title: 'Library',
    href: '/library',
    copy: 'Read spells, lore, monsters, and house rules through a focused manuscript interface.',
  },
  {
    title: 'Game',
    href: '/game',
    copy: 'Run a calm MMORPG-style session view with map, party status, and deliberate action controls.',
  },
];

const metrics = ['7 connected tools', '42 saved relics', '18 active chronicles'];

export default function Home() {
  return (
    <FantasyLayout>
      <section className={styles.hero}>
        <div className={styles.heroPanel}>
          <p className={styles.eyebrow}>Ancient campaign command</p>
          <h1>Forge worlds from a refined arcane table.</h1>
          <p className={styles.heroText}>
            A premium fantasy web application for building heroes, items, maps, libraries, profiles,
            markets, and live adventures with the restraint of an illuminated spellbook.
          </p>
          <div className={styles.heroActions}>
            <Link href="/character-builder" className={styles.primaryAction}>
              Begin Character
            </Link>
            <Link href="/library" className={styles.secondaryAction}>
              Open Library
            </Link>
          </div>
        </div>
        <aside className={styles.heroCard} aria-label="Current campaign overview">
          <div className={styles.cardHeader}>
            <span>Chronicle</span>
            <strong>Night of Emberkeep</strong>
          </div>
          <div className={styles.runeCircle} aria-hidden="true">
            <span>✦</span>
          </div>
          <dl className={styles.heroStats}>
            {metrics.map((metric) => {
              const [value, ...label] = metric.split(' ');
              return (
                <div key={metric}>
                  <dt>{label.join(' ')}</dt>
                  <dd>{value}</dd>
                </div>
              );
            })}
          </dl>
        </aside>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Core instruments</p>
          <h2>Everything a refined table requires.</h2>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href} className={styles.featureCard}>
              <span className={styles.featureIndex}>0{features.indexOf(feature) + 1}</span>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.processSection}>
        <div>
          <p className={styles.eyebrow}>Design system</p>
          <h2>Dark navy, antique gold, warm manuscript text.</h2>
        </div>
        <div className={styles.processGrid}>
          <article>
            <span>01</span>
            <h3>Calm surfaces</h3>
            <p>Panels use dark worn texture, thin gold borders, and low elevation.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Legible hierarchy</h3>
            <p>One elegant serif family keeps the interface cohesive and readable.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Soft interaction</h3>
            <p>Hover states rely on subtle gold glow without flashy or neon effects.</p>
          </article>
        </div>
      </section>
    </FantasyLayout>
  );
}
