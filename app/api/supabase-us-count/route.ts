import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    // Try get_us_tech_company_count() first, fallback to get_us_company_count()
    let rpcRes = await supabase.rpc('get_us_tech_company_count');
    if (rpcRes.error && rpcRes.error.message.includes('Could not find')) {
      rpcRes = await supabase.rpc('get_us_company_count');
    }

    clearTimeout(timeoutId);

    if (rpcRes.error) {
      console.error('RPC Execution Error:', rpcRes.error.message);
      return NextResponse.json({ success: false, error: rpcRes.error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: Number(rpcRes.data),
      source: 'Supabase SQL Function'
    });
  } catch (err: any) {
    console.error('Route Error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
