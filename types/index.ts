export interface GlobalFilterState {
  country: string;
  industry: string;
  employeeRange: string;
  dataSource: string;
  pipelineStatus: string;
  duplicateType: string;
  fieldIssue: string;
  dateRange: string;
  searchQuery: string;
}

export interface OverviewMetrics {
  totalSalesGPT: number;
  totalClay: number;
  difference: number;
  salesgptGrowthTrend: number;
  matchedCompanies: number;
  matchingPercentage: number;
  duplicateGroups: number;
  duplicateRowsRemoved: number;
  clayOnlyNewCompanies: number;
  readyForImportCount: number;
  horizontalBreakdown: {
    salesgptOnly: number;
    salesgptOnlyPct: number;
    overlap: number;
    overlapPct: number;
    clayOnly: number;
    clayOnlyPct: number;
  };
}

export interface CountryComparisonRecord {
  id: string;
  country: string;
  salesgpt: number;
  salesgptPct?: number;
  clayRaw: number;
  clayClean: number;
  clayPct?: number;
  overlap: number;
  overlapPct?: number;
  clayOnly: number;
  salesgptOnly: number;
  coveragePct: number;
  status: 'Excellent' | 'Good' | 'Needs Attention' | 'Poor';
  industry: string;
  employeeRange: string;
}

export interface DuplicateTypeRecord {
  id: string;
  duplicateType: 'Exact Domain' | 'LinkedIn Match' | 'Legal Entity' | 'Name Variation' | 'Fuzzy Match' | 'Other';
  groups: number;
  rowsRemoved: number;
  status: 'Cleaned' | 'In Progress' | 'Requires Review';
  percentage: number;
  color: string;
}

export interface PipelineStageRecord {
  id: string;
  stageName: string;
  stageOrder: number;
  count: number;
  subtitle: string;
  completionPct: number;
  dropoffPct: number;
}

export interface FieldIssueRecord {
  id: string;
  field: string;
  issue: string;
  affectedRecords: number;
  suggestedAction: string;
  status: 'Pending' | 'Review' | 'Cleaning' | 'Resolved' | 'Ignored';
  issueType: string;
  impactLevel: 'High' | 'Medium' | 'Low';
}

export interface DuplicatesOverview {
  duplicateGroups: number;
  duplicateRowsRemoved: number;
  manualReviewNeeded: number;
  confirmedMatches: number;
}

export interface FieldIssuesOverview {
  fieldsWithIssues: number;
  pendingCount: number;
  resolvedCount: number;
  inReviewCount: number;
}

export interface FilterOptions {
  countries: string[];
  industries: string[];
  employeeRanges: string[];
  dataSources: string[];
  pipelineStatuses: string[];
  duplicateTypes: string[];
  fieldIssues: string[];
  dateRanges: string[];
}
