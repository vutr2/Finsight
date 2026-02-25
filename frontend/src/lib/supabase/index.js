import { getSupabase } from './server';

/**
 * Get a user row by their Descope user ID.
 * Returns null if not found.
 */
export async function getUserByDescopeId(descopeId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('descope_id', descopeId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('[supabase] getUserByDescopeId error:', error.message);
  }
  return data ?? null;
}

/**
 * Insert a payment record.
 */
export async function createPayment({ userid, orderId, planId, amount, cycle }) {
  const supabase = getSupabase();
  const { error } = await supabase.from('payments').insert({
    user_id: userid,
    order_id: orderId,
    plan_id: planId,
    amount,
    cycle,
    status: 'pending',
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`[supabase] createPayment error: ${error.message}`);
  }
}

/**
 * Update payment status by orderId.
 */
export async function updatePaymentStatus(orderId, status) {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('payments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('order_id', orderId);

  if (error) {
    throw new Error(`[supabase] updatePaymentStatus error: ${error.message}`);
  }
}
