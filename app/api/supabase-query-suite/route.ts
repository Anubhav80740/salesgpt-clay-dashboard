import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'liveQueryCache.json');
const HISTORY_DIR_PATH = path.join(process.cwd(), 'data', 'history');

// All 30 target countries from the trigger menu
const ALL_TARGET_COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Australia',
  'India',
  'Japan',
  'Brazil',
  'Mexico',
  'Netherlands',
  'Spain',
  'Sweden',
  'Switzerland',
  'Italy',
  'Ireland',
  'Israel',
  'Singapore',
  'Romania',
  'Argentina',
  'Belgium',
  'Austria',
  'Denmark',
  'Finland',
  'Norway',
  'Poland',
  'Portugal',
  'South Africa',
  'South Korea',
  'New Zealand'
];

const QUERY_TYPES = [
  'total_companies',
  'tech_companies',
  'non_tech_companies',
  'tech_employee_headcount',
  'non_tech_employee_headcount',
  'zero_employees'
];

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

// Helper to update disk JSON cache without overwriting — appends to history array
function updateDiskCache(country: string, queryType: string, count: number, source: string) {
  try {
    const cache = getDiskCache();
    if (!cache.queries) cache.queries = {};
    if (!cache.queries[country]) cache.queries[country] = {};

    const executedAt = new Date().toLocaleTimeString();
    const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = Date.now();

    const newEntry = { count, executedAt, source, timestamp };

    const existing = cache.queries[country][queryType] || {};
    const historyArray = Array.isArray(existing.history) ? existing.history : (existing.count !== undefined ? [existing] : []);
    historyArray.push(newEntry);

    cache.lastUpdated = new Date().toISOString();
    cache.queries[country][queryType] = {
      latest: newEntry,
      count: count,
      executedAt: executedAt,
      source: source,
      history: historyArray
    };

    // 1. Write main live cache file
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cache, null, 2), 'utf8');

    // 2. Append to daily history snapshot file (data/history/YYYY-MM-DD.json)
    if (!fs.existsSync(HISTORY_DIR_PATH)) {
      fs.mkdirSync(HISTORY_DIR_PATH, { recursive: true });
    }

    const historyFilePath = path.join(HISTORY_DIR_PATH, `${todayDate}.json`);
    let historyCache: any = { date: todayDate, lastUpdated: new Date().toISOString(), queries: {} };

    if (fs.existsSync(historyFilePath)) {
      try {
        historyCache = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));
      } catch (err) {}
    }

    if (!historyCache.queries) historyCache.queries = {};
    if (!historyCache.queries[country]) historyCache.queries[country] = {};

    const dayExisting = historyCache.queries[country][queryType] || {};
    const dayHistoryArray = Array.isArray(dayExisting.history) ? dayExisting.history : (dayExisting.count !== undefined ? [dayExisting] : []);
    dayHistoryArray.push(newEntry);

    historyCache.lastUpdated = new Date().toISOString();
    historyCache.queries[country][queryType] = {
      latest: newEntry,
      count: count,
      executedAt: executedAt,
      source: source,
      history: dayHistoryArray
    };

    fs.writeFileSync(historyFilePath, JSON.stringify(historyCache, null, 2), 'utf8');
  } catch (e) {
    console.error('Cache write error:', e);
  }
}

// Single query runner helper
async function executeSingleRpcQuery(country: string, queryType: string) {
  const rpcMap: Record<string, string[]> = {
    total_companies: ['get_country_total_companies', 'get_us_total_companies', 'get_us_company_count'],
    tech_companies: ['get_country_tech_companies', 'get_us_tech_companies', 'get_us_tech_company_count'],
    non_tech_companies: ['get_country_non_tech_companies', 'get_us_non_tech_companies'],
    tech_employee_headcount: ['get_country_tech_employees', 'get_us_tech_employees', 'get_us_tech_headcount'],
    non_tech_employee_headcount: ['get_country_non_tech_employees', 'get_us_non_tech_employees', 'get_us_non_tech_headcount'],
    zero_employees: ['get_country_no_employees', 'get_us_no_employees', 'get_us_zero_employee_companies']
  };

  const targetRpcs = rpcMap[queryType] || ['get_country_total_companies'];
  let lastError = `RPC function for '${queryType}' not found in database.`;

  for (const rpcName of targetRpcs) {
    let res = await supabase.rpc(rpcName, { target_country: country });

    if (res.error && res.error.message.includes('parameters')) {
      res = await supabase.rpc(rpcName);
    }

    if (!res.error && res.data !== null && res.data !== undefined) {
      const count = Number(res.data);
      const source = `RPC ${rpcName}('${country}')`;
      updateDiskCache(country, queryType, count, source);
      return { success: true, count, source };
    }

    if (res.error) {
      lastError = res.error.message;
    }
  }

  return { success: false, error: lastError };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const queryType = searchParams.get('type') || 'total_companies';
  const country = searchParams.get('country') || 'United States';
  const fetchCachedOnly = searchParams.get('cached');
  const action = searchParams.get('action');

  // Automatic Daily Check: If today's history snapshot file does not exist yet, trigger scan for all 30 countries
  if (action === 'auto_daily_check' || action === 'run_daily_scan') {
    const todayDate = new Date().toISOString().split('T')[0];
    const todayFilePath = path.join(HISTORY_DIR_PATH, `${todayDate}.json`);

    if (action === 'auto_daily_check' && fs.existsSync(todayFilePath)) {
      return NextResponse.json({
        success: true,
        alreadyScannedToday: true,
        message: `Today's daily snapshot (${todayDate}.json) is already created.`
      });
    }

    const scanResults: Record<string, any> = {};
    for (const c of ALL_TARGET_COUNTRIES) {
      scanResults[c] = {};
      for (const qt of QUERY_TYPES) {
        const res = await executeSingleRpcQuery(c, qt);
        scanResults[c][qt] = res;
      }
    }

    return NextResponse.json({
      success: true,
      alreadyScannedToday: false,
      message: `Daily auto-scan completed for all ${ALL_TARGET_COUNTRIES.length} countries.`,
      scanResults,
      lastUpdated: new Date().toISOString()
    });
  }

  // Return disk cached queries if requested
  if (fetchCachedOnly) {
    const cache = getDiskCache();
    if (fetchCachedOnly === 'all') {
      return NextResponse.json({
        success: true,
        queries: cache.queries || {},
        lastUpdated: cache.lastUpdated
      });
    }

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

    const res = await executeSingleRpcQuery(country, queryType);

    clearTimeout(timeoutId);

    if (res.success) {
      return NextResponse.json({
        success: true,
        queryType,
        country,
        count: res.count,
        source: res.source
      });
    }

    return NextResponse.json({
      success: false,
      queryType,
      country,
      error: res.error
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
