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
  Cpu,
} from 'lucide-react';
import styles from './Home.module.css';

interface LayerData {
  id: string;
  tag: string;
  name: string;
  subtitle: string;
  detail: string;
  metrics: string;
}

const LAYERS: LayerData[] = [
  {
    id: 'user',
    tag: 'LAYER 3 / APPLICATION LAYER',
    name: 'User & dApp Interface',
    subtitle: 'Wallets, decentralized applications, and smart contract interfaces.',
    detail:
      'Transactions originate here when you sign a payload using your private key (via MetaMask, Rabby, or smart contract wallet). Rather than broadcasting directly to Ethereum Mainnet, the signed intent is routed to the Layer 2 sequencer.',
    metrics: 'Initiation · ECDSA Signatures · Client-side routing',
  },
  {
    id: 'arbitrum',
    tag: 'LAYER 2 — ROLLUP EXECUTION',
    name: 'Arbitrum One / Nitro Engine',
    subtitle: 'High-throughput off-chain execution with compressed batch posting.',
    detail:
      'Arbitrum executes transactions immediately inside its Nitro engine, providing instant user feedback. Transactions are ordered, bundled into batches, compressed via Brotli, and posted down to Ethereum as calldata. Fraud-proof mechanisms allow any validator to challenge invalid state transitions.',
    metrics: 'Off-chain Execution · Calldata Compression · Interactive Fraud Proofs',
  },
  {
    id: 'ethereum',
    tag: 'LAYER 1 — BASE SETTLEMENT & CONSENSUS',
    name: 'Ethereum Mainnet',
    subtitle: 'The decentralized settlement, data availability, and security anchor.',
    detail:
      'Ethereum stores the compressed transaction batches posted by Arbitrum. If an invalid assertion is disputed during the dispute window, Ethereum smart contracts execute an interactive one-step fraud proof to verify and slash malicious actors, guaranteeing Layer 1 grade security.',
    metrics: 'Proof of Stake · Final Settlement · Dispute Arbitration',
  },
];

export default function Home() {
  const [activeLayer, setActiveLayer] = useState<string | null>('arbitrum');

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
            Base-layer blockchains prioritize decentralization and security over
            raw computational throughput. Layer 2 optimistic rollups like Arbitrum
            move transaction execution off-chain while anchoring final settlement and
            security directly to Ethereum.
          </p>
          <div className={styles.heroCtas}>
            <a href="#layers" className={styles.ctaPrimary}>
              Explore Layer Architecture
              <ArrowDown size={14} aria-hidden="true" />
            </a>
            <Link to="/simulator" className={styles.ctaSecondary}>
              Launch Block Simulator
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Interactive Layer Diagram ---- */}
      <section className={styles.section} id="layers">
        <div className="container">
          <p className={styles.sectionLabel}>System Architecture</p>
          <h2 className={styles.sectionTitle}>The Modular Scaling Stack</h2>
          <p className={styles.sectionDescription}>
            Explore how data flows through the three architectural tiers. Click any layer
            to inspect its cryptographic and execution responsibilities.
          </p>

          <div
            className={styles.layerDiagram}
            role="list"
            aria-label="Interactive Layer 2 architecture diagram"
          >
            {LAYERS.map((layer, idx) => {
              const isSelected = activeLayer === layer.id;
              return (
                <div key={layer.id} className={styles.layerWrapper}>
                  <button
                    className={`${styles.layerCard} ${
                      isSelected ? styles.activeLayer : ''
                    }`}
                    onClick={() => toggleLayer(layer.id)}
                    aria-expanded={isSelected}
                    role="listitem"
                  >
                    <div className={styles.layerCardHeader}>
                      <div className={styles.layerHeaderLeft}>
                        <span className={styles.layerTag}>{layer.tag}</span>
                        {layer.id === 'arbitrum' && (
                          <span className={styles.featuredBadge}>Scaling Layer</span>
                        )}
                      </div>
                      <span className={styles.layerArrow} aria-hidden="true">
                        <ChevronDown size={16} />
                      </span>
                    </div>

                    <h3 className={styles.layerName}>{layer.name}</h3>
                    <p className={styles.layerSub}>{layer.subtitle}</p>

                    <div
                      className={`${styles.layerDetail} ${
                        isSelected ? styles.expanded : ''
                      }`}
                    >
                      <p className={styles.layerDetailText}>{layer.detail}</p>
                      <div className={styles.layerMetrics}>
                        <Cpu size={12} aria-hidden="true" />
                        <span>{layer.metrics}</span>
                      </div>
                    </div>
                  </button>

                  {idx < LAYERS.length - 1 && (
                    <div className={styles.layerConnector} aria-hidden="true">
                      <div className={styles.layerConnectorLine} />
                      <div className={styles.layerConnectorDot} />
                      <div className={styles.layerConnectorLine} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className={styles.diagramCaption}>
            Select a tier above to inspect execution mechanics and security guarantees
          </p>
        </div>
      </section>

      {/* ---- The Problem ---- */}
      <section className={styles.section}>
        <div className="container">
          <p className={styles.sectionLabel}>The Scalability Trilemma</p>
          <h2 className={styles.sectionTitle}>
            Why Ethereum Layer 1 Needs Off-Chain Execution
          </h2>
          <p className={styles.sectionDescription}>
            Every full node on Ethereum must execute every single smart contract operation
            and store global state. When transaction demand exceeds block capacity, the system
            encounters severe bottlenecks:
          </p>

          <div className={styles.problemGrid}>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>
                <AlertTriangle size={18} aria-hidden="true" />
              </div>
              <h3 className={styles.problemTitle}>Network Congestion</h3>
              <p className={styles.problemText}>
                Ethereum processes approximately 15–30 transactions per second on base layer.
                When thousands of users submit transactions concurrently, pending mempools
                fill up and wait times surge.
              </p>
            </div>

            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>
                <TrendingUp size={18} aria-hidden="true" />
              </div>
              <h3 className={styles.problemTitle}>Volatile Gas Markets</h3>
              <p className={styles.problemText}>
                Base layer fee markets use priority gas auctions (EIP-1559). During market
                volatility or popular mints, transaction fees can spike to dozens of dollars
                for basic transfers.
              </p>
            </div>

            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>
                <Box size={18} aria-hidden="true" />
              </div>
              <h3 className={styles.problemTitle}>Global State Bloat</h3>
              <p className={styles.problemText}>
                Requiring tens of thousands of global nodes to process identical execution
                payloads caps computational throughput to ensure consumer hardware can run
                validating nodes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- The Solution ---- */}
      <section className={styles.section}>
        <div className="container">
          <p className={styles.sectionLabel}>Optimistic Rollup Technology</p>
          <h2 className={styles.sectionTitle}>
            How Arbitrum Scales Throughput Without Sacrificing Trust
          </h2>

          <div className={styles.solutionContent}>
            <div className={styles.solutionText}>
              <p className={styles.solutionParagraph}>
                Arbitrum is an{' '}
                <span className={styles.solutionHighlight}>
                  Optimistic Rollup
                </span>{' '}
                that assumes off-chain state transitions are valid by default
                (&ldquo;optimistic&rdquo;). Instead of performing complex computations
                directly on Ethereum, Arbitrum processes transactions in its Nitro
                execution environment and posts highly compressed transaction data back to
                Layer 1.
              </p>
              <p className={styles.solutionParagraph}>
                By bundling hundreds of operations into a single calldata batch on
                Ethereum, users share the fixed Layer 1 settlement cost while enjoying
                sub-second confirmation times and full EVM compatibility.
              </p>
              <p className={styles.solutionParagraph}>
                Security is maintained through an{' '}
                <span className={styles.solutionHighlight}>
                  interactive fraud-proof protocol
                </span>. If a malicious assertion is submitted, honest validators can challenge
                it on Ethereum through a bisection game, narrowing the dispute down to a single
                instruction executed on-chain.
              </p>
            </div>

            <div className={styles.solutionFeatures}>
              <div className={styles.solutionFeature}>
                <div className={styles.featureIcon}>
                  <Layers size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className={styles.featureLabel}>Calldata Compression</p>
                  <p className={styles.featureText}>
                    Hundreds of user transactions are compressed and bundled into a single
                    Ethereum transaction, amortizing settlement costs across the batch.
                  </p>
                </div>
              </div>

              <div className={styles.solutionFeature}>
                <div className={styles.featureIcon}>
                  <Zap size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className={styles.featureLabel}>Sub-Second User Feedback</p>
                  <p className={styles.featureText}>
                    Transactions receive soft confirmations nearly instantaneously on L2,
                    dramatically improving user experience for trading, gaming, and payments.
                  </p>
                </div>
              </div>

              <div className={styles.solutionFeature}>
                <div className={styles.featureIcon}>
                  <Shield size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className={styles.featureLabel}>Ethereum-Anchored Security</p>
                  <p className={styles.featureText}>
                    Layer 1 consensus provides immutable data availability and dispute
                    resolution. Arbitrum does not rely on a separate external validator set.
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
          <p className={styles.sectionLabel}>Comparative Analysis</p>
          <h2 className={styles.sectionTitle}>
            Ethereum Mainnet vs. Arbitrum One
          </h2>
          <p className={styles.sectionDescription}>
            A side-by-side engineering comparison illustrating why modern Web3 applications
            deploy to Layer 2 for execution.
          </p>

          <div className={styles.comparisonGrid}>
            {/* Ethereum side */}
            <div className={styles.comparisonSide}>
              <p
                className={`${styles.comparisonSideLabel} ${styles.comparisonSideLabelEth}`}
              >
                ETHEREUM MAINNET (LAYER 1)
              </p>
              <h3 className={styles.comparisonSideTitle}>Base Settlement</h3>
              <div className={styles.comparisonPoints}>
                <div className={styles.comparisonPoint}>
                  <MinusCircle
                    size={14}
                    className={styles.comparisonPointIcon}
                    color="var(--color-invalid)"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Variable Gas Costs:</strong> Each transaction pays full L1 execution and storage fees individually.
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
                    <strong>12-Second Slots:</strong> Blocks are produced on fixed 12-second intervals with 2-epoch finality.
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
                    <strong>Constrained Throughput:</strong> Global block gas limits cap network capacity to ~15–30 TPS.
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
                ARBITRUM ONE (LAYER 2)
              </p>
              <h3 className={styles.comparisonSideTitle}>Rollup Execution</h3>
              <div className={styles.comparisonPoints}>
                <div className={styles.comparisonPoint}>
                  <CheckCircle2
                    size={14}
                    className={styles.comparisonPointIcon}
                    color="var(--color-valid)"
                    aria-hidden="true"
                  />
                  <span>
                    <strong>Batch Cost Sharing:</strong> Execution happens on L2; compressed batch calldata amortizes L1 overhead.
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
                    <strong>Sub-Second Confirmations:</strong> Near-instant sequencer responses provide smooth interactive UX.
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
                    <strong>Inherited L1 Security:</strong> Backed by Ethereum consensus and interactive fraud-proof arbitration.
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
            <p className={styles.sectionLabel}>Educational Takeaway</p>
            <p className={styles.takeawayText}>
              Layer 2 rollups scale Ethereum by separating execution from settlement.
            </p>
            <p className={styles.takeawaySubtext}>
              Instead of forcing a single layer to balance high throughput, decentralization,
              and security simultaneously, the modular blockchain paradigm allows Ethereum to
              serve as a secure settlement anchor while Layer 2 networks like Arbitrum deliver
              fast, cost-effective computational throughput for millions of users.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
