import { useState, useCallback } from 'react';
import { fetchMarketData } from '../services/coingecko';
import type { MarketDataState } from '../types';

const INITIAL_STATE: MarketDataState = {
  data: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

export function useMarketData() {
  const [state, setState] = useState<MarketDataState>(INITIAL_STATE);

  const fetch_ = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetchMarketData();
      setState({
        data,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch market data';
      setState(prev => ({
        ...prev,
        loading: false,
        error: message,
      }));
    }
  }, []);

  return {
    ...state,
    fetchData: fetch_,
  };
}
