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

/** Block Simulator */
export interface Block {
  id: number;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
  isMined: boolean;
  isMining: boolean;
  isValid: boolean;
}

export interface MiningLog {
  nonce: number;
  hash: string;
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
