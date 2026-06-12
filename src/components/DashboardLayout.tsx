'use client';

import { ReactNode, useMemo } from 'react';
import { useParsedIncome, useTransactions } from '@/hooks/useSupabaseData';
import { Transaction } from '@/lib/income-parser';
import AppShell from './AppShell';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  children: ReactNode;
}

export interface DashboardData {
  parsedIncome: {
    parsed: {
      totalIncome: number;
      income: Array<{
        date: Date;
        amount: number;
        platform: string;
      }>;
      startDate: Date;
      endDate: Date;
      byPlatform: Map<string, any>;
    };
    stability: {
      score: number;
      rating: string;
      weeklyAverage: number;
      variability: number;
    };
    rawTransactions: Transaction[];
  } | null;
  transactions: Transaction[];
  isLoading: boolean;
}

export default function DashboardLayout({ user, onLogout, children }: DashboardLayoutProps) {
  // Fetch data from Supabase
  const { data: supabaseParsedIncome, loading: incomeLoading, error: incomeError } = useParsedIncome(user.id);
  const { data: transactions, loading: transactionsLoading } = useTransactions(user.id);

  // Transform Supabase data to Dashboard format
  const parsedIncome = useMemo(() => {
    if (!supabaseParsedIncome) {
      return null;
    }

    // Extract data from JSONB database structure
    const platformData = supabaseParsedIncome.by_platform || {};
    const stabilityData = supabaseParsedIncome.stability || {
      score: 0,
      rating: 'Unknown',
      weeklyAverage: 0,
      variability: 0,
    };

    // Build income array and byPlatform map from stored JSONB data
    const incomeArray: any[] = [];
    const byPlatformMap = new Map<string, any>();

    // Convert JSONB platform data to income array and map
    Object.entries(platformData).forEach(([platform, data]: [string, any]) => {
      if (data.items && Array.isArray(data.items)) {
        data.items.forEach((item: any) => {
          const incomeItem = {
            date: new Date(item.date),
            amount: item.amount,
            platform: platform,
            description: item.description,
          };
          incomeArray.push(incomeItem);
        });

        byPlatformMap.set(platform, {
          total: data.total,
          count: data.count,
          items: data.items.map((item: any) => ({
            ...item,
            date: new Date(item.date),
          })),
        });
      }
    });

    // Transform Supabase format to Dashboard format
    return {
      parsed: {
        totalIncome: supabaseParsedIncome.total_income || incomeArray.reduce((sum, item) => sum + item.amount, 0),
        income: incomeArray,
        startDate: new Date(supabaseParsedIncome.start_date),
        endDate: new Date(supabaseParsedIncome.end_date),
        byPlatform: byPlatformMap,
      },
      stability: {
        score: stabilityData.score || 0,
        rating: stabilityData.rating || 'Unknown',
        weeklyAverage: stabilityData.weeklyAverage || 0,
        variability: stabilityData.variability || 0,
      },
      rawTransactions: (transactions || []).map((tx) => ({
        id: tx.id,
        date: new Date(tx.date),
        description: tx.name,
        amount: tx.amount,
        type: tx.amount > 0 ? 'credit' : 'debit' as 'credit' | 'debit',
      })),
    };
  }, [supabaseParsedIncome, transactions]);

  // Loading state
  const isLoading = incomeLoading || transactionsLoading;

  // Error handling
  if (incomeError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-white/10 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-base font-semibold text-white mb-1">Error loading data</h2>
          <p className="text-sm text-slate-400">{incomeError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-3.5 py-1.5 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium  transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    onLogout();
  };

  return (
    <AppShell user={user} onLogout={handleLogout}>
      {children}
    </AppShell>
  );
}
