import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryType = searchParams.get('type') || 'total_companies';
  const country = searchParams.get('country') || 'United States';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    // Map query types to dynamic country RPC functions
    const rpcMap: Record<string, string[]> = {
      total_companies: ['get_country_total_companies', 'get_us_total_companies', 'get_us_company_count'],
      tech_companies: ['get_country_tech_companies', 'get_us_tech_companies', 'get_us_tech_company_count'],
      non_tech_companies: ['get_country_non_tech_companies', 'get_us_non_tech_companies'],
      tech_employee_headcount: ['get_country_tech_employees', 'get_us_tech_employees', 'get_us_tech_headcount'],
      non_tech_employee_headcount: ['get_country_non_tech_employees', 'get_us_non_tech_employees', 'get_us_non_tech_headcount'],
      zero_employees: ['get_country_no_employees', 'get_us_no_employees', 'get_us_zero_employee_companies']
    };

    const targetRpcs = rpcMap[queryType] || ['get_country_total_companies'];
    let lastError = `RPC function for '${queryType}' not found in database schema cache. Make sure to run the SQL script in Supabase SQL Editor!`;

    // Try calling dynamic RPC function with target_country parameter
    for (const rpcName of targetRpcs) {
      // Try with parameter target_country
      let res = await supabase.rpc(rpcName, { target_country: country });

      // If function takes no parameters, try without parameters
      if (res.error && res.error.message.includes('parameters')) {
        res = await supabase.rpc(rpcName);
      }

      if (!res.error && res.data !== null && res.data !== undefined) {
        clearTimeout(timeoutId);
        return NextResponse.json({
          success: true,
          queryType,
          country,
          count: Number(res.data),
          source: `RPC ${rpcName}('${country}')`
        });
      }

      if (res.error) {
        lastError = res.error.message;
      }
    }

    clearTimeout(timeoutId);

    return NextResponse.json({
      success: false,
      queryType,
      country,
      error: lastError
    }, { status: 500 });

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      queryType,
      country,
      error: err.message || 'Server connection error'
    }, { status: 500 });
  }
}
