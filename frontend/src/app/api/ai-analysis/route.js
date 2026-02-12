import { NextResponse } from "next/server";

import { getQuotes, getHistory, parseQuote, parseHistory } from "@/lib/vps";
import { calcRSI, calcMACD, calcBollinger } from "@/lib/indicators";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request) {
  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === "your_api_key_here") {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY chua duoc cau hinh" },
      { status: 500 }
    );
  }

  try {
    const { symbol } = await request.json();
    if (!symbol) {
      return NextResponse.json({ error: "Thieu ma co phieu" }, { status: 400 });
    }

    // Fetch stock data directly from VPS
    const [quotes, hist] = await Promise.all([
      getQuotes([symbol.toUpperCase()]),
      getHistory(symbol.toUpperCase(), 45),
    ]);
    if (!quotes || quotes.length === 0) throw new Error(`No data for ${symbol}`);

    const q = parseQuote(quotes[0]);
    const bars = parseHistory(hist);
    const closes = hist.c.map((p) => p * 1000);

    const stock = {
      ...q,
      rsi: calcRSI(closes),
      macd: calcMACD(closes),
      bollingerBands: calcBollinger(closes),
      priceHistory: bars.slice(-10),
    };

    // Build prompt with real data
    const prompt = `Ban la chuyen gia giao duc tai chinh Viet Nam. Hay phan tich co phieu ${stock.symbol} dua tren du lieu sau va GIAI THICH cac chi so cho nguoi moi hoc dau tu.

QUAN TRONG: Day la phan tich GIAO DUC. KHONG duoc khuyen nghi mua/ban. Chi giai thich y nghia cua cac chi so.

Du lieu hien tai:
- Gia: ${stock.price.toLocaleString()} VND
- Thay doi: ${stock.change > 0 ? "+" : ""}${stock.changePercent}%
- Mo cua: ${stock.open.toLocaleString()} | Cao nhat: ${stock.high.toLocaleString()} | Thap nhat: ${stock.low.toLocaleString()}
- Khoi luong: ${stock.volume}

Chi bao ky thuat:
- RSI(14): ${stock.rsi}
- MACD: value=${stock.macd.value}, signal=${stock.macd.signal}, histogram=${stock.macd.histogram}
- Bollinger Bands: upper=${stock.bollingerBands.upper.toLocaleString()}, middle=${stock.bollingerBands.middle.toLocaleString()}, lower=${stock.bollingerBands.lower.toLocaleString()}

Lich su gia 10 phien gan nhat:
${stock.priceHistory.map((d) => `${d.date}: O=${d.open} H=${d.high} L=${d.low} C=${d.close} V=${d.volume}`).join("\n")}

Hay viet bao cao phan tich bang tieng Viet, bao gom:
1. TONG QUAN: Tinh hinh gia va xu huong ngan han
2. PHAN TICH CHI BAO: Giai thich RSI, MACD, Bollinger co y nghia gi (danh cho nguoi moi)
3. NHAN DINH: Diem dang chu y ve co phieu nay

Ket thuc bang disclaimer: "Day la phan tich mang tinh giao duc, khong phai khuyen nghi dau tu."`;

    // Call Claude API
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      console.error("Claude API error:", err);
      throw new Error(`Claude API ${claudeRes.status}`);
    }

    const claudeData = await claudeRes.json();
    const report = claudeData.content?.[0]?.text || "Khong the tao bao cao.";

    return NextResponse.json({ report, symbol: stock.symbol });
  } catch (error) {
    console.error("AI Analysis error:", error);
    return NextResponse.json(
      { error: "Khong the tao bao cao AI. Vui long thu lai." },
      { status: 500 }
    );
  }
}
