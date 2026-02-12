import { callN8n, ACTIONS } from "@/lib/n8n";
import { newsItems } from "@/lib/mock-data";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "10";

  try {
    if (!process.env.N8N_WEBHOOK_BASE_URL) {
      return NextResponse.json({ items: newsItems.slice(0, Number(limit)) });
    }

    const data = await callN8n(ACTIONS.NEWS, { limit });
    return NextResponse.json(data);
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json({ items: newsItems.slice(0, Number(limit)) });
  }
}
