import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@descope/nextjs-sdk";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Finsight - Thông tin thị trường & Giáo dục đầu tư",
  description:
    "Công cụ giáo dục tài chính giúp bạn hiểu rõ thị trường chứng khoán Việt Nam. Dữ liệu, phân tích, và kiến thức cho nhà đầu tư mới.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider projectId={process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID || ""}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
