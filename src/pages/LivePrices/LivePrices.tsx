import { useEffect } from 'react';
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';
import { useMarketData } from '../../hooks/useMarketData';
import { formatPrice, formatPercent, formatTime } from '../../utils/formatters';
import type { CoinPriceData } from '../../types';
import styles from './LivePrices.module.css';

function PriceCard({ coin }: { coin: CoinPriceData }) {
  const isPositive = coin.change24h >= 0;

  return (
    <article className={styles.priceCard}>
      <div className={styles.cardTop}>
        <div className={styles.coinInfo}>
          <span className={styles.coinSymbol}>{coin.symbol}</span>
          <span className={styles.coinName}>{coin.name}</span>
        </div>
        <span
          className={`${styles.changeBadge} ${
            isPositive ? styles.changePositive : styles.changeNegative
          }`}
        >
          {isPositive ? (
            <TrendingUp size={12} aria-hidden="true" />
          ) : (
            <TrendingDown size={12} aria-hidden="true" />
          )}
          {formatPercent(coin.change24h)}
        </span>
      </div>
      <p className={styles.priceValue}>{formatPrice(coin.price)}</p>
      <p className={styles.priceLabel}>USD · 24H CHANGE</p>
    </article>
  );
}

function LoadingSkeleton() {
  return (
    <div className={styles.skeletonGrid}>
      {[0, 1, 2].map(i => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonLine} style={{ width: '30%' }} />
          <div className={styles.skeletonLine} style={{ width: '50%' }} />
          <div
            className={`${styles.skeletonLine} ${styles.skeletonLg}`}
          />
          <div
            className={`${styles.skeletonLine} ${styles.skeletonSm}`}
          />
        </div>
      ))}
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className={styles.stateContainer} role="alert">
      <div className={`${styles.stateIcon} ${styles.stateIconError}`}>
        <AlertCircle size={20} aria-hidden="true" />
      </div>
      <h2 className={styles.stateTitle}>Unable to load market data</h2>
      <p className={styles.stateText}>{message}</p>
      <button onClick={onRetry} className={styles.retryBtn}>
        <RefreshCw size={14} aria-hidden="true" />
        Retry
      </button>
    </div>
  );
}

export default function LivePrices() {
  const { data, loading, error, lastUpdated, fetchData } = useMarketData();

  // Fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasData = data.length > 0;

  return (
    <main className="page-content">
      <div className="container">
        <header className={styles.header}>
          <p className={styles.headerLabel}>LAYER//LAB — CASE 03</p>
          <h1 className={styles.headerTitle}>Live Market Intelligence</h1>
          <p className={styles.headerDescription}>
            Real-time cryptocurrency prices from the CoinGecko API. Observe how
            assets related to the Ethereum and Arbitrum ecosystems move.
          </p>
        </header>

        {/* Loading state (initial) */}
        {loading && !hasData && <LoadingSkeleton />}

        {/* Error state (no data to show) */}
        {error && !hasData && (
          <ErrorState message={error} onRetry={fetchData} />
        )}

        {/* Data */}
        {hasData && (
          <>
            <div className={styles.priceGrid}>
              {data.map(coin => (
                <PriceCard key={coin.id} coin={coin} />
              ))}
            </div>

            {/* Controls */}
            <div className={styles.controls}>
              <button
                onClick={fetchData}
                disabled={loading}
                className={styles.refreshBtn}
                aria-label="Refresh market data"
              >
                <RefreshCw
                  size={14}
                  className={`${styles.refreshIcon} ${
                    loading ? styles.spinning : ''
                  }`}
                  aria-hidden="true"
                />
                {loading ? 'Refreshing...' : 'Refresh Market Data'}
              </button>

              <div className={styles.lastUpdated}>
                <span
                  className={`${styles.statusDot} ${
                    error ? styles.statusDotError : ''
                  }`}
                  aria-hidden="true"
                />
                {error ? (
                  <span>Refresh failed — showing previous data</span>
                ) : lastUpdated ? (
                  <span>Last updated: {formatTime(lastUpdated)}</span>
                ) : null}
              </div>
            </div>

            {/* Error banner during refresh (still showing stale data) */}
            {error && (
              <div className={styles.apiNote} role="alert">
                ⚠ {error} — Displaying previously fetched data.
              </div>
            )}
          </>
        )}

        <p className={styles.apiNote}>
          Data source: CoinGecko Public API · Prices in USD · Not financial
          advice
        </p>
      </div>
    </main>
  );
}
