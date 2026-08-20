import styles from '../PagePlaceholder.module.css';

export default function LivePrices() {
  return (
    <main className="page-content">
      <div className={`container ${styles.placeholder}`}>
        <span className={styles.caseLabel}>LAYER//LAB — CASE 03</span>
        <h1 className={styles.title}>Live Prices</h1>
        <p className={styles.subtitle}>
          Real-time cryptocurrency market data powered by the CoinGecko API.
        </p>
        <span className={styles.hashDecor} aria-hidden="true">
          0x3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d
        </span>
      </div>
    </main>
  );
}
