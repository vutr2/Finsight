'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reason = searchParams.get('reason');

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>

        {/* Error icon */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'var(--bear-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '28px', color: 'var(--bear)',
        }}>✕</div>

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
          Thanh toan khong thanh cong
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px' }}>
          {reason === 'invalid'
            ? 'Chu ky giao dich khong hop le. Neu ban da bi tru tien, vui long lien he ho tro.'
            : 'Giao dich bi huy hoac that bai. Ban co the thu lai bat ky luc nao.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => router.push('/dashboard/upgrade')}
            style={{
              width: '100%', padding: '13px',
              borderRadius: 'var(--radius-sm)', border: 'none',
              background: 'linear-gradient(135deg, #b07d2a, #d4a84b)',
              color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Thu lai
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              width: '100%', padding: '12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--bg-border)',
              background: 'transparent',
              color: 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Ve Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
