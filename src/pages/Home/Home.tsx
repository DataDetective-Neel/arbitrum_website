import styles from '../PagePlaceholder.module.css';

export default function Home() {
  return (
    <main className="page-content">
      <div className={`container ${styles.placeholder}`}>
        <span className={styles.caseLabel}>LAYER//LAB — CASE 01</span>
        <h1 className={styles.title}>Home</h1>
        <p className={styles.subtitle}>
          Ethereum doesn't need to do everything itself. Discover how Layer 2 
          solutions like Arbitrum extend Ethereum's capabilities.
        </p>
        <span className={styles.hashDecor} aria-hidden="true">
          0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
        </span>
      </div>
    </main>
  );
}
