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
    <div className="flex items-start justify-between gap-2 py-2.5 border-b border-card-border last:border-0">
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-muted">{label}</span>
        {explanation && (
          <div className="group relative">
            <Info size={13} className="text-muted cursor-help" />
            <div className="absolute bottom-full left-0 z-10 mb-1 hidden w-64 rounded-lg border border-card-border bg-card-bg p-3 text-xs text-muted shadow-lg group-hover:block">
              {explanation}
            </div>
          </div>
        )}
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function AnalysisContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const { data: stockData, loading } = useStock(query);

  if (!query) {
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Phan tich co phieu</h1>
          <p className="text-sm text-muted">Nhap ma co phieu de xem du lieu, bieu do va giai thich chi tiet.</p>
        </div>
        <SearchBar placeholder="Nhap ma co phieu (VD: VCB, FPT)..." />
        <section>
          <h2 className="mb-3 text-sm font-semibold text-muted uppercase tracking-wider">
            Co phieu pho bien
          </h2>
          <div className="flex flex-wrap gap-2">
            {topMovers.map((s) => (
              <Link
                key={s.symbol}
                href={`/analysis?q=${s.symbol}`}
                className="rounded-full border border-card-border bg-card-bg px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent transition-colors"
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
        <Loader2 size={28} className="animate-spin text-accent" />
      </div>
    );
  }

  const stock = stockData || { ...fallbackStock, symbol: query };
  const history = stockData?.priceHistory || fallbackHistory;
  const isUp = stock.change >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/analysis" className="flex h-9 w-9 items-center justify-center rounded-lg border border-card-border text-muted hover:text-foreground hover:border-foreground/20 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{stock.symbol}</h1>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${isUp ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
              {isUp ? "+" : ""}{stock.changePercent?.toFixed(2)}%
            </span>
          </div>
          <p className="text-sm text-muted">{stock.name}</p>
        </div>
        <div className="text-right">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold">{formatPrice(stock.price)}</span>
            <span className="text-sm text-muted pb-1">VND</span>
          </div>
          <div className="mt-0.5 flex items-center justify-end gap-1">
            {isUp ? <TrendingUp size={14} className="text-success" /> : <TrendingDown size={14} className="text-danger" />}
            <span className={`text-sm font-medium ${isUp ? "text-success" : "text-danger"}`}>
              {isUp ? "+" : ""}{stock.change?.toFixed(2)}%
            </span>
            <span className="text-xs text-muted">hom nay</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Chart + Technical */}
        <div className="col-span-2 space-y-6">
          {/* Chart */}
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Bieu do gia</h2>
              <div className="flex gap-1">
                {["1T", "1Th", "3Th", "1N"].map((period) => (
                  <button
                    key={period}
                    className="rounded-md px-3 py-1.5 text-xs text-muted hover:bg-accent/10 hover:text-accent first:bg-accent/15 first:text-accent transition-colors"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <PriceChart data={history} />
          </Card>

          {/* Technical Indicators */}
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="font-semibold">Chi bao ky thuat</h2>
              <span className="rounded-full bg-info/15 px-2 py-0.5 text-xs text-info">Giao duc</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* RSI */}
              <div className="rounded-xl border border-card-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">RSI (14)</span>
                  <span className="text-lg font-bold text-accent">{stock.rsi}</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-card-border">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${stock.rsi}%` }} />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-muted">
                  <span>Oversold (30)</span>
                  <span>Trung tinh</span>
                  <span>Overbought (70)</span>
                </div>
                <p className="mt-3 text-xs text-muted leading-relaxed">
                  RSI = {stock.rsi} nam trong vung trung tinh. RSI do toc do thay doi gia trong 14 phien. {'>'} 70 co the dang overbought, {'<'} 30 co the dang oversold.
                </p>
              </div>

              {/* MACD */}
              <div className="rounded-xl border border-card-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">MACD</span>
                  <span className="text-lg font-bold text-success">{stock.macd?.value}</span>
                </div>
                <div className="mt-2 flex gap-4 text-xs text-muted">
                  <span>Signal: {stock.macd?.signal}</span>
                  <span>Histogram: {stock.macd?.histogram}</span>
                </div>
                <p className="mt-3 text-xs text-muted leading-relaxed">
                  MACD ({stock.macd?.value}) {'>'} Signal ({stock.macd?.signal}) cho thay xu huong ngan han dang tich cuc. MACD so sanh hai duong trung binh dong de nhan biet xu huong gia.
                </p>
              </div>
            </div>

            {/* Bollinger Bands - full width */}
            <div className="mt-4 rounded-xl border border-card-border p-4">
              <span className="text-sm font-medium">Bollinger Bands</span>
              <div className="mt-3 flex justify-between text-sm">
                <div className="text-center">
                  <p className="text-xs text-muted">Dai duoi</p>
                  <p className="mt-1 font-medium">{formatPrice(stock.bollingerBands?.lower)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted">Giua</p>
                  <p className="mt-1 font-bold text-accent">{formatPrice(stock.bollingerBands?.middle)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted">Dai tren</p>
                  <p className="mt-1 font-medium">{formatPrice(stock.bollingerBands?.upper)}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted leading-relaxed">
                Gia hien tai ({formatPrice(stock.price)}) nam giua dai giua va dai tren, cho thay gia dang o muc trung binh-cao. Bollinger Bands do do bien dong cua gia so voi trung binh.
              </p>
            </div>
          </Card>
        </div>

        {/* Right: Metrics + Glossary */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <Card>
            <h2 className="mb-2 font-semibold">Thong tin co ban</h2>
            <DataRow label="Gia mo cua" value={`${formatPrice(stock.open)}d`} />
            <DataRow label="Cao nhat" value={`${formatPrice(stock.high)}d`} />
            <DataRow label="Thap nhat" value={`${formatPrice(stock.low)}d`} />
            <DataRow label="Khoi luong" value={stock.volume} />
            <DataRow label="Von hoa" value={stock.marketCap} explanation="Tong gia tri co phieu luu hanh = Gia x So luong CP" />
            <DataRow label="P/E" value={stock.pe?.toFixed(1)} explanation="Ty le gia/loi nhuan. P/E cao = ky vong tang truong cao hoac dinh gia cao." />
            <DataRow label="P/B" value={stock.pb?.toFixed(1)} explanation="Ty le gia/gia tri so sach. P/B > 1 = thi truong danh gia cao hon gia tri so sach." />
            <DataRow label="EPS" value={`${formatPrice(stock.eps)}d`} explanation="Loi nhuan tren moi co phieu." />
            <DataRow label="Co tuc" value={stock.dividend} />
          </Card>

          {/* Related Glossary */}
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <BookOpen size={14} className="text-accent" />
              <h2 className="font-semibold">Thuat ngu lien quan</h2>
            </div>
            {glossaryTerms.slice(0, 3).map((term) => (
              <div key={term.term} className="border-b border-card-border py-2.5 last:border-0">
                <p className="text-sm font-semibold text-accent">{term.term}</p>
                <p className="mt-1 text-xs text-muted leading-relaxed">{term.definition}</p>
              </div>
            ))}
            <Link href="/education" className="mt-3 inline-block text-sm text-accent hover:underline">
              Xem them thuat ngu →
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="text-muted text-sm">Dang tai...</div>}>
      <AnalysisContent />
    </Suspense>
  );
}
