import { AuthProvider } from '@descope/nextjs-sdk';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-body',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const metadata = {
  title: 'Finsight — Phân Tích Chứng Khoán Việt Nam',
  description:
    'Nền tảng phân tích chứng khoán Việt Nam với dữ liệu thời gian thực, tin tức thị trường và AI phân tích cổ phiếu thông minh.',
  keywords: 'chứng khoán, HOSE, HNX, VN-Index, phân tích cổ phiếu, đầu tư',
  openGraph: {
    title: 'Finsight — Phân Tích Chứng Khoán Việt Nam',
    description: 'AI-powered stock analysis for Vietnamese markets.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${geist.variable} ${geistMono.variable} ${playfair.variable} antialiased`}>
        <AuthProvider projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
