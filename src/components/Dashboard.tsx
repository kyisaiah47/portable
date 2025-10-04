'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import BenefitsMarketplace from './BenefitsMarketplace';
import PlaidLink from './PlaidLink';
import { BarChart3, DollarSign, PiggyBank, Shield, LogOut, User, FileText, Zap, Globe, ArrowRight, Heart, Wallet, Briefcase, Receipt, BookOpen, Users, Target, Upload, Download, Check, ChevronDown, Calendar, TrendingDown } from 'lucide-react';
import { SiUber, SiLyft, SiDoordash, SiInstacart, SiGrubhub, SiUbereats, SiUpwork, SiFiverr, SiFreelancer, SiToptal, SiYoutube, SiTwitch, SiPatreon, SiOnlyfans, SiSubstack, SiAirbnb } from 'react-icons/si';
import { parseTransactions, calculateStabilityScore, type Transaction } from '@/lib/income-parser';
import { parseExpenses } from '@/lib/expense-parser';
import { calculateTaxes, getQuarterlyDeadlines, projectAnnualTax } from '@/lib/tax-calculator';
import { getTips, getGuides, type City, type GigType } from '@/lib/content-registry';
import { useParsedIncome, useTransactions, usePlaidItems } from '@/hooks/useSupabaseData';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
} from 'recharts';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = pathname === '/dashboard' ? 'home' : pathname.split('/').pop() || 'home';
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [selectedGigTypes, setSelectedGigTypes] = useState<GigType[]>([]);
  const [incomeChartView, setIncomeChartView] = useState<'bar' | 'pie'>('bar');
  const [incomeTimePeriod, setIncomeTimePeriod] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [taxChartView, setTaxChartView] = useState<'quarterly' | 'liability'>('quarterly');
  const [expenseChartView, setExpenseChartView] = useState<'donut' | 'bar' | 'line'>('donut');

  // Fetch data from Supabase
  const { data: supabaseParsedIncome, loading: incomeLoading, error: incomeError } = useParsedIncome(user.id);
  const { data: transactions, loading: transactionsLoading } = useTransactions(user.id);
  const { data: plaidItems, loading: plaidItemsLoading } = usePlaidItems(user.id);

  // Transform Supabase data to Dashboard format
  const parsedIncome = useMemo(() => {
    if (!supabaseParsedIncome) {
      return null;
    }

    // Transform Supabase format to Dashboard format
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
                  { id: 'benefits', label: 'Benefits', icon: Shield, path: '/dashboard/benefits' },
                  { id: 'taxes', label: 'Taxes', icon: FileText, path: '/dashboard/taxes' },
                  { id: 'insights', label: 'Insights', icon: Target, path: '/dashboard/insights' },
                  { id: 'referrals', label: 'Referrals', icon: Users, path: '/dashboard/referrals' },
                  { id: 'learn', label: 'Learn', icon: BookOpen, path: '/dashboard/learn' }
                ].map((tab) => (
                  <Link
                    key={tab.id}
                    href={tab.path}
                    className={`flex items-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </Link>
                ))}
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

        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Hero message - SHORT AND PUNCHY */}
            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space-grotesk">
                You&apos;re crushing it, {user.firstName}
              </h1>
              <p className="text-base md:text-lg text-slate-300">
                {parsedIncome?.parsed?.totalIncome ? (
                  <>
                    ${parsedIncome.parsed.totalIncome.toLocaleString()} earned. Auto-saved ${Math.round(parsedIncome.parsed.totalIncome * 0.30).toLocaleString()} for taxes. Most people don&apos;t have their shit this together.
                  </>
                ) : (
                  <>
                    Connect your bank to automatically track your earnings across all gig platforms in one place.
                  </>
                )}
              </p>
            </div>

            {/* Dynamic Insights & Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Earnings Card */}
              <div className="bg-gradient-to-br from-blue-900/40 via-blue-900/20 to-slate-900/40 backdrop-blur-xl rounded-lg p-6 border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <span className="text-xs text-blue-400 font-semibold">+12%</span>
                </div>
                <div className="text-3xl font-black text-white font-space-grotesk mb-1">
                  ${parsedIncome?.stability.weeklyAverage ? (parsedIncome.stability.weeklyAverage * 4).toFixed(0) : '0'}
                </div>
                <div className="text-xs text-slate-400 mb-3">Earned this month</div>

                {/* Mini Sparkline */}
                {parsedIncome?.parsed?.income && parsedIncome.parsed.income.length > 0 && (
                  <div className="h-12 -mx-2">
                    <ChartContainer
                      config={{ income: { label: 'Income', color: '#3b82f6' } }}
                      className="h-full w-full"
                    >
                      <LineChart
                        data={(() => {
                          // Get last 6 weeks of income
                          const weeklyData: Record<string, number> = {};
                          parsedIncome.parsed.income.forEach((item: any) => {
                            const date = new Date(item.date);
                            const weekStart = new Date(date);
                            weekStart.setDate(date.getDate() - date.getDay());
                            const key = weekStart.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
                            weeklyData[key] = (weeklyData[key] || 0) + item.amount;
                          });
                          return Object.entries(weeklyData)
                            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                            .slice(-6)
                            .map(([week, amount]) => ({ week, amount }));
                        })()}
                      >
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ChartContainer>
                  </div>
                )}
              </div>

              {/* Tax Readiness Card */}
              <div className="bg-gradient-to-br from-purple-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-xl rounded-lg p-6 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <Receipt className="w-5 h-5 text-purple-400" />
                  <span className="text-xs text-purple-400 font-semibold">68%</span>
                </div>
                <div className="text-3xl font-black text-white font-space-grotesk mb-1">
                  ${parsedIncome?.stability?.weeklyAverage ? ((parsedIncome.stability.weeklyAverage * 4) * 0.25).toFixed(0) : '0'}
                </div>
                <div className="text-xs text-slate-400">Set aside for taxes</div>
              </div>

              {/* Benefits Coverage Card */}
              <div className="bg-gradient-to-br from-pink-900/40 via-pink-900/20 to-slate-900/40 backdrop-blur-xl rounded-lg p-6 border border-pink-500/20">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="w-5 h-5 text-pink-400" />
                  <span className="text-xs text-pink-400 font-semibold">1.2 mo</span>
                </div>
                <div className="text-3xl font-black text-white font-space-grotesk mb-1">
                  $3,200
                </div>
                <div className="text-xs text-slate-400">Emergency fund</div>
              </div>

              {/* Next Deadline Card */}
              <div className="bg-gradient-to-br from-orange-900/40 via-orange-900/20 to-slate-900/40 backdrop-blur-xl rounded-lg p-6 border border-orange-500/20">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <span className="text-xs text-orange-400 font-semibold">2 weeks</span>
                </div>
                <div className="text-xl font-black text-white font-space-grotesk mb-1">
                  Q3 Taxes
                </div>
                <div className="text-xs text-slate-400">Next deadline</div>
              </div>
            </div>

            {/* Financial Pillars */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Earnings Stability Pillar */}
              <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Earnings Stability</h3>
                    <p className="text-xs text-slate-400">
                      {parsedIncome ? 'Good' : 'No data'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  {parsedIncome && parsedIncome.stability?.weeklyAverage
                    ? `$${parsedIncome.stability.weeklyAverage.toFixed(0)}/week average • ${parsedIncome.stability.variability}% variability`
                    : 'Upload income data to track stability'}
                </p>
              </div>

              {/* Tax Readiness Pillar */}
              <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Tax Readiness</h3>
                    <p className="text-xs text-slate-400">On track</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300">Q3 deadline in 2 weeks • 68% of taxes set aside</p>
              </div>

              {/* Benefits Coverage Pillar */}
              <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Benefits Coverage</h3>
                    <p className="text-xs text-slate-400">Partial</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300">Emergency fund covers 1.2 months • Consider health insurance</p>
              </div>

              {/* Expenses & Deductions Pillar */}
              <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Expenses & Deductions</h3>
                    <p className="text-xs text-slate-400">Optimized</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300">Tracking $1,240 in deductible expenses this month</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Personalized Tips */}
            {parsedIncome && (() => {
              // Get filtered tips from centralized registry
              const tips = getTips(
                selectedCities.length > 0 ? selectedCities : [],
                selectedGigTypes
              );

              const topTips = tips.slice(0, 6); // Show top 6 tips

              return (
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-white font-space-grotesk">Personalized tips</h2>
                    <p className="text-xs text-slate-400">
                      {selectedCities.length > 0 || selectedGigTypes.length > 0
                        ? `Filtered by ${selectedCities.length > 0 ? selectedCities.join(', ') : 'all cities'}${selectedGigTypes.length > 0 ? ` · ${selectedGigTypes.join(', ')}` : ''}`
                        : 'Based on your income, platforms, and location'}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topTips.map((tip) => {
                      const colorClasses = {
                        blue: 'border-blue-500/50 hover:border-blue-500',
                        green: 'border-green-500/50 hover:border-green-500',
                        purple: 'border-purple-500/50 hover:border-purple-500',
                        orange: 'border-orange-500/50 hover:border-orange-500',
                        red: 'border-red-500/50 hover:border-red-500',
                        yellow: 'border-yellow-500/50 hover:border-yellow-500',
                      };

                      return (
                        <div
                          key={tip.id}
                          className={`bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 ${colorClasses[tip.color as keyof typeof colorClasses]} transition-all cursor-pointer group`}
                        >
                          <div className="flex items-start space-x-3 mb-3">
                            <div className="text-2xl flex-shrink-0">{tip.icon}</div>
                            <div className="flex-1">
                              <h3 className="text-sm font-bold text-white mb-1 font-space-grotesk">{tip.title}</h3>
                              <p className="text-xs text-slate-400 leading-relaxed">{tip.description}</p>
                            </div>
                          </div>
                          {tip.action && (
                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                              <span className={`text-xs font-semibold text-${tip.color}-400`}>{tip.action}</span>
                              <ArrowRight className={`w-3 h-3 text-${tip.color}-400 group-hover:translate-x-1 transition-transform`} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Recommended for you - TOP OF FEED */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white font-space-grotesk">Recommended for you</h2>
                <p className="text-xs text-slate-400">Quick actions to improve your financial health</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Heart className="w-4 h-4 text-blue-400" />
                      </div>
                      <h3 className="text-base font-bold text-white font-space-grotesk">Get health insurance</h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 mb-2">As an Uber driver, having health coverage protects you and your income. Plans start at $200/mo with subsidies available.</p>
                  <div className="text-xs text-blue-400 font-semibold">Browse marketplace →</div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <PiggyBank className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="text-base font-bold text-white font-space-grotesk">Start a retirement fund</h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 mb-2">Solo 401(k) designed for gig workers. Tax advantages + we&apos;ll auto-contribute based on your earnings.</p>
                  <div className="text-xs text-purple-400 font-semibold">Learn more →</div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-pink-400" />
                      </div>
                      <h3 className="text-base font-bold text-white font-space-grotesk">Connect Instacart</h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-pink-400 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 mb-2">Top earners work 3+ platforms. Instacart pairs well with your Uber schedule and could add $800+/mo.</p>
                  <div className="text-xs text-pink-400 font-semibold">Connect platform →</div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-green-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Receipt className="w-4 h-4 text-green-400" />
                      </div>
                      <h3 className="text-base font-bold text-white font-space-grotesk">Tax deduction tracker</h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-green-400 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 mb-2">Automatically track mileage, phone bills, and other deductions. Average user saves $2,800/year.</p>
                  <div className="text-xs text-green-400 font-semibold">Start tracking →</div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Platform breakdown - DENSE GRID */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white font-space-grotesk">Where your money&apos;s coming from</h2>
                <p className="text-sm text-slate-400">You&apos;re crushing it on Uber. DoorDash is solid. Upwork? You&apos;re leaving money on the table.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Uber */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-blue-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">🚗</div>
                      <div>
                        <h3 className="text-base font-bold text-white font-space-grotesk">Uber</h3>
                        <p className="text-xs text-slate-400">Rideshare</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-space-grotesk">$1,890</div>
                      <div className="text-xs text-slate-400">44% of income</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{width: '44%'}}></div>
                  </div>
                  <p className="text-xs text-blue-400"><strong>Your best hours:</strong> 5-9pm weekdays when surge hits</p>
                </div>

                {/* DoorDash */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-purple-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">🍔</div>
                      <div>
                        <h3 className="text-base font-bold text-white font-space-grotesk">DoorDash</h3>
                        <p className="text-xs text-slate-400">Delivery</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent font-space-grotesk">$1,290</div>
                      <div className="text-xs text-slate-400">30% of income</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{width: '30%'}}></div>
                  </div>
                  <p className="text-xs text-purple-400"><strong>Pro tip:</strong> Downtown & university = stacked orders</p>
                </div>

                {/* Upwork */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-pink-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">💼</div>
                      <div>
                        <h3 className="text-base font-bold text-white font-space-grotesk">Upwork</h3>
                        <p className="text-xs text-slate-400">Freelance</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent font-space-grotesk">$1,120</div>
                      <div className="text-xs text-slate-400">26% of income</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full" style={{width: '26%'}}></div>
                  </div>
                  <p className="text-xs text-pink-400"><strong>Real talk:</strong> Bump your rate 15%. You&apos;re undercharging.</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* More sections side by side */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Quick actions */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-3 font-space-grotesk">Quick actions</h3>
                <div className="space-y-2">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg text-left hover:opacity-90 transition-opacity flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Connect new platform</div>
                      <div className="text-xs text-blue-100">Sync earnings automatically</div>
                    </div>
                    <Globe className="w-5 h-5" />
                  </button>
                  <button className="w-full bg-slate-800/50 text-white p-3 rounded-lg text-left hover:bg-slate-800 transition-colors flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Calculate taxes</div>
                      <div className="text-xs text-slate-400">See Q1 estimate</div>
                    </div>
                    <FileText className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Financial health */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-3 font-space-grotesk">Financial health</h3>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-4 border-green-500/30 flex items-center justify-center">
                    <div className="text-xl font-black text-white font-space-grotesk">78</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-white mb-1">Looking good</div>
                    <div className="text-xs text-slate-400">Better than 65% of gig workers</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Emergency fund</span>
                    <span className="text-green-400 font-semibold">✓ On track</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Retirement</span>
                    <span className="text-yellow-400 font-semibold">⚠ Needs work</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Health coverage</span>
                    <span className="text-green-400 font-semibold">✓ Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Educational content */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white font-space-grotesk">Learn & grow</h2>
                <p className="text-xs text-slate-400">Articles based on your work</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-blue-400 transition-colors">Maximizing Uber earnings in your city</h3>
                  <p className="text-xs text-slate-400 mb-3">Learn the best times, zones, and strategies to increase your hourly rate by 30% or more.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-400">5 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Heart className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-purple-400 transition-colors">The gig worker&apos;s guide to health insurance</h3>
                  <p className="text-xs text-slate-400 mb-3">Everything you need to know about getting affordable coverage without an employer.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-400">8 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Receipt className="w-4 h-4 text-pink-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-pink-400 transition-colors">How to track mileage for tax deductions</h3>
                  <p className="text-xs text-slate-400 mb-3">Simple systems to capture every deductible mile and maximize your tax savings.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-pink-400">6 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-pink-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-green-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Wallet className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-green-400 transition-colors">Building an emergency fund on variable income</h3>
                  <p className="text-xs text-slate-400 mb-3">Proven strategies to save consistently even when your earnings fluctuate month to month.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-400">7 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-green-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="w-4 h-4 text-orange-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-orange-400 transition-colors">Quarterly tax estimates explained</h3>
                  <p className="text-xs text-slate-400 mb-3">How to calculate, when to pay, and how to avoid penalties on your self-employment taxes.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-orange-400">10 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Target className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-indigo-400 transition-colors">Retirement planning for freelancers</h3>
                  <p className="text-xs text-slate-400 mb-3">Solo 401(k)s, SEP IRAs, and other retirement accounts designed for independent workers.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-indigo-400">12 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Community insights */}
            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white font-space-grotesk">Community insights</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-white">12,000 Uber drivers</span> on Portable average <span className="font-bold text-blue-400">$2,100/mo more</span> with multi-platform strategies
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-white">Top earners in your area</span> work <span className="font-bold text-purple-400">3+ platforms simultaneously</span>
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-pink-400">95% of members</span> hit their emergency fund goal <span className="font-bold text-white">within 8 months</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'income' && (
          <div className="space-y-8">
            {/* Top Card - Hero number with utilities */}
            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">Income This Month</h1>
                  <div className="flex items-baseline gap-4 mb-2">
                    <div className="text-5xl md:text-6xl font-black text-white font-space-grotesk">
                      ${parsedIncome?.stability.weeklyAverage ? (parsedIncome.stability.weeklyAverage * 4).toFixed(0) : '0'}
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <ArrowRight className="w-4 h-4 rotate-[-45deg]" />
                      <span className="text-lg font-bold">+12%</span>
                    </div>
                  </div>
                  <p className="text-base text-slate-300">
                    vs last month • Track every dollar across platforms
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Plaid Connect Bank Button */}
                  <div className="flex-shrink-0">
                    <PlaidLink
                      userId={user.id}
                      onSuccess={() => {
                        // Refresh data after connecting bank
                        window.location.reload();
                      }}
                      variant="button"
                    />
                  </div>
                  <a
                    href="/sample-bank-statement.csv"
                    download
                    className="bg-slate-900/80 backdrop-blur-xl rounded-lg p-3 border border-white/20 hover:border-purple-500/50 hover:bg-slate-800 transition-all text-center max-w-[120px]"
                  >
                    <Download className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-white mb-0.5">Sample CSV</p>
                    <p className="text-[10px] text-slate-400 leading-tight">Try with mock data</p>
                  </a>
                  <label className="cursor-pointer flex-shrink-0">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-lg p-3 border border-white/20 hover:border-blue-500/50 hover:bg-slate-800 transition-all text-center max-w-[120px]">
                      <Upload className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-white mb-0.5">Upload CSV</p>
                      <p className="text-[10px] text-slate-400 leading-tight">Parse your bank statement</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Explainer text */}
            <div className="space-y-4 text-base text-slate-300 leading-relaxed">
              <p>
                Connect your gig platforms and we&apos;ll automatically track <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent font-semibold">all your income in one place</span>. No more logging into five different apps to see what you made this month. We pull everything together—Uber, DoorDash, Upwork, Fiverr, Instacart, and 50+ other platforms—into a single unified timeline.
              </p>
              <p>
                We analyze your earning patterns across every platform you work on, calculate your <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-semibold">safe-to-spend amount</span> after taxes and expenses, and give you a <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent font-semibold">stability score</span> based on consistency and diversification. Think of it as a financial health check designed specifically for gig workers.
              </p>
              <p>
                Here&apos;s the data: <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">top earners work 3+ platforms simultaneously</span> to maximize income and improve their stability scores. Multi-platform workers earn 40% more on average and have significantly better income stability during slow periods. We&apos;ll show you personalized tips to boost your earnings based on your city, work schedule, and income mix.
              </p>
            </div>

            {/* No Bank Connected CTA */}
            {plaidItems.length === 0 && !parsedIncome && (
              <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-lg p-12 border border-white/10 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Wallet className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4 font-space-grotesk">
                    Connect your bank to get started
                  </h2>
                  <p className="text-slate-300 mb-8 text-lg">
                    Securely link your bank account with Plaid to automatically track all your income across platforms.
                    We'll analyze your earnings, calculate your stability score, and help you maximize your income.
                  </p>
                  <PlaidLink
                    userId={user.id}
                    onSuccess={() => {
                      window.location.reload();
                    }}
                    variant="card"
                  />
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-white/10 mt-8"></div>

            {/* Parsed Results */}
            {parsedIncome && (
              <>
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-lg p-5 border border-green-500/20">
                    <div className="text-xs text-green-400 mb-1 font-semibold">Total Income Detected</div>
                    <div className="text-3xl font-black text-white font-space-grotesk">
                      ${parsedIncome.parsed.totalIncome.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{parsedIncome.parsed.income.length} payments</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-lg p-5 border border-blue-500/20">
                    <div className="text-xs text-blue-400 mb-1 font-semibold">Platforms Found</div>
                    <div className="text-3xl font-black text-white font-space-grotesk">
                      {parsedIncome.parsed.byPlatform.size}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {Array.from(parsedIncome.parsed.byPlatform.keys()).slice(0, 3).join(', ')}
                      {parsedIncome.parsed.byPlatform.size > 3 && '...'}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-lg p-5 border border-purple-500/20">
                    <div className="text-xs text-purple-400 mb-1 font-semibold">Stability Score</div>
                    <div className="text-3xl font-black text-white font-space-grotesk">
                      {parsedIncome.stability.score}/100
                    </div>
                    <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">{parsedIncome.stability.rating}</div>
                  </div>
                </div>

                {/* Income Chart with View Toggles */}
                <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white font-space-grotesk">Income Trends</h2>
                      <p className="text-xs text-slate-400">Your earnings across platforms over time</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* View toggles */}
                      <button
                        onClick={() => setIncomeChartView('bar')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          incomeChartView === 'bar'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                        }`}
                      >
                        Stacked Bar
                      </button>
                      <button
                        onClick={() => setIncomeChartView('pie')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          incomeChartView === 'pie'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                        }`}
                      >
                        Pie
                      </button>
                      {/* Time period toggles (only for bar chart) */}
                      {incomeChartView === 'bar' && (
                        <>
                          <div className="w-px h-6 bg-white/10 mx-1"></div>
                          {(['weekly', 'biweekly', 'monthly'] as const).map((period) => (
                            <button
                              key={period}
                              onClick={() => setIncomeTimePeriod(period)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                                incomeTimePeriod === period
                                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                  : 'text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                              }`}
                            >
                              {period}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {(() => {
                    // Prepare chart data based on parsed income
                    const platforms = Array.from(parsedIncome.parsed.byPlatform.entries()) as [string, any][];

                    // Empty state check
                    if (!platforms.length || parsedIncome.parsed.income.length === 0) {
                      return (
                        <div className="h-80 flex items-center justify-center bg-slate-900/30 rounded-lg border border-white/5">
                          <div className="text-center px-8">
                            <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-sm text-slate-400 font-medium mb-1">No income data yet</p>
                            <p className="text-xs text-slate-500">Upload a bank statement to see your earnings visualized</p>
                          </div>
                        </div>
                      );
                    }

                    // Color mapping for platforms
                    const platformColors: Record<string, string> = {
                      'Uber': '#3b82f6',
                      'Lyft': '#ec4899',
                      'DoorDash': '#ef4444',
                      'Instacart': '#10b981',
                      'Grubhub': '#f59e0b',
                      'UberEats': '#06b6d4',
                      'Upwork': '#14b8a6',
                      'Fiverr': '#22c55e',
                      'Freelancer': '#8b5cf6',
                      'Other': '#64748b',
                    };

                    if (incomeChartView === 'pie') {
                      // Pie chart data
                      const pieData = platforms.map(([platform, data]: [string, any]) => ({
                        name: platform,
                        value: data.total,
                        fill: platformColors[platform] || platformColors['Other'],
                      }));

                      return (
                        <div className="h-80">
                          <ChartContainer
                            config={Object.fromEntries(
                              platforms.map(([platform]) => [
                                platform,
                                { label: platform, color: platformColors[platform] || platformColors['Other'] }
                              ])
                            )}
                            className="h-full w-full"
                          >
                            <PieChart>
                              <ChartTooltip
                                content={<ChartTooltipContent />}
                              />
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <ChartLegend content={<ChartLegendContent />} />
                            </PieChart>
                          </ChartContainer>
                        </div>
                      );
                    }

                    // Stacked bar chart data - group by time period
                    const groupedData: Record<string, any> = {};

                    parsedIncome.parsed.income.forEach((item: any) => {
                      const date = new Date(item.date);
                      let key: string;

                      if (incomeTimePeriod === 'weekly') {
                        const weekStart = new Date(date);
                        weekStart.setDate(date.getDate() - date.getDay());
                        key = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      } else if (incomeTimePeriod === 'biweekly') {
                        const weekOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
                        const biweekNum = Math.floor(weekOfYear / 2);
                        key = `BW ${biweekNum}`;
                      } else {
                        key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                      }

                      if (!groupedData[key]) {
                        groupedData[key] = { period: key };
                      }

                      const platform = item.platform || 'Other';
                      groupedData[key][platform] = (groupedData[key][platform] || 0) + item.amount;
                    });

                    const barData = Object.values(groupedData);

                    return (
                      <div className="h-80">
                        <ChartContainer
                          config={Object.fromEntries(
                            platforms.map(([platform]) => [
                              platform,
                              { label: platform, color: platformColors[platform] || platformColors['Other'] }
                            ])
                          )}
                          className="h-full w-full"
                        >
                          <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis
                              dataKey="period"
                              stroke="#64748b"
                              style={{ fontSize: '12px' }}
                            />
                            <YAxis
                              stroke="#64748b"
                              style={{ fontSize: '12px' }}
                              tickFormatter={(value) => `$${value}`}
                            />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            {platforms.map(([platform]) => (
                              <Bar
                                key={platform}
                                dataKey={platform}
                                stackId="a"
                                fill={platformColors[platform] || platformColors['Other']}
                              />
                            ))}
                          </BarChart>
                        </ChartContainer>
                      </div>
                    );
                  })()}
                </div>

                {/* Safe-to-Spend Calculator */}
                <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-8 border border-white/10">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white font-space-grotesk">Safe to spend</h2>
                    <p className="text-xs text-slate-400">What you can safely spend after setting aside for taxes and savings</p>
                  </div>

                  {(() => {
                    const totalIncome = parsedIncome.parsed.totalIncome;
                    const taxSetAside = totalIncome * 0.30; // 30% for taxes
                    const emergencyFund = totalIncome * 0.10; // 10% for emergency fund
                    const safeToSpend = totalIncome - taxSetAside - emergencyFund;

                    return (
                      <div className="grid md:grid-cols-2 gap-8">
                        {/* Left: Visual breakdown */}
                        <div>
                          <div className="space-y-4">
                            {/* Total Income */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-white">Total Income</span>
                                <span className="text-lg font-black text-white font-space-grotesk">
                                  ${totalIncome.toLocaleString()}
                                </span>
                              </div>
                              <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: '100%' }}></div>
                              </div>
                            </div>

                            {/* Tax Set-Aside */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Receipt className="w-4 h-4 text-orange-400" />
                                  <span className="text-sm font-semibold text-slate-300">Tax Set-Aside (30%)</span>
                                </div>
                                <span className="text-base font-bold text-orange-400 font-space-grotesk">
                                  -${taxSetAside.toLocaleString()}
                                </span>
                              </div>
                              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full" style={{ width: '30%' }}></div>
                              </div>
                            </div>

                            {/* Emergency Savings */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <PiggyBank className="w-4 h-4 text-blue-400" />
                                  <span className="text-sm font-semibold text-slate-300">Emergency Fund (10%)</span>
                                </div>
                                <span className="text-base font-bold text-blue-400 font-space-grotesk">
                                  -${emergencyFund.toLocaleString()}
                                </span>
                              </div>
                              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '10%' }}></div>
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-white/10 my-4"></div>

                            {/* Safe to Spend */}
                            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs text-green-400 font-semibold mb-1">SAFE TO SPEND</div>
                                  <div className="text-4xl font-black text-white font-space-grotesk">
                                    ${Math.round(safeToSpend).toLocaleString()}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-black text-green-400 font-space-grotesk">60%</div>
                                  <div className="text-xs text-slate-400">of income</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Explanation and tips */}
                        <div className="flex flex-col justify-center space-y-4">
                          <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                              <Zap className="w-4 h-4 text-yellow-400" />
                              <span>Why this matters</span>
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              As a gig worker, you need to manually set aside money for taxes (30%) and build an emergency fund (10%) before spending. This calculator shows your true spending power.
                            </p>
                          </div>

                          <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                              <Target className="w-4 h-4 text-blue-400" />
                              <span>Smart budgeting tip</span>
                            </h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Transfer ${taxSetAside.toLocaleString()} to a separate tax savings account <span className="text-white font-semibold">right now</span>. Set up auto-transfers so you never touch tax money.
                            </p>
                          </div>

                          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
                            <h3 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                              <Heart className="w-4 h-4 text-pink-400" />
                              <span>Good news</span>
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              You're earning <span className="text-white font-semibold">${safeToSpend.toLocaleString()}</span> in real spending power. That's <span className="text-white font-semibold">{Math.round((safeToSpend / totalIncome) * 100)}%</span> take-home after being financially responsible.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Divider */}
                <div className="border-t border-white/10"></div>

                {/* Platform Breakdown */}
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-white font-space-grotesk">Platform Breakdown</h2>
                    <p className="text-xs text-slate-400">Income sources with trend indicators</p>
                  </div>
                  <div className="space-y-3">
                    {Array.from(parsedIncome.parsed.byPlatform.entries())
                      .map((entry) => {
                        const [platform, total] = entry;
                        return {
                          platform,
                          total: typeof total === 'number' ? total : 0,
                          count: 1, // Placeholder - would need historical data
                          category: 'other', // Placeholder - would need to map platform to category
                        };
                      })
                      .sort((a, b) => b.total - a.total)
                      .map(({ platform, total, count, category }, index) => {
                        // Map platforms to brand icons
                        const platformIconMap: Record<string, any> = {
                          'Uber': SiUber,
                          'Lyft': SiLyft,
                          'DoorDash': SiDoordash,
                          'Instacart': SiInstacart,
                          'Grubhub': SiGrubhub,
                          'Uber Eats': SiUbereats,
                          'Upwork': SiUpwork,
                          'Fiverr': SiFiverr,
                          'Freelancer': SiFreelancer,
                          'Toptal': SiToptal,
                          'YouTube': SiYoutube,
                          'Twitch': SiTwitch,
                          'Patreon': SiPatreon,
                          'OnlyFans': SiOnlyfans,
                          'Substack': SiSubstack,
                          'Airbnb': SiAirbnb,
                        };

                        // Fallback category icons
                        const categoryIconMap: Record<string, any> = {
                          'rideshare': DollarSign,
                          'delivery': Receipt,
                          'freelance': Briefcase,
                          'creator': Target,
                          'rental': Globe,
                          'other': DollarSign,
                        };

                        const IconComponent = platformIconMap[platform] || categoryIconMap[category];

                        // Mock trend data (in production, calculate from historical data)
                        const trendPercent = [8, -3, 15, 5, -2][index % 5];
                        const isPositive = trendPercent > 0;
                        const totalIncome = parsedIncome.parsed.totalIncome;
                        const percentOfTotal = ((total / totalIncome) * 100).toFixed(1);

                        return (
                          <div key={platform} className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-4 border border-white/10 hover:border-white/20 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <IconComponent className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-sm font-bold text-white font-space-grotesk">{platform}</h3>
                                  <p className="text-xs text-slate-400">{count} payments • {percentOfTotal}% of total</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                  <ArrowRight className={`w-4 h-4 ${isPositive ? 'rotate-[-45deg]' : 'rotate-[45deg]'}`} />
                                  <span className="text-xs font-semibold">{Math.abs(trendPercent)}%</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-black text-white font-space-grotesk">
                                    ${total.toFixed(0)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-8">
            {/* Hero message */}
            <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space-grotesk">
                Track every deduction
              </h1>
              <p className="text-base md:text-lg text-slate-300">
                Upload your bank statement to discover hidden tax deductions and maximize your savings.
              </p>
            </div>

            {/* Explainer text */}
            <div className="space-y-4 text-base text-slate-300 leading-relaxed">
              <p>
                Every dollar you spend on your gig work is <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-semibold">potentially tax-deductible</span>. Gas for Uber. Hot bags for DoorDash. Camera gear for YouTube. Software subscriptions for Upwork. Phone bills. Internet. Home office space. Most gig workers leave thousands on the table because they don't know what qualifies.
              </p>
              <p>
                We automatically scan your transactions and <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent font-semibold">flag deductible expenses</span> based on your gig type. Rideshare drivers get mileage tracking. Delivery workers see hot bag purchases. Freelancers catch software subscriptions. Creators track equipment costs. Everything is categorized, calculated, and ready for tax time.
              </p>
              <p>
                The <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent font-semibold">average gig worker</span> who tracks expenses properly saves <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-semibold">$2,800 per year</span> in taxes. That's real money back in your pocket. Upload your statement and see what you've been missing.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 mt-8"></div>

            {!parsedIncome ? (
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-12 border border-white/10 text-center">
                <Receipt className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No expenses tracked yet</h3>
                <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                  Upload your bank statement in the Income tab to automatically detect deductible business expenses.
                </p>
                <Link
                  href="/dashboard/income"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Go to Income Tab</span>
                </Link>
              </div>
            ) : (() => {
              // Parse expenses from uploaded transactions
              const expenseResults = parseExpenses(parsedIncome.rawTransactions || []);
              const { expenses, byCategory, totalExpenses, totalDeductions, potentialTaxSavings } = expenseResults;

              const categoryIcons: Record<string, any> = {
                vehicle: '🚗',
                equipment: '📦',
                supplies: '✏️',
                software: '💻',
                phone: '📱',
                'home-office': '🏠',
                other: '💼',
              };

              const categoryColors: Record<string, string> = {
                vehicle: 'blue',
                equipment: 'purple',
                supplies: 'green',
                software: 'pink',
                phone: 'orange',
                'home-office': 'indigo',
                other: 'slate',
              };

              if (expenses.length === 0) {
                return (
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-12 border border-white/10 text-center">
                    <Receipt className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No deductible expenses detected</h3>
                    <p className="text-sm text-slate-400 max-w-md mx-auto">
                      We didn't find any recognizable business expenses in your uploaded transactions. Try uploading a statement that includes gas, maintenance, equipment, or software purchases.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-8">
                  {/* Summary Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-400 font-semibold">TOTAL EXPENSES</span>
                        <Receipt className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-3xl font-black text-white font-space-grotesk">
                        ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{expenses.length} deductible transactions</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 backdrop-blur-sm border border-green-500/20 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-green-400 font-semibold">TAX DEDUCTIONS</span>
                        <Target className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="text-3xl font-black text-white font-space-grotesk">
                        ${totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Qualified business deductions</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-purple-400 font-semibold">TAX SAVINGS</span>
                        <Zap className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="text-3xl font-black text-white font-space-grotesk">
                        ${potentialTaxSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Estimated at 30% tax rate</p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10"></div>

                  {/* Expenses Chart with View Toggle */}
                  <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-8 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-white font-space-grotesk">Expenses Overview</h2>
                        <p className="text-xs text-slate-400">
                          {expenseChartView === 'donut' && 'Monthly breakdown by category'}
                          {expenseChartView === 'bar' && 'Category trends over time'}
                          {expenseChartView === 'line' && 'Cumulative expenses year-to-date'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setExpenseChartView('donut')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            expenseChartView === 'donut'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                          }`}
                        >
                          Donut
                        </button>
                        <button
                          onClick={() => setExpenseChartView('bar')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            expenseChartView === 'bar'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                          }`}
                        >
                          Trend
                        </button>
                        <button
                          onClick={() => setExpenseChartView('line')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            expenseChartView === 'line'
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : 'text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                          }`}
                        >
                          YTD
                        </button>
                      </div>
                    </div>

                    {(() => {
                      const colorMap: Record<string, string> = {
                        'blue': '#3b82f6',
                        'purple': '#a855f7',
                        'green': '#22c55e',
                        'pink': '#ec4899',
                        'orange': '#f97316',
                        'indigo': '#6366f1',
                        'slate': '#64748b',
                      };

                      // Prepare category data
                      const categories = Array.from(byCategory.entries()).map(([category, categoryExpenses]) => {
                        const color = categoryColors[category] || 'slate';
                        return {
                          category,
                          displayName: category.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                          expenses: categoryExpenses,
                          color: colorMap[color] || colorMap['slate'],
                        };
                      });

                      // Empty state check
                      if (!categories.length || expenses.length === 0) {
                        return (
                          <div className="h-80 flex items-center justify-center bg-slate-900/30 rounded-lg border border-white/5">
                            <div className="text-center px-8">
                              <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                              <p className="text-sm text-slate-400 font-medium mb-1">No expense data yet</p>
                              <p className="text-xs text-slate-500">Upload transactions to track deductible business expenses</p>
                            </div>
                          </div>
                        );
                      }

                      if (expenseChartView === 'donut') {
                        // Donut chart - current month snapshot
                        const donutData = categories.map(cat => ({
                          name: cat.displayName,
                          value: cat.expenses.reduce((sum, e) => sum + e.deductibleAmount, 0),
                          fill: cat.color,
                        }));

                        return (
                          <div className="h-80">
                            <ChartContainer
                              config={Object.fromEntries(
                                donutData.map((item) => [item.name, { label: item.name, color: item.fill }])
                              )}
                              className="h-full w-full"
                            >
                              <PieChart>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Pie
                                  data={donutData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  outerRadius={120}
                                  innerRadius={60}
                                  dataKey="value"
                                >
                                  {donutData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                  ))}
                                </Pie>
                                <ChartLegend content={<ChartLegendContent />} />
                              </PieChart>
                            </ChartContainer>
                          </div>
                        );
                      }

                      if (expenseChartView === 'bar') {
                        // Stacked bar - monthly trend
                        // Group expenses by month
                        const monthlyData: Record<string, any> = {};

                        categories.forEach(cat => {
                          cat.expenses.forEach(exp => {
                            const monthKey = exp.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                            if (!monthlyData[monthKey]) {
                              monthlyData[monthKey] = { month: monthKey };
                            }
                            monthlyData[monthKey][cat.displayName] = (monthlyData[monthKey][cat.displayName] || 0) + exp.deductibleAmount;
                          });
                        });

                        const barData = Object.values(monthlyData);

                        return (
                          <div className="h-80">
                            <ChartContainer
                              config={Object.fromEntries(
                                categories.map(cat => [cat.displayName, { label: cat.displayName, color: cat.color }])
                              )}
                              className="h-full w-full"
                            >
                              <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value}`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                {categories.map(cat => (
                                  <Bar key={cat.category} dataKey={cat.displayName} stackId="a" fill={cat.color} />
                                ))}
                              </BarChart>
                            </ChartContainer>
                          </div>
                        );
                      }

                      // Line chart - cumulative YTD
                      // Sort all expenses by date and calculate running totals per category
                      const allExpenses = categories.flatMap(cat =>
                        cat.expenses.map(exp => ({
                          ...exp,
                          category: cat.displayName,
                          color: cat.color,
                        }))
                      ).sort((a, b) => a.date.getTime() - b.date.getTime());

                      const cumulativeData: Record<string, any>[] = [];
                      const runningTotals: Record<string, number> = {};

                      allExpenses.forEach(exp => {
                        runningTotals[exp.category] = (runningTotals[exp.category] || 0) + exp.deductibleAmount;
                        cumulativeData.push({
                          date: exp.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                          ...runningTotals,
                        });
                      });

                      return (
                        <div className="h-80">
                          <ChartContainer
                            config={Object.fromEntries(
                              categories.map(cat => [cat.displayName, { label: cat.displayName, color: cat.color }])
                            )}
                            className="h-full w-full"
                          >
                            <LineChart data={cumulativeData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value}`} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <ChartLegend content={<ChartLegendContent />} />
                              {categories.map(cat => (
                                <Line key={cat.category} type="monotone" dataKey={cat.displayName} stroke={cat.color} strokeWidth={2} />
                              ))}
                            </LineChart>
                          </ChartContainer>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10"></div>

                  {/* Expenses by Category */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-white font-space-grotesk">Expenses by category</h2>
                      <p className="text-xs text-slate-400">Detected deductible business expenses</p>
                    </div>

                    <div className="space-y-6">
                      {Array.from(byCategory.entries()).map(([category, categoryExpenses]) => {
                        const categoryTotal = categoryExpenses.reduce((sum, e) => sum + e.deductibleAmount, 0);
                        const color = categoryColors[category] || 'slate';

                        return (
                          <div key={category} className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-6 border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className="text-3xl">{categoryIcons[category]}</div>
                                <div>
                                  <h3 className="text-lg font-bold text-white font-space-grotesk capitalize">{category.replace('-', ' ')}</h3>
                                  <p className="text-xs text-slate-400">{categoryExpenses.length} transactions</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-2xl font-black bg-gradient-to-r from-${color}-400 to-${color}-600 bg-clip-text text-transparent font-space-grotesk`}>
                                  ${categoryTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <p className="text-xs text-slate-400">deductible</p>
                              </div>
                            </div>

                            {/* Expense Items */}
                            <div className="space-y-2">
                              {categoryExpenses.slice(0, 5).map((expense, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 px-3 bg-slate-800/50 rounded">
                                  <div className="flex-1">
                                    <p className="text-sm text-white font-medium">{expense.description}</p>
                                    <p className="text-xs text-slate-400">{expense.date.toLocaleDateString()} • {expense.subcategory}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-bold text-white">${expense.deductibleAmount.toFixed(2)}</p>
                                    {expense.deductionRate < 100 && (
                                      <p className="text-xs text-slate-400">{expense.deductionRate}% deductible</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {categoryExpenses.length > 5 && (
                                <p className="text-xs text-slate-400 text-center py-2">
                                  + {categoryExpenses.length - 5} more expenses
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">💡</div>
                      <div>
                        <h3 className="text-base font-bold text-white mb-2 font-space-grotesk">Pro tip</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          Keep all receipts for expenses over $75. The IRS may require documentation during an audit. Take photos and store them digitally for easy access.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === 'benefits' && <BenefitsMarketplace />}

        {activeTab === 'taxes' && (
          <div className="space-y-8">
            {/* Hero message */}
            <div className="bg-gradient-to-br from-orange-500/10 via-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space-grotesk">
                Stay ahead of tax season
              </h1>
              <p className="text-base md:text-lg text-slate-300">
                Set aside the right amount each month. Track every deduction. Never get caught off guard.
              </p>
            </div>

            {!parsedIncome ? (
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-12 border border-white/10 text-center">
                <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Upload income to calculate taxes</h3>
                <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                  Upload your bank statement in the Income tab to get accurate quarterly tax estimates and deduction calculations.
                </p>
                <Link
                  href="/dashboard/income"
                  className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Go to Income Tab</span>
                </Link>
              </div>
            ) : (() => {
              // Calculate real taxes from uploaded data
              const expenseResults = parseExpenses(parsedIncome.rawTransactions || []);
              const taxCalc = parsedIncome.parsed.startDate && parsedIncome.parsed.endDate
                ? projectAnnualTax(
                    parsedIncome.parsed.totalIncome,
                    expenseResults.totalDeductions,
                    parsedIncome.parsed.startDate,
                    parsedIncome.parsed.endDate
                  )
                : calculateTaxes(parsedIncome.parsed.totalIncome, expenseResults.totalDeductions);

              const deadlines = getQuarterlyDeadlines(2024, taxCalc.quarterlyPayment);

              return (
                <>
                  {/* Tax Summary Cards */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl rounded-lg p-5 border border-orange-500/20">
                      <div className="text-xs text-orange-400 mb-1 font-semibold">Annual Tax Liability</div>
                      <div className="text-3xl font-black text-white font-space-grotesk">
                        ${Math.round(taxCalc.totalTaxLiability).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{(taxCalc.effectiveTaxRate * 100).toFixed(1)}% effective rate</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl rounded-lg p-5 border border-blue-500/20">
                      <div className="text-xs text-blue-400 mb-1 font-semibold">Quarterly Payment</div>
                      <div className="text-3xl font-black text-white font-space-grotesk">
                        ${Math.round(taxCalc.quarterlyPayment).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Due 4 times per year</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-lg p-5 border border-green-500/20">
                      <div className="text-xs text-green-400 mb-1 font-semibold">Total Deductions</div>
                      <div className="text-3xl font-black text-white font-space-grotesk">
                        ${Math.round(expenseResults.totalDeductions).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">{expenseResults.expenses.length} expenses tracked</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-lg p-5 border border-purple-500/20">
                      <div className="text-xs text-purple-400 mb-1 font-semibold">Tax Savings</div>
                      <div className="text-3xl font-black text-white font-space-grotesk">
                        ${Math.round(expenseResults.potentialTaxSavings).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">From deductions</div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10"></div>

                  {/* Tax Breakdown */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-white font-space-grotesk">Tax breakdown</h2>
                      <p className="text-xs text-slate-400">How your ${Math.round(taxCalc.totalTaxLiability).toLocaleString()} tax bill is calculated</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left: Visual breakdown */}
                      <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-6 border border-white/10">
                        <h3 className="text-sm font-bold text-white mb-4">Tax Components</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-300">Federal Income Tax</span>
                              <span className="text-sm font-bold text-white">
                                ${Math.round(taxCalc.breakdown.federalIncome).toLocaleString()}
                              </span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                style={{ width: `${(taxCalc.breakdown.federalIncome / taxCalc.totalTaxLiability) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-300">Social Security (12.4%)</span>
                              <span className="text-sm font-bold text-white">
                                ${Math.round(taxCalc.breakdown.socialSecurity).toLocaleString()}
                              </span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                                style={{ width: `${(taxCalc.breakdown.socialSecurity / taxCalc.totalTaxLiability) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-300">Medicare (2.9%)</span>
                              <span className="text-sm font-bold text-white">
                                ${Math.round(taxCalc.breakdown.medicare).toLocaleString()}
                              </span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full"
                                style={{ width: `${(taxCalc.breakdown.medicare / taxCalc.totalTaxLiability) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-300">State Tax (CA)</span>
                              <span className="text-sm font-bold text-white">
                                ${Math.round(taxCalc.breakdown.state).toLocaleString()}
                              </span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                                style={{ width: `${(taxCalc.breakdown.state / taxCalc.totalTaxLiability) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">Total Tax</span>
                            <span className="text-lg font-black text-white font-space-grotesk">
                              ${Math.round(taxCalc.totalTaxLiability).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Income calculation */}
                      <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-6 border border-white/10">
                        <h3 className="text-sm font-bold text-white mb-4">Income Calculation</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-300">Gross Income</span>
                            <span className="text-sm font-bold text-white">
                              ${Math.round(taxCalc.grossIncome).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-red-400">
                            <span className="text-sm">Business Deductions</span>
                            <span className="text-sm font-bold">
                              -${Math.round(expenseResults.totalDeductions).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-red-400">
                            <span className="text-sm">Standard Deduction</span>
                            <span className="text-sm font-bold">-$14,600</span>
                          </div>
                          <div className="flex items-center justify-between text-red-400">
                            <span className="text-sm">SE Tax Deduction (50%)</span>
                            <span className="text-sm font-bold">
                              -${Math.round(taxCalc.selfEmploymentTax * 0.5).toLocaleString()}
                            </span>
                          </div>
                          <div className="border-t border-white/10 pt-3 mt-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-white">Taxable Income</span>
                              <span className="text-sm font-bold text-green-400">
                                ${Math.round(taxCalc.adjustedGrossIncome - 14600).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
                          <h4 className="text-xs font-semibold text-blue-400 mb-2">💡 Pro Tip</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            As a self-employed person, you can deduct 50% of your self-employment tax from your adjusted gross income. This saves you ${Math.round(taxCalc.selfEmploymentTax * 0.5 * 0.22).toLocaleString()} in federal income tax.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10"></div>

                  {/* Tax Visualization */}
                  <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-8 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-white font-space-grotesk">Tax Overview</h2>
                        <p className="text-xs text-slate-400">Quarterly payments and tax liability breakdown</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTaxChartView('quarterly')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            taxChartView === 'quarterly'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                          }`}
                        >
                          Quarterly
                        </button>
                        <button
                          onClick={() => setTaxChartView('liability')}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            taxChartView === 'liability'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                          }`}
                        >
                          Liability
                        </button>
                      </div>
                    </div>

                    {taxChartView === 'liability' ? (
                      (() => {
                        // Pie chart for tax liability breakdown
                        const liabilityData = [
                          { name: 'Federal Income', value: taxCalc.breakdown.federalIncome, fill: '#3b82f6' },
                          { name: 'Social Security', value: taxCalc.breakdown.socialSecurity, fill: '#a855f7' },
                          { name: 'Medicare', value: taxCalc.breakdown.medicare, fill: '#ec4899' },
                          { name: 'State Tax', value: taxCalc.breakdown.state, fill: '#f97316' },
                        ];

                        return (
                          <div className="h-80">
                            <ChartContainer
                              config={{
                                'Federal Income': { label: 'Federal Income Tax', color: '#3b82f6' },
                                'Social Security': { label: 'Social Security', color: '#a855f7' },
                                'Medicare': { label: 'Medicare', color: '#ec4899' },
                                'State Tax': { label: 'State Tax', color: '#f97316' },
                              }}
                              className="h-full w-full"
                            >
                              <PieChart>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Pie
                                  data={liabilityData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  outerRadius={120}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {liabilityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                  ))}
                                </Pie>
                                <ChartLegend content={<ChartLegendContent />} />
                              </PieChart>
                            </ChartContainer>
                          </div>
                        );
                      })()
                    ) : (
                      (() => {
                        // Quarterly bar chart (default)
                        const quarterlyData = deadlines.map((deadline) => ({
                          quarter: deadline.quarter,
                          owed: deadline.amount,
                          setAside: deadline.amount * 0.68, // Mock 68% set aside
                        }));

                        return (
                          <div className="h-80">
                            <ChartContainer
                              config={{
                                owed: { label: 'Owed', color: '#ef4444' },
                                setAside: { label: 'Set Aside', color: '#22c55e' },
                              }}
                              className="h-full w-full"
                            >
                              <BarChart data={quarterlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis
                                  dataKey="quarter"
                                  stroke="#64748b"
                                  style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                  stroke="#64748b"
                                  style={{ fontSize: '12px' }}
                                  tickFormatter={(value) => `$${value}`}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="setAside" fill="#22c55e" />
                                <Bar dataKey="owed" fill="#ef4444" />
                              </BarChart>
                            </ChartContainer>
                          </div>
                        );
                      })()
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10"></div>

                  {/* Quarterly Payment Cards */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-white font-space-grotesk">Quarterly payment schedule</h2>
                      <p className="text-xs text-slate-400">Pay ${Math.round(taxCalc.quarterlyPayment).toLocaleString()} four times per year to avoid penalties</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {deadlines.map((deadline, idx) => {
                        const colors = [
                          { blur: 'from-orange-500 to-red-600', bg: 'from-orange-600/20 to-red-700/20', border: 'border-orange-400/30', text: 'text-orange-300' },
                          { blur: 'from-blue-500 to-blue-600', bg: 'from-blue-600/20 to-blue-700/20', border: 'border-blue-400/30', text: 'text-blue-300' },
                          { blur: 'from-purple-500 to-purple-600', bg: 'from-purple-600/20 to-purple-700/20', border: 'border-purple-400/30', text: 'text-purple-300' },
                          { blur: 'from-pink-500 to-pink-600', bg: 'from-pink-600/20 to-pink-700/20', border: 'border-pink-400/30', text: 'text-pink-300' },
                        ][idx];

                        return (
                          <div key={deadline.quarter} className="group relative">
                            <div className={`absolute inset-0 bg-gradient-to-br ${colors.blur} rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                            <div className={`relative bg-gradient-to-br ${colors.bg} backdrop-blur-xl rounded-lg p-6 border ${colors.border} transform group-hover:-translate-y-1 transition-transform`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className={`text-xs ${colors.text} font-semibold uppercase tracking-wider`}>{deadline.quarter} 2024</div>
                                {deadline.isPast ? (
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                ) : (
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                )}
                              </div>
                              <div className="text-2xl font-black text-white mb-1 font-space-grotesk">
                                ${Math.round(deadline.amount).toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-400 mb-3">{deadline.period}</div>
                              <div className={`text-xs ${colors.text} font-semibold mb-4`}>
                                Due: {deadline.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              {deadline.isPast ? (
                                <button className="w-full bg-white/10 backdrop-blur-sm text-white py-2 px-3 rounded-lg text-xs font-bold border border-white/20 hover:bg-white/20 transition-colors">
                                  Overdue - Pay Now
                                </button>
                              ) : (
                                <button className="w-full bg-white/10 backdrop-blur-sm text-white py-2 px-3 rounded-lg text-xs font-bold border border-white/20 hover:bg-white/20 transition-colors">
                                  Set Reminder
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10"></div>

                  {/* Deduction Summary */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-white font-space-grotesk">Your deductions</h2>
                      <p className="text-xs text-slate-400">Track every dollar you can write off</p>
                    </div>

                    {expenseResults.expenses.length === 0 ? (
                      <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-8 border border-white/10 text-center">
                        <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-white mb-2">No deductions tracked yet</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                          Upload transactions with business expenses to see potential tax deductions
                        </p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from(expenseResults.byCategory.entries()).map(([category, expenses]) => {
                          const categoryIcons: Record<string, string> = {
                            vehicle: '🚗',
                            equipment: '📦',
                            supplies: '✏️',
                            software: '💻',
                            phone: '📱',
                            'home-office': '🏠',
                            other: '💼',
                          };

                          const totalAmount = expenses.reduce((sum, e) => sum + e.deductibleAmount, 0);

                          return (
                            <div key={category} className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                              <div className="flex items-start justify-between mb-3">
                                <div className="text-2xl">{categoryIcons[category]}</div>
                                <div className="text-xs text-slate-400">{expenses.length} items</div>
                              </div>
                              <h3 className="text-sm font-bold text-white mb-1 capitalize">{category.replace('-', ' ')}</h3>
                              <div className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent font-space-grotesk">
                                ${Math.round(totalAmount).toLocaleString()}
                              </div>
                              <p className="text-xs text-slate-400 mt-2">Deductible amount</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10"></div>

                  {/* Quarterly Tax Calculator */}
                  {(() => {
                    const QuarterlyTaxCalculator = require('./QuarterlyTaxCalculator').default;
                    return (
                      <div>
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-white font-space-grotesk">
                            Quarterly Tax Calculator
                          </h2>
                          <p className="text-slate-400 text-sm mt-1">
                            Calculate and track your quarterly estimated tax payments
                          </p>
                        </div>
                        <QuarterlyTaxCalculator
                          yearToDateIncome={parsedIncome.parsed.totalIncome}
                          yearToDateExpenses={expenseResults.totalDeductions}
                        />
                      </div>
                    );
                  })()}

                  {/* End of tax calculations */}
                </>
              );
            })()}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2 font-space-grotesk">Platform Insights</h1>
              <p className="text-slate-400">
                Compare platform performance and get personalized recommendations to maximize earnings
              </p>
            </div>

            {(() => {
              const PlatformInsights = require('./PlatformInsights').default;
              // Transform transactions to include platform info
              const transactionsWithPlatform = parsedIncome?.rawTransactions?.map((tx: any) => ({
                ...tx,
                platform: tx.platform || 'Other',
              })) || [];

              return <PlatformInsights transactions={transactionsWithPlatform} />;
            })()}
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="space-y-8">
            {/* Dynamic import for ReferralDashboard */}
            {(() => {
              const ReferralDashboard = require('./ReferralDashboard').default;
              return <ReferralDashboard />;
            })()}
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="space-y-8">
            {/* Hero message */}
            <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space-grotesk">
                    Learn & grow your gig business
                  </h1>
                  <p className="text-base md:text-lg text-slate-300">
                    City-specific guides, tax tips, and strategies from top earners. Everything you need to level up.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* City Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 hover:border-purple-500/50 transition-all text-sm">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">
                          {selectedCities.length === 0 ? 'All Cities' : selectedCities.length === 1 ? selectedCities[0] : `${selectedCities.length} cities`}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-slate-900 border-white/10">
                      <DropdownMenuLabel className="text-slate-400">Select Cities</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      {(['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Austin'] as City[]).map((city) => (
                        <DropdownMenuCheckboxItem
                          key={city}
                          checked={selectedCities.includes(city)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCities([...selectedCities, city]);
                            } else {
                              setSelectedCities(selectedCities.filter(c => c !== city));
                            }
                          }}
                          className="text-slate-300 focus:bg-slate-800 focus:text-white"
                        >
                          {city}
                        </DropdownMenuCheckboxItem>
                      ))}
                      {selectedCities.length > 0 && (
                        <>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <button
                            onClick={() => setSelectedCities([])}
                            className="w-full px-2 py-1.5 text-xs text-slate-400 hover:text-white transition-colors text-center"
                          >
                            Clear all
                          </button>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Gig Type Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-white/10 hover:border-purple-500/50 transition-all text-sm">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">
                          {selectedGigTypes.length === 0 ? 'All Gigs' : selectedGigTypes.length === 1 ? selectedGigTypes[0] : `${selectedGigTypes.length} types`}
                        </span>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-slate-900 border-white/10">
                      <DropdownMenuLabel className="text-slate-400">Select Gig Types</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10" />
                      {(['rideshare', 'delivery', 'freelance', 'creator', 'rental'] as const).map((gigType) => (
                        <DropdownMenuCheckboxItem
                          key={gigType}
                          checked={selectedGigTypes.includes(gigType)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedGigTypes([...selectedGigTypes, gigType]);
                            } else {
                              setSelectedGigTypes(selectedGigTypes.filter(t => t !== gigType));
                            }
                          }}
                          className="text-slate-300 focus:bg-slate-800 focus:text-white"
                        >
                          {gigType.charAt(0).toUpperCase() + gigType.slice(1)}
                        </DropdownMenuCheckboxItem>
                      ))}
                      {selectedGigTypes.length > 0 && (
                        <>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <button
                            onClick={() => setSelectedGigTypes([])}
                            className="w-full px-2 py-1.5 text-xs text-slate-400 hover:text-white transition-colors text-center"
                          >
                            Clear all
                          </button>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Explainer text */}
            <div className="space-y-4 text-base text-slate-300 leading-relaxed">
              <p>
                Every gig platform has its own tricks, strategies, and hidden features. <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent font-semibold">Uber surge patterns in New York City</span> are completely different from Chicago. The best zones for DoorDash in San Francisco won&apos;t work in Austin. How you price yourself on Upwork depends on your reviews, your competition, and your positioning.
              </p>
              <p>
                We&apos;ve built a <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent font-semibold">knowledge base designed specifically for gig workers</span>. Every article is 3-4 minutes long, focused on actionable strategies, and personalized to your gig type and city. Filter by rideshare, delivery, freelance, or creator work. Get <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-semibold">city-specific tips</span> that actually matter in your market.
              </p>
              <p>
                Learn how to maximize surge pricing. How to stack orders across multiple apps without getting deactivated. How to raise your rates on Upwork without losing clients. How to track mileage for maximum tax deductions. These aren&apos;t generic blog posts—they&apos;re <span className="bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent font-semibold">practical playbooks</span> from top earners in your exact situation.
              </p>
              <p>
                The difference between struggling and thriving in the gig economy often comes down to knowing what the top 10% know. Now you do too.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 mt-8"></div>

            {/* Filtered Guides */}
            {(() => {
              const guides = getGuides(selectedCities, selectedGigTypes);

              const colorClasses = {
                blue: { border: 'hover:border-blue-500/50', bg: 'bg-blue-500/20', text: 'text-blue-400', hover: 'group-hover:text-blue-400' },
                green: { border: 'hover:border-green-500/50', bg: 'bg-green-500/20', text: 'text-green-400', hover: 'group-hover:text-green-400' },
                purple: { border: 'hover:border-purple-500/50', bg: 'bg-purple-500/20', text: 'text-purple-400', hover: 'group-hover:text-purple-400' },
                orange: { border: 'hover:border-orange-500/50', bg: 'bg-orange-500/20', text: 'text-orange-400', hover: 'group-hover:text-orange-400' },
                red: { border: 'hover:border-red-500/50', bg: 'bg-red-500/20', text: 'text-red-400', hover: 'group-hover:text-red-400' },
                yellow: { border: 'hover:border-yellow-500/50', bg: 'bg-yellow-500/20', text: 'text-yellow-400', hover: 'group-hover:text-yellow-400' },
              };

              return (
                <div>
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-white font-space-grotesk">
                      {selectedCities.length > 0 || selectedGigTypes.length > 0 ? 'Filtered Guides' : 'All Guides'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {guides.length} guide{guides.length !== 1 ? 's' : ''} found
                      {selectedCities.length > 0 && ` in ${selectedCities.join(', ')}`}
                      {selectedGigTypes.length > 0 && ` for ${selectedGigTypes.join(', ')}`}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {guides.map((guide) => {
                      const colors = colorClasses[guide.color as keyof typeof colorClasses];
                      return (
                        <div key={guide.id} className={`bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 ${colors.border} transition-all cursor-pointer group`}>
                          <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center mb-3`}>
                            <BookOpen className={`w-4 h-4 ${colors.text}`} />
                          </div>
                          {guide.cities.length > 0 && !guide.cities.includes('all') && (
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`text-xs ${colors.bg} ${colors.text} px-2 py-0.5 rounded font-semibold`}>
                                {guide.cities.join(', ')}
                              </span>
                            </div>
                          )}
                          <h3 className={`text-sm font-bold text-white mb-2 font-space-grotesk ${colors.hover} transition-colors`}>{guide.title}</h3>
                          <p className="text-xs text-slate-400 mb-3">{guide.description}</p>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${colors.text}`}>{guide.readTime}</span>
                            <ArrowRight className={`w-3 h-3 text-slate-400 ${colors.hover} transition-colors`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
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