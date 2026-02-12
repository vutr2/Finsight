import { newsItems } from "@/lib/mock-data";
import { analyzeSentiment } from "@/lib/sentiment";
import { NextResponse } from "next/server";

/**
 * GET /api/news?limit=10
 * Tin tuc tu VnExpress RSS (kinh doanh)
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || "10");

  try {
    const res = await fetch("https://vnexpress.net/rss/kinh-doanh.rss", {
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

    const xml = await res.text();
    const items = parseRSS(xml).slice(0, limit);

    if (items.length === 0) throw new Error("No items parsed from RSS");

    return NextResponse.json({ items });
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json({ items: newsItems.slice(0, limit) });
  }
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  let id = 1;

  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const title = extractTag(content, "title");
    const description = extractTag(content, "description");
    const pubDate = extractTag(content, "pubDate");

    if (!title) continue;

    items.push({
      id: id++,
      title: cleanHTML(title),
      source: "VnExpress",
      time: formatTime(pubDate),
      sentiment: analyzeSentiment(cleanHTML(title), cleanHTML(description)),
      summary: cleanHTML(description).slice(0, 200),
    });
  }

  return items;
}

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}>([\\s\\S]*?)</${tag}>`));
  return match ? (match[1] || match[2] || "").trim() : "";
}

function cleanHTML(html) {
  return html.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim();
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Vua xong";
  if (hours < 24) return hours + " gio truoc";
  const days = Math.floor(hours / 24);
  return days + " ngay truoc";
}

