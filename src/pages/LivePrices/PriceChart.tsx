import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Layers,
} from 'lucide-react';
import { fetchHistoricalChart } from '../../services/coingecko';
import {
  formatPrice,
  formatPercent,
  formatDateTime,
  formatAxisDate,
} from '../../utils/formatters';
import type { TimeframeKey, TimeframeConfig, HistoricalPricePoint, CoinPriceData } from '../../types';
import styles from './PriceChart.module.css';

const TIMEFRAMES: TimeframeConfig[] = [
  { key: '1W', label: '1 Week', days: 7 },
  { key: '1M', label: '1 Month', days: 30 },
  { key: '3M', label: '3 Months', days: 90 },
  { key: '6M', label: '6 Months', days: 180 },
  { key: '1Y', label: '1 Year', days: 365 },
];

const ASSETS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'arbitrum', symbol: 'ARB', name: 'Arbitrum' },
];

interface PriceChartProps {
  currentPrices: CoinPriceData[];
  initialCoinId?: string;
}

export default function PriceChart({ currentPrices, initialCoinId = 'bitcoin' }: PriceChartProps) {
  const [selectedCoinId, setSelectedCoinId] = useState<string>(initialCoinId);
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeKey>('1M');
  const [points, setPoints] = useState<HistoricalPricePoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredPoint, setHoveredPoint] = useState<HistoricalPricePoint | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const currentCoinMeta = ASSETS.find(a => a.id === selectedCoinId) || ASSETS[0];
  const currentCoinPrice = currentPrices.find(c => c.id === selectedCoinId)?.price;
  const currentDays = TIMEFRAMES.find(t => t.key === selectedTimeframe)?.days || 30;

  // Load historical points whenever coin or timeframe changes
  const loadChartData = useCallback(async () => {
    setLoading(true);
    setHoveredPoint(null);
    try {
      const data = await fetchHistoricalChart(selectedCoinId, currentDays, currentCoinPrice);
      setPoints(data);
    } catch (err) {
      console.error('Failed to load chart data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCoinId, currentDays, currentCoinPrice]);

  useEffect(() => {
    loadChartData();
  }, [loadChartData]);

  // Synchronize when initialCoinId prop changes (e.g. clicking a price card)
  useEffect(() => {
    if (initialCoinId) {
      setSelectedCoinId(initialCoinId);
    }
  }, [initialCoinId]);

  // Price calculations
  const hasData = points.length > 1;
  const firstPrice = hasData ? points[0].price : 0;
  const latestPrice = hasData ? points[points.length - 1].price : (currentCoinPrice || 0);
  const activePrice = hoveredPoint ? hoveredPoint.price : latestPrice;
  const activeTimestamp = hoveredPoint
    ? hoveredPoint.timestamp
    : hasData
    ? points[points.length - 1].timestamp
    : Date.now();

  const pricesArray = points.map(p => p.price);
  const minPrice = hasData ? Math.min(...pricesArray) : 0;
  const maxPrice = hasData ? Math.max(...pricesArray) : 1;
  const priceRange = maxPrice - minPrice || 1;

  const delta = activePrice - firstPrice;
  const deltaPercent = firstPrice > 0 ? (delta / firstPrice) * 100 : 0;
  const isPositive = delta >= 0;

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 260;
  const padding = { top: 20, right: 65, bottom: 35, left: 15 };
  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = svgHeight - padding.top - padding.bottom;

  const getX = (index: number) => {
    if (points.length <= 1) return padding.left;
    return padding.left + (index / (points.length - 1)) * innerWidth;
  };

  const getY = (price: number) => {
    return padding.top + innerHeight - ((price - minPrice) / priceRange) * innerHeight;
  };

  // Generate SVG path string
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(p.price).toFixed(1)}`)
    .join(' ');

  const areaPath = hasData
    ? `${linePath} L ${(padding.left + innerWidth).toFixed(1)} ${(padding.top + innerHeight).toFixed(1)} L ${padding.left.toFixed(1)} ${(padding.top + innerHeight).toFixed(1)} Z`
    : '';

  // Interactive mouse scrubbing
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const normalizedX = (mouseX / rect.width) * svgWidth;

    const boundedX = Math.max(padding.left, Math.min(padding.left + innerWidth, normalizedX));
    const ratio = (boundedX - padding.left) / innerWidth;
    const index = Math.round(ratio * (points.length - 1));

    if (points[index]) {
      setHoveredPoint(points[index]);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  // Y-axis ticks
  const yTicks = [
    maxPrice,
    minPrice + priceRange * 0.5,
    minPrice,
  ];

  // X-axis date labels indices
  const xIndices = hasData ? [0, Math.floor(points.length * 0.33), Math.floor(points.length * 0.66), points.length - 1] : [];

  const activeHoverIndex = hoveredPoint
    ? points.findIndex(p => p.timestamp === hoveredPoint.timestamp)
    : -1;

  const strokeColor = isPositive ? 'var(--color-valid)' : 'var(--color-invalid)';
  const gradientId = `chart-gradient-${selectedCoinId}-${selectedTimeframe}`;

  return (
    <section className={styles.chartContainer} aria-label="Interactive Historical Price Chart">
      {/* Top Controls Toolbar */}
      <div className={styles.controlsBar}>
        {/* Asset Switcher Tabs */}
        <div className={styles.coinTabs} role="tablist" aria-label="Select Asset">
          {ASSETS.map(asset => {
            const isSelected = selectedCoinId === asset.id;
            return (
              <button
                key={asset.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCoinId(asset.id)}
                className={`${styles.coinTab} ${isSelected ? styles.activeTab : ''}`}
              >
                <Layers size={13} aria-hidden="true" />
                <span>{asset.symbol}</span>
              </button>
            );
          })}
        </div>

        {/* Timeframe Selector Tabs */}
        <div className={styles.timeframeTabs} role="tablist" aria-label="Select Timeframe">
          {TIMEFRAMES.map(tf => {
            const isSelected = selectedTimeframe === tf.key;
            return (
              <button
                key={tf.key}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedTimeframe(tf.key)}
                className={`${styles.timeframeBtn} ${isSelected ? styles.activeTimeframe : ''}`}
                title={tf.label}
              >
                {tf.key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Header & Price Telemetry HUD */}
      <div className={styles.chartHud}>
        <div className={styles.hudLeft}>
          <span className={styles.hudCoinName}>
            {currentCoinMeta.name} ({currentCoinMeta.symbol}) · {selectedTimeframe} TIMEFRAME
          </span>
          <div className={styles.priceDisplayRow}>
            <span className={styles.currentPrice}>{formatPrice(activePrice)}</span>
            <span
              className={`${styles.deltaBadge} ${
                isPositive ? styles.deltaPositive : styles.deltaNegative
              }`}
              aria-label={`Period return: ${formatPercent(deltaPercent)}`}
            >
              {isPositive ? (
                <TrendingUp size={12} aria-hidden="true" />
              ) : (
                <TrendingDown size={12} aria-hidden="true" />
              )}
              {formatPercent(deltaPercent)} ({isPositive ? '+' : ''}{formatPrice(delta)})
            </span>
          </div>
          <span className={styles.hudDate}>
            <Calendar size={12} aria-hidden="true" />
            {formatDateTime(activeTimestamp)}
          </span>
        </div>

        {/* High / Low Period Metrics */}
        <div className={styles.hudRightMetrics}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>{selectedTimeframe} High</span>
            <span className={styles.metricValue}>{formatPrice(maxPrice)}</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>{selectedTimeframe} Low</span>
            <span className={styles.metricValue}>{formatPrice(minPrice)}</span>
          </div>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Period Open</span>
            <span className={styles.metricValue}>{formatPrice(firstPrice)}</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart Area */}
      <div className={styles.svgContainer}>
        {loading ? (
          <div className={styles.chartSkeleton}>
            <span>Loading historical telemetry...</span>
          </div>
        ) : (
          <>
            <svg
              ref={svgRef}
              className={styles.svgElement}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              aria-label={`${currentCoinMeta.name} price chart for ${selectedTimeframe}`}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={isPositive ? 'var(--color-valid)' : 'var(--color-invalid)'}
                    stopOpacity="0.25"
                  />
                  <stop
                    offset="100%"
                    stopColor={isPositive ? 'var(--color-valid)' : 'var(--color-invalid)'}
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {yTicks.map((priceVal, i) => {
                const y = getY(priceVal);
                return (
                  <g key={i}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + innerWidth}
                      y2={y}
                      stroke="var(--color-border)"
                      strokeDasharray={i === 1 ? '3 3' : 'none'}
                    />
                    <text
                      x={padding.left + innerWidth + 8}
                      y={y + 4}
                      fill="var(--color-text-tertiary)"
                      fontSize="10"
                      fontFamily="var(--font-mono)"
                    >
                      {formatPrice(priceVal)}
                    </text>
                  </g>
                );
              })}

              {/* Area Gradient Fill */}
              {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}

              {/* Main Line Stroke */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* X-Axis Date Labels */}
              {xIndices.map(idx => {
                const pt = points[idx];
                if (!pt) return null;
                const x = getX(idx);
                return (
                  <text
                    key={idx}
                    x={x}
                    y={svgHeight - 10}
                    fill="var(--color-text-tertiary)"
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                    textAnchor={idx === 0 ? 'start' : idx === points.length - 1 ? 'end' : 'middle'}
                  >
                    {formatAxisDate(pt.timestamp, currentDays)}
                  </text>
                );
              })}

              {/* Interactive Scrubbing Crosshair and Indicator Dot */}
              {hoveredPoint && activeHoverIndex >= 0 && (
                <g>
                  {/* Vertical Crosshair Line */}
                  <line
                    x1={getX(activeHoverIndex)}
                    y1={padding.top}
                    x2={getX(activeHoverIndex)}
                    y2={padding.top + innerHeight}
                    stroke="var(--color-accent-blue)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  {/* Intersection Glowing Dot */}
                  <circle
                    cx={getX(activeHoverIndex)}
                    cy={getY(hoveredPoint.price)}
                    r={6}
                    fill="var(--color-accent-blue)"
                    stroke="var(--color-bg-primary)"
                    strokeWidth="2.5"
                    style={{ filter: 'drop-shadow(0 0 6px var(--color-accent-blue))' }}
                  />
                </g>
              )}
            </svg>

            {/* Hover Floating HUD */}
            {hoveredPoint && (
              <div className={styles.hoverTooltip}>
                <span className={styles.tooltipPrice}>{formatPrice(hoveredPoint.price)}</span>
                <span className={styles.tooltipDate}>{formatDateTime(hoveredPoint.timestamp)}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Chart Footer Info */}
      <div className={styles.chartFooter}>
        <span>Interactive Scrubbing: Move cursor across the graph to inspect historical spot values</span>
        <span>Timeframe: {selectedTimeframe} ({currentDays} Days)</span>
      </div>
    </section>
  );
}
