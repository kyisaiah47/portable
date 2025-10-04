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
