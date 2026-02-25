'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const PRO_FEATURES = [
  { icon: '💼', text: 'Giao dịch demo với 100 triệu VNĐ' },
  { icon: '🤖', text: 'Chat AI phân tích cổ phiếu không giới hạn' },
  { icon: '🎯', text: 'Khuyến nghị Mua / Bán từ AI' },
  { icon: '🧠', text: 'Điểm tâm lý 1–10 cho mọi cổ phiếu' },
];

export default function UpgradePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  async function handleUpgrade() {
    setError('');
    setPaying(true);
    try {
      const res = await fetch('/api/vnpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.userId ?? user?.sub ?? '',
          amount: 50000,
          planId: 'pro_monthly',
          cycle: 'monthly',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.paymentUrl) {
        setError(data.error || 'Không thể tạo thanh toán. Vui lòng thử lại.');
        return;
      }
      window.location.href = data.paymentUrl;
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setPaying(false);
    }
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '70vh', padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #b07d2a 0%, #d4a84b 50%, #c99840 100%)',
          borderRadius: 'var(--radius-md)',
          padding: '32px 28px 28px',
          marginBottom: '16px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-30px', right: '-30px',
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
          }} />
          <span style={{
            display: 'inline-block',
            fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em',
            background: 'rgba(255,255,255,0.25)', color: '#fff',
            padding: '3px 8px', borderRadius: '4px', marginBottom: '12px',
          }}>PRO</span>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '8px' }}>
            Finsight Pro
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
            Mở khoá toàn bộ tính năng AI & giao dịch nâng cao
          </p>
        </div>

        {/* Features */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--bg-border)',
          borderRadius: 'var(--radius-md)', padding: '24px 28px', marginBottom: '16px',
        }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            Bao gồm trong Pro
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {PRO_FEATURES.map((f) => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{f.icon}</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price + CTA */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--bg-border)',
          borderRadius: 'var(--radius-md)', padding: '20px 28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                50.000₫
                <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>/ tháng</span>
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Huỷ bất kỳ lúc nào</p>
            </div>
          </div>

          {error && (
            <p style={{
              fontSize: '13px', color: 'var(--bear)', marginBottom: '12px',
              padding: '10px 12px', background: 'var(--bear-dim)', borderRadius: 'var(--radius-sm)',
            }}>
              {error}
            </p>
          )}

          <button
            onClick={handleUpgrade}
            disabled={paying}
            style={{
              width: '100%', padding: '14px',
              borderRadius: 'var(--radius-sm)', border: 'none',
              background: paying ? 'var(--bg-border)' : 'linear-gradient(135deg, #b07d2a, #d4a84b)',
              color: paying ? 'var(--text-muted)' : '#fff',
              fontSize: '15px', fontWeight: 700,
              cursor: paying ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => { if (!paying) e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            {paying ? 'Đang chuyển hướng...' : 'Thanh toán qua VNPAY'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Được bảo mật bởi</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0066aa' }}>VNPAY</span>
          </div>
        </div>

        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
          Tài khoản Free vẫn xem được thị trường, tin tức và khoá học miễn phí
        </p>
      </div>
    </div>
  );
}
