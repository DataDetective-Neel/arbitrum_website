import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  Box,
  Layers,
  Zap,
  Shield,
  ChevronDown,
  MinusCircle,
  CheckCircle2,
} from 'lucide-react';
import styles from './Home.module.css';

interface LayerData {
  id: string;
  tag: string;
  name: string;
  subtitle: string;
  detail: string;
}

const LAYERS: LayerData[] = [
  {
    id: 'user',
    tag: 'APPLICATION LAYER',
    name: 'You (the User)',
    subtitle: 'Wallets, dApps, and applications you interact with every day.',
    detail:
      'When you send a transaction, swap tokens, or interact with a decentralized application, your request starts here. The application passes your signed transaction down to the execution layer.',
  },
  {
    id: 'arbitrum',
    tag: 'LAYER 2 — EXECUTION',
    name: 'Arbitrum (Rollup)',
    subtitle: 'Processes transactions quickly and affordably off Ethereum mainnet.',
    detail:
      'Arbitrum bundles many transactions together and executes them on its own chain. It then posts compressed transaction data back to Ethereum as a single batch, dramatically reducing the per-transaction cost while inheriting Ethereum\'s security guarantees.',
  },
  {
    id: 'ethereum',
    tag: 'LAYER 1 — SETTLEMENT',
    name: 'Ethereum (Mainnet)',
    subtitle: 'The security and finality backbone for the entire ecosystem.',
    detail:
      'Ethereum validates the compressed proofs posted by Arbitrum. It acts as the ultimate source of truth — if there is ever a dispute about a transaction, Ethereum settles it. This is what gives Layer 2 solutions their security.',
  },
];

export default function Home() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  const toggleLayer = (id: string) => {
    setActiveLayer(prev => (prev === id ? null : id));
  };

  return (
    <main className="page-content">
      {/* ---- Hero ---- */}
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.heroLabel}>LAYER//LAB — CASE 01</p>
          <h1 className={styles.heroHeadline}>
            Ethereum doesn't need to do{' '}
            <span className={styles.heroHeadlineEm}>everything</span> itself.
          </h1>
          <p className={styles.heroDescription}>
            As demand for Ethereum grew, so did congestion and costs. Layer 2
            solutions like Arbitrum extend Ethereum's capacity — processing
            transactions faster and more affordably while preserving the
            security of the underlying network.
          </p>
          <div className={styles.heroCtas}>
            <a href="#layers" className={styles.ctaPrimary}>
              Explore the Layers
              <ArrowDown size={14} aria-hidden="true" />
            </a>
            <Link to="/simulator" className={styles.ctaSecondary}>
              Run the Simulator
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Interactive Layer Diagram ---- */}
      <section className={styles.section} id="layers">
        <div className="container">
          <p className={styles.sectionLabel}>Infrastructure</p>
          <h2 className={styles.sectionTitle}>How the layers connect</h2>
          <p className={styles.sectionDescription}>
            Click each layer to understand its role in the stack. Transactions
            flow downward — from you to execution to settlement.
          </p>

          <div className={styles.layerDiagram} role="list" aria-label="Layer 2 architecture diagram">
            {LAYERS.map((layer, idx) => (
              <div key={layer.id}>
                <button
                  className={`${styles.layerCard} ${
                    activeLayer === layer.id ? styles.activeLayer : ''
                  }`}
                  onClick={() => toggleLayer(layer.id)}
                  aria-expanded={activeLayer === layer.id}
                  role="listitem"
                >
                  <div className={styles.layerCardHeader}>
                    <span className={styles.layerTag}>{layer.tag}</span>
                    <span className={styles.layerArrow}>
                      <ChevronDown size={14} aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className={styles.layerName}>{layer.name}</h3>
                  <p className={styles.layerSub}>{layer.subtitle}</p>
                  <div
                    className={`${styles.layerDetail} ${
                      activeLayer === layer.id ? styles.expanded : ''
                    }`}
                  >
                    <p className={styles.layerDetailText}>{layer.detail}</p>
                  </div>
                </button>
                {idx < LAYERS.length - 1 && (
                  <div className={styles.layerConnector} aria-hidden="true">
                    <div className={styles.layerConnectorDot} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className={styles.diagramCaption}>
            ↑ Click a layer to explore its role
          </p>
        </div>
      </section>

      {/* ---- The Problem ---- */}
      <section className={styles.section}>
        <div className="container">
          <p className={styles.sectionLabel}>The Problem</p>
          <h2 className={styles.sectionTitle}>
            Ethereum's growing pains
          </h2>
          <p className={styles.sectionDescription}>
            Ethereum's popularity became its bottleneck. The network can only
            process a limited number of transactions per block, which creates
            cascading issues during periods of high demand.
          </p>

          <div className={styles.problemGrid}>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>
                <AlertTriangle size={18} aria-hidden="true" />
              </div>
              <h3 className={styles.problemTitle}>Network Congestion</h3>
              <p className={styles.problemText}>
                When many users compete for limited block space, transactions
                queue up and confirmation times increase significantly.
              </p>
            </div>

            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>
                <TrendingUp size={18} aria-hidden="true" />
              </div>
              <h3 className={styles.problemTitle}>Rising Transaction Costs</h3>
              <p className={styles.problemText}>
                Users bid against each other for block inclusion. During peak
                demand, gas fees can make simple operations prohibitively
                expensive for everyday use.
              </p>
            </div>

            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>
                <Box size={18} aria-hidden="true" />
              </div>
              <h3 className={styles.problemTitle}>Scaling Limitations</h3>
              <p className={styles.problemText}>
                Ethereum's base layer prioritizes decentralization and security
                over raw throughput, creating a natural ceiling on how many
                transactions it can handle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- The Solution ---- */}
      <section className={styles.section}>
        <div className="container">
          <p className={styles.sectionLabel}>The Solution</p>
          <h2 className={styles.sectionTitle}>
            Arbitrum: scaling Ethereum without compromise
          </h2>

          <div className={styles.solutionContent}>
            <div className={styles.solutionText}>
              <p className={styles.solutionParagraph}>
                Arbitrum is a{' '}
                <span className={styles.solutionHighlight}>
                  Layer 2 optimistic rollup
                </span>{' '}
                built on Ethereum. Instead of processing every transaction
                directly on Ethereum, Arbitrum handles execution on its own
                chain and periodically posts compressed transaction data back
                to Ethereum.
              </p>
              <p className={styles.solutionParagraph}>
                This approach preserves Ethereum's security guarantees while
                significantly increasing the number of transactions the
                ecosystem can handle. Users interact with the same
                applications and assets — but with lower fees and faster
                confirmation times.
              </p>
              <p className={styles.solutionParagraph}>
                If any transaction result is disputed, Arbitrum's fraud-proof
                system allows anyone to challenge it on Ethereum, ensuring
                that invalid state transitions can always be corrected.
              </p>
            </div>

            <div className={styles.solutionFeatures}>
              <div className={styles.solutionFeature}>
                <div className={styles.featureIcon}>
                  <Layers size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className={styles.featureLabel}>Batch Processing</p>
                  <p className={styles.featureText}>
                    Hundreds of transactions are compressed into a single
                    Ethereum transaction, sharing the base layer cost.
                  </p>
                </div>
              </div>

              <div className={styles.solutionFeature}>
                <div className={styles.featureIcon}>
                  <Zap size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className={styles.featureLabel}>Faster Execution</p>
                  <p className={styles.featureText}>
                    Transactions are processed on Arbitrum's chain with
                    faster block times and near-instant confirmations.
                  </p>
                </div>
              </div>

              <div className={styles.solutionFeature}>
                <div className={styles.featureIcon}>
                  <Shield size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className={styles.featureLabel}>Ethereum Security</p>
                  <p className={styles.featureText}>
                    All transaction data is posted to Ethereum. Dispute
                    resolution is handled by Ethereum's consensus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Real-World Benefit ---- */}
      <section className={styles.section}>
        <div className="container">
          <p className={styles.sectionLabel}>Real-World Comparison</p>
          <h2 className={styles.sectionTitle}>
            What changes for the user?
          </h2>
          <p className={styles.sectionDescription}>
            The same applications and assets — but with a meaningfully
            different cost and speed profile.
          </p>

          <div className={styles.comparisonGrid}>
            {/* Ethereum side */}
            <div className={styles.comparisonSide}>
              <p
                className={`${styles.comparisonSideLabel} ${styles.comparisonSideLabelEth}`}
              >
                ETHEREUM MAINNET
              </p>
              <h3 className={styles.comparisonSideTitle}>Layer 1</h3>
              <div className={styles.comparisonPoints}>
                <div className={styles.comparisonPoint}>
                  <MinusCircle
                    size={14}
                    className={styles.comparisonPointIcon}
                    color="var(--color-invalid)"
                    aria-hidden="true"
                  />
                  <span>
                    Transaction fees vary widely and can spike during high demand
                  </span>
                </div>
                <div className={styles.comparisonPoint}>
                  <MinusCircle
                    size={14}
                    className={styles.comparisonPointIcon}
                    color="var(--color-invalid)"
                    aria-hidden="true"
                  />
                  <span>
                    Block confirmations take approximately 12–15 seconds
                  </span>
                </div>
                <div className={styles.comparisonPoint}>
                  <MinusCircle
                    size={14}
                    className={styles.comparisonPointIcon}
                    color="var(--color-invalid)"
                    aria-hidden="true"
                  />
                  <span>
                    Limited throughput shared across all applications
                  </span>
                </div>
              </div>
            </div>

            {/* VS Divider */}
            <div className={styles.comparisonDivider} aria-hidden="true">
              <span className={styles.comparisonLine} />
              <span className={styles.comparisonVs}>VS</span>
              <span className={styles.comparisonLine} />
            </div>

            {/* Arbitrum side */}
            <div className={styles.comparisonSide}>
              <p
                className={`${styles.comparisonSideLabel} ${styles.comparisonSideLabelArb}`}
              >
                ARBITRUM
              </p>
              <h3 className={styles.comparisonSideTitle}>Layer 2</h3>
              <div className={styles.comparisonPoints}>
                <div className={styles.comparisonPoint}>
                  <CheckCircle2
                    size={14}
                    className={styles.comparisonPointIcon}
                    color="var(--color-valid)"
                    aria-hidden="true"
                  />
                  <span>
                    Significantly lower fees by batching transactions together
                  </span>
                </div>
                <div className={styles.comparisonPoint}>
                  <CheckCircle2
                    size={14}
                    className={styles.comparisonPointIcon}
                    color="var(--color-valid)"
                    aria-hidden="true"
                  />
                  <span>
                    Near-instant transaction confirmation on the L2 chain
                  </span>
                </div>
                <div className={styles.comparisonPoint}>
                  <CheckCircle2
                    size={14}
                    className={styles.comparisonPointIcon}
                    color="var(--color-valid)"
                    aria-hidden="true"
                  />
                  <span>
                    Higher throughput while inheriting Ethereum's security
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Why It Matters ---- */}
      <section className={styles.takeaway}>
        <div className="container">
          <div className={styles.takeawayContent}>
            <p className={styles.sectionLabel}>Why It Matters</p>
            <p className={styles.takeawayText}>
              Layer 2 solutions don't replace Ethereum — they extend it.
            </p>
            <p className={styles.takeawaySubtext}>
              By moving execution to a separate layer while using Ethereum for
              settlement and security, the ecosystem can serve more users
              without sacrificing the decentralization and trustlessness that
              make blockchain technology valuable in the first place.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
