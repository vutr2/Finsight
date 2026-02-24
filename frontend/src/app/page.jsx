'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const FEATURES = [
  {
    icon: '📊',
    title: 'Dữ Liệu Thời Gian Thực',
    desc: 'Giá cổ phiếu HOSE & HNX cập nhật liên tục. Heatmap ngành và danh sách theo dõi cá nhân.',
    tag: 'Miễn phí',
    pro: false,
  },
  {
    icon: '📰',
    title: 'Tin Tức & Cảm Xúc Thị Trường',
    desc: 'AI tự động phân loại tin tức Tăng / Giảm / Trung lập cho từng cổ phiếu bạn theo dõi.',
    tag: 'Miễn phí',
    pro: false,
  },
  {
    icon: '🤖',
    title: 'AI Chat Phân Tích Cổ Phiếu',
    desc: 'Hỏi AI về bất kỳ mã nào. Nhận điểm tâm lý 1–10 và khuyến nghị Mua/Bán bằng tiếng Việt.',
    tag: 'Pro',
    pro: true,
  },
  {
    icon: '🎓',
    title: 'Học Đầu Tư Chứng Khoán',
    desc: 'Lộ trình từ cơ bản đến nâng cao — P/E, EPS, đọc biểu đồ nến — dành cho người mới.',
    tag: 'Miễn phí',
    pro: false,
  },
];

const FREE_FEATURES = [
  [true, 'Bảng giá HOSE & HNX thời gian thực'],
  [true, 'Tin tức thị trường tổng hợp'],
  [true, 'Học đầu tư cơ bản'],
  [false, 'AI Chat phân tích cổ phiếu'],
  [false, 'Điểm tâm lý & khuyến nghị Mua/Bán'],
];

const PRO_FEATURES = [
  'Tất cả tính năng Cơ bản',
  'AI Chat phân tích không giới hạn',
  'Điểm tâm lý 1–10 cho mọi cổ phiếu',
  'Khuyến nghị Mua/Bán chi tiết',
  'Cảnh báo biến động qua Zalo',
];

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      {/* Page-level responsive helpers not in globals.css */}
      <style>{`
        .nav-links { display: flex; gap: 28px; }
        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .pricing-row { display: flex; gap: 16px; flex-wrap: wrap; }

        @media (max-width: 720px) {
          .nav-links    { display: none !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .pricing-row  { flex-direction: column; align-items: center; }
        }
      `}</style>

      {/* ── Navbar ───────────────────────────────────────────── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          background: scrolled ? 'rgba(8,10,13,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled
            ? '1px solid var(--bg-border)'
            : '1px solid transparent',
          transition: 'all 0.3s',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: 'var(--radius-sm)',
              background:
                'linear-gradient(135deg, var(--gold-dim), var(--gold))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--bg-base)',
            }}
          >
            F
          </div>
          <span className="font-display" style={{ fontSize: '17px' }}>
            Finsight
          </span>
        </div>

        {/* Links */}
        <div className="nav-links">
          {['Tính năng', 'Giá cả', 'Học đầu tư'].map((l) => (
            <a
              key={l}
              href="#"
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) =>
                (e.target.style.color = 'var(--text-primary)')
              }
              onMouseLeave={(e) =>
                (e.target.style.color = 'var(--text-secondary)')
              }
            >
              {l}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn-ghost"
            style={{ padding: '8px 16px', fontSize: '13px' }}
            onClick={() => router.push('/login')}
          >
            Đăng nhập
          </button>
          <button
            className="btn-gold"
            style={{ padding: '8px 18px', fontSize: '13px' }}
            onClick={() => router.push('/login')}
          >
            Dùng miễn phí
          </button>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '140px 32px 100px',
        }}
      >
        {/* Live badge */}
        <div
          className="animate-fade-slide-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--gold-subtle)',
            border: '1px solid var(--gold-dim)',
            borderRadius: '99px',
            padding: '5px 14px',
            marginBottom: '28px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--bull)',
              display: 'inline-block',
            }}
          />
          <span
            className="font-mono"
            style={{ fontSize: '11px', color: 'var(--gold)' }}
          >
            VNINDEX +0.87% — Thị trường đang mở
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-slide-up animate-delay-100"
          style={{
            fontSize: 'clamp(38px, 6vw, 62px)',
            marginBottom: '22px',
            maxWidth: '720px',
          }}
        >
          Phân tích chứng khoán Việt{' '}
          <span className="text-gold-gradient">thông minh hơn</span> với AI
        </h1>

        {/* Sub */}
        <p
          className="animate-fade-slide-up animate-delay-200"
          style={{
            fontSize: '17px',
            color: 'var(--text-secondary)',
            lineHeight: 1.75,
            maxWidth: '500px',
            marginBottom: '36px',
          }}
        >
          Dữ liệu HOSE & HNX thời gian thực, tin tức với phân tích cảm xúc tự
          động, và AI chat giải thích cổ phiếu bằng tiếng Việt.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-slide-up animate-delay-300"
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
        >
          <button
            className="btn-gold"
            style={{ padding: '13px 30px', fontSize: '15px' }}
            onClick={() => router.push('/login')}
          >
            Bắt đầu miễn phí
          </button>
          <button
            className="btn-ghost"
            style={{ padding: '13px 24px', fontSize: '15px' }}
            onClick={() => document.querySelector('.features-grid').scrollIntoView({ behavior: 'smooth' })}
          >
            Xem demo →
          </button>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--bg-border)' }} />

      {/* ── Features ─────────────────────────────────────────── */}
      <section
        style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 32px' }}
      >
        <p
          style={{
            fontSize: '11px',
            color: 'var(--gold)',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          Tính năng
        </p>

        <h2
          style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: '48px' }}
        >
          Mọi thứ bạn cần để đầu tư tốt hơn
        </h2>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: '24px',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold-dim)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--bg-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Icon + tag row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '14px',
                }}
              >
                <div
                  className="card-elevated"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  {f.icon}
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '99px',
                    background: f.pro
                      ? 'var(--gold-subtle)'
                      : 'var(--bull-dim)',
                    color: f.pro ? 'var(--gold)' : 'var(--bull)',
                    border: `1px solid ${f.pro ? 'var(--gold-dim)' : 'rgba(0,214,143,0.2)'}`,
                  }}
                >
                  {f.tag}
                </span>
              </div>

              <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--bg-border)' }} />

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section
        style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 32px' }}
      >
        <p
          style={{
            fontSize: '11px',
            color: 'var(--gold)',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          Bảng giá
        </p>

        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: '8px' }}>
          Đơn giản, minh bạch
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            marginBottom: '48px',
          }}
        >
          Bắt đầu miễn phí. Nâng cấp khi bạn cần AI phân tích chuyên sâu.
        </p>

        <div className="pricing-row">
          {/* Free tier */}
          <div
            className="card"
            style={{ padding: '32px', flex: 1, maxWidth: '320px' }}
          >
            <p
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Cơ bản
            </p>

            <p
              className="font-display"
              style={{ fontSize: '38px', marginBottom: '24px' }}
            >
              Miễn phí
            </p>

            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '28px',
              }}
            >
              {FREE_FEATURES.map(([ok, label], i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    color: ok ? 'var(--text-primary)' : 'var(--text-muted)',
                  }}
                >
                  <span
                    style={{
                      color: ok ? 'var(--bull)' : 'var(--text-muted)',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {ok ? '✓' : '–'}
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <button
              className="btn-ghost"
              style={{ width: '100%', padding: '11px', fontSize: '14px' }}
              onClick={() => router.push('/login')}
            >
              Bắt đầu ngay
            </button>
          </div>

          {/* Pro tier */}
          <div
            className="border-gold-glow"
            style={{
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              padding: '32px',
              flex: 1,
              maxWidth: '320px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Badge */}
            <div
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 10px',
                background: 'var(--gold)',
                color: 'var(--bg-base)',
                borderRadius: '99px',
                letterSpacing: '0.06em',
              }}
            >
              PHỔ BIẾN
            </div>

            <p
              style={{
                fontSize: '11px',
                color: 'var(--gold)',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Pro
            </p>

            <div style={{ marginBottom: '24px' }}>
              <span className="font-display" style={{ fontSize: '38px' }}>
                50.000₫
              </span>
              <span
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  marginLeft: '4px',
                }}
              >
                /tháng
              </span>
            </div>

            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '28px',
              }}
            >
              {PRO_FEATURES.map((label, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--bull)',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <button
              className="btn-gold"
              style={{ width: '100%', padding: '11px', fontSize: '14px' }}
              onClick={() => router.push('/login')}
            >
              Nâng cấp Pro ngay
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--bg-border)' }} />
      <footer
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '28px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: 'var(--radius-sm)',
              background:
                'linear-gradient(135deg, var(--gold-dim), var(--gold))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--bg-base)',
            }}
          >
            F
          </div>
          <span
            className="font-display"
            style={{ fontSize: '15px', color: 'var(--text-secondary)' }}
          >
            Finsight
          </span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          © 2025 Finsight · Xây dựng tại Việt Nam 🇻🇳 · Thông tin chỉ mang tính
          tham khảo
        </p>
      </footer>
    </>
  );
}
