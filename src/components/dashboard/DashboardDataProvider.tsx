'use client';

import { ReactNode, useMemo } from 'react';
import { useParsedIncome, useTransactions } from '@/hooks/useSupabaseData';
import { Transaction } from '@/lib/income-parser';

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

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface DashboardDataProviderProps {
  user: User;
  children: (data: DashboardData, user: User) => ReactNode;
}

export default function DashboardDataProvider({ user, children }: DashboardDataProviderProps) {
  // Fetch data from Supabase
  const { data: supabaseParsedIncome, loading: incomeLoading } = useParsedIncome(user.id);
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

  const isLoading = incomeLoading || transactionsLoading;

  const dashboardData: DashboardData = {
    parsedIncome,
    transactions: (transactions || []).map((tx) => ({
      id: tx.id,
      date: new Date(tx.date),
      description: tx.name,
      amount: tx.amount,
      type: tx.amount > 0 ? 'credit' : 'debit' as 'credit' | 'debit',
    })),
    isLoading,
  };

  return <>{children(dashboardData, user)}</>;
}
