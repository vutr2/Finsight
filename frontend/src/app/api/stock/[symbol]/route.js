import { callN8n, ACTIONS } from "@/lib/n8n";
import { stockDetail, priceHistory } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  const { symbol } = await params;

  try {
    if (!process.env.N8N_WEBHOOK_BASE_URL) {
      return NextResponse.json({
        ...stockDetail,
        symbol: symbol.toUpperCase(),
        priceHistory,
      });
    }

    const data = await callN8n(ACTIONS.STOCK_ANALYSIS, {
      symbol: symbol.toUpperCase(),
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
