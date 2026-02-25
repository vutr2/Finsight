'use client';

import ProGate from '@/components/ProGate';

export default function PortfolioLayout({ children }) {
  return (
    <ProGate feature="Giao dịch Demo">
      {children}
    </ProGate>
  );
}
