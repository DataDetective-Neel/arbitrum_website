import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Shield,
  AlertTriangle,
  Clock,
  RotateCcw,
  Plus,
  Zap,
} from 'lucide-react';
import {
  computeBlockHash,
  mineBlock,
  isValidHash,
  DIFFICULTY_PREFIX,
} from '../../utils/mining';
import type { Block, MiningLog } from '../../types';
import BlockCard from './BlockCard';
import ChainAnalytics from './ChainAnalytics';
import styles from './BlockSimulator.module.css';

const GENESIS_PREVIOUS_HASH = '0'.repeat(64);

const INITIAL_BLOCKS_DATA = [
  'Arbitrum Genesis Block · L2 Execution Anchor',
  'Tx Batch #001: 420 transfers compressed via Brotli',
  'Smart Contract Deploy: NitroRollup.sol',
];

function createGenesisBlock(): Block {
  return {
    id: 1,
    data: INITIAL_BLOCKS_DATA[0],
    previousHash: GENESIS_PREVIOUS_HASH,
    nonce: 0,
    hash: '',
    isMined: false,
    isMining: false,
    isValid: false,
  };
}

export default function BlockSimulator() {
  const [blocks, setBlocks] = useState<Block[]>([
    createGenesisBlock(),
    {
      id: 2,
      data: INITIAL_BLOCKS_DATA[1],
      previousHash: '',
      nonce: 0,
      hash: '',
      isMined: false,
      isMining: false,
      isValid: false,
    },
    {
      id: 3,
      data: INITIAL_BLOCKS_DATA[2],
      previousHash: '',
      nonce: 0,
      hash: '',
      isMined: false,
      isMining: false,
      isValid: false,
    },
  ]);

  const [miningLogs, setMiningLogs] = useState<Record<number, MiningLog[]>>({});
  const [isMiningChain, setIsMiningChain] = useState(false);
  const [chainMiningProgress, setChainMiningProgress] = useState<{ current: number; total: number } | null>(null);
  const [hasBeenMinedBefore, setHasBeenMinedBefore] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const blocksRef = useRef<Block[]>(blocks);
  blocksRef.current = blocks;

  // Real-time synchronization of hashes across the chain when inputs change
  useEffect(() => {
    // Skip continuous recomputation while chain-mining to avoid racing
    if (isMiningChain) return;

    let cancelled = false;

    async function syncChainHashes() {
      const currentBlocks = [...blocksRef.current];
      let hasChanges = false;
      const updatedBlocks: Block[] = [];

      for (let i = 0; i < currentBlocks.length; i++) {
        const b = { ...currentBlocks[i] };
        const expectedPrevHash = i === 0 ? GENESIS_PREVIOUS_HASH : updatedBlocks[i - 1].hash;

        if (b.previousHash !== expectedPrevHash) {
          b.previousHash = expectedPrevHash;
          hasChanges = true;
        }

        if (!b.isMining) {
          const calculatedHash = await computeBlockHash(b.data, b.previousHash, b.nonce);
          if (b.hash !== calculatedHash) {
            b.hash = calculatedHash;
            hasChanges = true;
          }

          const valid = isValidHash(b.hash);
          if (b.isValid !== valid) {
            b.isValid = valid;
            hasChanges = true;
          }
        }

        updatedBlocks.push(b);
      }

      if (!cancelled && hasChanges) {
        setBlocks(updatedBlocks);
      }
    }

    syncChainHashes();

    return () => {
      cancelled = true;
    };
  }, [blocks, isMiningChain]);

  // Mine a single block
  const handleMineBlock = useCallback(async (blockId: number) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setBlocks(prev =>
      prev.map(b => (b.id === blockId ? { ...b, isMining: true } : b))
    );
    setMiningLogs(prev => ({ ...prev, [blockId]: [] }));

    const targetBlock = blocksRef.current.find(b => b.id === blockId);
    if (!targetBlock) return;

    try {
      const result = await mineBlock(
        targetBlock.data,
        targetBlock.previousHash,
        0,
        (nonce, hash) => {
          setMiningLogs(prev => {
            const current = prev[blockId] || [];
            return { ...prev, [blockId]: [...current.slice(-19), { nonce, hash }] };
          });
          setBlocks(prev =>
            prev.map(b => (b.id === blockId ? { ...b, nonce, hash } : b))
          );
        },
        controller.signal
      );

      setBlocks(prev =>
        prev.map(b =>
          b.id === blockId
            ? {
                ...b,
                nonce: result.nonce,
                hash: result.hash,
                isMined: true,
                isMining: false,
                isValid: true,
                miningAttempts: result.attempts,
                miningDurationMs: result.durationMs,
              }
            : b
        )
      );

      setHasBeenMinedBefore(true);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        console.error('Mining error:', err);
      }
      setBlocks(prev =>
        prev.map(b => (b.id === blockId ? { ...b, isMining: false } : b))
      );
    }
  }, []);

  // Mine the entire chain sequentially ("MINE CHAIN")
  const handleMineChain = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsMiningChain(true);
    const total = blocksRef.current.length;
    setChainMiningProgress({ current: 0, total });

    try {
      let currentPrevHash = GENESIS_PREVIOUS_HASH;

      for (let i = 0; i < total; i++) {
        if (controller.signal.aborted) break;

        const currentBlock = blocksRef.current[i];
        setChainMiningProgress({ current: i + 1, total });

        setBlocks(prev =>
          prev.map((b, idx) =>
            idx === i
              ? { ...b, isMining: true, previousHash: currentPrevHash }
              : b
          )
        );
        setMiningLogs(prev => ({ ...prev, [currentBlock.id]: [] }));

        const result = await mineBlock(
          currentBlock.data,
          currentPrevHash,
          0,
          (nonce, hash) => {
            setMiningLogs(prev => {
              const logs = prev[currentBlock.id] || [];
              return {
                ...prev,
                [currentBlock.id]: [...logs.slice(-19), { nonce, hash }],
              };
            });
            setBlocks(prev =>
              prev.map((b, idx) =>
                idx === i ? { ...b, nonce, hash } : b
              )
            );
          },
          controller.signal
        );

        currentPrevHash = result.hash;

        setBlocks(prev =>
          prev.map((b, idx) =>
            idx === i
              ? {
                  ...b,
                  nonce: result.nonce,
                  hash: result.hash,
                  isMined: true,
                  isMining: false,
                  isValid: true,
                  miningAttempts: result.attempts,
                  miningDurationMs: result.durationMs,
                  previousHash: i === 0 ? GENESIS_PREVIOUS_HASH : prev[i - 1].hash,
                }
              : b
          )
        );
      }

      setHasBeenMinedBefore(true);
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        console.error('Chain mining error:', err);
      }
    } finally {
      setIsMiningChain(false);
      setChainMiningProgress(null);
      setBlocks(prev => prev.map(b => ({ ...b, isMining: false })));
    }
  }, []);

  // Add a new block to the tip of the chain
  const handleAddBlock = () => {
    abortControllerRef.current?.abort();
    setBlocks(prev => {
      const nextId = prev.length > 0 ? Math.max(...prev.map(b => b.id)) + 1 : 1;
      const lastBlock = prev[prev.length - 1];
      const newBlock: Block = {
        id: nextId,
        data: `Tx Batch #${String(nextId).padStart(3, '0')}: Rollup Data`,
        previousHash: lastBlock ? lastBlock.hash : GENESIS_PREVIOUS_HASH,
        nonce: 0,
        hash: '',
        isMined: false,
        isMining: false,
        isValid: false,
      };
      return [...prev, newBlock];
    });
  };

  // Remove a block from the chain (cannot remove genesis)
  const handleRemoveBlock = (blockId: number) => {
    if (blockId === 1) return; // Protect Genesis
    abortControllerRef.current?.abort();

    setBlocks(prev => {
      const filtered = prev.filter(b => b.id !== blockId);
      // Re-index remaining blocks while preserving data
      return filtered.map((b, idx) => ({
        ...b,
        id: idx + 1,
      }));
    });
  };

  // Handle data payload change on any block
  const handleBlockDataChange = (blockId: number, newData: string) => {
    abortControllerRef.current?.abort();
    setBlocks(prev =>
      prev.map(b => (b.id === blockId ? { ...b, data: newData, isMining: false } : b))
    );
    setMiningLogs(prev => ({ ...prev, [blockId]: [] }));
  };

  // Tamper with a specific block
  const handleTamperBlock = (blockId: number) => {
    handleBlockDataChange(blockId, `TAMPERED: Unauthorized State Shift (Block ${blockId})`);
  };

  // Reset chain back to initial 3-block state
  const handleResetChain = () => {
    abortControllerRef.current?.abort();
    setBlocks([
      createGenesisBlock(),
      {
        id: 2,
        data: INITIAL_BLOCKS_DATA[1],
        previousHash: '',
        nonce: 0,
        hash: '',
        isMined: false,
        isMining: false,
        isValid: false,
      },
      {
        id: 3,
        data: INITIAL_BLOCKS_DATA[2],
        previousHash: '',
        nonce: 0,
        hash: '',
        isMined: false,
        isMining: false,
        isValid: false,
      },
    ]);
    setMiningLogs({});
    setIsMiningChain(false);
    setChainMiningProgress(null);
    setHasBeenMinedBefore(false);
  };

  const handleSelectBlockFromAnalytics = (blockId: number) => {
    const el = document.getElementById(`block-card-${blockId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Chain validation calculations
  const allBlocksMinedAndValid =
    blocks.length > 0 && blocks.every(b => b.isValid && b.isMined && !b.isMining);

  const hasAnyInvalid =
    hasBeenMinedBefore && blocks.some(b => !b.isValid && (b.isMined || b.nonce > 0));

  const chainStatus: 'valid' | 'invalid' | 'pending' = allBlocksMinedAndValid
    ? 'valid'
    : hasAnyInvalid
    ? 'invalid'
    : 'pending';

  const isAnyMining = isMiningChain || blocks.some(b => b.isMining);

  return (
    <main className="page-content">
      <div className="container">
        <header className={styles.header}>
          <p className={styles.headerLabel}>LAYER//LAB — CASE 04</p>
          <h1 className={styles.headerTitle}>Dynamic Blockchain Simulator</h1>
          <p className={styles.headerDescription}>
            Experiment with a multi-block ledger powered by real SHA-256 Proof of Work.
            Add blocks, mine the entire chain, alter historical payloads to observe cascading
            downstream invalidation, and inspect live computational analytics.
          </p>
          <span className={styles.simLabel}>
            Educational Simulation · Native Web Crypto API · Dynamic Chain Length
          </span>
        </header>

        {/* Global Chain Integrity Banner */}
        <div
          className={`${styles.chainBanner} ${styles[chainStatus]}`}
          role="status"
          aria-live="polite"
        >
          <div className={styles.chainStatusLeft}>
            <div className={`${styles.chainStatusIcon} ${styles[chainStatus]}`}>
              {chainStatus === 'valid' ? (
                <Shield size={16} aria-hidden="true" />
              ) : chainStatus === 'invalid' ? (
                <AlertTriangle size={16} aria-hidden="true" />
              ) : (
                <Clock size={16} aria-hidden="true" />
              )}
            </div>
            <div>
              <p className={`${styles.chainLabel} ${styles[chainStatus]}`}>
                {chainStatus === 'valid'
                  ? 'CHAIN INTEGRITY: VERIFIED'
                  : chainStatus === 'invalid'
                  ? 'CHAIN INTEGRITY: COMPROMISED'
                  : 'CHAIN INTEGRITY: PENDING'}
              </p>
              <p className={styles.chainStatusText}>
                {chainStatus === 'valid'
                  ? `All ${blocks.length} blocks satisfy the Proof of Work difficulty and form unbroken cryptographic links.`
                  : chainStatus === 'invalid'
                  ? 'Altering historical data broke the cryptographic reference stored in downstream blocks.'
                  : `Mine all ${blocks.length} blocks to establish an immutable cryptographic chain.`}
              </p>
            </div>
          </div>

          {/* Chain-Level Action Toolbar */}
          <div className={styles.bannerActions}>
            <button
              onClick={handleMineChain}
              disabled={isAnyMining}
              className={styles.mineChainBtn}
              aria-label="Mine all blocks in the chain sequentially"
            >
              <Zap size={14} aria-hidden="true" />
              {isMiningChain
                ? `Mining Chain (${chainMiningProgress?.current}/${chainMiningProgress?.total})...`
                : 'Mine Entire Chain'}
            </button>

            <button
              onClick={handleAddBlock}
              disabled={isAnyMining}
              className={styles.addBlockBtn}
              aria-label="Add a new block to the chain"
            >
              <Plus size={14} aria-hidden="true" />
              Add Block
            </button>

            <button
              onClick={handleResetChain}
              disabled={isAnyMining}
              className={styles.resetBtn}
              aria-label="Reset simulation to default state"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Reset Chain
            </button>
          </div>
        </div>

        {/* Dynamic Blocks Container */}
        <div className={styles.chainGrid} role="list" aria-label="Blockchain blocks list">
          {blocks.map((block, idx) => {
            const isGenesis = idx === 0;
            const previousBlock = idx > 0 ? blocks[idx - 1] : null;
            const isPreviousHashMismatch =
              !isGenesis &&
              previousBlock !== null &&
              block.previousHash !== previousBlock.hash;

            return (
              <div key={block.id} className={styles.blockWrapper} role="listitem">
                <BlockCard
                  block={block}
                  logs={miningLogs[block.id] || []}
                  onDataChange={handleBlockDataChange}
                  onMine={handleMineBlock}
                  onTamper={handleTamperBlock}
                  onRemove={handleRemoveBlock}
                  disableMine={isAnyMining}
                  disableActions={isAnyMining}
                  isGenesis={isGenesis}
                  isPreviousHashMismatch={isPreviousHashMismatch}
                />

                {/* Visual Inter-Block Connector */}
                {idx < blocks.length - 1 && (
                  <div className={styles.chainConnector} aria-hidden="true">
                    <div className={styles.connectorLine} />
                    <div className={styles.connectorBadge}>
                      <span>HASH &#8595; PREV HASH</span>
                    </div>
                    <div className={styles.connectorLine} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Block Bottom Action */}
        <div className={styles.addBlockBottom}>
          <button
            onClick={handleAddBlock}
            disabled={isAnyMining}
            className={styles.addBlockLargeBtn}
            aria-label="Add a new block to the end of the chain"
          >
            <Plus size={16} aria-hidden="true" />
            <span>+ ADD BLOCK ({blocks.length + 1})</span>
          </button>
        </div>

        {/* Chain Analytics & Graphs Dashboard */}
        <ChainAnalytics
          blocks={blocks}
          onSelectBlock={handleSelectBlockFromAnalytics}
        />

        {/* Educational Breakdown */}
        <div className={styles.explanation}>
          <h2 className={styles.explanationTitle}>What the Chain Demonstrates</h2>
          <div className={styles.explanationSteps}>
            <div className={styles.explanationStep}>
              <span className={styles.stepNum}>1</span>
              <span>
                <strong>Cryptographic Nonce Mining</strong> — The simulator tests successive nonce
                values from 0 upwards and computes a native SHA-256 hash until finding one that starts with &ldquo;{DIFFICULTY_PREFIX}&rdquo;.
              </span>
            </div>
            <div className={styles.explanationStep}>
              <span className={styles.stepNum}>2</span>
              <span>
                <strong>Sequential Hash Pointer Chain</strong> — Every block after Genesis embeds the exact 64-character SHA-256 hash of the preceding block as its immutable &ldquo;Previous Hash&rdquo;.
              </span>
            </div>
            <div className={styles.explanationStep}>
              <span className={styles.stepNum}>3</span>
              <span>
                <strong>Cascading Downstream Invalidation</strong> — Changing even a single letter in an early block (e.g., Block 01 or Block 02) produces a completely different hash, breaking the reference in all subsequent blocks and compromising the entire chain.
              </span>
            </div>
            <div className={styles.explanationStep}>
              <span className={styles.stepNum}>4</span>
              <span>
                <strong>Computational Cost of History Alteration</strong> — To successfully rewrite historical transactions, an attacker must sequentially re-mine the tampered block and every subsequent block in the chain before the rest of the network progresses.
              </span>
            </div>
          </div>
        </div>

        <p className={styles.disclaimer}>
          Technical Note: This simulation executes W3C standard Web Crypto API (crypto.subtle.digest)
          computations directly in your browser. Real-world blockchains like Bitcoin and Ethereum
          utilize the same fundamental cryptographic hash links while incorporating distributed
          p2p gossip propagation, dynamic target difficulty adjustments, and decentralized consensus.
        </p>
      </div>
    </main>
  );
}
