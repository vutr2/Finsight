"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SearchBar from "@/components/ui/SearchBar";
import Card from "@/components/ui/Card";
import PriceChart from "@/components/charts/PriceChart";
import { useStock } from "@/lib/hooks";
import { stockDetail as fallbackStock, priceHistory as fallbackHistory, glossaryTerms, topMovers } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, Info, BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

function formatPrice(price) {
  return price.toLocaleString("vi-VN");
}

function DataRow({ label, value, explanation }) {
  return (
    <div className="flex items-start justify-between gap-2 py-2 border-b border-card-border last:border-0">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted">{label}</span>
        {explanation && (
          <div className="group relative">
            <Info size={12} className="text-muted cursor-help" />
            <div className="absolute bottom-full left-0 z-10 mb-1 hidden w-56 rounded-lg border border-card-border bg-card-bg p-2 text-xs text-muted shadow-lg group-hover:block">
              {explanation}
            </div>
          </div>
        )}
      </div>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}

function AnalysisContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const { data: stockData, loading } = useStock(query);

  if (!query) {
    return (
      <div className="space-y-5 px-4 pt-6">
        <h1 className="text-xl font-bold">Phân tích cổ phiếu</h1>
        <SearchBar placeholder="Nhập mã cổ phiếu (VD: VCB, FPT)..." />
        <p className="text-sm text-muted">
          Nhập mã cổ phiếu để xem dữ liệu, biểu đồ và giải thích chi tiết.
        </p>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wider">
            Cổ phiếu phổ biến
          </h2>
          <div className="flex flex-wrap gap-2">
            {topMovers.map((s) => (
              <Link
                key={s.symbol}
                href={`/analysis?q=${s.symbol}`}
                className="rounded-full border border-card-border bg-card-bg px-3 py-1.5 text-xs font-medium hover:border-accent hover:text-accent transition-colors"
              >
                {s.symbol}
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  const stock = stockData || { ...fallbackStock, symbol: query };
  const history = stockData?.priceHistory || fallbackHistory;
  const isUp = stock.change >= 0;

  return (
    <div className="space-y-4 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/analysis" className="text-muted hover:text-foreground">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{stock.symbol}</h1>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${isUp ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
              {isUp ? "+" : ""}{stock.changePercent?.toFixed(2)}%
            </span>
          </div>
          <p className="text-xs text-muted">{stock.name}</p>
        </div>
      </div>

      {/* Price */}
      <Card>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">{formatPrice(stock.price)}</span>
          <span className="text-sm text-muted">VND</span>
        </div>
        <div className="mt-1 flex items-center gap-1">
          {isUp ? <TrendingUp size={14} className="text-success" /> : <TrendingDown size={14} className="text-danger" />}
          <span className={`text-sm font-medium ${isUp ? "text-success" : "text-danger"}`}>
            {isUp ? "+" : ""}{stock.change?.toFixed(2)}%
          </span>
          <span className="text-xs text-muted">hôm nay</span>
        </div>
      </Card>

      {/* Chart */}
      <Card>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Biểu đồ giá</h2>
          <div className="flex gap-1">
            {["1T", "1Th", "3Th", "1N"].map((period) => (
              <button
                key={period}
                className="rounded-md px-2 py-1 text-xs text-muted hover:bg-accent/10 hover:text-accent first:bg-accent/15 first:text-accent"
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <PriceChart data={history} />
      </Card>

      {/* Key Metrics */}
      <Card>
        <h2 className="mb-2 text-sm font-semibold">Thông tin cơ bản</h2>
        <DataRow label="Giá mở cửa" value={`${formatPrice(stock.open)}đ`} />
        <DataRow label="Cao nhất" value={`${formatPrice(stock.high)}đ`} />
        <DataRow label="Thấp nhất" value={`${formatPrice(stock.low)}đ`} />
        <DataRow label="Khối lượng" value={stock.volume} />
        <DataRow
          label="Vốn hóa"
          value={stock.marketCap}
          explanation="Tổng giá trị cổ phiếu lưu hành = Giá × Số lượng CP"
        />
        <DataRow
          label="P/E"
          value={stock.pe?.toFixed(1)}
          explanation="Tỷ lệ giá/lợi nhuận. P/E cao = kỳ vọng tăng trưởng cao hoặc định giá cao."
        />
        <DataRow
          label="P/B"
          value={stock.pb?.toFixed(1)}
          explanation="Tỷ lệ giá/giá trị sổ sách. P/B > 1 nghĩa là thị trường đánh giá cao hơn giá trị sổ sách."
        />
        <DataRow label="EPS" value={`${formatPrice(stock.eps)}đ`} explanation="Lợi nhuận trên mỗi cổ phiếu." />
        <DataRow label="Cổ tức" value={stock.dividend} />
      </Card>

      {/* Technical Indicators */}
      <Card>
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-sm font-semibold">Chỉ báo kỹ thuật</h2>
          <span className="rounded-full bg-info/15 px-2 py-0.5 text-xs text-info">Giáo dục</span>
        </div>

        {/* RSI */}
        <div className="mb-3 rounded-xl bg-background p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">RSI (14)</span>
            <span className="text-sm font-bold text-accent">{stock.rsi}</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-card-border">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${stock.rsi}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-muted">
            <span>Oversold (30)</span>
            <span>Trung tính</span>
            <span>Overbought (70)</span>
          </div>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            📖 RSI = {stock.rsi} nằm trong vùng trung tính. RSI đo tốc độ thay đổi giá
            trong 14 phiên. Giá trị {'>'} 70 thường cho thấy cổ phiếu có thể đang được
            mua quá nhiều, {'<'} 30 có thể đang bị bán quá nhiều.
          </p>
        </div>

        {/* MACD */}
        <div className="mb-3 rounded-xl bg-background p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">MACD</span>
            <span className="text-sm font-bold text-success">{stock.macd?.value}</span>
          </div>
          <div className="mt-1 flex gap-4 text-xs text-muted">
            <span>Signal: {stock.macd?.signal}</span>
            <span>Histogram: {stock.macd?.histogram}</span>
          </div>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            📖 MACD ({stock.macd?.value}) {'>'} Signal ({stock.macd?.signal}) cho thấy
            xu hướng ngắn hạn đang tích cực. MACD so sánh hai đường trung bình động
            để nhận biết xu hướng giá.
          </p>
        </div>

        {/* Bollinger Bands */}
        <div className="rounded-xl bg-background p-3">
          <span className="text-xs font-medium">Bollinger Bands</span>
          <div className="mt-2 flex justify-between text-xs">
            <div className="text-center">
              <p className="text-muted">Dải dưới</p>
              <p className="font-medium">{formatPrice(stock.bollingerBands?.lower)}</p>
            </div>
            <div className="text-center">
              <p className="text-muted">Giữa</p>
              <p className="font-bold text-accent">{formatPrice(stock.bollingerBands?.middle)}</p>
            </div>
            <div className="text-center">
              <p className="text-muted">Dải trên</p>
              <p className="font-medium">{formatPrice(stock.bollingerBands?.upper)}</p>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            📖 Giá hiện tại ({formatPrice(stock.price)}) nằm giữa dải giữa và dải trên,
            cho thấy giá đang ở mức trung bình-cao. Bollinger Bands đo độ biến động
            của giá so với trung bình.
          </p>
        </div>
      </Card>

      {/* Related Glossary */}
      <Card>
        <div className="mb-2 flex items-center gap-2">
          <BookOpen size={14} className="text-accent" />
          <h2 className="text-sm font-semibold">Thuật ngữ liên quan</h2>
        </div>
        {glossaryTerms.slice(0, 3).map((term) => (
          <div key={term.term} className="border-b border-card-border py-2 last:border-0">
            <p className="text-xs font-semibold text-accent">{term.term}</p>
            <p className="mt-0.5 text-xs text-muted leading-relaxed">{term.definition}</p>
          </div>
        ))}
        <Link href="/education" className="mt-2 inline-block text-xs text-accent hover:underline">
          Xem thêm thuật ngữ →
        </Link>
      </Card>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="px-4 pt-6 text-muted text-sm">Đang tải...</div>}>
      <AnalysisContent />
    </Suspense>
  );
}
