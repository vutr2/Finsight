import { NextResponse } from 'next/server';
import { verifyReturnUrl } from '@/lib/vnpay';

// VNPAY redirects browser here after payment.
// Only verifies signature and redirects — database update is done by IPN.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());

  console.log('[vnpay/callback] query:', query);

  if (!verifyReturnUrl(query)) {
    console.error('[vnpay/callback] invalid signature');
    return NextResponse.redirect(new URL('/dashboard/payment/failed?reason=invalid', request.url));
  }

  const responseCode = query['vnp_ResponseCode'];
  console.log('[vnpay/callback] responseCode:', responseCode);

  if (responseCode !== '00') {
    return NextResponse.redirect(new URL('/dashboard/payment/failed?reason=declined', request.url));
  }

  return NextResponse.redirect(new URL('/dashboard/payment/success', request.url));
}
