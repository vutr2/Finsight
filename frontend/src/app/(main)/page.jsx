"use client";

import SearchBar from "@/components/ui/SearchBar";
import Card from "@/components/ui/Card";
import SentimentBadge from "@/components/ui/SentimentBadge";
import { useMarket, useNews } from "@/lib/hooks";
import { marketSummary as fallbackMarket, topMovers as fallbackMovers, newsItems as fallbackNews } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Newspaper } from "lucide-react";
import Link from "next/link";

function formatPrice(price) {
  return price.toLocaleString("vi-VN");
}

function IndexCard({ label, value, change, changePercent }) {
  const isUp = change >= 0;
  return (
    <Card className="min-w-[140px] flex-shrink-0">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-lg font-bold">{value.toLocaleString("vi-VN", { minimumFractionDigits: 2 })}</p>
      <p className={`mt-0.5 text-xs font-medium ${isUp ? "text-success" : "text-danger"}`}>
        {isUp ? "+" : ""}{change.toFixed(2)} ({isUp ? "+" : ""}{changePercent.toFixed(2)}%)
      </p>
    </Card>
  );
}

export default function HomePage() {
  const { data: marketData, loading: marketLoading } = useMarket();
  const { data: newsData, loading: newsLoading } = useNews(4);

  const market = marketData || fallbackMarket;
  const movers = marketData?.topMovers || fallbackMovers;
  const news = newsData?.items || fallbackNews;

  return (
    <div className="space-y-5 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Finsight</h1>
          <p className="text-sm text-muted">Thông tin thị trường hôm nay</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white">
          <span className="text-sm font-bold">F</span>
        </div>
      </div>

      {/* Search */}
      <SearchBar />

      {/* Market Summary */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wider">
          Tổng quan thị trường
        </h2>
        {marketLoading ? (
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="min-w-[140px] flex-shrink-0 animate-pulse">
                <div className="h-3 w-16 rounded bg-card-border" />
                <div className="mt-2 h-5 w-24 rounded bg-card-border" />
                <div className="mt-1 h-3 w-20 rounded bg-card-border" />
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="no-scrollbar flex gap-3 overflow-x-auto">
              <IndexCard label="VN-Index" {...market.vnIndex} />
              <IndexCard label="HNX-Index" {...market.hnxIndex} />
              <IndexCard label="UPCOM" {...market.upcom} />
            </div>
            <div className="mt-3 flex gap-3">
              <Card className="flex-1 text-center">
                <p className="text-xs text-muted">Khối lượng</p>
                <p className="mt-1 text-sm font-bold">{market.volume}</p>
              </Card>
              <Card className="flex-1 text-center">
                <p className="text-xs text-muted">Giá trị GD</p>
                <p className="mt-1 text-sm font-bold">{market.value}</p>
              </Card>
            </div>
          </>
        )}
      </section>

      {/* Top Movers */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">
            Cổ phiếu nổi bật
          </h2>
          <Link href="/analysis" className="text-xs text-accent">
            Xem tất cả
          </Link>
        </div>
        <div className="space-y-2">
          {movers.slice(0, 5).map((stock) => {
            const isUp = stock.change >= 0;
            return (
              <Link key={stock.symbol} href={`/analysis?q=${stock.symbol}`}>
                <Card className="flex items-center justify-between hover:border-accent/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      {isUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{stock.symbol}</p>
                      <p className="text-xs text-muted">{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatPrice(stock.price)}đ</p>
                    <p className={`text-xs font-medium ${isUp ? "text-success" : "text-danger"}`}>
                      {isUp ? "+" : ""}{stock.change.toFixed(2)}%
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* News */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Newspaper size={16} className="text-accent" />
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">
            Tin tức thị trường
          </h2>
        </div>
        <div className="space-y-2">
          {newsLoading ? (
            [1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-4 w-3/4 rounded bg-card-border" />
                <div className="mt-2 h-3 w-full rounded bg-card-border" />
                <div className="mt-1 h-3 w-1/2 rounded bg-card-border" />
              </Card>
            ))
          ) : (
            news.map((item) => (
              <Card key={item.id} className="hover:border-accent/30 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-snug">{item.title}</p>
                    <p className="mt-1 text-xs text-muted line-clamp-2">{item.summary}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-muted">{item.source}</span>
                      <span className="text-xs text-muted">•</span>
                      <span className="text-xs text-muted">{item.time}</span>
                    </div>
                  </div>
                  <SentimentBadge sentiment={item.sentiment} />
                </div>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
