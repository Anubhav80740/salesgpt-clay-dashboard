import overviewRaw from '@/data/overview.json';
import countriesRaw from '@/data/countries.json';
import duplicatesRaw from '@/data/duplicates.json';
import pipelineRaw from '@/data/pipeline.json';
import fieldIssuesRaw from '@/data/fieldIssues.json';
import { supabase } from '@/lib/supabaseClient';
import {
  GlobalFilterState,
  OverviewMetrics,
  CountryComparisonRecord,
  DuplicateTypeRecord,
  PipelineStageRecord,
  FieldIssueRecord,
  DuplicatesOverview,
  FieldIssuesOverview,
  FilterOptions,
} from '@/types';

/**
 * Executes live Supabase query on company_master table for US companies
 */
export async function fetchUSCompanyCountFromSupabase(): Promise<{ count: number; error: string | null }> {
  return fetchQuerySuiteCountFromSupabase('total_companies', 'United States');
}

export async function fetchQuerySuiteCountFromSupabase(
  queryType: string,
  country: string = 'United States'
): Promise<{ count: number; error: string | null }> {
  try {
    const res = await fetch(`/api/supabase-query-suite?type=${encodeURIComponent(queryType)}&country=${encodeURIComponent(country)}`, { cache: 'no-store' });
    const data = await res.json();

    if (data.success && typeof data.count === 'number') {
      return { count: data.count, error: null };
    }

    return { count: 0, error: data.error || 'Query failed' };
  } catch (err: any) {
    return { count: 0, error: err.message || 'Connection error' };
  }
}

export async function fetchCachedQuerySuiteFromSupabase(country: string = 'United States'): Promise<Record<string, { count: number; executedAt: string; source: string }>> {
  try {
    const res = await fetch(`/api/supabase-query-suite?cached=true&country=${encodeURIComponent(country)}`, { cache: 'no-store' });
    const data = await res.json();

    if (data.success && data.cachedQueries) {
      return data.cachedQueries;
    }
  } catch (e) {
    console.error('Fetch cache error:', e);
  }
  return {};
}

export async function fetchAllCachedQueriesFromSupabase(): Promise<Record<string, Record<string, { count: number; executedAt: string; source: string }>>> {
  try {
    const res = await fetch(`/api/supabase-query-suite?cached=all`, { cache: 'no-store' });
    const data = await res.json();

    if (data.success && data.queries) {
      return data.queries;
    }
  } catch (e) {
    console.error('Fetch all cache error:', e);
  }
  return {};
}

// Helper to filter country records based on current global filter state
function filterCountries(records: CountryComparisonRecord[], filters?: Partial<GlobalFilterState>): CountryComparisonRecord[] {
  if (!filters) return records;

  return records.filter((item) => {
    if (filters.country && filters.country !== 'All' && item.country !== filters.country) return false;
    if (filters.industry && filters.industry !== 'All' && item.industry !== filters.industry) return false;
    if (filters.employeeRange && filters.employeeRange !== 'All' && item.employeeRange !== filters.employeeRange) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      if (!item.country.toLowerCase().includes(q) && !item.industry.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export async function triggerDailyAutoScanFromSupabase(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/supabase-query-suite?action=run_daily_scan', { cache: 'no-store' });
    const data = await res.json();
    return { success: data.success, message: data.message, error: data.error };
  } catch (err: any) {
    return { success: false, error: err.message || 'Auto-scan request failed' };
  }
}

/**
 * Service Layer: Returns computed country list for Country Comparison Page.
 * Dynamically merges queried values from data/liveQueryCache.json!
 * STRICT: Only uses tech_companies count for this table (no fallback to total_companies).
 */
export function getCountryComparisonData(
  filters?: Partial<GlobalFilterState>,
  cachedQueries?: Record<string, Record<string, any>>
): CountryComparisonRecord[] {
  const filtered = filterCountries(countriesRaw as CountryComparisonRecord[], filters);

  const rawMapped = filtered.map((record) => {
    // Check if live query cache has a tech_companies count for this country
    const countryCache = cachedQueries?.[record.country];
    const techObj = countryCache?.tech_companies;

    // Read latest.count or count safely — STRICTLY tech_companies ONLY
    const liveTechCount = techObj?.latest?.count ?? techObj?.count;

    // If tech_companies has not been queried for this country, use baseline or 0 (NO total_companies fallback)
    const salesgpt = liveTechCount !== undefined ? liveTechCount : (record.salesgpt || 0);
    const clayClean = record.clayClean;
    const overlap = Math.min(salesgpt, clayClean);
    const clayOnly = Math.max(0, clayClean - overlap);
    const salesgptOnly = Math.max(0, salesgpt - overlap);
    const coveragePct = clayClean > 0 ? Number(((overlap / clayClean) * 100).toFixed(1)) : 0;

    let status: 'Excellent' | 'Good' | 'Needs Attention' | 'Poor' = 'Good';
    if (coveragePct >= 80) status = 'Excellent';
    else if (coveragePct >= 60) status = 'Good';
    else if (coveragePct >= 40) status = 'Needs Attention';
    else status = 'Poor';

    return {
      ...record,
      salesgpt,
      clayClean,
      overlap,
      clayOnly,
      salesgptOnly,
      coveragePct,
      status,
    };
  });

  const grandTotalSalesGPT = rawMapped.reduce((acc, c) => acc + c.salesgpt, 0);
  const grandTotalClayClean = rawMapped.reduce((acc, c) => acc + c.clayClean, 0);

  return rawMapped.map((r) => ({
    ...r,
    salesgptPct: grandTotalSalesGPT > 0 ? Number(((r.salesgpt / grandTotalSalesGPT) * 100).toFixed(1)) : 0,
    clayPct: grandTotalClayClean > 0 ? Number(((r.clayClean / grandTotalClayClean) * 100).toFixed(1)) : 0,
    overlapPct: r.clayClean > 0 ? Number(((r.overlap / r.clayClean) * 100).toFixed(1)) : 0,
  }));
}

/**
 * Service Layer: Returns pre-computed metrics for Overview Page.
 * Dynamically computes values using live queried counts if available!
 */
export function getOverviewMetrics(
  filters?: Partial<GlobalFilterState>,
  cachedQueries?: Record<string, Record<string, { count: number }>>
): OverviewMetrics {
  const filteredCountries = getCountryComparisonData(filters, cachedQueries);

  const totalSalesGPT = filteredCountries.reduce((acc, c) => acc + c.salesgpt, 0);
  const matchedCompanies = filteredCountries.reduce((acc, c) => acc + c.overlap, 0);
  const clayOnlyNewCompanies = filteredCountries.reduce((acc, c) => acc + c.clayOnly, 0);
  const salesgptOnly = filteredCountries.reduce((acc, c) => acc + c.salesgptOnly, 0);
  const totalClayClean = filteredCountries.reduce((acc, c) => acc + c.clayClean, 0);

  const totalClay = totalClayClean || overviewRaw.totalClay;
  const difference = totalClay - totalSalesGPT;
  const matchingPercentage = totalClayClean > 0 ? (matchedCompanies / totalClayClean) * 100 : 51.9;

  const totalUniverse = salesgptOnly + matchedCompanies + clayOnlyNewCompanies;
  const salesgptOnlyPct = totalUniverse > 0 ? (salesgptOnly / totalUniverse) * 100 : 25;
  const overlapPct = totalUniverse > 0 ? (matchedCompanies / totalUniverse) * 100 : 45;
  const clayOnlyPct = totalUniverse > 0 ? (clayOnlyNewCompanies / totalUniverse) * 100 : 30;

  return {
    totalSalesGPT: totalSalesGPT || overviewRaw.totalSalesGPT,
    totalClay: totalClay,
    difference: difference,
    salesgptGrowthTrend: overviewRaw.salesgptGrowthTrend,
    matchedCompanies: matchedCompanies || overviewRaw.matchedCompanies,
    matchingPercentage: Number(matchingPercentage.toFixed(1)),
    duplicateGroups: duplicatesRaw.summary.duplicateGroups || overviewRaw.duplicateGroups,
    duplicateRowsRemoved: duplicatesRaw.summary.duplicateRowsRemoved || overviewRaw.duplicateRowsRemoved,
    clayOnlyNewCompanies: clayOnlyNewCompanies || overviewRaw.clayOnlyNewCompanies,
    readyForImportCount: overviewRaw.readyForImportCount,
    horizontalBreakdown: {
      salesgptOnly: salesgptOnly || 23200,
      salesgptOnlyPct: Number(salesgptOnlyPct.toFixed(1)),
      overlap: matchedCompanies || 98400,
      overlapPct: Number(overlapPct.toFixed(1)),
      clayOnly: clayOnlyNewCompanies || 62400,
      clayOnlyPct: Number(clayOnlyPct.toFixed(1)),
    },
  };
}

/**
 * Service Layer: Returns pre-computed Duplicates data & metrics.
 * TODO: Replace with SQL query on deduplication log tables.
 */
export function getDuplicatesData(filters?: Partial<GlobalFilterState>) {
  let types = duplicatesRaw.types as DuplicateTypeRecord[];

  if (filters?.duplicateType && filters.duplicateType !== 'All') {
    types = types.filter((t) => t.duplicateType === filters.duplicateType);
  }

  const totalGroups = types.reduce((acc, t) => acc + t.groups, 0);
  const totalRemoved = types.reduce((acc, t) => acc + t.rowsRemoved, 0);

  const overview: DuplicatesOverview = {
    duplicateGroups: totalGroups || duplicatesRaw.summary.duplicateGroups,
    duplicateRowsRemoved: totalRemoved || duplicatesRaw.summary.duplicateRowsRemoved,
    manualReviewNeeded: duplicatesRaw.summary.manualReviewNeeded,
    confirmedMatches: duplicatesRaw.summary.confirmedMatches,
  };

  return {
    overview,
    types,
  };
}

/**
 * Service Layer: Returns pre-computed Pipeline Stage data.
 * TODO: Replace with ETL pipeline run status API / table stream query.
 */
export function getPipelineData(filters?: Partial<GlobalFilterState>): PipelineStageRecord[] {
  let stages = pipelineRaw as PipelineStageRecord[];

  if (filters?.pipelineStatus && filters.pipelineStatus !== 'All') {
    stages = stages.filter((s) => s.stageName.toLowerCase().includes(filters.pipelineStatus!.toLowerCase()));
  }

  return stages;
}

/**
 * Service Layer: Returns pre-computed Field Issues & summary cards.
 * TODO: Replace with data quality validation log API / Postgres view.
 */
export function getFieldIssuesData(filters?: Partial<GlobalFilterState>) {
  let issues = fieldIssuesRaw as FieldIssueRecord[];

  if (filters?.fieldIssue && filters.fieldIssue !== 'All') {
    issues = issues.filter((i) => i.status === filters.fieldIssue || i.issueType === filters.fieldIssue);
  }
  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    issues = issues.filter(
      (i) =>
        i.field.toLowerCase().includes(q) ||
        i.issue.toLowerCase().includes(q) ||
        i.suggestedAction.toLowerCase().includes(q)
    );
  }

  const overview: FieldIssuesOverview = {
    fieldsWithIssues: issues.length,
    pendingCount: issues.filter((i) => i.status === 'Pending').length,
    resolvedCount: issues.filter((i) => i.status === 'Resolved').length,
    inReviewCount: issues.filter((i) => i.status === 'Review' || i.status === 'Cleaning').length,
  };

  return {
    overview,
    issues,
  };
}

/**
 * Service Layer: Provides options for all filter dropdowns.
 */
export function getFilterOptions(): FilterOptions {
  const countries = Array.from(new Set(countriesRaw.map((c) => c.country))).sort();
  const industries = Array.from(new Set(countriesRaw.map((c) => c.industry))).sort();
  const employeeRanges = Array.from(new Set(countriesRaw.map((c) => c.employeeRange)));

  return {
    countries: ['All', ...countries],
    industries: ['All', ...industries],
    employeeRanges: ['All', ...employeeRanges],
    dataSources: ['All', 'SalesGPT', 'Clay Dataset', 'Overlap'],
    pipelineStatuses: ['All', 'Raw Found', 'Technology Filter', 'Invalid Records Removed', 'Duplicate Removal', 'Compared with SalesGPT', 'New Companies', 'Ready for Enrichment', 'Ready for Import', 'Imported', 'Failed'],
    duplicateTypes: ['All', 'Exact Domain', 'LinkedIn Match', 'Legal Entity', 'Name Variation', 'Fuzzy Match', 'Other'],
    fieldIssues: ['All', 'Pending', 'Review', 'Cleaning', 'Resolved', 'Ignored'],
    dateRanges: ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Q2 2026', 'Year to Date', 'Custom Range'],
  };
}
