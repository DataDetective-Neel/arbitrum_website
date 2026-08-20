import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CheckCircle2,
  XCircle,
  Hammer,
  AlertTriangle,
  Shield,
  Clock,
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

function createInitialBlock(id: number, previousHash: string): Block {
  return {
    id,
    data: id === 1 ? 'Hello, Arbitrum!' : 'Second block data',
    previousHash,
    nonce: 0,
    hash: '',
    isMined: false,
    isMining: false,
    isValid: false,
  };
}

export default function BlockSimulator() {
  const [block1, setBlock1] = useState<Block>(() => createInitialBlock(1, GENESIS_HASH));
  const [block2, setBlock2] = useState<Block>(() => createInitialBlock(2, ''));
  const [miningLogs, setMiningLogs] = useState<Record<number, MiningLog[]>>({ 1: [], 2: [] });

  const abortRef1 = useRef<AbortController | null>(null);
  const abortRef2 = useRef<AbortController | null>(null);

  // Compute block1 hash whenever its inputs change (and it's not mining)
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
          isMined: prev.isMined && valid,
        }));
      }
    });
    return () => { cancelled = true; };
  }, [block1.data, block1.previousHash, block1.nonce, block1.isMining]);

  // Update block2's previousHash when block1's hash changes
  useEffect(() => {
    if (block1.hash && !block2.isMining) {
      setBlock2(prev => ({
        ...prev,
        previousHash: block1.hash,
      }));
    }
  }, [block1.hash, block2.isMining]);

  // Compute block2 hash whenever its inputs change (and it's not mining)
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
          isMined: prev.isMined && valid,
        }));
      }
    });
    return () => { cancelled = true; };
  }, [block2.data, block2.previousHash, block2.nonce, block2.isMining]);

  // Mine a block
  const handleMine = useCallback(async (blockId: number) => {
    const setBlock = blockId === 1 ? setBlock1 : setBlock2;
    const abortRef = blockId === 1 ? abortRef1 : abortRef2;

    // Cancel any existing mining
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setBlock(prev => ({ ...prev, isMining: true, isMined: false }));
    setMiningLogs(prev => ({ ...prev, [blockId]: [] }));

    const currentBlock = blockId === 1 ? block1 : block2;

    try {
      const result = await mineBlock(
        currentBlock.data,
        currentBlock.previousHash,
        0,
        (nonce, hash) => {
          // Throttled progress callback — batch log entries
          setMiningLogs(prev => {
            const logs = prev[blockId];
            const newEntry = { nonce, hash };
            // Keep only last 20 entries to avoid memory bloat
            const updated = [...logs.slice(-19), newEntry];
            return { ...prev, [blockId]: updated };
          });
          setBlock(prev => ({ ...prev, nonce, hash }));
        },
        controller.signal
      );

      setBlock(prev => ({
        ...prev,
        nonce: result.nonce,
        hash: result.hash,
        isMined: true,
        isMining: false,
        isValid: true,
      }));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Mining was cancelled, that's fine
      }
      setBlock(prev => ({ ...prev, isMining: false }));
    }
  }, [block1, block2]);

  // Handle data change on block 1
  const handleBlock1DataChange = (newData: string) => {
    abortRef1.current?.abort();
    setBlock1(prev => ({
      ...prev,
      data: newData,
      isMined: false,
      isMining: false,
    }));
    setMiningLogs(prev => ({ ...prev, 1: [] }));
  };

  // Handle data change on block 2
  const handleBlock2DataChange = (newData: string) => {
    abortRef2.current?.abort();
    setBlock2(prev => ({
      ...prev,
      data: newData,
      isMined: false,
      isMining: false,
    }));
    setMiningLogs(prev => ({ ...prev, 2: [] }));
  };

  // Tamper with block 1
  const handleTamper = () => {
    handleBlock1DataChange('TAMPERED DATA');
  };

  // Determine chain status
  const getChainStatus = () => {
    if (!block1.isMined && !block2.isMined) return 'pending';
    if (block1.isValid && block2.isValid && block1.isMined && block2.isMined) return 'valid';
    return 'invalid';
  };

  const chainStatus = getChainStatus();

  const getStatusLabel = () => {
    switch (chainStatus) {
      case 'valid': return 'CHAIN INTEGRITY: VERIFIED';
      case 'invalid': return 'CHAIN INTEGRITY: COMPROMISED';
      case 'pending': return 'CHAIN INTEGRITY: PENDING';
    }
  };

  const getStatusText = () => {
    switch (chainStatus) {
      case 'valid': return 'Both blocks are mined and their hashes form a valid chain.';
      case 'invalid': return 'Changing earlier data changed its hash, breaking the reference stored by the next block.';
      case 'pending': return 'Mine both blocks to establish a valid chain.';
    }
  };

  const StatusIcon = chainStatus === 'valid' ? Shield
    : chainStatus === 'invalid' ? AlertTriangle
    : Clock;

  return (
    <main className="page-content">
      <div className="container">
        <header className={styles.header}>
          <p className={styles.headerLabel}>LAYER//LAB — CASE 04</p>
          <h1 className={styles.headerTitle}>Block Simulator</h1>
          <p className={styles.headerDescription}>
            Mine blocks with real SHA-256 hashing, observe chain dependencies,
            and see firsthand why tampering with blockchain data is detectable.
          </p>
          <span className={styles.simLabel}>
            Educational Simulation · Not a Production Blockchain
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

          {block1.isMined && (
            <button
              onClick={handleTamper}
              className={styles.tamperBtn}
              disabled={block1.isMining || block2.isMining}
              aria-label="Tamper with Block 1 data to demonstrate chain invalidation"
            >
              <AlertTriangle size={14} aria-hidden="true" />
              Tamper with Block 01
            </button>
          )}
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
            <div className={`${styles.connectorLine} ${
              block1.isMined && block2.isMined
                ? (block2.isValid ? styles.valid : styles.invalid)
                : ''
            }`} />
            <div className={`${styles.connectorDot} ${
              block1.isMined && block2.isMined
                ? (block2.isValid ? styles.valid : styles.invalid)
                : styles.pending
            }`} />
            <div className={`${styles.connectorLine} ${
              block1.isMined && block2.isMined
                ? (block2.isValid ? styles.valid : styles.invalid)
                : ''
            }`} />
          </div>

          {/* Block 2 */}
          <BlockCard
            block={block2}
            logs={miningLogs[2]}
            onDataChange={handleBlock2DataChange}
            onMine={() => handleMine(2)}
            disableMine={block1.isMining || block2.isMining || !block1.isMined}
          />
        </div>

        {/* What Just Happened */}
        <div className={styles.explanation}>
          <h2 className={styles.explanationTitle}>What just happened?</h2>
          <div className={styles.explanationSteps}>
            <div className={styles.explanationStep}>
              <span className={styles.stepNum}>1</span>
              <span>
                <strong>Mine Block 01</strong> — The simulator increments a nonce
                value and computes a SHA-256 hash each time, until the hash starts
                with "{DIFFICULTY_PREFIX}". This is a simplified version of
                proof-of-work.
              </span>
            </div>
            <div className={styles.explanationStep}>
              <span className={styles.stepNum}>2</span>
              <span>
                <strong>Mine Block 02</strong> — Block 02 stores Block 01's hash
                as its "Previous Hash." This creates a chain — each block
                references the one before it.
              </span>
            </div>
            <div className={styles.explanationStep}>
              <span className={styles.stepNum}>3</span>
              <span>
                <strong>Tamper with Block 01</strong> — Changing Block 01's data
                changes its hash. Block 02 still stores the <em>old</em> hash,
                so the reference breaks. The chain becomes invalid.
              </span>
            </div>
            <div className={styles.explanationStep}>
              <span className={styles.stepNum}>4</span>
              <span>
                <strong>Restore the chain</strong> — Re-mine Block 01 to get a
                new valid hash, then re-mine Block 02 so its Previous Hash
                matches. This demonstrates why altering historical data in a
                real blockchain requires re-mining every subsequent block.
              </span>
            </div>
          </div>
        </div>

        <p className={styles.disclaimer}>
          This simulator uses the Web Crypto API for real SHA-256 hashing. It
          demonstrates the core concept of hash-linked blocks and tamper
          detection. A real blockchain additionally involves distributed
          consensus, network propagation, and significantly higher difficulty
          targets.
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

  // Auto-scroll mining log
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
          MINING
        </span>
      );
    }
    if (block.isMined && block.isValid) {
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

  const cardClass = block.isMined
    ? block.isValid ? styles.valid : styles.invalid
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
          <label className={styles.fieldLabel}>Block Data</label>
          <input
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
          <label className={styles.fieldLabel}>Previous Hash</label>
          <div className={styles.fieldValue}>
            {block.previousHash ? (
              <span className={
                block.id === 2 && block.isMined && !block.isValid
                  ? styles.hashMismatch
                  : styles.fieldValueHighlight
              }>
                {block.previousHash}
              </span>
            ) : (
              <span style={{ opacity: 0.4 }}>Waiting for Block 01...</span>
            )}
          </div>
        </div>

        {/* Nonce */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Nonce</label>
          <div className={styles.fieldValue}>
            {block.nonce}
          </div>
        </div>

        {/* Hash */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Hash</label>
          <div className={styles.fieldValue}>
            {block.hash ? (
              <span className={
                block.isValid ? styles.fieldValueHighlight : styles.hashMismatch
              }>
                {block.hash}
              </span>
            ) : (
              <span style={{ opacity: 0.4 }}>—</span>
            )}
          </div>
        </div>

        {/* Mining Log */}
        {(block.isMining || logs.length > 0) && (
          <div className={styles.miningLog} ref={logRef} aria-label="Mining log">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`${styles.logEntry} ${
                  i === logs.length - 1 && block.isMined ? styles.logSuccess : ''
                }`}
              >
                <span className={styles.logNonce}>
                  Nonce: {log.nonce}
                </span>
                <span className={styles.logHash}>
                  {log.hash}
                </span>
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
          {block.isMining ? 'Mining...' : block.isMined ? 'Re-Mine Block' : 'Mine Block'}
        </button>
      </div>
    </div>
  );
}
