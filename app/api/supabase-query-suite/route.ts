import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'liveQueryCache.json');

// Helper to read disk JSON cache safely
function getDiskCache() {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const raw = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Cache read error:', e);
  }
  return { lastUpdated: null, queries: {} };
}

// Helper to write disk JSON cache safely
function updateDiskCache(country: string, queryType: string, count: number, source: string) {
  try {
    const cache = getDiskCache();
    if (!cache.queries) cache.queries = {};
    if (!cache.queries[country]) cache.queries[country] = {};

    const executedAt = new Date().toLocaleTimeString();
    cache.lastUpdated = new Date().toISOString();
    cache.queries[country][queryType] = {
      count,
      executedAt,
      source,
      timestamp: Date.now()
    };

    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), 'utf8');
  } catch (e) {
    console.error('Cache write error:', e);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryType = searchParams.get('type') || 'total_companies';
  const country = searchParams.get('country') || 'United States';
  const fetchCachedOnly = searchParams.get('cached') === 'true';

  // Return disk cached queries if requested
  if (fetchCachedOnly) {
    const cache = getDiskCache();
    const countryQueries = cache.queries?.[country] || {};
    return NextResponse.json({
      success: true,
      country,
      cachedQueries: countryQueries,
      lastUpdated: cache.lastUpdated
    });
  }

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
    let lastError = `RPC function for '${queryType}' not found in database. Run the SQL script in Supabase SQL Editor!`;

    // Try calling dynamic RPC function with target_country parameter
    for (const rpcName of targetRpcs) {
      let res = await supabase.rpc(rpcName, { target_country: country });

      if (res.error && res.error.message.includes('parameters')) {
        res = await supabase.rpc(rpcName);
      }

      if (!res.error && res.data !== null && res.data !== undefined) {
        clearTimeout(timeoutId);
        const count = Number(res.data);
        const source = `RPC ${rpcName}('${country}')`;

        // Save result persistently to data/liveQueryCache.json
        updateDiskCache(country, queryType, count, source);

        return NextResponse.json({
          success: true,
          queryType,
          country,
          count,
          source
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
