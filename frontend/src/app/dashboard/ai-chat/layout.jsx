'use client';

import ProGate from '@/components/ProGate';

export default function AiChatLayout({ children }) {
  return (
    <ProGate feature="AI Chat">
      <div
        style={{
          margin: '-24px',
          height: 'calc(100vh - 52px - 34px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </ProGate>
  );
}
