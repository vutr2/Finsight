import { NextResponse } from 'next/server';
import { createSdk } from '@descope/nextjs-sdk/server';
import { getSupabase } from '@/lib/supabase/server';

const STARTING_CASH = 100_000_000; // 100 triệu VNĐ

// Extract userId from Descope session token
async function getUserId(request) {
  const authHeader = request.headers.get('authorization') ?? '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return null;
  try {
    const sdk = createSdk({ projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID });
    const { token: validated } = await sdk.validateSession(token);
    return validated?.sub ?? null;
  } catch {
    return null;
  }
}

// Lazily create portfolio row for new users
async function ensurePortfolio(userId) {
  const { error } = await getSupabase()
    .from('portfolios')
    .upsert({ user_id: userId, cash: STARTING_CASH }, { onConflict: 'user_id', ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}

// Derive holdings from transactions
async function getHoldings(userId) {
  const { data, error } = await getSupabase()
    .from('transactions')
    .select('symbol, type, quantity, price')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);

  const map = {};
  for (const tx of data ?? []) {
    if (!map[tx.symbol]) map[tx.symbol] = { symbol: tx.symbol, quantity: 0, totalCost: 0 };
    if (tx.type === 'BUY') {
      map[tx.symbol].totalCost += tx.quantity * tx.price;
      map[tx.symbol].quantity += tx.quantity;
    } else {
      // SELL: reduce cost proportionally
      const avgCost = map[tx.symbol].quantity > 0
        ? map[tx.symbol].totalCost / map[tx.symbol].quantity
        : 0;
      map[tx.symbol].totalCost -= avgCost * tx.quantity;
      map[tx.symbol].quantity -= tx.quantity;
    }
  }

  return Object.values(map)
    .filter((h) => h.quantity > 0)
    .map((h) => ({
      symbol: h.symbol,
      quantity: h.quantity,
      avgCost: h.quantity > 0 ? Math.round(h.totalCost / h.quantity) : 0,
    }));
}

// ── GET /api/portfolio ──────────────────────────────────────────────────────
export async function GET(request) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await ensurePortfolio(userId);

    const [portfolioRes, holdingsData, txRes] = await Promise.all([
      getSupabase().from('portfolios').select('cash, created_at').eq('user_id', userId).single(),
      getHoldings(userId),
      getSupabase()
        .from('transactions')
        .select('id, symbol, type, quantity, price, total, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    if (portfolioRes.error) throw new Error(portfolioRes.error.message);

    return NextResponse.json({
      cash: portfolioRes.data.cash,
      holdings: holdingsData,
      transactions: txRes.data ?? [],
    });
  } catch (err) {
    console.error('[/api/portfolio GET]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ── POST /api/portfolio ─────────────────────────────────────────────────────
// Body: { action: 'buy'|'sell'|'reset', symbol, quantity, price }
export async function POST(request) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { action, symbol, quantity, price } = await request.json();

    // ── RESET ──────────────────────────────────────────────────────────────
    if (action === 'reset') {
      await getSupabase().from('transactions').delete().eq('user_id', userId);
      await getSupabase()
        .from('portfolios')
        .update({ cash: STARTING_CASH, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      return NextResponse.json({ ok: true });
    }

    // ── BUY / SELL validation ──────────────────────────────────────────────
    if (!symbol || !quantity || !price || quantity <= 0 || price <= 0) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    await ensurePortfolio(userId);

    const { data: portfolio } = await getSupabase()
      .from('portfolios')
      .select('cash')
      .eq('user_id', userId)
      .single();

    const total = quantity * price;

    if (action === 'buy') {
      if (portfolio.cash < total) {
        return NextResponse.json({ error: 'Số dư không đủ' }, { status: 400 });
      }
      // Deduct cash
      await getSupabase()
        .from('portfolios')
        .update({ cash: portfolio.cash - total, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      // Record transaction
      await getSupabase().from('transactions').insert({
        user_id: userId,
        symbol: symbol.toUpperCase(),
        type: 'BUY',
        quantity,
        price,
        total,
      });

    } else if (action === 'sell') {
      const holdings = await getHoldings(userId);
      const holding = holdings.find((h) => h.symbol === symbol.toUpperCase());
      if (!holding || holding.quantity < quantity) {
        return NextResponse.json({ error: 'Số lượng cổ phiếu không đủ' }, { status: 400 });
      }
      // Add cash
      await getSupabase()
        .from('portfolios')
        .update({ cash: portfolio.cash + total, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      // Record transaction
      await getSupabase().from('transactions').insert({
        user_id: userId,
        symbol: symbol.toUpperCase(),
        type: 'SELL',
        quantity,
        price,
        total,
      });

    } else {
      return NextResponse.json({ error: 'Action không hợp lệ' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[/api/portfolio POST]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
