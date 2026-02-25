'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDescope, useSession } from '@descope/nextjs-sdk/client';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { refresh } = useDescope();
  const { isSessionLoading } = useSession();
  const [refreshed, setRefreshed] = useState(false);

  // Force Descope to fetch a new token so plan='pro' is active immediately
  useEffect(() => {
    if (isSessionLoading) return;
    refresh()
      .catch((e) => console.warn('[payment/success] refresh failed', e))
      .finally(() => setRefreshed(true));
  }, [isSessionLoading, refresh]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '80vh', padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '480px', width: '100%' }}>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--bg-border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}>

          {/* Gold header */}
          <div style={{
            background: 'linear-gradient(135deg, #b07d2a 0%, #d4a84b 50%, #c99840 100%)',
            padding: '36px 32px 32px',
            textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-20px', right: '-20px',
              width: '100px', height: '100px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }} />
            {/* Checkmark */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '30px', color: '#fff',
            }}>✓</div>
            <span style={{
              display: 'inline-block',
              fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em',
              background: 'rgba(255,255,255,0.25)', color: '#fff',
              padding: '3px 8px', borderRadius: '4px', marginBottom: '12px',
            }}>PRO</span>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', lineHeight: 1.3, marginBottom: '8px' }}>
              Thanh toan thanh cong!
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
              Tai khoan cua ban da duoc nang cap len Finsight Pro
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '28px 32px' }}>
            <p style={{
              fontSize: '11px', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px',
            }}>Da mo khoa</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {[
                { icon: '💼', text: 'Giao dich demo voi 100 trieu VND' },
                { icon: '🤖', text: 'Chat AI phan tich co phieu khong gioi han' },
                { icon: '🎯', text: 'Khuyen nghi Mua / Ban tu AI' },
                { icon: '🧠', text: 'Diem tam ly 1-10 cho moi co phieu' },
              ].map((f) => (
                <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'var(--bull-dim)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '15px', flexShrink: 0,
                  }}>{f.icon}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{f.text}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--bull)', fontSize: '16px', fontWeight: 700 }}>✓</span>
                </div>
              ))}
            </div>

            {!refreshed && (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '16px' }}>
                Dang kich hoat tai khoan Pro...
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => router.push('/dashboard/portfolio')}
                style={{
                  width: '100%', padding: '13px',
                  borderRadius: 'var(--radius-sm)', border: 'none',
                  background: 'linear-gradient(135deg, #b07d2a, #d4a84b)',
                  color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Bat dau Giao dich Demo
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

        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
          Cam on ban da tin dung Finsight Pro
        </p>
      </div>
    </div>
  );
}
