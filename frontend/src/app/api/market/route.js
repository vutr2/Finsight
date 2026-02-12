import { NextResponse } from "next/server";
import { getQuotes, getHistory, parseQuote, formatVolume } from "@/lib/vps";
import { marketSummary, topMovers } from "@/lib/mock-data";

const TOP_SYMBOLS = ["VCB", "FPT", "VNM", "HPG", "MBB", "VHM", "VIC", "MSN", "TCB", "SSI", "STB", "ACB", "VPB", "HDB", "TPB"];

export async function GET() {
  try {
    // Fetch all quotes + index histories in parallel — single network round-trip for quotes
    const [quotes, vnHist, hnxHist] = await Promise.all([
      getQuotes(TOP_SYMBOLS),
      getHistory("VNINDEX", 7),
      getHistory("HNXINDEX", 7),
    ]);

    // Parse indices from history data
    const vnIndex = parseIndex(vnHist);
    const hnxIndex = parseIndex(hnxHist);

    // Parse top movers from quotes
    const movers = quotes
      .map((q) => {
        const parsed = parseQuote(q);
        return {
          symbol: parsed.symbol,
          name: parsed.name,
          price: parsed.price,
          change: parsed.changePercent,
          volume: formatVolume(parsed.volume),
        };
      })
      .sort((a, b) => {
        // Sort by raw volume descending
        const volA = quotes.find((q) => q.sym === a.symbol)?.lot || 0;
        const volB = quotes.find((q) => q.sym === b.symbol)?.lot || 0;
        return volB - volA;
      })
      .slice(0, 10);

    // Total volume from VNINDEX
    const totalVol = vnHist.v[vnHist.v.length - 1] || 0;

    return NextResponse.json({
      vnIndex,
      hnxIndex,
      upcom: { value: 0, change: 0, changePercent: 0 },
      volume: formatVolume(totalVol),
      value: "0",
      topMovers: movers,
    });
  } catch (error) {
    console.error("Market API error:", error);
    return NextResponse.json({ ...marketSummary, topMovers });
  }
}

function parseIndex(hist) {
  if (!hist || !hist.c || hist.c.length < 2) {
    return { value: 0, change: 0, changePercent: 0 };
  }
  const last = hist.c[hist.c.length - 1];
  const prev = hist.c[hist.c.length - 2];
  const change = last - prev;
  const pct = prev ? (change / prev) * 100 : 0;
  return {
    value: Math.round(last * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(pct * 100) / 100,
  };
}
