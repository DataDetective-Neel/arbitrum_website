import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CONCEPTS } from '../../data/concepts';
import type { ConceptComparison } from '../../types';
import styles from './Concepts.module.css';

function ConceptCard({
  concept,
  index,
  isOpen,
  onToggle,
}: {
  concept: ConceptComparison;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={`${styles.conceptCard} ${isOpen ? styles.expanded : ''}`}
    >
      <button
        className={styles.cardHeader}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`concept-body-${concept.id}`}
      >
        <div className={styles.cardHeaderLeft}>
          <span className={styles.cardIndex}>
            COMPARISON {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className={styles.cardTitle}>{concept.title}</h2>
          <p className={styles.cardDescription}>{concept.description}</p>
        </div>
        <span
          className={`${styles.cardToggle} ${isOpen ? styles.rotated : ''}`}
          aria-hidden="true"
        >
          <ChevronDown size={18} />
        </span>
      </button>

      <div
        id={`concept-body-${concept.id}`}
        className={`${styles.cardBody} ${isOpen ? styles.open : ''}`}
        role="region"
        aria-label={`${concept.title} comparison details`}
      >
        <div className={styles.cardBodyInner}>
          {/* Side-by-side comparison */}
          <div className={styles.comparisonRow}>
            <div className={styles.side}>
              <p className={`${styles.sideLabel} ${styles.sideLabelA}`}>
                {concept.sideA.label}
              </p>
              <div className={styles.sidePoints}>
                {concept.sideA.points.map((point, i) => (
                  <div key={i} className={styles.sidePoint}>
                    <span
                      className={`${styles.pointBullet} ${styles.bulletA}`}
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.side}>
              <p className={`${styles.sideLabel} ${styles.sideLabelB}`}>
                {concept.sideB.label}
              </p>
              <div className={styles.sidePoints}>
                {concept.sideB.points.map((point, i) => (
                  <div key={i} className={styles.sidePoint}>
                    <span
                      className={`${styles.pointBullet} ${styles.bulletB}`}
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Practical Example */}
          <div className={styles.practicalExample}>
            <p className={styles.practicalLabel}>Real-World Scenario</p>
            <p className={styles.practicalText}>
              {concept.practicalExample}
            </p>
          </div>

          {/* Key Takeaway */}
          <div className={styles.takeaway}>
            <p className={styles.takeawayLabel}>Core Architectural Insight</p>
            <p className={styles.takeawayText}>{concept.keyTakeaway}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Concepts() {
  const [openCards, setOpenCards] = useState<Set<string>>(
    () => new Set(['web2-vs-web3', 'public-vs-private-key'])
  );

  const toggleCard = (id: string) => {
    setOpenCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenCards(new Set(CONCEPTS.map(c => c.id)));
  };

  const collapseAll = () => {
    setOpenCards(new Set());
  };

  return (
    <main className="page-content">
      <div className="container">
        <header className={styles.header}>
          <p className={styles.headerLabel}>LAYER//LAB — CASE 02</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <h1 className={styles.headerTitle}>Fundamental Web3 Concepts</h1>
              <p className={styles.headerDescription}>
                Four comparative engineering investigations clarifying the trust assumptions,
                cryptographic foundations, and execution models of decentralized systems.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                onClick={expandAll}
                className={styles.actionBtn}
                aria-label="Expand all concept cards"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className={styles.actionBtn}
                aria-label="Collapse all concept cards"
              >
                Collapse All
              </button>
            </div>
          </div>
        </header>

        <div className={styles.conceptsGrid}>
          {CONCEPTS.map((concept, index) => (
            <ConceptCard
              key={concept.id}
              concept={concept}
              index={index}
              isOpen={openCards.has(concept.id)}
              onToggle={() => toggleCard(concept.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
