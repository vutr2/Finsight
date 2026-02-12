/**
 * Technical indicator calculations for stock analysis.
 * Pure JS — no dependencies needed.
 */

/**
 * RSI (Relative Strength Index) with default period 14.
 * @param {number[]} closes - array of closing prices
 * @param {number} period
 * @returns {number} RSI value (0-100)
 */
export function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + (diff > 0 ? diff : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (diff < 0 ? -diff : 0)) / period;
  }

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round((100 - 100 / (1 + rs)) * 100) / 100;
}

/**
 * MACD (12, 26, 9).
 * @param {number[]} closes
 * @returns {{value: number, signal: number, histogram: number}}
 */
export function calcMACD(closes, fast = 12, slow = 26, signal = 9) {
  if (closes.length < slow + signal) {
    return { value: 0, signal: 0, histogram: 0 };
  }

  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);

  const macdLine = [];
  const offset = slow - fast;
  for (let i = 0; i < emaSlow.length; i++) {
    macdLine.push(emaFast[i + offset] - emaSlow[i]);
  }

  const signalLine = ema(macdLine, signal);
  const lastMacd = macdLine[macdLine.length - 1];
  const lastSignal = signalLine[signalLine.length - 1];

  return {
    value: Math.round(lastMacd * 100) / 100,
    signal: Math.round(lastSignal * 100) / 100,
    histogram: Math.round((lastMacd - lastSignal) * 100) / 100,
  };
}

/**
 * Bollinger Bands (20, 2).
 * @param {number[]} closes - prices in VND
 * @returns {{upper: number, middle: number, lower: number}}
 */
export function calcBollinger(closes, period = 20, mult = 2) {
  if (closes.length < period) {
    const last = closes[closes.length - 1] || 0;
    return { upper: last, middle: last, lower: last };
  }

  const slice = closes.slice(-period);
  const mean = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((sum, v) => sum + (v - mean) ** 2, 0) / period;
  const std = Math.sqrt(variance);

  return {
    upper: Math.round(mean + mult * std),
    middle: Math.round(mean),
    lower: Math.round(mean - mult * std),
  };
}

/** EMA helper */
function ema(data, period) {
  const k = 2 / (period + 1);
  const result = [data[0]];
  for (let i = 1; i < data.length; i++) {
    result.push(data[i] * k + result[i - 1] * (1 - k));
  }
  return result;
}
