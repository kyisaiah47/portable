'use client';

import { DashboardData } from '@/components/dashboard/DashboardDataProvider';
import PlatformInsights from '@/components/PlatformInsights';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface InsightsPageProps {
  dashboardData: DashboardData;
  user: User;
}

export default function InsightsPage({ dashboardData, user }: InsightsPageProps) {
  const { parsedIncome } = dashboardData;

  // Use parsed income data which has platforms already extracted
  const transactionsWithPlatform = parsedIncome?.parsed?.income?.map((item: any) => ({
    id: `${item.platform}-${item.date}-${item.amount}`,
    date: item.date instanceof Date ? item.date : new Date(item.date),
    description: item.description,
    amount: item.amount,
    type: 'credit' as const,
    platform: item.platform || 'Other',
  })) || [];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1.5">Workspace</p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Platform insights</h1>
        <p className="text-sm text-slate-400 mt-1.5">
          Compare platform performance and find where the next dollar comes from.
        </p>
      </div>
      <PlatformInsights transactions={transactionsWithPlatform} />
    </div>
  );
}
