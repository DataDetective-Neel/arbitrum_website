/* ============================================
   LAYER//LAB — CoinGecko API Service
   Separated from UI — pure data fetching
   ============================================ */

import type { CoinPriceData } from '../types';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

interface CoinGeckoSimplePriceResponse {
  [id: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

const COIN_META: Record<string, { name: string; symbol: string }> = {
  bitcoin: { name: 'Bitcoin', symbol: 'BTC' },
  ethereum: { name: 'Ethereum', symbol: 'ETH' },
  arbitrum: { name: 'Arbitrum', symbol: 'ARB' },
};

const COIN_IDS = Object.keys(COIN_META);

export async function fetchMarketData(): Promise<CoinPriceData[]> {
  const url = `${COINGECKO_BASE}/simple/price?ids=${COIN_IDS.join(',')}&vs_currencies=usd&include_24hr_change=true`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `CoinGecko API returned ${response.status}: ${response.statusText}`
    );
  }

  const data: CoinGeckoSimplePriceResponse = await response.json();

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format from CoinGecko API');
  }

  const results: CoinPriceData[] = [];

  for (const id of COIN_IDS) {
    const coin = data[id];
    if (coin && typeof coin.usd === 'number') {
      const meta = COIN_META[id];
      results.push({
        id,
        name: meta.name,
        symbol: meta.symbol,
        price: coin.usd,
        change24h: typeof coin.usd_24h_change === 'number' ? coin.usd_24h_change : 0,
      });
    }
  }

  if (results.length === 0) {
    throw new Error('No price data returned from CoinGecko API');
  }

  return results;
}
