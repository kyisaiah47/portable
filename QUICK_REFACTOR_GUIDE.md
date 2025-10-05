# Quick Refactoring Reference

Use this as a quick reference when extracting the remaining dashboard pages.

## 1. Create Page Component Template

```typescript
'use client';

import { useState } from 'react';
import { DashboardData } from '@/components/dashboard/DashboardDataProvider';
// Import all necessary icons and components
import { /* icons */ } from 'lucide-react';

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
  const { parsedIncome, transactions, plaidItems } = dashboardData;

  // Add local state for view toggles
  // const [viewState, setViewState] = useState('default');

  return (
    <div className="space-y-8">
      {/* Paste content from Dashboard.tsx */}
    </div>
  );
}
```

## 2. Update Route Page Template

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

## 3. Line Number Reference

| Page | Start Line | End Line | Estimated Lines | File Path |
|------|-----------|----------|-----------------|-----------|
| Home | 252 | 800 | 548 | ✅ DONE |
| Income | 800 | 1343 | 543 | `/src/components/dashboard/IncomePage.tsx` |
| Expenses | 1343 | 1747 | 404 | `/src/components/dashboard/ExpensesPage.tsx` |
| Benefits | 1747 | 1749 | 2 | `/src/components/dashboard/BenefitsPage.tsx` |
| Taxes | 1749 | 2211 | 462 | `/src/components/dashboard/TaxesPage.tsx` |
| Insights | 2211 | 2233 | 22 | `/src/components/dashboard/InsightsPage.tsx` |
| Referrals | 2233 | 2243 | 10 | `/src/components/dashboard/ReferralsPage.tsx` |
| Learn | 2243 | 2424 | 181 | `/src/components/dashboard/LearnPage.tsx` |

## 4. Common State Variables by Page

### IncomePage
```typescript
const [incomeChartView, setIncomeChartView] = useState<'bar' | 'pie'>('bar');
const [incomeTimePeriod, setIncomeTimePeriod] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
```

### ExpensesPage
```typescript
const [expenseChartView, setExpenseChartView] = useState<'donut' | 'bar' | 'line'>('donut');
```

### TaxesPage
```typescript
const [taxChartView, setTaxChartView] = useState<'quarterly' | 'liability'>('quarterly');
```

### LearnPage
```typescript
const [selectedCities, setSelectedCities] = useState<City[]>([]);
const [selectedGigTypes, setSelectedGigTypes] = useState<GigType[]>([]);
```

## 5. Special Cases

### BenefitsPage (Simple)
```typescript
import BenefitsMarketplace from '@/components/BenefitsMarketplace';

export default function BenefitsPage() {
  return <BenefitsMarketplace />;
}
```

### InsightsPage (Dynamic Import)
```typescript
import PlatformInsights from '@/components/PlatformInsights';

export default function InsightsPage({ dashboardData, user }: InsightsPageProps) {
  const { parsedIncome } = dashboardData;

  const transactionsWithPlatform = parsedIncome?.rawTransactions?.map((tx: any) => ({
    ...tx,
    platform: tx.platform || 'Other',
  })) || [];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 font-space-grotesk">Platform Insights</h1>
        <p className="text-slate-400">
          Compare platform performance and get personalized recommendations to maximize earnings
        </p>
      </div>
      <PlatformInsights transactions={transactionsWithPlatform} />
    </div>
  );
}
```

### ReferralsPage (Dynamic Import)
```typescript
import ReferralDashboard from '@/components/ReferralDashboard';

export default function ReferralsPage() {
  return (
    <div className="space-y-8">
      <ReferralDashboard />
    </div>
  );
}
```

## 6. File Upload Handler (IncomePage)

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

    const parsed = parseTransactions(transactions);
    const stability = calculateStabilityScore(parsed.income);
    const incomeData = { parsed, stability, rawTransactions: transactions };

    // TODO: Save to Supabase instead of localStorage
    // For now, just reload to trigger re-fetch
    window.location.reload();
  };

  reader.readAsText(file);
};
```

## 7. Common Imports by Page

### All Pages
```typescript
import { DashboardData } from '@/components/dashboard/DashboardDataProvider';
```

### IncomePage
```typescript
import PlaidLink from '@/components/PlaidLink';
import { parseTransactions, calculateStabilityScore, type Transaction } from '@/lib/income-parser';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { SiUber, SiLyft, SiDoordash, ... } from 'react-icons/si';
```

### ExpensesPage
```typescript
import { parseExpenses } from '@/lib/expense-parser';
import { ChartContainer, ... } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, LineChart, ... } from 'recharts';
```

### TaxesPage
```typescript
import { calculateTaxes, getQuarterlyDeadlines, projectAnnualTax } from '@/lib/tax-calculator';
import QuarterlyTaxCalculator from '@/components/QuarterlyTaxCalculator';
```

### LearnPage
```typescript
import { getTips, getGuides, type City, type GigType } from '@/lib/content-registry';
import { DropdownMenu, DropdownMenuCheckboxItem, ... } from '@/components/ui/dropdown-menu';
```

## 8. Checklist for Each Page

- [ ] Create `/src/components/dashboard/[PageName].tsx`
- [ ] Copy content from Dashboard.tsx (correct line range)
- [ ] Add proper imports
- [ ] Define props interface
- [ ] Extract state variables
- [ ] Replace `parsedIncome` with `dashboardData.parsedIncome`
- [ ] Replace `user.` with prop `user.`
- [ ] Add any handlers (file upload, etc.)
- [ ] Update `/src/app/dashboard/[route]/page.tsx`
- [ ] Test page renders correctly
- [ ] Test all interactions work
- [ ] Test data loads properly
- [ ] Verify responsive design
- [ ] Check for console errors

## 9. Testing Commands

```bash
# Start development server
npm run dev

# Navigate to each route and test
# http://localhost:3000/dashboard
# http://localhost:3000/dashboard/income
# http://localhost:3000/dashboard/expenses
# http://localhost:3000/dashboard/taxes
# http://localhost:3000/dashboard/benefits
# http://localhost:3000/dashboard/insights
# http://localhost:3000/dashboard/referrals
# http://localhost:3000/dashboard/learn
```

## 10. Order of Extraction (Recommended)

1. **BenefitsPage** (easiest - just wraps existing component)
2. **InsightsPage** (simple - wraps PlatformInsights)
3. **ReferralsPage** (simple - wraps ReferralDashboard)
4. **LearnPage** (moderate - has filters and content rendering)
5. **ExpensesPage** (complex - charts and data processing)
6. **TaxesPage** (complex - multiple charts and calculations)
7. **IncomePage** (most complex - file upload, charts, Plaid integration)

Start with the easiest to build confidence and momentum!

## 11. Quick Search & Replace

When pasting content from Dashboard.tsx:

**Find**: `parsedIncome?.`
**Replace**: `dashboardData.parsedIncome?.`

**Find**: `transactions`
**Replace**: `dashboardData.transactions`

**Find**: `plaidItems`
**Replace**: `dashboardData.plaidItems`

**Find**: `{user.firstName}`
**Replace**: `{user.firstName}` (already correct)

## 12. Common Gotchas

1. **Dynamic requires**: Convert to static imports
   ```typescript
   // Old
   const Component = require('./Component').default;

   // New
   import Component from '@/components/Component';
   ```

2. **State initialization**: Move from Dashboard to page component
3. **Event handlers**: Include in page component, not layout
4. **Conditional rendering**: Keep `{parsedIncome && (...)}`  patterns
5. **Link components**: Already imported in each page

## Done!

Follow this guide for each remaining page. The pattern is consistent across all pages.
