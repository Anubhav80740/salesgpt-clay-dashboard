# SalesGPT vs Clay Data Reconciliation Analytics Dashboard

A production-quality, responsive internal analytics dashboard built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack Table**, **Recharts**, and **Framer Motion**.

Designed specifically for comparative data engineering and revenue ops teams evaluating company dataset overlap, deduplication efficiency, country-level coverage, stage-by-stage ingestion pipeline drop-off, and field quality discrepancies between **SalesGPT** internal CRM records and **Clay** enriched data feeds.

---

## Key Features

- **Light-Mode Minimalist UX**: Inspired by modern internal tools (Stripe Dashboard, Linear, Vercel, Supabase). Built with slate background (`#F8FAFC`), crisp Inter typography, high whitespace, zero glassmorphism/gradients.
- **Strict Data Layer Separation**: Data calculations and dynamic filtering logic are completely isolated inside `/services/dashboard.ts`. Components are pure presentation layers.
- **Dynamic Global Filters**: Filter panels (Country, Industry, Employee Range, Data Source, Pipeline Stage, Duplicate Type, Field Issue, Date Range) dynamically recalculate metrics across all pages in real-time.
- **Overview Page**:
  - 4 core KPI cards (Total Tech Companies, Data Overlap, Duplicates Removed, New Companies Found).
  - Stacked horizontal comparison bar (SalesGPT Proprietary vs Matched Overlap vs Clay Net New).
  - Database reconciliation health summary.
- **Country Comparison Page**:
  - Interactive **TanStack Table** with sticky header, live search, multi-column sorting, pagination.
  - Visual Coverage bar (`████████░░ 82%`) and status indicators (`Excellent`, `Good`, `Needs Attention`, `Poor`).
- **Duplicates Page**:
  - Top metric cards for duplicate groups, rows removed, manual review queue, and confirmed matches.
  - Recharts Pie Chart of duplicate categorizations (Exact Domain, LinkedIn Match, Legal Entity, Name Variation, Fuzzy Match, Other).
  - Deduplication audit table.
- **Pipeline Page**:
  - Recharts Funnel chart visualizing stage conversion drop-off.
  - Vertical connected stage flow cards displaying company counts, subtitles, and retention percentages.
- **Field Issues Page**:
  - Data quality summary cards (Fields with Issues, Pending, In Review, Resolved).
  - Detailed issue audit log with color-coded status badges (`Pending: Orange`, `Review: Blue`, `Cleaning: Yellow`, `Resolved: Green`, `Ignored: Gray`).
- **Settings Page**:
  - Configuration panel for SalesGPT API keys, Clay webhook endpoints, and matching confidence thresholds.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Table**: `@tanstack/react-table` (v8)
- **Charts**: `recharts`
- **Icons**: `lucide-react`
- **Animations**: `framer-motion`
- **Form Management**: `react-hook-form`

---

## Project Structure

```
app/
  layout.tsx               # Root HTML layout & font configuration
  page.tsx                 # Overview Page
  countries/page.tsx       # Country Comparison Page
  duplicates/page.tsx      # Duplicate Data Analysis Page
  pipeline/page.tsx        # Ingestion Pipeline Stage Page
  field-issues/page.tsx    # Field-Level Quality Audit Page
  settings/page.tsx        # Configuration & Settings Page
  globals.css              # Custom Tailwind directives & theme reset

components/
  dashboard/
    KpiCard.tsx            # Overview KPI Cards
    HorizontalComparisonBar.tsx # Stacked database distribution bar
    SectionHeader.tsx      # Page headers
    StatCard.tsx           # Reusable metric card
    SampleBanner.tsx       # Yellow placeholder data alert
  charts/
    DuplicatePieChart.tsx   # Recharts Pie chart for duplicate categories
    PipelineFunnelChart.tsx # Recharts Bar/Funnel chart for stage conversion
  tables/
    CountryTable.tsx       # TanStack Table for geographic breakdown
    DuplicateTable.tsx     # Deduplication log table
    IssueTable.tsx         # Data quality issue audit table
    TablePagination.tsx    # Reusable table pagination control
  cards/
    PipelineStageCard.tsx  # Vertical stage card with connector arrow
    CoverageBar.tsx        # ASCII style coverage meter (████████░░ 82%)
    StatusBadge.tsx        # Color-coded status badge indicator
    ProgressBadge.tsx      # Visual progress meter
    LoadingSkeleton.tsx    # Shimmer skeleton loader
  layout/
    Sidebar.tsx            # Left navigation sidebar
    Topbar.tsx             # Top header bar (Company Data, Date Range, Refresh)
    DashboardShell.tsx     # Global layout state wrapper
  filters/
    FilterBar.tsx          # Global filter drawer component

data/
  overview.json            # High-level overview metrics
  countries.json           # Geographic dataset coverage
  duplicates.json          # Deduplication rule statistics
  pipeline.json            # Processing stage volumes
  fieldIssues.json         # Data validation logs

services/
  dashboard.ts             # Central data computation & filtering service layer

types/
  index.ts                 # TypeScript interfaces for all metrics & records

utils/
  formatters.ts            # Number, percentage, and currency formatters
  cn.ts                    # Tailwind class merger utility
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. Build for Production

```bash
npm run build
npm start
```

---

## SQL & API Integration Roadmap

This application is designed for instant migration from mock JSON files to a live SQL database (e.g., PostgreSQL, BigQuery, Snowflake) or REST/GraphQL API services.

All UI components receive pre-computed data props exclusively from `/services/dashboard.ts`.

To replace the mock data with direct database queries:
1. Open `/services/dashboard.ts`.
2. Replace mock JSON imports with your database client (e.g., `pg`, `@google-cloud/bigquery`, or `fetch`).
3. Replace helper functions with SQL `SELECT` queries as noted in the `// TODO: Replace with SQL/API` comments.

Example SQL replacement inside `getCountryComparisonData`:
```sql
SELECT 
  country,
  SUM(salesgpt_cnt) as salesgpt,
  SUM(clay_raw_cnt) as clay_raw,
  SUM(clay_clean_cnt) as clay_clean,
  SUM(overlap_cnt) as overlap,
  SUM(clay_only_cnt) as clay_only,
  SUM(salesgpt_only_cnt) as salesgpt_only,
  ROUND((SUM(overlap_cnt)::numeric / NULLIF(SUM(clay_clean_cnt), 0)) * 100, 1) as coverage_pct
FROM company_reconciliation_stats
WHERE (:country = 'All' OR country = :country)
GROUP BY country;
```
