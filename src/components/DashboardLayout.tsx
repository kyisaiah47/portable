'use client';

import { ReactNode, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, DollarSign, Shield, LogOut, User, FileText, Receipt, BookOpen, Users, Target, ChevronDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useParsedIncome, useTransactions, usePlaidItems } from '@/hooks/useSupabaseData';
import { Transaction } from '@/lib/income-parser';

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
  plaidItems: any[];
  isLoading: boolean;
}

export default function DashboardLayout({ user, onLogout, children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname === '/dashboard' ? 'home' : pathname.split('/').pop() || 'home';

  // Fetch data from Supabase
  const { data: supabaseParsedIncome, loading: incomeLoading, error: incomeError } = useParsedIncome(user.id);
  const { data: transactions, loading: transactionsLoading } = useTransactions(user.id);
  const { data: plaidItems, loading: plaidItemsLoading } = usePlaidItems(user.id);

  // Transform Supabase data to Dashboard format
  const parsedIncome = useMemo(() => {
    if (!supabaseParsedIncome) {
      return null;
    }

    // Extract data from JSONB fields
    const stabilityData = supabaseParsedIncome.stability as any;
    const platformData = supabaseParsedIncome.by_platform as any;
    const incomeData = stabilityData?.incomeData || [];

    // Transform Supabase format to Dashboard format
    return {
      parsed: {
        totalIncome: supabaseParsedIncome.total_income,
        income: incomeData.map((item: any) => ({
          date: new Date(item.date),
          amount: item.amount,
          platform: item.platform,
        })),
        startDate: new Date(supabaseParsedIncome.start_date),
        endDate: new Date(supabaseParsedIncome.end_date),
        byPlatform: new Map(Object.entries(platformData || {})),
      },
      stability: {
        score: stabilityData?.score || 0,
        rating: stabilityData?.rating || 'Unknown',
        weeklyAverage: stabilityData?.weeklyAverage || 0,
        variability: stabilityData?.variability || 0,
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

  // Loading state
  const isLoading = incomeLoading || transactionsLoading || plaidItemsLoading;

  // Error handling
  if (incomeError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
          <h2 className="text-red-400 font-bold mb-2">Error Loading Data</h2>
          <p className="text-slate-300 text-sm">{incomeError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-colors"
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
    <div className="min-h-screen bg-slate-950 font-inter">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-900/90 rounded-lg p-8 border border-white/10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-white font-semibold">Loading your data...</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="backdrop-blur-xl bg-slate-900/70 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
                </div>
                <h1 className="text-2xl font-bold text-white font-space-grotesk">Portable</h1>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                {[
                  { id: 'home', label: 'Home', icon: BarChart3, path: '/dashboard' },
                  { id: 'income', label: 'Income', icon: DollarSign, path: '/dashboard/income' },
                  { id: 'expenses', label: 'Expenses', icon: Receipt, path: '/dashboard/expenses' },
                  { id: 'taxes', label: 'Taxes', icon: FileText, path: '/dashboard/taxes' },
                  { id: 'benefits', label: 'Benefits', icon: Shield, path: '/dashboard/benefits' }
                ].map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.path}
                    className={`flex items-center space-x-1.5 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'text-white bg-white/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </Link>
                ))}

                {/* More dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className={`flex items-center space-x-1.5 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    ['insights', 'referrals', 'learn'].includes(activeTab)
                      ? 'text-white bg-white/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}>
                    <MoreHorizontal className="w-4 h-4" />
                    <span>More</span>
                    <ChevronDown className="w-3 h-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-900 border-white/10">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/insights" className="flex items-center space-x-2 cursor-pointer">
                        <Target className="w-4 h-4" />
                        <span>Insights</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/referrals" className="flex items-center space-x-2 cursor-pointer">
                        <Users className="w-4 h-4" />
                        <span>Referrals</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/learn" className="flex items-center space-x-2 cursor-pointer">
                        <BookOpen className="w-4 h-4" />
                        <span>Learn</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/10">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user.firstName}
                  </p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 bg-slate-900/50 backdrop-blur-xl mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
              </div>
              <span className="text-xl font-bold text-white font-space-grotesk">Portable</span>
            </div>
            <div className="text-sm text-slate-500">© 2025 Portable Financial Ltd. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
