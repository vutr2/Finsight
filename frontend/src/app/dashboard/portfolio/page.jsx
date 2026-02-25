'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useMarket } from '@/hooks/useStockData';
import TradeModal from '@/components/portfolio/TradeModal';

const CandlestickChart = dynamic(() => import('@/components/charts/CandlestickChart'), { ssr: false });

const fmt = (n) => (n != null ? Math.round(n).toLocaleString('vi-VN') : '—');
const fmtShort = (n) => {
  if (n == null) return '—';
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + ' tỷ';
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' tr';
  return fmt(n);
};
const fmtPrice = (n) => (n != null ? (n / 1000).toFixed(1) : '—');

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)}p trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h trước`;
  return new Date(iso).toLocaleDateString('vi-VN');
}

function HoldingChart({ symbol }) {
  return <CandlestickChart symbol={symbol} height={220} />;
}

export default function PortfolioPage() {
  const router = useRouter();
  const { cash, holdings, transactions, loading, trading, buy, sell, reset } = usePortfolio();
  const { data: market } = useMarket(30000);

  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [activeTab, setActiveTab] = useState('holdings');

  const enriched = useMemo(() => holdings.map((h) => {
    const q = market.find((m) => m.symbol === h.symbol);
    const currentPrice = q?.price ?? h.avgCost;
    const currentValue = currentPrice * h.quantity;
    const costBasis = h.avgCost * h.quantity;
    const pnl = currentValue - costBasis;
    const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    return { ...h, currentPrice, currentValue, pnl, pnlPct };
  }), [holdings, market]);

  const totalStockValue = enriched.reduce((s, h) => s + h.currentValue, 0);
  const totalValue = cash + totalStockValue;
  const totalCost = enriched.reduce((s, h) => s + h.avgCost * h.quantity, 0);
  const totalPnl = totalStockValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  const selectedHolding = enriched.find((h) => h.symbol === selected);
  const selectedQuote = market.find((m) => m.symbol === selected);

  async function handleTrade(type, symbol, quantity, price) {
    return type === 'buy' ? buy(symbol, quantity, price) : sell(symbol, quantity, price);
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted)', fontSize: '14px', gap: '10px' }}>
      <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid var(--bg-border)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      Đang tải danh mục...
    </div>
  );

  const pnlColor = totalPnl >= 0 ? 'var(--bull)' : 'var(--bear)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1200px' }}>

      {/* ── HEADER ROW ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch' }}>

        {/* Total Value Card */}
        <div style={{
          flex: '0 0 300px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--bg-border)',
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top left, rgba(201,168,76,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
            Tổng tài sản
          </p>
          <p className="font-mono" style={{ fontSize: '30px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {fmtShort(totalValue)}
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '6px' }}>VNĐ</span>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
            <span style={{
              fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600,
              color: pnlColor,
              background: totalPnl >= 0 ? 'var(--bull-dim)' : 'var(--bear-dim)',
              padding: '2px 8px', borderRadius: '4px',
            }}>
              {totalPnl >= 0 ? '+' : ''}{fmtShort(totalPnl)}
            </span>
            <span style={{ fontSize: '11px', color: pnlColor, fontFamily: 'var(--font-mono)' }}>
              {totalPnl >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}%
            </span>
          </div>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px' }}>
            DEMO · 100M khởi điểm
          </p>
        </div>

        {/* Stats row */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Tiền mặt', value: fmtShort(cash), sub: `${((cash / totalValue) * 100).toFixed(1)}% danh mục`, color: 'var(--gold)' },
            { label: 'Giá trị CP', value: fmtShort(totalStockValue), sub: `${enriched.length} mã`, color: 'var(--text-primary)' },
            { label: 'Lệnh đã đặt', value: transactions.length, sub: 'giao dịch', color: 'var(--text-secondary)' },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--bg-border)',
              borderRadius: 'var(--radius-md)', padding: '16px 20px',
            }}>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
                {s.label}
              </p>
              <p className="font-mono" style={{ fontSize: '20px', fontWeight: 700, color: s.color }}>
                {s.value}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{
          flex: '0 0 auto',
          background: 'var(--bg-surface)', border: '1px solid var(--bg-border)',
          borderRadius: 'var(--radius-md)', padding: '16px',
          display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center',
          minWidth: '120px',
        }}>
          <button
            onClick={() => setModal({ symbol: selected ?? 'VNM', type: 'buy' })}
            style={{
              padding: '10px 0', borderRadius: 'var(--radius-sm)', border: 'none',
              background: 'var(--bull)', color: '#000',
              fontSize: '13px', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.08em',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            MUA
          </button>
          <button
            onClick={() => selected && setModal({ symbol: selected, type: 'sell' })}
            disabled={!selected}
            style={{
              padding: '10px 0', borderRadius: 'var(--radius-sm)', border: 'none',
              background: selected ? 'var(--bear)' : 'var(--bg-elevated)',
              color: selected ? '#000' : 'var(--text-muted)',
              fontSize: '13px', fontWeight: 800, cursor: selected ? 'pointer' : 'not-allowed',
              letterSpacing: '0.08em', transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => { if (selected) e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={(e) => { if (selected) e.currentTarget.style.opacity = '1'; }}
          >
            BÁN
          </button>
          {selected && (
            <p style={{ fontSize: '10px', color: 'var(--gold)', textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              {selected}
            </p>
          )}
        </div>
      </div>

      {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', alignItems: 'start' }}>

        {/* LEFT: Chart */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>

          {/* Chart header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--bg-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {selected ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{selected}</p>
                  {selectedQuote && (
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                      <span className="font-mono">{fmt(selectedQuote.price)} đ</span>
                      <span style={{ marginLeft: '8px', color: (selectedQuote.pctChange ?? 0) >= 0 ? 'var(--bull)' : 'var(--bear)' }}>
                        {(selectedQuote.pctChange ?? 0) >= 0 ? '▲' : '▼'} {Math.abs(selectedQuote.pctChange ?? 0).toFixed(2)}%
                      </span>
                    </p>
                  )}
                </div>
                {selectedHolding && (
                  <div style={{ padding: '6px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--bg-border)' }}>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Đang nắm giữ</p>
                    <p className="font-mono" style={{ fontSize: '12px', color: selectedHolding.pnl >= 0 ? 'var(--bull)' : 'var(--bear)', fontWeight: 600 }}>
                      {selectedHolding.quantity.toLocaleString('vi-VN')} cp · {selectedHolding.pnl >= 0 ? '+' : ''}{fmtShort(selectedHolding.pnl)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Chọn cổ phiếu từ danh mục</p>
            )}
            {selected && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setModal({ symbol: selected, type: 'buy' })}
                  style={{ padding: '6px 14px', borderRadius: '4px', border: 'none', background: 'rgba(0,214,143,0.15)', color: 'var(--bull)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  Mua
                </button>
                {selectedHolding && (
                  <button onClick={() => setModal({ symbol: selected, type: 'sell' })}
                    style={{ padding: '6px 14px', borderRadius: '4px', border: 'none', background: 'rgba(255,71,87,0.15)', color: 'var(--bear)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                    Bán
                  </button>
                )}
              </div>
            )}
          </div>

          <div style={{ padding: selected ? '16px' : '0' }}>
            {selected ? (
              <HoldingChart symbol={selected} />
            ) : (
              <div style={{ height: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '10px' }}>
                <span style={{ fontSize: '36px', opacity: 0.2 }}>📈</span>
                <p style={{ fontSize: '13px' }}>Nhấn vào một cổ phiếu để xem biểu đồ</p>
              </div>
            )}
          </div>

          {/* Quick buy bar */}
          {market.length > 0 && (
            <div style={{ borderTop: '1px solid var(--bg-border)', padding: '12px 16px' }}>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', fontFamily: 'var(--font-mono)' }}>
                Mua nhanh
              </p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {market.slice(0, 10).map((s) => {
                  const chg = s.pctChange ?? 0;
                  return (
                    <button key={s.symbol} onClick={() => setModal({ symbol: s.symbol, type: 'buy' })}
                      style={{
                        padding: '5px 10px', borderRadius: '4px',
                        border: '1px solid var(--bg-border)',
                        background: 'var(--bg-elevated)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-dim)'; e.currentTarget.style.background = 'var(--gold-subtle)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--bg-border)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                    >
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{s.symbol}</span>
                      <span style={{ fontSize: '10px', color: chg >= 0 ? 'var(--bull)' : 'var(--bear)', fontFamily: 'var(--font-mono)' }}>
                        {chg >= 0 ? '+' : ''}{chg.toFixed(1)}%
                      </span>
                    </button>
                  );
                })}
                <button onClick={() => router.push('/dashboard/stock')}
                  style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid var(--bg-border)', background: 'transparent', cursor: 'pointer', fontSize: '11px', color: 'var(--text-muted)' }}>
                  Thêm →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Holdings / History */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>

          {/* Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--bg-border)' }}>
            {[
              { id: 'holdings', label: `Danh mục`, count: enriched.length },
              { id: 'history', label: `Lịch sử`, count: transactions.length },
            ].map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '12px 8px', border: 'none', cursor: 'pointer',
                  background: 'transparent',
                  borderBottom: activeTab === t.id ? '2px solid var(--gold)' : '2px solid transparent',
                  color: activeTab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '12px', fontWeight: activeTab === t.id ? 700 : 400,
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                {t.label}
                <span style={{
                  fontSize: '10px', fontFamily: 'var(--font-mono)',
                  background: activeTab === t.id ? 'var(--gold-subtle)' : 'var(--bg-elevated)',
                  color: activeTab === t.id ? 'var(--gold)' : 'var(--text-muted)',
                  padding: '1px 6px', borderRadius: '10px',
                }}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          <div style={{ overflowY: 'auto', maxHeight: '480px' }}>

            {/* HOLDINGS */}
            {activeTab === 'holdings' && (
              enriched.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '32px', marginBottom: '10px', opacity: 0.3 }}>💼</p>
                  <p style={{ fontSize: '13px', marginBottom: '4px' }}>Chưa có cổ phiếu nào</p>
                  <p style={{ fontSize: '11px', opacity: 0.6 }}>Nhấn MUA để bắt đầu</p>
                </div>
              ) : (
                <div>
                  {enriched.map((h) => {
                    const isSelected = selected === h.symbol;
                    return (
                      <div
                        key={h.symbol}
                        onClick={() => setSelected(isSelected ? null : h.symbol)}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--bg-border)',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(201,168,76,0.05)' : 'transparent',
                          borderLeft: `2px solid ${isSelected ? 'var(--gold)' : 'transparent'}`,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                        onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                                {h.symbol}
                              </span>
                              <span style={{
                                fontSize: '10px', padding: '1px 6px', borderRadius: '3px',
                                background: h.pnl >= 0 ? 'var(--bull-dim)' : 'var(--bear-dim)',
                                color: h.pnl >= 0 ? 'var(--bull)' : 'var(--bear)',
                                fontFamily: 'var(--font-mono)', fontWeight: 600,
                              }}>
                                {h.pnl >= 0 ? '+' : ''}{h.pnlPct.toFixed(1)}%
                              </span>
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>
                              {h.quantity.toLocaleString('vi-VN')} cp · vốn {fmtPrice(h.avgCost)}k
                            </p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {fmtShort(h.currentValue)}
                            </p>
                            <p className="font-mono" style={{ fontSize: '11px', color: h.pnl >= 0 ? 'var(--bull)' : 'var(--bear)', marginTop: '3px' }}>
                              {h.pnl >= 0 ? '+' : ''}{fmtShort(h.pnl)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* HISTORY */}
            {activeTab === 'history' && (
              transactions.length === 0 ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '13px' }}>Chưa có giao dịch nào</p>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div key={tx.id} style={{ padding: '11px 16px', borderBottom: '1px solid var(--bg-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '3px', letterSpacing: '0.04em',
                        background: tx.type === 'BUY' ? 'var(--bull-dim)' : 'var(--bear-dim)',
                        color: tx.type === 'BUY' ? 'var(--bull)' : 'var(--bear)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {tx.type === 'BUY' ? 'MUA' : 'BÁN'}
                      </span>
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{tx.symbol}</p>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                          {tx.quantity.toLocaleString('vi-VN')} × {fmtPrice(tx.price)}k
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="font-mono" style={{ fontSize: '12px', fontWeight: 600, color: tx.type === 'BUY' ? 'var(--bear)' : 'var(--bull)' }}>
                        {tx.type === 'BUY' ? '−' : '+'}{fmtShort(tx.total)}
                      </p>
                      <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{timeAgo(tx.created_at)}</p>
                    </div>
                  </div>
                ))
              )
            )}
          </div>

          {/* Reset footer */}
          <div style={{ borderTop: '1px solid var(--bg-border)', padding: '10px 16px', display: 'flex', justifyContent: 'flex-end' }}>
            {confirmReset ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reset về 100M?</span>
                <button onClick={async () => { await reset(); setConfirmReset(false); }}
                  style={{ padding: '4px 12px', borderRadius: '4px', border: 'none', background: 'var(--bear)', color: '#fff', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                  Xác nhận
                </button>
                <button onClick={() => setConfirmReset(false)}
                  style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--bg-border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}>
                  Huỷ
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmReset(true)}
                style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--bg-border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--bear)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
                ↺ Reset danh mục
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── TRADE MODAL ───────────────────────────────────────────────── */}
      {modal && (
        <TradeModal
          symbol={modal.symbol}
          type={modal.type}
          currentPrice={market.find((m) => m.symbol === modal.symbol)?.price ?? null}
          cash={cash}
          holding={enriched.find((h) => h.symbol === modal.symbol) ?? null}
          quote={market.find((m) => m.symbol === modal.symbol) ?? null}
          trading={trading}
          onClose={() => setModal(null)}
          onConfirm={handleTrade}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
