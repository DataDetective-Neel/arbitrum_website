import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CheckCircle2,
  XCircle,
  Hammer,
  AlertTriangle,
  Shield,
  Clock,
  RotateCcw,
} from 'lucide-react';
import {
  computeBlockHash,
  mineBlock,
  isValidHash,
  DIFFICULTY_PREFIX,
} from '../../utils/mining';
import type { Block, MiningLog } from '../../types';
import styles from './BlockSimulator.module.css';

const GENESIS_HASH = '0'.repeat(64);

const INITIAL_BLOCK_1_DATA = 'Hello, Arbitrum!';
const INITIAL_BLOCK_2_DATA = 'Second block data';

export default function BlockSimulator() {
  const [block1, setBlock1] = useState<Block>({
    id: 1,
    data: INITIAL_BLOCK_1_DATA,
    previousHash: GENESIS_HASH,
    nonce: 0,
    hash: '',
    isMined: false,
    isMining: false,
    isValid: false,
  });

  const [block2, setBlock2] = useState<Block>({
    id: 2,
    data: INITIAL_BLOCK_2_DATA,
    previousHash: '',
    nonce: 0,
    hash: '',
    isMined: false,
    isMining: false,
    isValid: false,
  });

  const [miningLogs, setMiningLogs] = useState<Record<number, MiningLog[]>>({ 1: [], 2: [] });
  const [hasBeenMinedBefore, setHasBeenMinedBefore] = useState(false);

  const abortRef1 = useRef<AbortController | null>(null);
  const abortRef2 = useRef<AbortController | null>(null);

  // Compute Block 1 Hash whenever data, previousHash, or nonce changes (and not actively mining)
  useEffect(() => {
    if (block1.isMining) return;

    let cancelled = false;
    computeBlockHash(block1.data, block1.previousHash, block1.nonce).then(hash => {
      if (!cancelled) {
        const valid = isValidHash(hash);
        setBlock1(prev => ({
          ...prev,
          hash,
          isValid: valid,
        }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [block1.data, block1.previousHash, block1.nonce, block1.isMining]);

  // Propagate Block 1 Hash to Block 2's previousHash
  useEffect(() => {
    if (block1.hash && !block2.isMining) {
      setBlock2(prev => {
        if (prev.previousHash !== block1.hash) {
          return { ...prev, previousHash: block1.hash };
        }
        return prev;
      });
    }
  }, [block1.hash, block2.isMining]);

  // Compute Block 2 Hash whenever its data, previousHash, or nonce changes (and not actively mining)
  useEffect(() => {
    if (block2.isMining || !block2.previousHash) return;

    let cancelled = false;
    computeBlockHash(block2.data, block2.previousHash, block2.nonce).then(hash => {
      if (!cancelled) {
        const valid = isValidHash(hash);
        setBlock2(prev => ({
          ...prev,
          hash,
          isValid: valid,
        }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [block2.data, block2.previousHash, block2.nonce, block2.isMining]);

  // Mine a block
  const handleMine = useCallback(async (blockId: number) => {
    const isBlock1 = blockId === 1;
    const abortRef = isBlock1 ? abortRef1 : abortRef2;

    // Abort existing mining on this block if any
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (isBlock1) {
      setBlock1(prev => ({ ...prev, isMining: true }));
    } else {
      setBlock2(prev => ({ ...prev, isMining: true }));
    }

    setMiningLogs(prev => ({ ...prev, [blockId]: [] }));

    const currentBlock = isBlock1 ? block1 : block2;

    try {
      const result = await mineBlock(
        currentBlock.data,
        currentBlock.previousHash,
        0,
        (nonce, hash) => {
          setMiningLogs(prev => {
            const logs = prev[blockId] || [];
            const newEntry = { nonce, hash };
            const updated = [...logs.slice(-19), newEntry];
            return { ...prev, [blockId]: updated };
          });
          if (isBlock1) {
            setBlock1(prev => ({ ...prev, nonce, hash }));
          } else {
            setBlock2(prev => ({ ...prev, nonce, hash }));
          }
        },
        controller.signal
      );

      if (isBlock1) {
        setBlock1(prev => ({
          ...prev,
          nonce: result.nonce,
          hash: result.hash,
          isMined: true,
          isMining: false,
          isValid: true,
        }));
      } else {
        setBlock2(prev => ({
          ...prev,
          nonce: result.nonce,
          hash: result.hash,
          isMined: true,
          isMining: false,
          isValid: true,
        }));
        setHasBeenMinedBefore(true);
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        console.error('Mining error:', err);
      }
      if (isBlock1) {
        setBlock1(prev => ({ ...prev, isMining: false }));
      } else {
        setBlock2(prev => ({ ...prev, isMining: false }));
      }
    }
  }, [block1, block2]);

  // Handle data changes
  const handleBlock1DataChange = (newData: string) => {
    abortRef1.current?.abort();
    setBlock1(prev => ({
      ...prev,
      data: newData,
      isMining: false,
    }));
    setMiningLogs(prev => ({ ...prev, 1: [] }));
  };

  const handleBlock2DataChange = (newData: string) => {
    abortRef2.current?.abort();
    setBlock2(prev => ({
      ...prev,
      data: newData,
      isMining: false,
    }));
    setMiningLogs(prev => ({ ...prev, 2: [] }));
  };

  // Tamper action
  const handleTamper = () => {
    handleBlock1DataChange('TAMPERED: 100 ETH to Attacker');
  };

  // Reset to initial clean state
  const handleReset = () => {
    abortRef1.current?.abort();
    abortRef2.current?.abort();
    setBlock1({
      id: 1,
      data: INITIAL_BLOCK_1_DATA,
      previousHash: GENESIS_HASH,
      nonce: 0,
      hash: '',
      isMined: false,
      isMining: false,
      isValid: false,
    });
    setBlock2({
      id: 2,
      data: INITIAL_BLOCK_2_DATA,
      previousHash: '',
      nonce: 0,
      hash: '',
      isMined: false,
      isMining: false,
      isValid: false,
    });
    setMiningLogs({ 1: [], 2: [] });
    setHasBeenMinedBefore(false);
  };

  // Compute overall chain status
  const isChainValid = block1.isValid && block2.isValid && block1.isMined && block2.isMined;
  const isCompromised = hasBeenMinedBefore && (!block1.isValid || !block2.isValid);
  const chainStatus: 'valid' | 'invalid' | 'pending' = isChainValid
    ? 'valid'
    : isCompromised
    ? 'invalid'
    : 'pending';

  const getStatusLabel = () => {
    switch (chainStatus) {
      case 'valid':
        return 'CHAIN INTEGRITY: VERIFIED';
      case 'invalid':
        return 'CHAIN INTEGRITY: COMPROMISED';
      case 'pending':
        return 'CHAIN INTEGRITY: PENDING';
    }
  };

  const getStatusText = () => {
    switch (chainStatus) {
      case 'valid':
        return 'Both blocks are validly mined and their hashes form an unbroken cryptographic link.';
      case 'invalid':
        return 'Modifying earlier block data altered its hash, breaking the cryptographic reference stored in subsequent blocks.';
      case 'pending':
        return 'Mine Block 01 and Block 02 to establish an immutable cryptographic chain.';
    }
  };

  const StatusIcon =
    chainStatus === 'valid'
      ? Shield
      : chainStatus === 'invalid'
      ? AlertTriangle
      : Clock;

  return (
    <main className="page-content">
      <div className="container">
        <header className={styles.header}>
          <p className={styles.headerLabel}>LAYER//LAB — CASE 04</p>
          <h1 className={styles.headerTitle}>Block Simulator</h1>
          <p className={styles.headerDescription}>
            Mine blocks using real SHA-256 hashing via the Web Crypto API, inspect
            chain dependencies, and witness how altering historical records instantly
            breaks chain integrity.
          </p>
          <span className={styles.simLabel}>
            Educational Simulation · Real SHA-256 Hashing · No External Libraries
          </span>
        </header>

        {/* Chain Integrity Banner */}
        <div
          className={`${styles.chainBanner} ${styles[chainStatus]}`}
          role="status"
          aria-live="polite"
        >
          <div className={styles.chainStatusLeft}>
            <div className={`${styles.chainStatusIcon} ${styles[chainStatus]}`}>
              <StatusIcon size={16} aria-hidden="true" />
            </div>
            <div>
              <p className={`${styles.chainLabel} ${styles[chainStatus]}`}>
                {getStatusLabel()}
              </p>
              <p className={styles.chainStatusText}>{getStatusText()}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <button
              onClick={handleTamper}
              className={styles.tamperBtn}
              disabled={block1.isMining || block2.isMining}
              aria-label="Tamper with Block 1 data to demonstrate chain invalidation"
            >
              <AlertTriangle size={14} aria-hidden="true" />
              Tamper with Block 01
            </button>

            <button
              onClick={handleReset}
              className={styles.resetBtn}
              disabled={block1.isMining || block2.isMining}
              aria-label="Reset simulation to initial state"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Reset Chain
            </button>
          </div>
        </div>

        {/* Blocks Grid */}
        <div className={styles.blocksGrid}>
          {/* Block 1 */}
          <BlockCard
            block={block1}
            logs={miningLogs[1]}
            onDataChange={handleBlock1DataChange}
            onMine={() => handleMine(1)}
            disableMine={block1.isMining || block2.isMining}
          />

          {/* Chain Connector */}
          <div className={styles.chainConnector} aria-hidden="true">
            <div
              className={`${styles.connectorLine} ${
                chainStatus === 'valid'
                  ? styles.valid
                  : chainStatus === 'invalid'
                  ? styles.invalid
                  : ''
              }`}
            />
            <div
              className={`${styles.connectorDot} ${
                chainStatus === 'valid'
                  ? styles.valid
                  : chainStatus === 'invalid'
                  ? styles.invalid
                  : styles.pending
              }`}
            />
            <div
              className={`${styles.connectorLine} ${
                chainStatus === 'valid'
                  ? styles.valid
                  : chainStatus === 'invalid'
                  ? styles.invalid
                  : ''
              }`}
            />
          </div>

          {/* Block 2 */}
          <BlockCard
            block={block2}
            logs={miningLogs[2]}
            onDataChange={handleBlock2DataChange}
            onMine={() => handleMine(2)}
            disableMine={block1.isMining || block2.isMining || !block1.isValid}
          />
        </div>

        {/* What Just Happened */}
        <div className={styles.explanation}>
          <h2 className={styles.explanationTitle}>How Blockchain Immutability Works</h2>
          <div className={styles.explanationSteps}>
            <div className={styles.explanationStep}>
              <span className={styles.stepNum}>1</span>
              <span>
                <strong>Mine Block 01</strong> — The simulator increments the nonce from 0
                and calculates a real SHA-256 hash at every step until finding a hash starting with "
                {DIFFICULTY_PREFIX}". This simulates Proof of Work consensus.
              </span>
            </div>
            <div className={styles.explanationStep}>
              <span className={styles.stepNum}>2</span>
              <span>
                <strong>Mine Block 02</strong> — Block 02 stores Block 01's valid hash as its
                immutable "Previous Hash". The cryptographic fingerprint of Block 01 is now sealed inside Block 02.
              </span>
            </div>
            <div className={styles.explanationStep}>
              <span className={styles.stepNum}>3</span>
              <span>
                <strong>Tamper with Block 01</strong> — Altering any character of Block 01's data
                produces a completely different SHA-256 hash. The hash stored in Block 02 no longer matches Block 01's content, instantly invalidating Block 02 and alerting the entire network.
              </span>
            </div>
            <div className={styles.explanationStep}>
              <span className={styles.stepNum}>4</span>
              <span>
                <strong>Restoring Chain Integrity</strong> — To forge historical data, an attacker would have to re-mine Block 01 and then sequentially re-mine every subsequent block in the chain before the rest of the network progresses.
              </span>
            </div>
          </div>
        </div>

        <p className={styles.disclaimer}>
          Technical Note: This educational simulation uses the standard W3C Web Crypto API
          (crypto.subtle.digest) for client-side SHA-256 computation. A production blockchain network
          builds upon these exact cryptographic primitives while incorporating peer-to-peer gossip
          propagation, dynamic difficulty adjustment, and decentralized consensus algorithms.
        </p>
      </div>
    </main>
  );
}

/* ---- Block Card Sub-component ---- */

function BlockCard({
  block,
  logs,
  onDataChange,
  onMine,
  disableMine,
}: {
  block: Block;
  logs: MiningLog[];
  onDataChange: (val: string) => void;
  onMine: () => void;
  disableMine: boolean;
}) {
  const logRef = useRef<HTMLDivElement>(null);

  // Auto-scroll mining log to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const getBadge = () => {
    if (block.isMining) {
      return (
        <span className={`${styles.validityBadge} ${styles.miningBadge}`}>
          <Hammer size={10} aria-hidden="true" />
          MINING...
        </span>
      );
    }
    if (block.isValid) {
      return (
        <span className={`${styles.validityBadge} ${styles.validBadge}`}>
          <CheckCircle2 size={10} aria-hidden="true" />
          VALID
        </span>
      );
    }
    if (block.isMined && !block.isValid) {
      return (
        <span className={`${styles.validityBadge} ${styles.invalidBadge}`}>
          <XCircle size={10} aria-hidden="true" />
          INVALID
        </span>
      );
    }
    return (
      <span className={`${styles.validityBadge} ${styles.pendingBadge}`}>
        NOT MINED
      </span>
    );
  };

  const cardClass = block.isMining
    ? ''
    : block.isValid
    ? styles.valid
    : block.isMined || (!block.isValid && block.nonce > 0)
    ? styles.invalid
    : '';

  return (
    <div className={`${styles.blockCard} ${cardClass}`}>
      <div className={styles.blockCardHeader}>
        <span className={styles.blockId}>
          BLOCK {String(block.id).padStart(2, '0')}
        </span>
        {getBadge()}
      </div>

      <div className={styles.blockCardBody}>
        {/* Data */}
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor={`block-data-${block.id}`}>
            Block Data (Payload)
          </label>
          <input
            id={`block-data-${block.id}`}
            type="text"
            className={styles.fieldInput}
            value={block.data}
            onChange={e => onDataChange(e.target.value)}
            disabled={block.isMining}
            aria-label={`Block ${block.id} data`}
          />
        </div>

        {/* Previous Hash */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Previous Hash</span>
          <div className={styles.fieldValue}>
            {block.previousHash ? (
              <span className={styles.fieldValueHighlight}>
                {block.previousHash}
              </span>
            ) : (
              <span style={{ opacity: 0.4 }}>Waiting for Block 01...</span>
            )}
          </div>
        </div>

        {/* Nonce */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Nonce (Proof of Work Counter)</span>
          <div className={styles.fieldValue}>{block.nonce}</div>
        </div>

        {/* Hash */}
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Current SHA-256 Hash</span>
          <div className={styles.fieldValue}>
            {block.hash ? (
              <span
                className={
                  block.isValid ? styles.fieldValueHighlight : styles.hashMismatch
                }
              >
                {block.hash}
              </span>
            ) : (
              <span style={{ opacity: 0.4 }}>—</span>
            )}
          </div>
        </div>

        {/* Mining Log */}
        {(block.isMining || logs.length > 0) && (
          <div
            className={styles.miningLog}
            ref={logRef}
            aria-label={`Block ${block.id} mining log`}
            tabIndex={0}
          >
            {logs.map((log, i) => (
              <div
                key={i}
                className={`${styles.logEntry} ${
                  i === logs.length - 1 && block.isValid ? styles.logSuccess : ''
                }`}
              >
                <span className={styles.logNonce}>Nonce {log.nonce}:</span>
                <span className={styles.logHash}>{log.hash}</span>
              </div>
            ))}
          </div>
        )}

        {/* Mine Button */}
        <button
          onClick={onMine}
          disabled={disableMine}
          className={`${styles.mineBtn} ${block.isMining ? styles.mining : ''}`}
          aria-label={`Mine block ${block.id}`}
        >
          <Hammer size={14} aria-hidden="true" />
          {block.isMining
            ? 'Mining in Progress...'
            : block.isValid
            ? 'Re-Mine Block'
            : 'Mine Block'}
        </button>
      </div>
    </div>
  );
}
