import FantasyLayout from '@/components/fantasy/FantasyLayout';
import styles from '@/styles/fantasy/AppPages.module.css';

const tools = ['Select', 'Room', 'Path', 'Fog', 'Note', 'Measure'];
const assets = ['✦', '♜', '◇', '✧', '♞', '☉'];

export default function MapEditorPage() {
  return (
    <FantasyLayout
      title="Map Editor"
      description="A professional editor layout with tools, assets, grid canvas, and properties."
    >
      <section className={`${styles.pageBody} ${styles.editorGrid}`}>
        <div className={styles.toolbar}>
          {tools.map((tool) => <button className={styles.toolButton} key={tool}>{tool}</button>)}
        </div>

        <aside className={styles.panel}>
          <p className={styles.kicker}>Assets</p>
          <h2>Encounter pieces</h2>
          <div className={styles.assetGrid}>
            {assets.map((asset) => <div className={styles.assetTile} key={asset}>{asset}</div>)}
          </div>
        </aside>

        <div className={styles.canvas} aria-label="Map grid canvas">
          <div className={styles.mapMarker}>✦</div>
          <div className={styles.mapMarker}>♜</div>
          <div className={styles.mapMarker}>◇</div>
          <div className={styles.mapMarker}>✧</div>
        </div>

        <aside className={styles.panel}>
          <p className={styles.kicker}>Properties</p>
          <h2>Selected room</h2>
          {['Name Ember Vault', 'Size 40 × 30', 'Terrain Worn stone', 'Visibility Dim'].map((row) => {
            const [label, ...value] = row.split(' ');
            return <div className={styles.propertyRow} key={row}><span>{label}</span>{value.join(' ')}</div>;
          })}
        </aside>
      </section>
    </FantasyLayout>
  );
}
