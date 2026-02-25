import { NextResponse } from 'next/server';
import { verifyReturnUrl } from '@/lib/vnpay';

// VNPAY server calls this URL server-to-server to confirm payment.
// This is the ONLY place we update the database.
// Must be public (no auth) — see middleware.js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());
  return handleIpn(query);
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());
  // Also try body params
  try {
    const text = await request.text();
    if (text) {
      const bodyParams = Object.fromEntries(new URLSearchParams(text));
      Object.assign(query, bodyParams);
    }
  } catch { /* ignore */ }
  return handleIpn(query);
}

async function handleIpn(query) {
  console.log('[vnpay/ipn] received:', query);

  if (!verifyReturnUrl(query)) {
    console.error('[vnpay/ipn] invalid signature');
    return NextResponse.json({ RspCode: '97', Message: 'Fail checksum' });
  }

  const responseCode = query['vnp_ResponseCode'];
  const orderInfo = query['vnp_OrderInfo'] ?? '';
  const amount = Number(query['vnp_Amount']) / 100;

  console.log(`[vnpay/ipn] responseCode=${responseCode} amount=${amount} orderInfo=${orderInfo}`);

  if (responseCode !== '00') {
    return NextResponse.json({ RspCode: '00', Message: 'Confirm Success' });
  }

  // orderInfo format: "Nang cap Pro {userId} {safeEmail}"
  const parts = orderInfo.split(' ');
  const userId = parts[3] ?? null;

  if (!userId) {
    console.error('[vnpay/ipn] cannot extract userId from:', orderInfo);
    return NextResponse.json({ RspCode: '01', Message: 'Order not found' });
  }

  try {
    await grantPro(userId);
    console.log('[vnpay/ipn] granted Pro to:', userId);
  } catch (err) {
    console.error('[vnpay/ipn] grantPro error:', err.message);
    return NextResponse.json({ RspCode: '99', Message: 'Unknown error' });
  }

  return NextResponse.json({ RspCode: '00', Message: 'Confirm Success' });
}

async function grantPro(userId) {
  const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID;
  const managementKey = process.env.DESCOPE_MANAGEMENT_KEY;

  if (!managementKey) {
    console.warn('[grantPro] DESCOPE_MANAGEMENT_KEY not set');
    return;
  }

  const res = await fetch('https://api.descope.com/v1/mgmt/user/update/customAttribute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${projectId}:${managementKey}`,
    },
    body: JSON.stringify({
      loginId: userId,
      attributeKey: 'plan',
      attributeValue: 'pro',
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Descope ${res.status}: ${body}`);
  }
}
