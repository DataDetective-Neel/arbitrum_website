import { ExternalLink } from 'lucide-react';
import styles from './Footer.module.css';

const GITHUB_URL = 'https://github.com/DataDetective-Neel/arbitrum_website';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.footerLeft}>
          <span className={styles.footerBrand}>
            LAYER<span className={styles.footerSlash}>//</span>LAB
          </span>
          <span className={styles.footerSub}>
            An educational Web3 exploration project
          </span>
        </div>

        <div className={styles.footerRight}>
          <span className={styles.footerLink}>
            Built by Indraneel Chatterjee
          </span>

          <span className={styles.footerDivider} aria-hidden="true" />

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
            aria-label="View source code on GitHub"
          >
            GitHub
            <ExternalLink size={12} aria-hidden="true" />
          </a>

          <span className={styles.footerDivider} aria-hidden="true" />

          <span className={styles.footerLink}>
            Arbitrum Builder Labs
          </span>
        </div>
      </div>
    </footer>
  );
}
