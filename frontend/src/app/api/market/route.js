import { callN8n, WEBHOOKS } from "@/lib/n8n";
import { marketSummary, topMovers } from "@/lib/mock-data";
import { NextResponse } from "next/server";

/**
 * GET /api/market
 * Lấy tổng quan thị trường: VN-Index, HNX, UPCOM, top movers
 *
 * n8n workflow cần trả về JSON:
 * {
 *   vnIndex: { value, change, changePercent },
 *   hnxIndex: { value, change, changePercent },
 *   upcom: { value, change, changePercent },
 *   volume: "682.5M",
 *   value: "18,234 tỷ",
 *   topMovers: [{ symbol, name, price, change, volume }]
 * }
 */
export async function GET() {
  try {
    if (!process.env.N8N_WEBHOOK_BASE_URL) {
      // Trả mock data khi chưa kết nối n8n
      return NextResponse.json({ ...marketSummary, topMovers });
    }

    const data = await callN8n(WEBHOOKS.MARKET_SUMMARY);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Market API error:", error);
    // Fallback về mock data nếu n8n lỗi
    return NextResponse.json({ ...marketSummary, topMovers });
  }
}
