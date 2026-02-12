/**
 * VPS Public API client for Vietnamese stock market data.
 * Uses bgapidatafeed.vps.com.vn (realtime quotes) and
 * histdatafeed.vps.com.vn (OHLCV history).
 * No auth required. Responses are fast (~200-500ms).
 */

const QUOTE_BASE = "https://bgapidatafeed.vps.com.vn";
const HIST_BASE = "https://histdatafeed.vps.com.vn";

/**
 * Fetch realtime quotes for one or more symbols in a single call.
 * @param {string[]} symbols - e.g. ["VCB", "FPT", "HPG"]
 * @returns {Promise<Object[]>} Array of quote objects
 */
export async function getQuotes(symbols) {
  const url = `${QUOTE_BASE}/getliststockdata/${symbols.join(",")}`;
  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`VPS quote API ${res.status}`);
  return res.json();
}

/**
 * Fetch OHLCV history for a single symbol.
 * @param {string} symbol
 * @param {number} days - how many days of history
 * @returns {Promise<{t:number[], o:number[], h:number[], l:number[], c:number[], v:number[]}>}
 */
export async function getHistory(symbol, days = 30) {
  const now = Math.floor(Date.now() / 1000);
  const from = now - days * 86400;
  const url = `${HIST_BASE}/tradingview/history?symbol=${symbol}&resolution=D&from=${from}&to=${now}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`VPS history API ${res.status}`);
  const data = await res.json();
  if (data.s !== "ok") throw new Error(`VPS history: ${data.s}`);
  return data;
}

/**
 * Parse a VPS quote object into a normalized format.
 * VPS prices are in x1000 VND (e.g., 64.2 = 64,200 VND).
 */
export function parseQuote(q) {
  const price = q.lastPrice * 1000;
  const refPrice = q.r * 1000;
  const change = price - refPrice;
  const changePct = refPrice ? (change / refPrice) * 100 : 0;

  return {
    symbol: q.sym,
    name: q.sym,
    price,
    change: Math.round(change),
    changePercent: Math.round(changePct * 100) / 100,
    open: q.openPrice * 1000,
    high: q.highPrice * 1000,
    low: q.lowPrice * 1000,
    volume: q.lot,
    ceiling: q.c * 1000,
    floor: q.f * 1000,
    refPrice,
  };
}

/**
 * Parse VPS history into array of price bars for the frontend.
 * VPS history prices are already in x1000 VND.
 */
export function parseHistory(data) {
  const bars = [];
  for (let i = 0; i < data.t.length; i++) {
    const d = new Date(data.t[i] * 1000);
    bars.push({
      date: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      open: Math.round(data.o[i] * 1000),
      high: Math.round(data.h[i] * 1000),
      low: Math.round(data.l[i] * 1000),
      close: Math.round(data.c[i] * 1000),
      volume: data.v[i],
    });
  }
  return bars;
}

/**
 * Format volume for display (e.g., 1234567 -> "1.23M")
 */
export function formatVolume(vol) {
  if (!vol || vol === 0) return "0";
  if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(2)}B`;
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(2)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(1)}K`;
  return String(vol);
}
