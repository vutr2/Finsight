import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const descopeId = searchParams.get('userId');

  if (!descopeId) {
    return NextResponse.json({ isPro: false });
  }

  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('payments')
      .select('id')
      .eq('descope_id', descopeId)
      .eq('status', 'completed')
      .limit(1)
      .single();

    return NextResponse.json({ isPro: !!data });
  } catch {
    return NextResponse.json({ isPro: false });
  }
}
