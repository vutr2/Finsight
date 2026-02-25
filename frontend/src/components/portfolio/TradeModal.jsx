'use client';

import { useState, useEffect, useCallback } from 'react';

const fmt = (n) => (n != null ? Math.round(n).toLocaleString('vi-VN') : '—');
const fmtPrice = (n) => (n != null ? (n / 1000).toFixed(1) : '—'); // hiển thị theo nghìn đồng như app thật

// Loại lệnh
const ORDER_TYPES = [
  { id: 'LO', label: 'LO', desc: 'Giới hạn' },
  { id: 'MP', label: 'MP', desc: 'Thị trường' },
  { id: 'ATO', label: 'ATO', desc: 'Mở cửa' },
  { id: 'ATC', label: 'ATC', desc: 'Đóng cửa' },
];

export default function TradeModal({ symbol, type, currentPrice, cash, holding, quote, onClose, onConfirm, trading }) {
  const isBuy = type === 'buy';

  const [orderType, setOrderType] = useState('LO');
  const [priceInput, setPriceInput] = useState(() =>
    currentPrice ? (currentPrice / 1000).toFixed(1) : ''
  );
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  // Derived
  const isMarketOrder = orderType === 'MP' || orderType === 'ATO' || orderType === 'ATC';
  const execPrice = isMarketOrder ? (currentPrice ?? 0) : (parseFloat(priceInput) * 1000 || 0);
  const qty = parseInt(quantity, 10) || 0;
  const total = qty * execPrice;

  const maxQty = isBuy
    ? (execPrice > 0 ? Math.floor((cash ?? 0) / execPrice) : 0)
    : (holding?.quantity ?? 0);

  // Giá tham chiếu để tính % thay đổi
  const refPrice = quote?.open ?? currentPrice ?? 0;
  const ceiling = quote?.ceiling ?? (refPrice * 1.07);
  const floor = quote?.floor ?? (refPrice * 0.93);

  // Lãi/lỗ ước tính khi bán
  const estPnl = !isBuy && holding ? (execPrice - holding.avgCost) * qty : null;
  const estPnlPct = !isBuy && holding && holding.avgCost > 0 ? ((execPrice - holding.avgCost) / holding.avgCost) * 100 : null;

  // Reset form when symbol/type changes (not on currentPrice updates to avoid cascading renders)
  useEffect(() => {
    setPriceInput(currentPrice ? (currentPrice / 1000).toFixed(1) : '');
    setQuantity('');
    setError('');
    setOrderType('LO');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, type]);

  const handlePriceChange = useCallback((val) => {
    // Cho phép nhập số thập phân
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setPriceInput(val);
      setError('');
    }
  }, []);

  const handleQtyChange = useCallback((val) => {
    if (val === '' || /^\d+$/.test(val)) {
      setQuantity(val);
      setError('');
    }
  }, []);

  // Quick fill: % of max
  function fillQty(pct) {
    const q = Math.floor(maxQty * pct);
    setQuantity(q > 0 ? String(q) : '0');
  }

  // Click giá bid/ask
  function setQuickPrice(price) {
    if (price) setPriceInput((price / 1000).toFixed(1));
  }

  async function handleConfirm() {
    if (qty < 1) { setError('Vui lòng nhập số lượng'); return; }
    if (!isMarketOrder && execPrice <= 0) { setError('Vui lòng nhập giá hợp lệ'); return; }
    if (!isMarketOrder && execPrice > ceiling * 1.01) { setError(`Giá vượt trần (${fmt(Math.round(ceiling))})`); return; }
    if (!isMarketOrder && execPrice < floor * 0.99) { setError(`Giá dưới sàn (${fmt(Math.round(floor))})`); return; }
    if (isBuy && total > (cash ?? 0)) { setError('Số dư không đủ'); return; }
    if (!isBuy && qty > (holding?.quantity ?? 0)) { setError('Không đủ cổ phiếu để bán'); return; }

    const result = await onConfirm(type, symbol, qty, execPrice || currentPrice);
    if (result?.error) setError(result.error);
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  const canSubmit = !trading && qty > 0 && qty <= maxQty && (isMarketOrder || execPrice > 0);

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'var(--bg-surface)',
        border: `1px solid ${isBuy ? 'rgba(0,214,143,0.3)' : 'rgba(255,71,87,0.3)'}`,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: isBuy
          ? '0 0 40px rgba(0,214,143,0.1)'
          : '0 0 40px rgba(255,71,87,0.1)',
      }}>

        {/* ── HEADER ── */}
        <div style={{
          background: isBuy ? 'rgba(0,214,143,0.08)' : 'rgba(255,71,87,0.08)',
          borderBottom: `1px solid ${isBuy ? 'rgba(0,214,143,0.2)' : 'rgba(255,71,87,0.2)'}`,
          padding: '14px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 800,
              background: isBuy ? 'var(--bull)' : 'var(--bear)',
              color: 'var(--bg-base)', letterSpacing: '0.06em',
            }}>
              {isBuy ? 'MUA' : 'BÁN'}
            </span>
            <span className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
              {symbol}
            </span>
            {currentPrice && (
              <span className="font-mono" style={{ fontSize: '13px', color: isBuy ? 'var(--bull)' : 'var(--bear)' }}>
                {fmtPrice(currentPrice)}
              </span>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '18px', cursor: 'pointer', lineHeight: 1, padding: '4px' }}>
            ✕
          </button>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* ── LOẠI LỆNH ── */}
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Loại lệnh</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {ORDER_TYPES.map((ot) => (
                <button
                  key={ot.id}
                  onClick={() => { setOrderType(ot.id); setError(''); }}
                  style={{
                    flex: 1, padding: '7px 4px', borderRadius: '4px', cursor: 'pointer',
                    border: orderType === ot.id
                      ? `1px solid ${isBuy ? 'var(--bull)' : 'var(--bear)'}`
                      : '1px solid var(--bg-border)',
                    background: orderType === ot.id
                      ? (isBuy ? 'rgba(0,214,143,0.12)' : 'rgba(255,71,87,0.12)')
                      : 'var(--bg-elevated)',
                    color: orderType === ot.id ? 'var(--text-primary)' : 'var(--text-muted)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{ot.id}</span>
                  <span style={{ fontSize: '9px', opacity: 0.7 }}>{ot.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── GIÁ + KHỐI LƯỢNG ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {/* Giá */}
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Giá <span style={{ fontSize: '10px', opacity: 0.6 }}>(nghìn đ)</span>
              </p>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  inputMode="decimal"
                  value={isMarketOrder ? orderType : priceInput}
                  onChange={(e) => !isMarketOrder && handlePriceChange(e.target.value)}
                  disabled={isMarketOrder}
                  placeholder="0.0"
                  style={{
                    width: '100%', height: '42px', textAlign: 'center',
                    background: isMarketOrder ? 'rgba(255,255,255,0.03)' : 'var(--bg-elevated)',
                    border: `1px solid ${isMarketOrder ? 'var(--bg-border)' : (isBuy ? 'rgba(0,214,143,0.4)' : 'rgba(255,71,87,0.4)')}`,
                    borderRadius: '6px',
                    color: isMarketOrder ? 'var(--text-muted)' : 'var(--text-primary)',
                    fontSize: '16px', fontFamily: 'var(--font-mono)', fontWeight: 700,
                    outline: 'none', boxSizing: 'border-box',
                    cursor: isMarketOrder ? 'not-allowed' : 'text',
                  }}
                />
              </div>
              {/* Trần / Sàn */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <button onClick={() => !isMarketOrder && setQuickPrice(ceiling)} style={{ fontSize: '10px', color: 'var(--bull)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', padding: 0 }}>
                  Trần {fmtPrice(ceiling)}
                </button>
                <button onClick={() => !isMarketOrder && setQuickPrice(floor)} style={{ fontSize: '10px', color: 'var(--bear)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', padding: 0 }}>
                  Sàn {fmtPrice(floor)}
                </button>
              </div>
            </div>

            {/* Khối lượng */}
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                KL <span style={{ fontSize: '10px', opacity: 0.6 }}>(cổ phiếu)</span>
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={quantity}
                onChange={(e) => handleQtyChange(e.target.value)}
                placeholder="0"
                style={{
                  width: '100%', height: '42px', textAlign: 'center',
                  background: 'var(--bg-elevated)',
                  border: `1px solid ${qty > 0 && qty <= maxQty ? (isBuy ? 'rgba(0,214,143,0.4)' : 'rgba(255,71,87,0.4)') : 'var(--bg-border)'}`,
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '16px', fontFamily: 'var(--font-mono)', fontWeight: 700,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              {/* Quick fill */}
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                {[0.25, 0.5, 0.75, 1].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => fillQty(pct)}
                    style={{
                      flex: 1, fontSize: '10px', padding: '2px 0',
                      background: 'var(--bg-elevated)', border: '1px solid var(--bg-border)',
                      borderRadius: '3px', color: 'var(--text-muted)', cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {pct === 1 ? 'Max' : `${pct * 100}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── BID / ASK TABLE ── */}
          {quote && (
            <div style={{ background: 'var(--bg-elevated)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--bg-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', fontSize: '11px' }}>
                {/* Header */}
                <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--bg-border)', borderRight: '1px solid var(--bg-border)', color: 'var(--bull)', fontWeight: 600, textAlign: 'center', letterSpacing: '0.06em' }}>
                  DƯ MUA
                </div>
                <div style={{ padding: '6px 10px', borderBottom: '1px solid var(--bg-border)', color: 'var(--bear)', fontWeight: 600, textAlign: 'center', letterSpacing: '0.06em' }}>
                  DƯ BÁN
                </div>

                {/* Bid rows */}
                {[1, 2, 3].map((i) => {
                  const p = quote[`priceBid${i}`];
                  const v = quote[`quantityBid${i}`];
                  const ap = quote[`priceAsk${i}`];
                  const av = quote[`quantityAsk${i}`];
                  if (!p && !ap) return null;
                  return [
                    <button
                      key={`bid${i}`}
                      onClick={() => setQuickPrice(p)}
                      style={{
                        padding: '5px 10px', border: 'none', borderRight: '1px solid var(--bg-border)',
                        background: 'transparent', cursor: p ? 'pointer' : 'default',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                      onMouseEnter={(e) => p && (e.currentTarget.style.background = 'rgba(0,214,143,0.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span className="font-mono" style={{ color: 'var(--bull)', fontSize: '11px', fontWeight: 600 }}>{fmtPrice(p)}</span>
                      <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{v ? (v / 10).toFixed(0) : '—'}</span>
                    </button>,
                    <button
                      key={`ask${i}`}
                      onClick={() => setQuickPrice(ap)}
                      style={{
                        padding: '5px 10px', border: 'none',
                        background: 'transparent', cursor: ap ? 'pointer' : 'default',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                      onMouseEnter={(e) => ap && (e.currentTarget.style.background = 'rgba(255,71,87,0.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span className="font-mono" style={{ color: 'var(--bear)', fontSize: '11px', fontWeight: 600 }}>{fmtPrice(ap)}</span>
                      <span className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{av ? (av / 10).toFixed(0) : '—'}</span>
                    </button>,
                  ];
                })}
              </div>
            </div>
          )}

          {/* ── SUMMARY ── */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--bg-border)',
            borderRadius: '6px',
            padding: '10px 14px',
            display: 'flex', flexDirection: 'column', gap: '6px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Giá × KL</span>
              <span className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: isBuy ? 'var(--bear)' : 'var(--bull)' }}>
                {qty > 0 && execPrice > 0 ? `${isBuy ? '−' : '+'}${fmt(total)} đ` : '—'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{isBuy ? 'Tiền còn lại' : 'Tiền thu về'}</span>
              <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {qty > 0 && execPrice > 0 ? `${fmt(isBuy ? (cash ?? 0) - total : (cash ?? 0) + total)} đ` : `${fmt(cash ?? 0)} đ`}
              </span>
            </div>
            {!isBuy && estPnl !== null && qty > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid var(--bg-border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lãi/Lỗ ước tính</span>
                <span className="font-mono" style={{ fontSize: '12px', fontWeight: 600, color: estPnl >= 0 ? 'var(--bull)' : 'var(--bear)' }}>
                  {estPnl >= 0 ? '+' : ''}{fmt(estPnl)} đ ({estPnlPct >= 0 ? '+' : ''}{estPnlPct?.toFixed(2)}%)
                </span>
              </div>
            )}
            {!isBuy && holding && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Đang nắm giữ</span>
                <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {holding.quantity.toLocaleString('vi-VN')} cp · vốn {fmtPrice(holding.avgCost)}
                </span>
              </div>
            )}
          </div>

          {/* ── ERROR ── */}
          {error && (
            <div style={{ fontSize: '12px', color: 'var(--bear)', background: 'var(--bear-dim)', padding: '8px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* ── CONFIRM BUTTON ── */}
          <button
            onClick={handleConfirm}
            disabled={!canSubmit}
            style={{
              padding: '13px',
              borderRadius: '6px', border: 'none',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              fontSize: '14px', fontWeight: 800, letterSpacing: '0.04em',
              background: !canSubmit
                ? 'var(--bg-elevated)'
                : isBuy
                ? 'linear-gradient(135deg, #00c47a, #00d68f)'
                : 'linear-gradient(135deg, #e03040, #ff4757)',
              color: canSubmit ? 'var(--bg-base)' : 'var(--text-muted)',
              boxShadow: canSubmit
                ? isBuy ? '0 4px 16px rgba(0,214,143,0.3)' : '0 4px 16px rgba(255,71,87,0.3)'
                : 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={(e) => { if (canSubmit) e.currentTarget.style.opacity = '1'; }}
          >
            {trading
              ? '⏳ Đang đặt lệnh...'
              : canSubmit
              ? `${isBuy ? 'Đặt lệnh MUA' : 'Đặt lệnh BÁN'} ${qty.toLocaleString('vi-VN')} ${symbol} · ${isMarketOrder ? orderType : `${priceInput}k`}`
              : `${isBuy ? 'Đặt lệnh MUA' : 'Đặt lệnh BÁN'}`
            }
          </button>

          {/* Demo tag */}
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', opacity: 0.6 }}>
            DEMO — Không có tiền thật. Giá thực tế từ sàn HOSE/HNX.
          </p>
        </div>
      </div>
    </div>
  );
}
