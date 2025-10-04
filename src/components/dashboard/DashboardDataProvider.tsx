'use client';

import { ReactNode, useMemo } from 'react';
import { useParsedIncome, useTransactions, usePlaidItems } from '@/hooks/useSupabaseData';
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
  plaidItems: any[];
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
  const { data: plaidItems, loading: plaidItemsLoading } = usePlaidItems(user.id);

  // Transform Supabase data to Dashboard format
  const parsedIncome = useMemo(() => {
    if (!supabaseParsedIncome) {
      return null;
    }

    return {
      parsed: {
        totalIncome: supabaseParsedIncome.total_income,
        income: supabaseParsedIncome.income_data.map((item) => ({
          date: new Date(item.date),
          amount: item.amount,
          platform: item.platform,
        })),
        startDate: new Date(supabaseParsedIncome.start_date),
        endDate: new Date(supabaseParsedIncome.end_date),
        byPlatform: new Map(Object.entries(supabaseParsedIncome.platforms)),
      },
      stability: {
        score: supabaseParsedIncome.stability_score,
        rating: supabaseParsedIncome.stability_rating,
        weeklyAverage: supabaseParsedIncome.weekly_average,
        variability: supabaseParsedIncome.variability,
      },
      rawTransactions: transactions.map((tx) => ({
        id: tx.id,
        date: new Date(tx.date),
        description: tx.name,
        amount: tx.amount,
        type: tx.amount > 0 ? 'credit' : 'debit' as 'credit' | 'debit',
      })),
    };
  }, [supabaseParsedIncome, transactions]);

  const isLoading = incomeLoading || transactionsLoading || plaidItemsLoading;

  const dashboardData: DashboardData = {
    parsedIncome,
    transactions: transactions.map((tx) => ({
      id: tx.id,
      date: new Date(tx.date),
      description: tx.name,
      amount: tx.amount,
      type: tx.amount > 0 ? 'credit' : 'debit' as 'credit' | 'debit',
    })),
    plaidItems,
    isLoading,
  };

  return <>{children(dashboardData, user)}</>;
}
