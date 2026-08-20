import styles from '../PagePlaceholder.module.css';

export default function Concepts() {
  return (
    <main className="page-content">
      <div className={`container ${styles.placeholder}`}>
        <span className={styles.caseLabel}>LAYER//LAB — CASE 02</span>
        <h1 className={styles.title}>Concepts</h1>
        <p className={styles.subtitle}>
          Four fundamental comparisons that define modern Web3 infrastructure.
        </p>
        <span className={styles.hashDecor} aria-hidden="true">
          0xa948904f2f0f479b8f8564fd22d1c7e68e5f4a338d8d51b461e1e8796d6e9a72
        </span>
      </div>
    </main>
  );
}
