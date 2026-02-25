import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client — lazy init so build doesn't fail without env vars
let _client = null;

export function getSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || url === 'your_supabase_url_here') {
      throw new Error('Supabase chưa được cấu hình. Thêm NEXT_PUBLIC_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY vào .env.local');
    }
    _client = createClient(url, key);
  }
  return _client;
}
