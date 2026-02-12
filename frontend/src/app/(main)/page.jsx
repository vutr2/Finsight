"use client";

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
    <Card>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-xl font-bold">{value.toLocaleString("vi-VN", { minimumFractionDigits: 2 })}</p>
      <p className={`mt-0.5 text-sm font-medium ${isUp ? "text-success" : "text-danger"}`}>
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
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold">Tổng quan thị trường</h1>
        <p className="text-sm text-muted">Dữ liệu và tin tức cập nhật hôm nay</p>
      </div>

      {/* Market Summary - 3 col grid */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wider">
          Chỉ số chính
        </h2>
        {marketLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-3 w-16 rounded bg-card-border" />
                <div className="mt-2 h-6 w-24 rounded bg-card-border" />
                <div className="mt-1 h-4 w-20 rounded bg-card-border" />
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <IndexCard label="VN-Index" {...market.vnIndex} />
              <IndexCard label="HNX-Index" {...market.hnxIndex} />
              <IndexCard label="UPCOM" {...market.upcom} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Card className="text-center">
                <p className="text-xs text-muted">Tổng khối lượng</p>
                <p className="mt-1 font-bold">{market.volume}</p>
              </Card>
              <Card className="text-center">
                <p className="text-xs text-muted">Giá trị giao dịch</p>
                <p className="mt-1 font-bold">{market.value}</p>
              </Card>
            </div>
          </>
        )}
      </section>

      {/* Two Column: Top Movers + News */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Movers */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">
              Cổ phiếu nổi bật
            </h2>
            <Link href="/analysis" className="text-xs text-accent hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-2">
            {movers.slice(0, 6).map((stock) => {
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
                  <div className="flex items-start justify-between gap-3">
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
    </div>
  );
}
