import styles from '../PagePlaceholder.module.css';

export default function BlockSimulator() {
  return (
    <main className="page-content">
      <div className={`container ${styles.placeholder}`}>
        <span className={styles.caseLabel}>LAYER//LAB — CASE 04</span>
        <h1 className={styles.title}>Block Simulator</h1>
        <p className={styles.subtitle}>
          Mine blocks, generate SHA-256 hashes, and observe how blockchain 
          immutability works through hands-on experimentation.
        </p>
        <span className={styles.hashDecor} aria-hidden="true">
          0x2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
        </span>
      </div>
    </main>
  );
}
