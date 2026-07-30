import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

const TECH_INDUSTRIES = [
  '%software%', '%technology%', '%information%', '%internet%', '%computer%',
  '%data%', '%IT%', '%telecommunication%', '%telecom%', '%electronics%',
  '%semiconductor%', '%automation%', '%robotics%', '%network%', '%blockchain%',
  '%cyber%', '%cloud%'
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryType = searchParams.get('type') || 'total_companies';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    // 1. Try RPC function first
    const rpcMap: Record<string, string[]> = {
      total_companies: ['get_us_total_companies', 'get_us_company_count'],
      tech_companies: ['get_us_tech_companies', 'get_us_tech_company_count'],
      non_tech_companies: ['get_us_non_tech_companies'],
      tech_employee_headcount: ['get_us_tech_employees', 'get_us_tech_headcount'],
      non_tech_employee_headcount: ['get_us_non_tech_employees', 'get_us_non_tech_headcount'],
      zero_employees: ['get_us_zero_employee_companies', 'get_us_no_employees']
    };

    const targetRpcs = rpcMap[queryType] || ['get_us_company_count'];

    for (const rpcName of targetRpcs) {
      const { data, error } = await supabase.rpc(rpcName);
      if (!error && data !== null && data !== undefined) {
        clearTimeout(timeoutId);
        return NextResponse.json({
          success: true,
          queryType,
          count: Number(data),
          source: `RPC ${rpcName}()`
        });
      }
    }

    // 2. Direct Supabase Table Query Fallback (If RPC functions do not exist in database)
    const US_COUNTRIES = ['United States', 'united states', 'US', 'us', 'USA', 'usa', 'United States of America', 'u.s.', 'u.s.a.'];

    let countResult: number | null = null;
    let queryError: string | null = null;

    if (queryType === 'total_companies') {
      const { count, error } = await supabase
        .from('company_master')
        .select('id', { count: 'exact', head: true })
        .in('country', US_COUNTRIES);
      countResult = count;
      queryError = error?.message || null;
    } else if (queryType === 'zero_employees') {
      const { count, error } = await supabase
        .from('company_master')
        .select('id', { count: 'exact', head: true })
        .in('country', US_COUNTRIES)
        .or('employee_count.is.null,employee_count.eq.0');
      countResult = count;
      queryError = error?.message || null;
    } else if (queryType === 'tech_companies') {
      const { count, error } = await supabase
        .from('company_master')
        .select('id', { count: 'exact', head: true })
        .in('country', US_COUNTRIES)
        .or(TECH_INDUSTRIES.map(i => `primary_industry.ilike.${i}`).join(','));
      countResult = count;
      queryError = error?.message || null;
    }

    clearTimeout(timeoutId);

    if (countResult !== null && !queryError) {
      return NextResponse.json({
        success: true,
        queryType,
        count: countResult,
        source: 'Direct Supabase Table Query'
      });
    }

    return NextResponse.json({
      success: false,
      queryType,
      error: queryError || `RPC function not created in database. Run the SQL script in Supabase SQL Editor!`
    }, { status: 500 });

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      queryType,
      error: err.message || 'Server connection error'
    }, { status: 500 });
  }
}
