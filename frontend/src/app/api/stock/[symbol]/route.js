import { NextResponse } from "next/server";
import { getQuotes, getHistory, parseQuote, parseHistory, formatVolume } from "@/lib/vps";
import { calcRSI, calcMACD, calcBollinger } from "@/lib/indicators";
import { stockDetail, priceHistory } from "@/lib/mock-data";

export async function GET(_request, { params }) {
  const { symbol } = await params;
  const ticker = symbol.toUpperCase();

  try {
    // Fetch quote and 45-day history in parallel
    const [quotes, hist] = await Promise.all([
      getQuotes([ticker]),
      getHistory(ticker, 45),
    ]);

    if (!quotes || quotes.length === 0) {
      throw new Error(`No data for ${ticker}`);
    }

    const q = parseQuote(quotes[0]);
    const bars = parseHistory(hist);
    const closes = hist.c.map((p) => p * 1000); // Convert to VND for indicators

    // Technical indicators
    const rsi = calcRSI(closes);
    const macd = calcMACD(closes);
    const bollinger = calcBollinger(closes);

    return NextResponse.json({
      symbol: q.symbol,
      name: q.name,
      price: q.price,
      change: q.changePercent,
      changePercent: q.changePercent,
      open: q.open,
      high: q.high,
      low: q.low,
      volume: formatVolume(q.volume),
      marketCap: "N/A",
      pe: 0,
      pb: 0,
      eps: 0,
      dividend: "N/A",
      week52High: 0,
      week52Low: 0,
      rsi,
      macd,
      bollingerBands: bollinger,
      priceHistory: bars.slice(-10),
    });
  } catch (error) {
    console.error(`Stock API error [${ticker}]:`, error);
    return NextResponse.json({
      ...stockDetail,
      symbol: ticker,
      priceHistory,
    });
  }
}
