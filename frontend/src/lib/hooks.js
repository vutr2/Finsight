"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook để fetch data từ API routes
 * Tự động fallback về mock data nếu API lỗi
 */
export function useFetch(url, fallbackData = null) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          // Giữ fallbackData nếu có
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

export function useMarket() {
  return useFetch("/api/market");
}

export function useStock(symbol) {
  return useFetch(symbol ? `/api/stock/${symbol}` : null);
}

export function useNews(limit = 10) {
  return useFetch(`/api/news?limit=${limit}`);
}

export function useEducation(type = "all") {
  return useFetch(`/api/education?type=${type}`);
}
