import FantasyLayout from '@/components/fantasy/FantasyLayout';
import styles from '@/styles/fantasy/AppPages.module.css';

const party = ['Aveline HP 38', 'Mira HP 24', 'Orven HP 31'];
const actions = ['Cast ward', 'Move party', 'Inspect relic', 'End turn'];

export default function GamePage() {
  return (
    <FantasyLayout
      title="Game"
      description="A simple MMORPG-style session screen with map area, party status, and action controls."
    >
      <section className={`${styles.pageBody} ${styles.gameGrid}`}>
        <div className={styles.mapArea} aria-label="Adventure map area">
          <div className={styles.mapMarker}>♜</div>
          <div className={styles.mapMarker}>✦</div>
          <div className={styles.mapMarker}>◇</div>
          <div className={styles.mapMarker}>♞</div>
        </div>

        <aside className={styles.actionPanel}>
          <p className={styles.kicker}>Session</p>
          <h2>Emberkeep Gate</h2>
          <div className={styles.partyList}>
            {party.map((member) => {
              const [name, hp, value] = member.split(' ');
              return <div className={styles.partyMember} key={member}><span>{name}</span>{hp} {value}</div>;
            })}
          </div>
          <div className={styles.actionStack} style={{ marginTop: 18 }}>
            {actions.map((action) => <button className={styles.actionButton} key={action}>{action}</button>)}
          </div>
          <div className={styles.actionLog}>
            <p className={styles.kicker}>Action log</p>
            <p>The party approaches the sealed threshold. A quiet gold sigil answers the lantern flame.</p>
          </div>
        </aside>
      </section>
    </FantasyLayout>
  );
}
