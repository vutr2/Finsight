'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const NAV = [
  { icon: '▦', label: 'Tổng quan', href: '/dashboard' },
  { icon: '📈', label: 'Cổ phiếu', href: '/dashboard/stock' },
  { icon: '💼', label: 'Danh mục', href: '/dashboard/portfolio', pro: true },
  { icon: '📰', label: 'Tin tức', href: '/dashboard/news' },
  { icon: '🤖', label: 'AI Chat', href: '/dashboard/ai-chat', pro: true },
  { icon: '🎓', label: 'Học đầu tư', href: '/dashboard/learn' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isPro } = useAuth();

  return (
    <aside
      style={{
        width: '220px',
        flexShrink: 0,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--bg-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        gap: '4px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px 20px' }}>
        <div
          style={{
            width: '26px', height: '26px',
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, var(--gold-dim), var(--gold))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0,
          }}
        >
          F
        </div>
        <span className="font-display" style={{ fontSize: '16px' }}>Finsight</span>
      </div>

      {/* Nav items */}
      {NAV.map((item) => {
        const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        const locked = item.pro && !isPro;

        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: 'var(--font-body)',
              background: active ? 'var(--gold-subtle)' : 'transparent',
              color: active ? 'var(--gold)' : locked ? 'var(--text-muted)' : 'var(--text-secondary)',
              borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
              transition: 'all 0.15s',
              textAlign: 'left',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.background = 'var(--bg-elevated)';
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: '15px', width: '18px', textAlign: 'center' }}>
              {item.icon}
            </span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.pro && (
              <span style={{
                fontSize: '9px', fontWeight: 800, letterSpacing: '0.08em',
                padding: '2px 5px', borderRadius: '3px',
                background: isPro ? 'var(--gold-subtle)' : 'rgba(176,125,42,0.12)',
                color: 'var(--gold)',
                flexShrink: 0,
              }}>
                PRO
              </span>
            )}
          </button>
        );
      })}

      {/* Upgrade prompt for free users */}
      {!isPro && (
        <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <button
            onClick={() => window.location.href = '/dashboard/upgrade'}
            style={{
              width: '100%', padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--gold-dim)',
              background: 'var(--gold-subtle)',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold)', marginBottom: '2px' }}>
              Nâng cấp Pro
            </p>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Mở khoá AI Chat & Giao dịch
            </p>
          </button>
        </div>
      )}
    </aside>
  );
}
