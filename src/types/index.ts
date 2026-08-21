/* ============================================
   LAYER//LAB — Type Definitions
   ============================================ */

/** Navigation route definition */
export interface NavRoute {
  path: string;
  label: string;
  shortLabel: string;
  caseNumber: string;
}

/** CoinGecko price response */
export interface CoinPriceData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
}

export interface MarketDataState {
  data: CoinPriceData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/** Historical Price Chart */
export type TimeframeKey = '1W' | '1M' | '3M' | '6M' | '1Y';

export interface TimeframeConfig {
  key: TimeframeKey;
  label: string;
  days: number;
}

export interface HistoricalPricePoint {
  timestamp: number;
  price: number;
}

export interface MarketChartState {
  points: HistoricalPricePoint[];
  loading: boolean;
  error: string | null;
  selectedCoinId: string;
  selectedTimeframe: TimeframeKey;
}

/** Dynamic Blockchain Simulator */
export interface Block {
  id: number;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
  isMined: boolean;
  isMining: boolean;
  isValid: boolean;
  miningAttempts?: number;
  miningDurationMs?: number;
}

export interface MiningLog {
  nonce: number;
  hash: string;
}

export interface ChainAnalyticsData {
  totalBlocks: number;
  minedBlocks: number;
  validBlocks: number;
  invalidBlocks: number;
  totalAttempts: number;
  avgNonce: number;
  avgDurationMs: number;
}

/** Concept comparison card */
export interface ComparisonItem {
  label: string;
  points: string[];
  icon?: string;
}

export interface ConceptComparison {
  id: string;
  title: string;
  description: string;
  sideA: ComparisonItem;
  sideB: ComparisonItem;
  keyTakeaway: string;
  practicalExample: string;
}
