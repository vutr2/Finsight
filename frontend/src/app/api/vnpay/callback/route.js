import { NextResponse } from 'next/server';
import { verifyReturnUrl } from '@/lib/vnpay';
import { updatePaymentStatus } from '@/lib/supabase';

// VNPAY redirects the browser here after payment.
// In sandbox, IPN is never called — so we also update DB here as fallback.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());

  if (!verifyReturnUrl(query)) {
    console.error('[vnpay/callback] invalid signature');
    return NextResponse.redirect(new URL('/dashboard/payment/failed?reason=invalid', request.url));
  }

  const responseCode = query['vnp_ResponseCode'];
  const orderId = query['vnp_TxnRef'] ?? '';

  if (responseCode !== '00') {
    // Non-blocking — mark failed
    updatePaymentStatus(orderId, 'failed').catch(() => {});
    return NextResponse.redirect(new URL('/dashboard/payment/failed?reason=declined', request.url));
  }

  // Payment successful — update DB status to completed
  try {
    await updatePaymentStatus(orderId, 'completed');
    console.log('[vnpay/callback] payment completed for orderId:', orderId);
  } catch (err) {
    console.error('[vnpay/callback] updatePaymentStatus error:', err.message);
    // Still redirect to success — payment was confirmed by VNPAY
  }

  return NextResponse.redirect(new URL('/dashboard/payment/success', request.url));
}
