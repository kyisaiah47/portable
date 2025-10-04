# Dashboard Refactoring Guide

## Overview

The Dashboard component (/src/components/Dashboard.tsx) was a monolithic 2,443-line file containing all dashboard pages. This guide documents the refactoring to separate page components following industry best practices.

## Current Status

### ✅ Completed
1. **DashboardLayout** (`/src/components/DashboardLayout.tsx`) - 218 lines
   - Contains navigation, header, footer, and loading overlay
   - Handles shared data hooks and authentication
   - Provides consistent layout across all dashboard pages

2. **DashboardDataProvider** (`/src/components/dashboard/DashboardDataProvider.tsx`) - 74 lines
   - Fetches and transforms Supabase data
   - Uses render prop pattern to pass data to children
   - Centralizes data fetching logic

3. **HomePage** (`/src/components/dashboard/HomePage.tsx`) - 632 lines
   - Extracted from Dashboard.tsx lines 252-800
   - Contains hero message, metrics cards, tips, platform breakdown
   - Fully self-contained with all dependencies

4. **Main Dashboard Route** (`/src/app/dashboard/page.tsx`)
   - Updated to use DashboardLayout + DashboardDataProvider + HomePage
   - Demonstrates the refactoring pattern

### 📋 Remaining Work

The following page components still need to be extracted from Dashboard.tsx:

1. **IncomePage** (lines 800-1343) → `/src/components/dashboard/IncomePage.tsx`
2. **ExpensesPage** (lines 1343-1747) → `/src/components/dashboard/ExpensesPage.tsx`
3. **TaxesPage** (lines 1749-2211) → `/src/components/dashboard/TaxesPage.tsx`
4. **InsightsPage** (lines 2211-2233) → `/src/components/dashboard/InsightsPage.tsx`
5. **ReferralsPage** (lines 2233-2243) → `/src/components/dashboard/ReferralsPage.tsx`
6. **LearnPage** (lines 2243-2424) → `/src/components/dashboard/LearnPage.tsx`

## Refactoring Pattern

### Step 1: Extract Page Component

Create a new file in `/src/components/dashboard/[PageName].tsx`:

```typescript
'use client';

import { useState } from 'react';
import { DashboardData } from '@/components/dashboard/DashboardDataProvider';
import { /* import icons and components */ } from 'lucide-react';
// ... other imports

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface [PageName]Props {
  dashboardData: DashboardData;
  user: User;
}

export default function [PageName]({ dashboardData, user }: [PageName]Props) {
  const { parsedIncome, transactions, plaidItems, isLoading } = dashboardData;

  // Local state for view toggles (chart types, time periods, etc.)
  const [chartView, setChartView] = useState<'type1' | 'type2'>('type1');

  return (
    <div className="space-y-8">
      {/* Copy content from Dashboard.tsx activeTab === 'pagename' section */}
    </div>
  );
}
```

### Step 2: Update Route Page

Update `/src/app/dashboard/[route]/page.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardDataProvider from '@/components/dashboard/DashboardDataProvider';
import [PageName] from '@/components/dashboard/[PageName]';
import { useAuth } from '@/contexts/AuthContext';

export default function [Route]Page() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-white font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user} onLogout={signOut}>
      <DashboardDataProvider user={user}>
        {(dashboardData, user) => (
          <[PageName] dashboardData={dashboardData} user={user} />
        )}
      </DashboardDataProvider>
    </DashboardLayout>
  );
}
```

### Step 3: Handle File Uploads

For pages with file upload functionality (like IncomePage), extract the handler:

```typescript
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    const lines = text.split('\n');
    const transactions: Transaction[] = [];

    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const [date, description, amount, type] = line.split(',');
      if (date && description && amount && type) {
        transactions.push({
          id: `${i}`,
          date: new Date(date),
          description,
          amount: parseFloat(amount),
          type: type.trim() as 'credit' | 'debit',
        });
      }
    }

    // TODO: Save to Supabase
    window.location.reload();
  };

  reader.readAsText(file);
};
```

### Step 4: Handle Dynamic Imports

For pages that dynamically import components (like Insights, Referrals), convert to static imports:

```typescript
// Old (in Dashboard.tsx)
const PlatformInsights = require('./PlatformInsights').default;
return <PlatformInsights transactions={transactionsWithPlatform} />;

// New (in InsightsPage.tsx)
import PlatformInsights from '@/components/PlatformInsights';

// Then use directly
return <PlatformInsights transactions={transactionsWithPlatform} />;
```

## Benefits Page - Special Case

The Benefits page already uses a separate component (`BenefitsMarketplace`), so it's simpler:

```typescript
// /src/components/dashboard/BenefitsPage.tsx
'use client';

import BenefitsMarketplace from '@/components/BenefitsMarketplace';

export default function BenefitsPage() {
  return <BenefitsMarketplace />;
}
```

## Line Count Reduction

- **Original Dashboard.tsx**: 2,443 lines
- **DashboardLayout**: 218 lines
- **DashboardDataProvider**: 74 lines
- **HomePage**: 632 lines
- **Estimated after full refactor**: ~200 lines (just the old Dashboard wrapper for backward compatibility)

**Total reduction**: ~1,800 lines moved into separate, maintainable components

## Architecture Benefits

1. **Separation of Concerns**: Each page is self-contained
2. **Easier Testing**: Can test individual pages in isolation
3. **Better Performance**: Smaller bundle sizes per route
4. **Improved Maintainability**: Changes to one page don't affect others
5. **Clearer Code Ownership**: Each file has a single responsibility
6. **Reduced Merge Conflicts**: Multiple developers can work on different pages
7. **Type Safety**: Each page has clearly defined props
8. **Reusability**: Layout and data fetching logic is shared

## File Structure

```
/src
  /components
    /dashboard
      DashboardDataProvider.tsx  (data fetching)
      HomePage.tsx               (home page content)
      IncomePage.tsx            (income page content)
      ExpensesPage.tsx          (expenses page content)
      TaxesPage.tsx             (taxes page content)
      InsightsPage.tsx          (insights page content)
      ReferralsPage.tsx         (referrals page content)
      LearnPage.tsx             (learn page content)
      BenefitsPage.tsx          (benefits page content)
    /ui
      (shadcn components)
    DashboardLayout.tsx         (shared layout)
    Dashboard.tsx               (KEEP for backward compatibility)
    BenefitsMarketplace.tsx
    PlatformInsights.tsx
    PlaidLink.tsx
    QuarterlyTaxCalculator.tsx
    ReferralDashboard.tsx
  /app
    /dashboard
      page.tsx                  (home route - REFACTORED)
      /income
        page.tsx                (income route - TODO)
      /expenses
        page.tsx                (expenses route - TODO)
      /taxes
        page.tsx                (taxes route - TODO)
      /benefits
        page.tsx                (benefits route - TODO)
      /insights
        page.tsx                (insights route - TODO)
      /referrals
        page.tsx                (referrals route - TODO)
      /learn
        page.tsx                (learn route - TODO)
```

## Important Notes

1. **Keep Dashboard.tsx**: Don't delete it until all routes are migrated and tested
2. **Preserve ALL functionality**: Every feature must work exactly as before
3. **Maintain UI/UX**: No visual changes should occur
4. **Test each page**: Verify data loading, interactions, and navigation
5. **State management**: Each page manages its own view state (chart types, etc.)
6. **Shared data**: Fetched once in DashboardDataProvider, passed to all pages

## Testing Checklist

For each refactored page:
- [ ] Page renders without errors
- [ ] Data loads correctly from Supabase
- [ ] All charts and visualizations display properly
- [ ] Interactive elements work (buttons, dropdowns, toggles)
- [ ] Navigation between tabs works
- [ ] Loading states display correctly
- [ ] Error states handle gracefully
- [ ] File uploads work (if applicable)
- [ ] Responsive design works on mobile
- [ ] No console errors or warnings

## Next Steps

1. Extract IncomePage component
2. Extract ExpensesPage component
3. Extract TaxesPage component
4. Extract InsightsPage component
5. Extract ReferralsPage component
6. Extract LearnPage component
7. Extract BenefitsPage component
8. Update all route pages to use new components
9. Test all pages thoroughly
10. Remove old Dashboard.tsx (keep as legacy fallback initially)
11. Update any direct imports of Dashboard component

## Questions or Issues?

This is a complex refactoring. If you encounter issues:
- Check that all imports are correct
- Verify data is being passed through props correctly
- Ensure state management is properly scoped to each component
- Review the HomePage implementation as a reference

## Example: IncomePage Extraction

Here's what the extraction should look like for IncomePage:

1. Copy lines 800-1343 from Dashboard.tsx
2. Extract state variables like `incomeChartView`, `incomeTimePeriod`
3. Add `handleFileUpload` function
4. Import all necessary icons and components
5. Replace `parsedIncome` references with `dashboardData.parsedIncome`
6. Add proper TypeScript types
7. Test thoroughly

The pattern is the same for all pages!
