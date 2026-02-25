'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';

// ── Helpers ──────────────────────────────────────────────────────────────────
function calcMA(data, period) {
  return data.map((d, i) => {
    if (i < period - 1) return null;
    const sum = data.slice(i - period + 1, i + 1).reduce((s, c) => s + c.close, 0);
    return { time: d.time, value: sum / period };
  }).filter(Boolean);
}

const RANGES = [
  { label: '1T',  days: 30   },
  { label: '3T',  days: 90   },
  { label: '6T',  days: 180  },
  { label: '1N',  days: 365  },
  { label: '3N',  days: 1095 },
  { label: '5N',  days: 1825 },
];

const MA_COLORS = { 5: '#e67e22', 10: '#8e44ad', 20: '#2980b9' };

const fmt    = (n) => n != null ? n.toLocaleString('vi-VN') : '—';
const fmtVol = (n) => {
  if (n == null) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K';
  return n.toLocaleString('vi-VN');
};

// ── Component ─────────────────────────────────────────────────────────────────
// Props:
//   symbol  — ticker string, e.g. "VNM"  (self-fetching mode)
//   data    — OHLCV array                (controlled mode — no range bar)
//   height  — px
export default function CandlestickChart({ symbol, data: dataProp, height = 380 }) {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);
  const candleRef    = useRef(null);
  const volumeRef    = useRef(null);
  const maRefs       = useRef({});

  const [rangeDays, setRangeDays] = useState(365);
  const [data,      setData]      = useState(dataProp ?? []);
  const [loading,   setLoading]   = useState(!!symbol);
  const [activeMA,  setActiveMA]  = useState({ 5: true, 10: true, 20: true });
  const [tooltip,   setTooltip]   = useState(null);

  // Keep a stable ref to the latest data so chart-build effect can read it
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  // ── Fetch when self-managed ───────────────────────────────────────────────
  useEffect(() => {
    if (!symbol) { setData(dataProp ?? []); return; }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/stocks?type=history&symbol=${symbol}&days=${rangeDays}`)
      .then((r) => r.json())
      .then((j) => { if (!cancelled) { setData(j.data ?? []); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [symbol, rangeDays, dataProp]);

  // ── Sync controlled data ──────────────────────────────────────────────────
  useEffect(() => {
    if (!symbol && dataProp) setData(dataProp);
  }, [dataProp, symbol]);

  // ── Push data into series (stable ref so both effects can call it) ──────────
  const pushData = useCallback((rows) => {
    if (!candleRef.current || !rows.length) return;
    const sorted = [...rows].sort((a, b) => a.time - b.time);
    try {
      candleRef.current.setData(sorted.map((d) => ({
        time: d.time, open: d.open, high: d.high, low: d.low, close: d.close,
      })));
      volumeRef.current?.setData(sorted.map((d) => ({
        time: d.time, value: d.volume ?? 0,
        color: d.close >= d.open ? 'rgba(10,143,92,0.3)' : 'rgba(217,38,56,0.3)',
      })));
      for (const p of [5, 10, 20]) maRefs.current[p]?.setData(calcMA(sorted, p));
      chartRef.current?.timeScale().fitContent();
    } catch { /* ignore */ }
  }, []);

  // ── Build chart (once) ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background:  { color: 'transparent' },
        textColor:   '#64748b',
        fontFamily:  "'Geist Mono', monospace",
        fontSize:    11,
      },
      grid: {
        vertLines: { color: '#f1f5f9' },
        horzLines: { color: '#f1f5f9' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#94a3b8', width: 1, style: 2, labelBackgroundColor: '#334155' },
        horzLine: { color: '#94a3b8', width: 1, style: 2, labelBackgroundColor: '#334155' },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.08, bottom: 0.28 },
        textColor: '#94a3b8',
      },
      timeScale: {
        borderVisible: false,
        timeVisible:   true,
        secondsVisible:false,
        fixLeftEdge:   true,
        tickMarkFormatter: (t) => {
          const d = new Date(t * 1000);
          return `${d.getDate()}/${d.getMonth() + 1}`;
        },
      },
      handleScroll: true,
      handleScale:  true,
      width:  containerRef.current.clientWidth,
      height,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor:        '#0a8f5c', downColor:      '#d92638',
      borderUpColor:  '#0a8f5c', borderDownColor:'#d92638',
      wickUpColor:    '#0a8f5c', wickDownColor:  '#d92638',
      priceLineVisible: true, priceLineWidth: 1,
      priceLineColor: '#94a3b8', priceLineStyle: 2,
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' }, priceScaleId: 'vol',
      lastValueVisible: false, priceLineVisible: false,
    });
    chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.78, bottom: 0 } });

    const maSeries = {};
    for (const p of [5, 10, 20]) {
      maSeries[p] = chart.addSeries(LineSeries, {
        color: MA_COLORS[p], lineWidth: 1,
        priceLineVisible: false, lastValueVisible: false,
        crosshairMarkerVisible: false,
      });
    }

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point) { setTooltip(null); return; }
      const candle = param.seriesData.get(candleSeries);
      const vol    = param.seriesData.get(volumeSeries);
      if (!candle) { setTooltip(null); return; }
      setTooltip({
        time: param.time,
        open: candle.open, high: candle.high, low: candle.low, close: candle.close,
        volume: vol?.value ?? null,
        isUp: candle.close >= candle.open,
        x: param.point.x,
        containerWidth: containerRef.current?.clientWidth ?? 600,
      });
    });

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    });
    ro.observe(containerRef.current);

    chartRef.current  = chart;
    candleRef.current = candleSeries;
    volumeRef.current = volumeSeries;
    maRefs.current    = maSeries;

    // Chart just built — push whatever data is already loaded
    pushData(dataRef.current);

    return () => { ro.disconnect(); chart.remove(); chartRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  // ── Re-push whenever data changes ────────────────────────────────────────
  useEffect(() => { pushData(data); }, [data, pushData]);

  // ── MA visibility ─────────────────────────────────────────────────────────
  useEffect(() => {
    for (const [p, v] of Object.entries(activeMA)) maRefs.current[p]?.applyOptions({ visible: v });
  }, [activeMA]);

  const toggleMA = useCallback((p) => setActiveMA((prev) => ({ ...prev, [p]: !prev[p] })), []);

  const ttLeft = tooltip
    ? (tooltip.x + 12 + 155 > tooltip.containerWidth ? tooltip.x - 165 : tooltip.x + 12)
    : 0;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative', width: '100%' }}>

      {/* ── Top bar: Range selector (left) + MA toggles (right) ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px',
        borderBottom: '1px solid var(--bg-border)',
      }}>
        {/* Range buttons */}
        <div style={{ display: 'flex', gap: '2px' }}>
          {RANGES.map((r) => {
            const active = symbol ? rangeDays === r.days : false;
            return (
              <button
                key={r.label}
                onClick={() => symbol && setRangeDays(r.days)}
                disabled={!symbol}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: symbol ? 'pointer' : 'default',
                  fontSize: '12px',
                  fontWeight: active ? 700 : 500,
                  fontFamily: "'Geist Mono', monospace",
                  background: active ? '#dbeafe' : 'transparent',
                  color: active ? '#1d4ed8' : 'var(--text-muted)',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={(e) => { if (symbol && !active) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                {r.label}
              </button>
            );
          })}
        </div>

        {/* MA toggles */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[5, 10, 20].map((p) => (
            <button
              key={p}
              onClick={() => toggleMA(p)}
              style={{
                padding: '3px 8px', borderRadius: '4px',
                border: `1px solid ${MA_COLORS[p]}`,
                background: activeMA[p] ? MA_COLORS[p] : 'transparent',
                color: activeMA[p] ? '#fff' : MA_COLORS[p],
                fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                fontFamily: "'Geist Mono', monospace",
                opacity: activeMA[p] ? 1 : 0.45,
                transition: 'all 0.15s',
              }}
            >
              MA{p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loading overlay ── */}
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, top: 41,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.8)', zIndex: 5,
          fontSize: '13px', color: 'var(--text-muted)', gap: '8px',
        }}>
          <span style={{
            display: 'inline-block', width: '14px', height: '14px',
            border: '2px solid var(--bg-border)', borderTopColor: '#1d4ed8',
            borderRadius: '50%', animation: 'spin 0.7s linear infinite',
          }} />
          Đang tải...
        </div>
      )}

      {/* ── Chart canvas ── */}
      <div ref={containerRef} style={{ width: '100%', height }} />

      {/* ── OHLCV Tooltip ── */}
      {tooltip && (
        <div style={{
          position: 'absolute', top: 50, left: ttLeft,
          pointerEvents: 'none',
          background: 'rgba(255,255,255,0.97)',
          border: `1px solid ${tooltip.isUp ? 'rgba(10,143,92,0.25)' : 'rgba(217,38,56,0.25)'}`,
          borderRadius: '6px', padding: '8px 12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          zIndex: 20, minWidth: '150px',
        }}>
          <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '5px', fontFamily: "'Geist Mono', monospace" }}>
            {(() => {
              const d = new Date(tooltip.time * 1000);
              return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
            })()}
          </p>
          {[
            ['Mở',   tooltip.open,  '#475569'],
            ['Cao',  tooltip.high,  '#0a8f5c'],
            ['Thấp', tooltip.low,   '#d92638'],
            ['Đóng', tooltip.close, tooltip.isUp ? '#0a8f5c' : '#d92638'],
          ].map(([label, val, color]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', lineHeight: '1.65' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: "'Geist Mono', monospace" }}>{label}</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color, fontFamily: "'Geist Mono', monospace" }}>{fmt(val)}</span>
            </div>
          ))}
          {tooltip.volume != null && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', marginTop: '5px', paddingTop: '5px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: "'Geist Mono', monospace" }}>KL</span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', fontFamily: "'Geist Mono', monospace" }}>{fmtVol(tooltip.volume)}</span>
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
