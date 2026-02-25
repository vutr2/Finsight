'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function usePortfolio() {
  const { sessionToken, isAuthenticated } = useAuth();
  const [portfolio, setPortfolio] = useState(null); // { cash, holdings, transactions }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trading, setTrading] = useState(false); // true while buy/sell/reset is in progress

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionToken}`,
  }), [sessionToken]);

  const fetchPortfolio = useCallback(async () => {
    if (!isAuthenticated || !sessionToken) return;
    try {
      const res = await fetch('/api/portfolio', { headers: headers() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setPortfolio(json);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, sessionToken, headers]);

  useEffect(() => {
    if (isAuthenticated && sessionToken) {
      setLoading(true);
      fetchPortfolio();
    }
  }, [isAuthenticated, sessionToken, fetchPortfolio]);

  const trade = useCallback(async (action, symbol, quantity, price) => {
    setTrading(true);
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ action, symbol, quantity, price }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      await fetchPortfolio(); // refresh after trade
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    } finally {
      setTrading(false);
    }
  }, [headers, fetchPortfolio]);

  const buy = (symbol, quantity, price) => trade('buy', symbol, quantity, price);
  const sell = (symbol, quantity, price) => trade('sell', symbol, quantity, price);
  const reset = () => trade('reset');

  // Helper: get quantity owned for a symbol
  const getHolding = useCallback((symbol) => {
    return portfolio?.holdings?.find((h) => h.symbol === symbol.toUpperCase()) ?? null;
  }, [portfolio]);

  return {
    cash: portfolio?.cash ?? 0,
    holdings: portfolio?.holdings ?? [],
    transactions: portfolio?.transactions ?? [],
    loading,
    trading,
    error,
    buy,
    sell,
    reset,
    getHolding,
    refresh: fetchPortfolio,
  };
}
