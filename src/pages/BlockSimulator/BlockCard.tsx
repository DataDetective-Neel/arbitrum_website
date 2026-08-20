import { useRef, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Hammer,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import type { Block, MiningLog } from '../../types';
import styles from './BlockSimulator.module.css';

interface BlockCardProps {
  block: Block;
  logs: MiningLog[];
  onDataChange: (id: number, val: string) => void;
  onMine: (id: number) => void;
  onTamper: (id: number) => void;
  onRemove?: (id: number) => void;
  disableMine: boolean;
  disableActions: boolean;
  isGenesis: boolean;
  isPreviousHashMismatch: boolean;
}

export default function BlockCard({
  block,
  logs,
  onDataChange,
  onMine,
  onTamper,
  onRemove,
  disableMine,
  disableActions,
  isGenesis,
  isPreviousHashMismatch,
}: BlockCardProps) {
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
    if (block.isMined || isPreviousHashMismatch || (!block.isValid && block.nonce > 0)) {
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
    : block.isMined || isPreviousHashMismatch || (!block.isValid && block.nonce > 0)
    ? styles.invalid
    : '';

  return (
    <article
      id={`block-card-${block.id}`}
      className={`${styles.blockCard} ${cardClass}`}
      aria-label={`Block ${block.id}`}
    >
      <div className={styles.blockCardHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className={styles.blockId}>
            BLOCK {String(block.id).padStart(2, '0')}
          </span>
          {isGenesis && <span className={styles.genesisBadge}>GENESIS</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {getBadge()}
          {!isGenesis && onRemove && (
            <button
              onClick={() => onRemove(block.id)}
              disabled={disableActions}
              className={styles.removeBtn}
              title={`Remove Block ${block.id}`}
              aria-label={`Remove Block ${block.id}`}
            >
              <Trash2 size={12} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className={styles.blockCardBody}>
        {/* Data Payload */}
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor={`block-data-${block.id}`}>
            Block Data (Payload)
          </label>
          <input
            id={`block-data-${block.id}`}
            type="text"
            className={styles.fieldInput}
            value={block.data}
            onChange={e => onDataChange(block.id, e.target.value)}
            disabled={disableActions}
            aria-label={`Block ${block.id} payload`}
          />
        </div>

        {/* Previous Hash */}
        <div className={styles.field}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.fieldLabel}>Previous Hash</span>
            {isPreviousHashMismatch && (
              <span className={styles.mismatchAlert}>⚠ REFERENCE BROKEN</span>
            )}
          </div>
          <div
            className={`${styles.fieldValue} ${
              isPreviousHashMismatch ? styles.hashMismatchBox : ''
            }`}
          >
            {block.previousHash ? (
              <span
                className={
                  isPreviousHashMismatch
                    ? styles.hashMismatch
                    : styles.fieldValueHighlight
                }
              >
                {block.previousHash}
              </span>
            ) : (
              <span style={{ opacity: 0.4 }}>Waiting for predecessor...</span>
            )}
          </div>
        </div>

        {/* Nonce */}
        <div className={styles.field}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.fieldLabel}>Nonce (Proof of Work Counter)</span>
            {block.miningAttempts !== undefined && (
              <span className={styles.attemptsLabel}>
                {block.miningAttempts} attempts {block.miningDurationMs !== undefined ? `(${block.miningDurationMs}ms)` : ''}
              </span>
            )}
          </div>
          <div className={styles.fieldValue}>{block.nonce}</div>
        </div>

        {/* Current SHA-256 Hash */}
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

        {/* Mining Log Terminal */}
        {(block.isMining || logs.length > 0) && (
          <div
            className={styles.miningLog}
            ref={logRef}
            aria-label={`Block ${block.id} mining output`}
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

        {/* Block Controls */}
        <div className={styles.cardActions}>
          <button
            onClick={() => onMine(block.id)}
            disabled={disableMine}
            className={`${styles.mineBtn} ${block.isMining ? styles.mining : ''}`}
            aria-label={`Mine block ${block.id}`}
          >
            <Hammer size={14} aria-hidden="true" />
            {block.isMining
              ? 'Mining...'
              : block.isValid
              ? 'Re-Mine Block'
              : 'Mine Block'}
          </button>

          <button
            onClick={() => onTamper(block.id)}
            disabled={disableActions}
            className={styles.cardTamperBtn}
            title={`Tamper with Block ${block.id} payload`}
            aria-label={`Tamper with Block ${block.id}`}
          >
            <AlertTriangle size={13} aria-hidden="true" />
            Tamper
          </button>
        </div>
      </div>
    </article>
  );
}
