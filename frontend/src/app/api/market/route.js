import { callN8n, ACTIONS } from "@/lib/n8n";
import { marketSummary, topMovers } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.N8N_WEBHOOK_BASE_URL) {
      return NextResponse.json({ ...marketSummary, topMovers });
    }

    const data = await callN8n(ACTIONS.MARKET_SUMMARY);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Market API error:", error);
    return NextResponse.json({ ...marketSummary, topMovers });
  }
}
