'use client';

import { useAuth } from '@/hooks/useAuth';

const PRO_FEATURES = [
  'Giao dịch demo với 100 triệu VNĐ',
  'Chat với AI phân tích cổ phiếu không giới hạn',
  'Khuyến nghị Mua / Bán từ AI',
  'Điểm tâm lý 1–10 cho mọi cổ phiếu',
];

// Wraps a page — renders children for Pro users, upgrade wall for Free users.
// Usage: <ProGate feature="AI Chat">...</ProGate>
export default function ProGate({ children, feature = 'tính năng này' }) {
  const { isPro, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-muted)', fontSize: '14px' }}>
        Đang tải...
      </div>
    );
  }

  if (isPro) return children;

  // ── Upgrade wall ─────────────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '440px', width: '100%',
        background: 'var(--bg-surface)',
        border: '1px solid var(--bg-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #b07d2a 0%, #d4a84b 50%, #c99840 100%)',
          padding: '28px 28px 24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{
              fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em',
              background: 'rgba(255,255,255,0.25)', color: '#fff',
              padding: '3px 8px', borderRadius: '4px',
            }}>PRO</span>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>Finsight Pro</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
            Nâng cấp để dùng {feature}
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', marginTop: '6px' }}>
            Gói Pro mở khoá toàn bộ tính năng nâng cao
          </p>
        </div>

        {/* Features list */}
        <div style={{ padding: '20px 28px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
            Bao gồm trong Pro
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {PRO_FEATURES.map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#0a8f5c', fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>✓</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '14px',
          }}>
            <div>
              <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
                50.000 <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-muted)' }}>đ/tháng</span>
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Huỷ bất kỳ lúc nào</p>
            </div>
            <button
              onClick={() => window.location.href = '/dashboard/upgrade'}
              style={{
                padding: '10px 22px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'linear-gradient(135deg, #b07d2a, #d4a84b)',
                color: '#fff',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Nâng cấp ngay
            </button>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
            Tài khoản Free vẫn xem được thị trường, tin tức và khóa học
          </p>
        </div>
      </div>
    </div>
  );
}
