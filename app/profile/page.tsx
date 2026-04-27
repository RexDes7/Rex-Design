import FantasyLayout from '@/components/fantasy/FantasyLayout';
import styles from '@/styles/fantasy/AppPages.module.css';

const achievements = ['Cartographer of Emberkeep', 'Archivist of Seven Tomes', 'Relic Artisan'];
const content = ['3 campaign maps', '8 playable characters', '14 custom items'];

export default function UserProfilePage() {
  return (
    <FantasyLayout
      title="User Profile"
      description="Profile, achievements, created content, and inventory presented as an arcane dossier."
    >
      <section className={`${styles.pageBody} ${styles.profileGrid}`}>
        <div className={styles.panel}>
          <div className={styles.avatar} aria-hidden="true">A</div>
          <p className={styles.kicker} style={{ marginTop: 22 }}>Game master</p>
          <h2>Arcanist Valen</h2>
          <p className={styles.muted}>Keeper of quiet chronicles, curated maps, and refined magical inventories.</p>
          <div className={styles.statGrid}>
            {['Sessions 64', 'Maps 21', 'Characters 18', 'Relics 42'].map((stat) => {
              const [label, value] = stat.split(' ');
              return <div className={styles.statusCard} key={stat}><span>{label}</span><div className={styles.statValue}>{value}</div></div>;
            })}
          </div>
        </div>

        <aside className={styles.panel}>
          <p className={styles.kicker}>Collection</p>
          <h2>Achievements</h2>
          <div className={styles.achievementList}>
            {achievements.map((achievement) => <div className={styles.achievement} key={achievement}>{achievement}</div>)}
          </div>
          <h2 style={{ marginTop: 24 }}>Created content</h2>
          <div className={styles.contentList}>
            {content.map((entry) => <div className={styles.contentItem} key={entry}>{entry}</div>)}
          </div>
        </aside>
      </section>
    </FantasyLayout>
  );
}
