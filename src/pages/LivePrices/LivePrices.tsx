import { useEffect } from 'react';
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Activity,
  CheckCircle2,
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
          aria-label={`24 hour change: ${formatPercent(coin.change24h)}`}
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
      <div className={styles.priceFooter}>
        <span className={styles.priceLabel}>USD · 24H DELTA</span>
        <span className={styles.feedStatus}>
          <span className={styles.feedStatusDot} aria-hidden="true" />
          LIVE
        </span>
      </div>
    </article>
  );
}

function LoadingSkeleton() {
  return (
    <div className={styles.skeletonGrid} aria-label="Loading market prices">
      {[0, 1, 2].map(i => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonLine} style={{ width: '30%' }} />
          <div className={styles.skeletonLine} style={{ width: '50%' }} />
          <div className={`${styles.skeletonLine} ${styles.skeletonLg}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonSm}`} />
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
      <h2 className={styles.stateTitle}>Market Data Feed Disrupted</h2>
      <p className={styles.stateText}>{message}</p>
      <button onClick={onRetry} className={styles.retryBtn}>
        <RefreshCw size={14} aria-hidden="true" />
        Retry Feed Handshake
      </button>
    </div>
  );
}

export default function LivePrices() {
  const { data, loading, error, lastUpdated, fetchData } = useMarketData();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const hasData = data.length > 0;

  return (
    <main className="page-content">
      <div className="container">
        <header className={styles.header}>
          <p className={styles.headerLabel}>LAYER//LAB — CASE 03</p>
          <div className={styles.titleRow}>
            <h1 className={styles.headerTitle}>Live Market Intelligence</h1>
            <div className={styles.feedBadge}>
              <Activity size={12} aria-hidden="true" />
              <span>COINGECKO API FEED</span>
            </div>
          </div>
          <p className={styles.headerDescription}>
            Real-time spot price metrics for benchmark Layer 1 and Layer 2 assets.
            Observe live market valuation differences across the Ethereum and Arbitrum ecosystems.
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
                aria-label="Fetch updated market data from CoinGecko"
              >
                <RefreshCw
                  size={14}
                  className={`${styles.refreshIcon} ${
                    loading ? styles.spinning : ''
                  }`}
                  aria-hidden="true"
                />
                {loading ? 'Polling Network...' : 'Refresh Market Feed'}
              </button>

              <div className={styles.lastUpdated}>
                <span
                  className={`${styles.statusDot} ${
                    error ? styles.statusDotError : ''
                  }`}
                  aria-hidden="true"
                />
                {error ? (
                  <span>Rate limit or network warning — displaying cached state</span>
                ) : lastUpdated ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    <CheckCircle2 size={12} color="var(--color-valid)" aria-hidden="true" />
                    Last telemetry sync: {formatTime(lastUpdated)}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Error banner during refresh (still showing stale data) */}
            {error && (
              <div className={styles.apiNote} role="alert">
                ⚠ {error} — Serving previously verified market cache.
              </div>
            )}
          </>
        )}

        <div className={styles.marketDisclaimer}>
          <span>Public CoinGecko REST v3 Protocol</span>
          <span>·</span>
          <span>USD Denominated Spot Rates</span>
          <span>·</span>
          <span>Educational Infrastructure Research</span>
        </div>
      </div>
    </main>
  );
}
