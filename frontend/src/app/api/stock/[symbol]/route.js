import { callN8n, WEBHOOKS } from "@/lib/n8n";
import { stockDetail, priceHistory } from "@/lib/mock-data";
import { NextResponse } from "next/server";

/**
 * GET /api/stock/[symbol]
 * Lấy phân tích chi tiết cho một mã cổ phiếu
 *
 * n8n workflow cần nhận query param: ?symbol=VCB
 * và trả về JSON:
 * {
 *   symbol, name, price, change, changePercent,
 *   open, high, low, volume, marketCap,
 *   pe, pb, eps, dividend,
 *   week52High, week52Low,
 *   rsi, macd: { value, signal, histogram },
 *   bollingerBands: { upper, middle, lower },
 *   priceHistory: [{ date, open, high, low, close, volume }]
 * }
 */
export async function GET(request, { params }) {
  const { symbol } = await params;

  try {
    if (!process.env.N8N_WEBHOOK_BASE_URL) {
      return NextResponse.json({
        ...stockDetail,
        symbol: symbol.toUpperCase(),
        priceHistory,
      });
    }

    const data = await callN8n(WEBHOOKS.STOCK_ANALYSIS, {
      params: { symbol: symbol.toUpperCase() },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Stock API error for ${symbol}:`, error);
    return NextResponse.json({
      ...stockDetail,
      symbol: symbol.toUpperCase(),
      priceHistory,
    });
  }
}
