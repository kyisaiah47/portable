'use client';

import { useState, useEffect, useMemo } from 'react';
import WelcomeWizard from '@/components/WelcomeWizard';
import MileageTracker from '@/components/MileageTracker';
import HomeOverview from '@/components/home/HomeOverview';
import ExpensesView from '@/components/expenses/ExpensesView';
import { buildAccountantCsv, downloadAccountantCsv } from '@/lib/accountant-export';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Upload,
  Download,
  Calculator,
  Receipt,
  FileText,
  BarChart3,
  BookOpen,
  Globe,
  Briefcase,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  User,
  Lock,
  Trash2,
  Save,
  Loader2,
  Bell,
  DollarSign,
  Target,
} from 'lucide-react';
import {
  SiUber,
  SiLyft,
  SiDoordash,
  SiInstacart,
  SiGrubhub,
  SiUbereats,
  SiUpwork,
  SiFiverr,
  SiFreelancer,
  SiToptal,
  SiYoutube,
  SiTwitch,
  SiPatreon,
  SiOnlyfans,
  SiSubstack,
  SiAirbnb,
} from 'react-icons/si';
import { calculateStabilityScore, type Transaction } from '@/lib/income-parser';
import { classifyTransactions, buildIncomeResults, buildExpensesFromTransactions } from '@/lib/hybrid-classifier';
import { calculateTaxes, getQuarterlyDeadlines, projectAnnualTax } from '@/lib/tax-calculator';
import AITaxSummary from './AITaxSummary';
import DeductionCheckDialog from './DeductionCheckDialog';
import AppShell from './AppShell';
import { getTips, getGuides, type City, type GigType } from '@/lib/content-registry';
import { useParsedIncome, useTransactions, clearAllCaches } from '@/hooks/useSupabaseData';
import { supabase } from '@/lib/supabase';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

/* ------------------------------------------------------------------ */
/* Quiet visual vocabulary shared by every tab                         */
/* ------------------------------------------------------------------ */

const CHART_GRID = '#eceef1';
const CHART_AXIS = '#9ca3af';

// Muted categorical palette — no neon.
const PLATFORM_COLORS: Record<string, string> = {
  Uber: '#5b5bd6',
  Lyft: '#c98a98',
  DoorDash: '#cf6f6f',
  Instacart: '#6fa287',
  Grubhub: '#c9a36a',
  UberEats: '#7da7c9',
  'Uber Eats': '#7da7c9',
  Upwork: '#6f9e94',
  Fiverr: '#86a06f',
  Freelancer: '#9b8ed4',
  YouTube: '#b07c7c',
  Twitch: '#8d7cb0',
  Airbnb: '#c4848f',
  Other: '#9aa1ad',
};

const EXPENSE_CATEGORY_COLORS: Record<string, string> = {
  vehicle: '#5b5bd6',
  equipment: '#9b8ed4',
  supplies: '#6fa287',
  software: '#7da7c9',
  phone: '#c9a36a',
  'home-office': '#6f9e94',
  other: '#9aa1ad',
};

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Uber: SiUber,
  Lyft: SiLyft,
  DoorDash: SiDoordash,
  Instacart: SiInstacart,
  Grubhub: SiGrubhub,
  'Uber Eats': SiUbereats,
  UberEats: SiUbereats,
  Upwork: SiUpwork,
  Fiverr: SiFiverr,
  Freelancer: SiFreelancer,
  Toptal: SiToptal,
  YouTube: SiYoutube,
  Twitch: SiTwitch,
  Patreon: SiPatreon,
  OnlyFans: SiOnlyfans,
  Substack: SiSubstack,
  Airbnb: SiAirbnb,
};

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;
const money2 = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1.5">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

function StatGrid({ stats }: { stats: { label: string; value: React.ReactNode; sub?: React.ReactNode }[] }) {
  return (
    <div
      className={`grid sm:grid-cols-2 ${
        stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
      } gap-px bg-slate-700 border border-white/10 rounded-lg overflow-hidden`}
    >
      {stats.map((s) => (
        <div key={s.label} className="bg-slate-900 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1.5">
            {s.label}
          </p>
          <p className="text-2xl font-semibold tracking-tight text-white">{s.value}</p>
          {s.sub && <p className="text-xs text-slate-400 mt-1">{s.sub}</p>}
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 mb-3">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex items-center bg-slate-800 rounded-md p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            value === opt.value
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ChartEmptyState({ icon: Icon, title, hint }: { icon: typeof BarChart3; title: string; hint: string }) {
  return (
    <div className="h-72 flex items-center justify-center rounded-md border border-dashed border-white/10 bg-slate-950/50">
      <div className="text-center px-8">
        <Icon className="w-8 h-8 text-slate-600 mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-sm font-medium text-slate-300 mb-0.5">{title}</p>
        <p className="text-xs text-slate-500">{hint}</p>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: typeof Receipt;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-white/20 bg-slate-950/50 px-8 py-16 text-center">
      <Icon className="w-9 h-9 text-slate-600 mx-auto mb-4" strokeWidth={1.5} />
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">{body}</p>
      {action}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-3 w-24 bg-slate-700 rounded mb-3" />
        <div className="h-9 w-56 bg-slate-700 rounded" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-700 border border-white/10 rounded-lg overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-900 p-4">
            <div className="h-3 w-20 bg-slate-700 rounded mb-3" />
            <div className="h-7 w-28 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-white/10">
        <div className="h-10 border-b border-white/5 bg-slate-950/60 rounded-t-lg" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0">
            <div className="h-3.5 w-48 bg-slate-700 rounded" />
            <div className="h-3.5 w-16 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
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
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);

  // Settings state
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName || '');
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [taxReminders, setTaxReminders] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [notificationsMessage, setNotificationsMessage] = useState('');
  const [settingsError, setSettingsError] = useState('');

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
        classification: tx.classification ?? null,
      })),
    };
  }, [supabaseParsedIncome, transactions]);

  // Loading state
  const isLoading = incomeLoading || transactionsLoading;

  // First-run wizard: opens once data has resolved and there's nothing yet.
  // Dismissal persists in localStorage so tab/route changes don't resurface it.
  const [showWizard, setShowWizard] = useState(false);
  useEffect(() => {
    const seen =
      typeof window !== 'undefined' &&
      localStorage.getItem('stub-wizard-seen') === '1';
    if (!isLoading && !parsedIncome && !seen) setShowWizard(true);
  }, [isLoading, parsedIncome]);
  const dismissWizard = () => {
    localStorage.setItem('stub-wizard-seen', '1');
    setShowWizard(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('auth_user');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Settings handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage('');
    setSettingsError('');

    try {
      const { error } = await supabase
        .from('stub_users')
        .update({
          first_name: firstName,
          last_name: lastName,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfileMessage('Profile updated successfully');
      setTimeout(() => setProfileMessage(''), 3000);
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage('');
    setSettingsError('');

    if (newPassword !== confirmPassword) {
      setSettingsError('Passwords do not match');
      setSavingPassword(false);
      return;
    }

    if (newPassword.length < 8) {
      setSettingsError('Password must be at least 8 characters');
      setSavingPassword(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordMessage('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleUpdateNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingNotifications(true);
    setNotificationsMessage('');
    setSettingsError('');

    try {
      const { error } = await supabase
        .from('stub_users')
        .update({
          email_preferences: {
            weeklyReports,
            taxReminders,
          },
        })
        .eq('id', user.id);

      if (error) throw error;

      setNotificationsMessage('Notification preferences updated');
      setTimeout(() => setNotificationsMessage(''), 3000);
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : 'Failed to update preferences');
    } finally {
      setSavingNotifications(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setDeleting(true);
    setSettingsError('');

    try {
      // Delete user data
      await supabase.from('stub_transactions').delete().eq('user_id', user.id);
      await supabase.from('stub_parsed_income').delete().eq('user_id', user.id);
      await supabase.from('stub_plaid_items').delete().eq('user_id', user.id);
      await supabase.from('stub_users').delete().eq('id', user.id);

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      if (authError) throw authError;

      onLogout();
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : 'Failed to delete account');
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (user && activeTab === 'settings') {
      // Load notification preferences
      const loadPreferences = async () => {
        const { data } = await supabase
          .from('stub_users')
          .select('email_preferences')
          .eq('id', user.id)
          .single();

        if (data?.email_preferences) {
          setWeeklyReports(data.email_preferences.weeklyReports ?? true);
          setTaxReminders(data.email_preferences.taxReminders ?? true);
        }
      };
      loadPreferences();
    }
  }, [user, activeTab]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Starting CSV upload:', file.name);
    toast.info('Uploading CSV...', { duration: 2000 });

    const reader = new FileReader();
    reader.onerror = (error) => {
      console.error('File reader error:', error);
      toast.error('Failed to read file');
    };

    reader.onload = async (e) => {
      try {
        console.log('File loaded, parsing...');
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
              id: `csv-${user.id}-${i}`,
              date: new Date(date),
              description,
              amount: parseFloat(amount),
              type: type.trim() as 'credit' | 'debit',
            });
          }
        }

        console.log(`Parsed ${transactions.length} transactions`);

        // Hybrid classification: regex handles the obvious hits for free,
        // Claude classifies the remainder/low-confidence transactions.
        toast.info('Classifying transactions with AI...', { duration: 3000 });
        const { classifications, aiUsed, aiError } = await classifyTransactions(transactions);
        if (aiError) {
          console.warn('AI classification unavailable:', aiError);
          toast.warning('AI classification unavailable — using pattern matching only.');
        } else if (aiUsed) {
          console.log('AI classified the transactions regex could not match');
        }

        const parsed = buildIncomeResults(transactions, classifications);
        const stability = calculateStabilityScore(parsed.income);

        console.log('Saving to database...');

        // Save transactions to database
        const transactionsToInsert = transactions.map((tx) => ({
          user_id: user.id,
          plaid_transaction_id: tx.id, // Use this field instead of id
          account_id: 'csv-upload',
          date: tx.date.toISOString().split('T')[0], // Format as date only
          name: tx.description,
          amount: tx.amount, // CSV already has correct sign: positive for credits, negative for debits
          category: null,
          pending: false,
          classification: classifications.get(tx.id) || null,
        }));

        const { error: txError } = await supabase
          .from('stub_transactions')
          .upsert(transactionsToInsert, { onConflict: 'plaid_transaction_id' });

        if (txError) {
          console.error('Error saving transactions:', txError);
          toast.error('Error uploading transactions: ' + txError.message);
          return;
        }

        console.log('Transactions saved');

        // Save parsed income to database
        const byPlatformData = Object.fromEntries(
          Array.from(parsed.byPlatform.entries()).map(([platform, payments]) => {
            const items = payments as any[];
            return [
              platform,
              {
                total: items.reduce((sum, p) => sum + p.amount, 0),
                count: items.length,
                items: items.map(item => ({
                  date: item.date.toISOString(),
                  amount: item.amount,
                  description: item.description,
                })),
              },
            ];
          })
        );

        const weeklyAverage = parsed.totalIncome / 4;
        const variability = Math.round((1 - stability.score / 100) * 100);

        const stabilityData = {
          score: stability.score,
          rating: stability.rating,
          weeklyAverage: weeklyAverage,
          variability: variability,
        };

        const { error: incomeError } = await supabase
          .from('stub_parsed_income')
          .upsert({
            user_id: user.id,
            total_income: parsed.totalIncome,
            start_date: parsed.startDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            end_date: parsed.endDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            by_platform: byPlatformData,
            stability: stabilityData,
          }, { onConflict: 'user_id' });

        if (incomeError) {
          console.error('Error saving parsed income:', incomeError);
          toast.error('Error uploading income data: ' + incomeError.message);
          return;
        }

        console.log('Income data saved');

        // Clear all caches so data will be refetched
        clearAllCaches(user.id);

        // Show success message
        toast.success('CSV uploaded successfully! Reloading...', { duration: 2000 });

        console.log('Reloading page now...');

        // Immediate reload
        window.location.reload();
      } catch (error) {
        console.error('Error uploading CSV:', error);
        toast.error('Error uploading CSV: ' + (error as Error).message);
      } finally {
        // Reset the input so the same file can be uploaded again
        event.target.value = '';
      }
    };

    reader.readAsText(file);
  };

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

  const uploadActions = (
    <>
      <input
        type="file"
        id="csv-upload"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      <a
        href="/sample-bank-statement.csv"
        download
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/20 text-sm font-medium text-slate-300 hover:border-white/40 transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        Sample
      </a>
      <label
        htmlFor="csv-upload"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium  transition-colors cursor-pointer"
      >
        <Upload className="w-3.5 h-3.5" />
        Upload CSV
      </label>
    </>
  );

  return (
    <AppShell user={user} onLogout={handleLogout}>
      {isLoading && activeTab === 'home' ? (
        <DashboardSkeleton />
      ) : (
        <>
        {activeTab === 'home' && (
          <div className="space-y-10">
            <PageHeader
              eyebrow="Overview"
              title={parsedIncome ? money(parsedIncome.parsed.totalIncome) : 'Welcome'}
              subtitle={
                parsedIncome ? (
                  <>
                    Total income tracked
                    {parsedIncome.parsed.startDate && parsedIncome.parsed.endDate && (
                      <>
                        {' · '}
                        {parsedIncome.parsed.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' – '}
                        {parsedIncome.parsed.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </>
                    )}
                  </>
                ) : (
                  'Upload a bank statement to start tracking income across every platform.'
                )
              }
              actions={uploadActions}
            />

            {!parsedIncome ? (
              <EmptyState
                icon={BarChart3}
                title="No income data yet"
                body="Upload a CSV bank statement and Stub will classify every payout by platform, flag deductible expenses, and estimate your quarterly taxes."
                action={
                  <button
                    onClick={() => setShowWizard(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Open setup guide
                  </button>
                }
              />
            ) : (
              <>
                <HomeOverview parsedIncome={parsedIncome} />
              </>
            )}
          </div>
        )}

        {activeTab === 'income' && (
          <div className="space-y-10">
            <PageHeader
              eyebrow="Income"
              title={parsedIncome ? money(parsedIncome.parsed.totalIncome) : '$0'}
              subtitle={
                parsedIncome ? (
                  <>
                    {parsedIncome.parsed.income.length} payments across{' '}
                    {parsedIncome.parsed.byPlatform.size} platform
                    {parsedIncome.parsed.byPlatform.size === 1 ? '' : 's'}
                    {parsedIncome.parsed.startDate && parsedIncome.parsed.endDate && (
                      <>
                        {' · '}
                        {parsedIncome.parsed.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' – '}
                        {parsedIncome.parsed.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </>
                    )}
                  </>
                ) : (
                  'Every payout from every platform, in one ledger.'
                )
              }
              actions={uploadActions}
            />

            {!parsedIncome && (
              <EmptyState
                icon={DollarSign}
                title="Upload a statement to get started"
                body="Upload a CSV of your bank transactions and Stub will detect payouts from Uber, DoorDash, Upwork, and 50+ other platforms — then score the stability of your income."
                action={
                  <label
                    htmlFor="csv-upload"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium  transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload statement
                  </label>
                }
              />
            )}

            {parsedIncome && (
              <>
                <StatGrid
                  stats={[
                    {
                      label: 'Total income',
                      value: money2(parsedIncome.parsed.totalIncome),
                      sub: `${parsedIncome.parsed.income.length} payments`,
                    },
                    {
                      label: 'Platforms',
                      value: parsedIncome.parsed.byPlatform.size,
                      sub: `${Array.from(parsedIncome.parsed.byPlatform.keys()).slice(0, 3).join(', ')}${parsedIncome.parsed.byPlatform.size > 3 ? '…' : ''}`,
                    },
                    {
                      label: 'Stability score',
                      value: `${parsedIncome.stability.score}/100`,
                      sub: parsedIncome.stability.rating,
                    },
                  ]}
                />

                {/* Income chart */}
                <section className="rounded-lg border border-white/10 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div>
                      <h2 className="text-sm font-semibold text-white">Income trends</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Earnings across platforms over time</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <SegmentedControl
                        options={[
                          { value: 'bar' as const, label: 'Stacked' },
                          { value: 'pie' as const, label: 'Share' },
                        ]}
                        value={incomeChartView}
                        onChange={setIncomeChartView}
                      />
                      {incomeChartView === 'bar' && (
                        <SegmentedControl
                          options={[
                            { value: 'weekly' as const, label: 'Weekly' },
                            { value: 'biweekly' as const, label: 'Biweekly' },
                            { value: 'monthly' as const, label: 'Monthly' },
                          ]}
                          value={incomeTimePeriod}
                          onChange={setIncomeTimePeriod}
                        />
                      )}
                    </div>
                  </div>

                  {(() => {
                    // Prepare chart data based on parsed income
                    const platforms = Array.from(parsedIncome.parsed.byPlatform.entries()) as [string, any][];

                    // Empty state check
                    if (!platforms.length || parsedIncome.parsed.income.length === 0) {
                      return (
                        <ChartEmptyState
                          icon={BarChart3}
                          title="No income data yet"
                          hint="Upload a bank statement to see your earnings visualized"
                        />
                      );
                    }

                    const colorFor = (platform: string) =>
                      PLATFORM_COLORS[platform] || PLATFORM_COLORS.Other;

                    if (incomeChartView === 'pie') {
                      // Pie chart data
                      const pieData = platforms.map(([platform, data]: [string, any]) => ({
                        name: platform,
                        value: data.total,
                        fill: colorFor(platform),
                      }));

                      return (
                        <div className="h-72">
                          <ChartContainer
                            config={Object.fromEntries(
                              platforms.map(([platform]) => [
                                platform,
                                { label: platform, color: colorFor(platform) },
                              ])
                            )}
                            className="h-full w-full"
                          >
                            <PieChart>
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }: { name?: string; percent?: number }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                outerRadius={105}
                                innerRadius={62}
                                dataKey="value"
                                stroke="#fff"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <ChartLegend content={(<ChartLegendContent />) as never} />
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

                      const platform = item.platform || 'Unknown';
                      groupedData[key][platform] = (groupedData[key][platform] || 0) + item.amount;
                    });

                    const barData = Object.values(groupedData).map((item: any) => {
                      // Calculate total for this period
                      const total = Object.keys(item)
                        .filter(key => key !== 'period')
                        .reduce((sum, key) => sum + (item[key] || 0), 0);
                      return { ...item, total };
                    });

                    return (
                      <div className="h-72">
                        <ChartContainer
                          config={Object.fromEntries(
                            platforms.map(([platform]) => [
                              platform,
                              { label: platform, color: colorFor(platform) },
                            ])
                          )}
                          className="h-full w-full"
                        >
                          <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                            <XAxis
                              dataKey="period"
                              stroke={CHART_AXIS}
                              tickLine={false}
                              axisLine={false}
                              style={{ fontSize: '12px' }}
                            />
                            <YAxis
                              stroke={CHART_AXIS}
                              tickLine={false}
                              axisLine={false}
                              style={{ fontSize: '12px' }}
                              tickFormatter={(value) => `$${value.toLocaleString()}`}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={(<ChartLegendContent />) as never} />
                            {platforms.map(([platform]) => (
                              <Bar
                                key={platform}
                                dataKey={platform}
                                stackId="a"
                                fill={colorFor(platform)}
                                radius={[0, 0, 0, 0]}
                              />
                            ))}
                          </BarChart>
                        </ChartContainer>
                      </div>
                    );
                  })()}
                </section>

                {/* Safe to spend */}
                <section>
                  <SectionHeader
                    title="Safe to spend"
                    hint="After taxes and emergency savings are set aside"
                  />
                  {(() => {
                    const totalIncome = parsedIncome.parsed.totalIncome;
                    const taxSetAside = totalIncome * 0.30; // 30% for taxes
                    const emergencyFund = totalIncome * 0.10; // 10% for emergency fund
                    const safeToSpend = totalIncome - taxSetAside - emergencyFund;

                    return (
                      <div className="grid md:grid-cols-5 gap-4">
                        <div className="md:col-span-3 rounded-lg border border-white/10 overflow-hidden">
                          <table className="w-full text-sm">
                            <tbody>
                              <tr className="border-b border-white/5">
                                <td className="px-4 py-3 text-white font-medium">Total income</td>
                                <td className="px-4 py-3 text-right font-medium text-white">
                                  {money2(totalIncome)}
                                </td>
                              </tr>
                              <tr className="border-b border-white/5">
                                <td className="px-4 py-3 text-slate-400">Tax set-aside (30%)</td>
                                <td className="px-4 py-3 text-right text-red-400">
                                  −{money2(taxSetAside)}
                                </td>
                              </tr>
                              <tr className="border-b border-white/5">
                                <td className="px-4 py-3 text-slate-400">Emergency fund (10%)</td>
                                <td className="px-4 py-3 text-right text-red-400">
                                  −{money2(emergencyFund)}
                                </td>
                              </tr>
                              <tr className="bg-slate-950/60">
                                <td className="px-4 py-3">
                                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 block">
                                    Safe to spend
                                  </span>
                                  <span className="text-lg font-semibold text-white">
                                    {money(safeToSpend)}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right align-bottom text-sm text-emerald-400 font-medium">
                                  {Math.round((safeToSpend / totalIncome) * 100)}% of income
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="md:col-span-2 rounded-lg border border-white/10 p-4 space-y-4">
                          <div>
                            <h3 className="text-[13px] font-semibold text-white mb-1">Why this matters</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              No employer is withholding for you. Set aside taxes (30%) and an
                              emergency buffer (10%) before spending — what&apos;s left is your real
                              spending power.
                            </p>
                          </div>
                          <div className="border-t border-white/5 pt-4">
                            <h3 className="text-[13px] font-semibold text-white mb-1">Make it automatic</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              Move {money(taxSetAside)} to a separate tax savings account now and set
                              up auto-transfers so tax money never looks spendable.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </section>

                {/* Platform Breakdown */}
                <section>
                  <SectionHeader title="Platform breakdown" hint="Income sources with trend indicators" />
                  <div className="rounded-lg border border-white/10 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-white/10">
                          <th className="text-left text-[11px] font-medium uppercase tracking-wider text-slate-500 px-4 py-2.5">Platform</th>
                          <th className="text-right text-[11px] font-medium uppercase tracking-wider text-slate-500 px-4 py-2.5 hidden sm:table-cell">Payments</th>
                          <th className="text-right text-[11px] font-medium uppercase tracking-wider text-slate-500 px-4 py-2.5 hidden sm:table-cell">Share</th>
                          <th className="text-right text-[11px] font-medium uppercase tracking-wider text-slate-500 px-4 py-2.5">Trend</th>
                          <th className="text-right text-[11px] font-medium uppercase tracking-wider text-slate-500 px-4 py-2.5">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(parsedIncome.parsed.byPlatform.entries())
                          .map((entry) => {
                            const [platform, data] = entry;
                            return {
                              platform,
                              total: data.total || 0,
                              count: data.count || 0,
                            };
                          })
                          .sort((a, b) => b.total - a.total)
                          .map(({ platform, total, count }, index) => {
                            const PIcon = PLATFORM_ICONS[platform];
                            // Mock trend data (in production, calculate from historical data)
                            const trendPercent = [8, -3, 15, 5, -2][index % 5];
                            const isPositive = trendPercent > 0;
                            const totalIncome = parsedIncome.parsed.totalIncome;
                            const percentOfTotal = ((total / totalIncome) * 100).toFixed(1);

                            return (
                              <tr key={platform} className="border-b border-white/5 last:border-0 hover:bg-slate-800/60 transition-colors">
                                <td className="px-4 py-2.5">
                                  <span className="inline-flex items-center gap-2.5 font-medium text-white">
                                    {PIcon ? (
                                      <PIcon className="w-3.5 h-3.5 text-slate-500" />
                                    ) : (
                                      <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: PLATFORM_COLORS[platform] || PLATFORM_COLORS.Other }}
                                      />
                                    )}
                                    {platform}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-right text-slate-400 hidden sm:table-cell">{count}</td>
                                <td className="px-4 py-2.5 text-right text-slate-400 hidden sm:table-cell">{percentOfTotal}%</td>
                                <td className="px-4 py-2.5 text-right">
                                  <span
                                    className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                                      isPositive ? 'text-emerald-400' : 'text-red-400'
                                    }`}
                                  >
                                    {isPositive ? (
                                      <ArrowUpRight className="w-3 h-3" />
                                    ) : (
                                      <ArrowDownRight className="w-3 h-3" />
                                    )}
                                    {Math.abs(trendPercent)}%
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-right font-medium text-white">{money2(total)}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </div>
        )}
        {activeTab === 'expenses' && (
          <div className="space-y-10">
            <PageHeader
              eyebrow="Expenses"
              title="Write-offs"
              subtitle="Deductible business expenses, detected and explained automatically."
              actions={uploadActions}
            />
            {!parsedIncome ? (
              <EmptyState
                icon={Receipt}
                title="No expenses tracked yet"
                body="Upload your bank statement and Stub will detect deductible business expenses — gas, equipment, software, phone bills — and write down the reason for each."
                action={
                  <button
                    onClick={() => setShowWizard(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Open setup guide
                  </button>
                }
              />
            ) : (
              <ExpensesView parsedIncome={parsedIncome} />
            )}
          </div>
        )}


        {activeTab === 'taxes' && (
          <div className="space-y-10">
            {!parsedIncome ? (
              <>
                <PageHeader
                  eyebrow="Taxes"
                  title="$0"
                  subtitle="Quarterly self-employment tax estimates, computed from your real income."
                  actions={
                    <button
                      onClick={() => setIsCalculatorModalOpen(true)}
                      disabled
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 text-sm font-medium text-slate-600 cursor-not-allowed"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      Tax calculator
                    </button>
                  }
                />
                <EmptyState
                  icon={FileText}
                  title="Upload income to calculate taxes"
                  body="Upload your bank statement on the Income tab to get quarterly tax estimates, a payment schedule, and deduction calculations."
                  action={
                    <Link
                      href="/dashboard/income"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium  transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Go to Income
                    </Link>
                  }
                />
              </>
            ) : (() => {
              // Calculate real taxes from uploaded data
              const expenseResults = buildExpensesFromTransactions(parsedIncome.rawTransactions || []);
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
                  <PageHeader
                    eyebrow="Taxes"
                    title={money(taxCalc.quarterlyPayment)}
                    subtitle={`Estimated quarterly payment · ${(taxCalc.effectiveTaxRate * 100).toFixed(1)}% effective rate`}
                    actions={
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsCalculatorModalOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/20 text-sm font-medium text-slate-300 hover:border-white/40 transition-colors"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                          Tax calculator
                        </button>
                        <button
                          onClick={() =>
                            downloadAccountantCsv(
                              buildAccountantCsv({
                                totalIncome: parsedIncome.parsed.totalIncome,
                                totalDeductions: expenseResults.totalDeductions,
                                taxCalc,
                                transactions: parsedIncome.rawTransactions || [],
                              })
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Export for accountant
                        </button>
                      </div>
                    }
                  />

                  <StatGrid
                    stats={[
                      {
                        label: 'Annual tax liability',
                        value: money(taxCalc.totalTaxLiability),
                        sub: `${(taxCalc.effectiveTaxRate * 100).toFixed(1)}% effective rate`,
                      },
                      {
                        label: 'Quarterly payment',
                        value: money(taxCalc.quarterlyPayment),
                        sub: 'Due four times per year',
                      },
                      {
                        label: 'Total deductions',
                        value: money(expenseResults.totalDeductions),
                        sub: `${expenseResults.expenses.length} expenses tracked`,
                      },
                      {
                        label: 'Tax savings',
                        value: money(expenseResults.potentialTaxSavings),
                        sub: 'From deductions',
                      },
                    ]}
                  />

                  {/* AI plain-English summary (numbers come from the tax calculator) */}
                  <AITaxSummary
                    taxCalc={taxCalc}
                    totalDeductions={expenseResults.totalDeductions}
                    deadlines={deadlines}
                    platforms={Array.from(parsedIncome.parsed.byPlatform.keys())}
                    deductionsByCategory={Object.fromEntries(
                      Array.from(expenseResults.byCategory.entries()).map(([category, items]) => [
                        category,
                        items.reduce((sum, e) => sum + e.deductibleAmount, 0),
                      ])
                    )}
                  />

                  {/* Tax breakdown */}
                  <section>
                    <SectionHeader
                      title="Tax breakdown"
                      hint={`How your ${money(taxCalc.totalTaxLiability)} bill is calculated`}
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Left: components */}
                      <div className="rounded-lg border border-white/10 p-4">
                        <h3 className="text-[13px] font-semibold text-white mb-3">Tax components</h3>
                        <div className="space-y-3">
                          {[
                            { label: 'Federal income tax', value: taxCalc.breakdown.federalIncome },
                            { label: 'Social Security (12.4%)', value: taxCalc.breakdown.socialSecurity },
                            { label: 'Medicare (2.9%)', value: taxCalc.breakdown.medicare },
                            { label: 'State tax (CA)', value: taxCalc.breakdown.state },
                          ].map((row) => (
                            <div key={row.label}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-slate-400">{row.label}</span>
                                <span className="text-sm font-medium text-white">{money(row.value)}</span>
                              </div>
                              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-400/70 rounded-full"
                                  style={{ width: `${(row.value / taxCalc.totalTaxLiability) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-sm font-semibold text-white">Total tax</span>
                          <span className="text-base font-semibold text-white">
                            {money(taxCalc.totalTaxLiability)}
                          </span>
                        </div>
                      </div>

                      {/* Right: income calculation */}
                      <div className="rounded-lg border border-white/10 p-4">
                        <h3 className="text-[13px] font-semibold text-white mb-3">Income calculation</h3>
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Gross income</span>
                            <span className="text-sm font-medium text-white">{money(taxCalc.grossIncome)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Business deductions</span>
                            <span className="text-sm font-medium text-red-400">
                              −{money(expenseResults.totalDeductions)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">Standard deduction</span>
                            <span className="text-sm font-medium text-red-400">−$14,600</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">SE tax deduction (50%)</span>
                            <span className="text-sm font-medium text-red-400">
                              −{money(taxCalc.selfEmploymentTax * 0.5)}
                            </span>
                          </div>
                          <div className="border-t border-white/10 pt-2.5 flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">Taxable income</span>
                            <span className="text-sm font-semibold text-white">
                              {money(taxCalc.adjustedGrossIncome - 14600)}
                            </span>
                          </div>
                        </div>

                        <p className="mt-4 text-xs text-slate-500 leading-relaxed border-t border-white/5 pt-3">
                          Self-employed filers deduct 50% of self-employment tax from adjusted gross
                          income — worth about {money(taxCalc.selfEmploymentTax * 0.5 * 0.22)} in federal
                          income tax here.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Tax chart */}
                  <section className="rounded-lg border border-white/10 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                      <div>
                        <h2 className="text-sm font-semibold text-white">Tax overview</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Quarterly payments and liability breakdown</p>
                      </div>
                      <SegmentedControl
                        options={[
                          { value: 'quarterly' as const, label: 'Quarterly' },
                          { value: 'liability' as const, label: 'Liability' },
                        ]}
                        value={taxChartView}
                        onChange={setTaxChartView}
                      />
                    </div>

                    {taxChartView === 'liability' ? (
                      (() => {
                        // Pie chart for tax liability breakdown
                        const liabilityData = [
                          { name: 'Federal Income', value: taxCalc.breakdown.federalIncome, fill: '#5b5bd6' },
                          { name: 'Social Security', value: taxCalc.breakdown.socialSecurity, fill: '#7da7c9' },
                          { name: 'Medicare', value: taxCalc.breakdown.medicare, fill: '#9b8ed4' },
                          { name: 'State Tax', value: taxCalc.breakdown.state, fill: '#c9a36a' },
                        ];

                        return (
                          <div className="h-72">
                            <ChartContainer
                              config={{
                                'Federal Income': { label: 'Federal income tax', color: '#5b5bd6' },
                                'Social Security': { label: 'Social Security', color: '#7da7c9' },
                                'Medicare': { label: 'Medicare', color: '#9b8ed4' },
                                'State Tax': { label: 'State tax', color: '#c9a36a' },
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
                                  label={({ name, percent }: { name?: string; percent?: number }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                  outerRadius={105}
                                  innerRadius={62}
                                  dataKey="value"
                                  stroke="#fff"
                                >
                                  {liabilityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                  ))}
                                </Pie>
                                <ChartLegend content={(<ChartLegendContent />) as never} />
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
                          <div className="h-72">
                            <ChartContainer
                              config={{
                                owed: { label: 'Owed', color: '#cf6f6f' },
                                setAside: { label: 'Set aside', color: '#6fa287' },
                              }}
                              className="h-full w-full"
                            >
                              <BarChart data={quarterlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                                <XAxis
                                  dataKey="quarter"
                                  stroke={CHART_AXIS}
                                  tickLine={false}
                                  axisLine={false}
                                  style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                  stroke={CHART_AXIS}
                                  tickLine={false}
                                  axisLine={false}
                                  style={{ fontSize: '12px' }}
                                  tickFormatter={(value) => `$${value}`}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={(<ChartLegendContent />) as never} />
                                <Bar dataKey="setAside" fill="#6fa287" />
                                <Bar dataKey="owed" fill="#cf6f6f" />
                              </BarChart>
                            </ChartContainer>
                          </div>
                        );
                      })()
                    )}
                  </section>

                  {/* Quarterly payment schedule */}
                  <section>
                    <SectionHeader
                      title="Quarterly payment schedule"
                      hint={`Pay ${money(taxCalc.quarterlyPayment)} four times per year to avoid penalties`}
                    />
                    <div className="rounded-lg border border-white/10 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-950/60 border-b border-white/10">
                            <th className="text-left text-[11px] font-medium uppercase tracking-wider text-slate-500 px-4 py-2.5">Quarter</th>
                            <th className="text-left text-[11px] font-medium uppercase tracking-wider text-slate-500 px-4 py-2.5 hidden sm:table-cell">Period</th>
                            <th className="text-left text-[11px] font-medium uppercase tracking-wider text-slate-500 px-4 py-2.5">Due</th>
                            <th className="text-left text-[11px] font-medium uppercase tracking-wider text-slate-500 px-4 py-2.5">Status</th>
                            <th className="text-right text-[11px] font-medium uppercase tracking-wider text-slate-500 px-4 py-2.5">Amount</th>
                            <th className="px-4 py-2.5"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {deadlines.map((deadline) => (
                            <tr key={deadline.quarter} className="border-b border-white/5 last:border-0 hover:bg-slate-800/60 transition-colors">
                              <td className="px-4 py-2.5 font-medium text-white">{deadline.quarter} 2024</td>
                              <td className="px-4 py-2.5 text-slate-400 hidden sm:table-cell">{deadline.period}</td>
                              <td className="px-4 py-2.5 text-slate-400 whitespace-nowrap">
                                {deadline.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </td>
                              <td className="px-4 py-2.5">
                                {deadline.isPast ? (
                                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-red-500/10 text-red-400">
                                    Overdue
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-emerald-500/10 text-emerald-400">
                                    Upcoming
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2.5 text-right font-medium text-white">
                                {money(deadline.amount)}
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                {deadline.isPast ? (
                                  <button
                                    onClick={() => toast.success('IRS payment portal integration coming soon!')}
                                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                                  >
                                    Pay now
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => toast.success('Tax reminders coming soon!')}
                                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                                  >
                                    Set reminder
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Deduction summary */}
                  <section>
                    <SectionHeader title="Your deductions" hint="Every dollar you can write off" />
                    {expenseResults.expenses.length === 0 ? (
                      <EmptyState
                        icon={Receipt}
                        title="No deductions tracked yet"
                        body="Upload transactions with business expenses to see potential tax deductions."
                      />
                    ) : (
                      <div className="rounded-lg border border-white/10 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-950/60 border-b border-white/10">
                              <th className="text-left text-[11px] font-medium uppercase tracking-wider text-slate-500 px-4 py-2.5">Category</th>
                              <th className="text-right text-[11px] font-medium uppercase tracking-wider text-slate-500 px-4 py-2.5">Items</th>
                              <th className="text-right text-[11px] font-medium uppercase tracking-wider text-slate-500 px-4 py-2.5">Deductible</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.from(expenseResults.byCategory.entries()).map(([category, expenses]) => {
                              const totalAmount = expenses.reduce((sum, e) => sum + e.deductibleAmount, 0);

                              return (
                                <tr key={category} className="border-b border-white/5 last:border-0 hover:bg-slate-800/60 transition-colors">
                                  <td className="px-4 py-2.5">
                                    <span className="inline-flex items-center gap-2.5 font-medium text-white capitalize">
                                      <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: EXPENSE_CATEGORY_COLORS[category] || EXPENSE_CATEGORY_COLORS.other }}
                                      />
                                      {category.replace('-', ' ')}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2.5 text-right text-slate-400">{expenses.length}</td>
                                  <td className="px-4 py-2.5 text-right font-medium text-white">
                                    {money(totalAmount)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                </>
              );
            })()}

            {/* Tax Calculator Modal */}
            {parsedIncome && (() => {
              const QuarterlyTaxCalculator = require('./QuarterlyTaxCalculator').default;
              const expenseResults = buildExpensesFromTransactions(parsedIncome.rawTransactions || []);

              return (
                <Dialog open={isCalculatorModalOpen} onOpenChange={setIsCalculatorModalOpen}>
                  <DialogContent className="max-w-4xl w-[95vw] p-0 max-h-[90vh] overflow-hidden">
                    <div className="p-5 border-b border-white/10">
                      <DialogHeader>
                        <DialogTitle className="text-base font-semibold text-white">
                          Quarterly tax calculator
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-400">
                          Calculate and track your quarterly estimated tax payments
                        </DialogDescription>
                      </DialogHeader>
                    </div>
                    <div className="overflow-y-auto max-h-[calc(90vh-110px)] px-5 pb-5">
                      <QuarterlyTaxCalculator
                        yearToDateIncome={parsedIncome.parsed.totalIncome}
                        yearToDateExpenses={expenseResults.totalDeductions}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })()}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-8">
            <PageHeader
              eyebrow="Workspace"
              title="Platform insights"
              subtitle="Compare platform performance and find where the next dollar comes from."
            />

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

        {activeTab === 'mileage' && (
          <div className="space-y-8">
            <PageHeader
              eyebrow="Money"
              title="Mileage"
              subtitle="Log work miles — the IRS standard rate is usually your biggest deduction."
            />
            <MileageTracker userId={user.id} />
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="space-y-10">
            <PageHeader
              eyebrow="Workspace"
              title="Learn"
              subtitle="City-specific guides, tax tips, and strategies from top earners."
              actions={
                <>
                  {/* City Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/20 text-sm font-medium text-slate-300 hover:border-white/40 transition-colors">
                        <Globe className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          {selectedCities.length === 0 ? 'All cities' : selectedCities.length === 1 ? selectedCities[0] : `${selectedCities.length} cities`}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel className="text-slate-400 text-xs">Select cities</DropdownMenuLabel>
                      <DropdownMenuSeparator />
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
                        >
                          {city}
                        </DropdownMenuCheckboxItem>
                      ))}
                      {selectedCities.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
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
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/20 text-sm font-medium text-slate-300 hover:border-white/40 transition-colors">
                        <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                        <span>
                          {selectedGigTypes.length === 0 ? 'All gigs' : selectedGigTypes.length === 1 ? selectedGigTypes[0] : `${selectedGigTypes.length} types`}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel className="text-slate-400 text-xs">Select gig types</DropdownMenuLabel>
                      <DropdownMenuSeparator />
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
                        >
                          {gigType.charAt(0).toUpperCase() + gigType.slice(1)}
                        </DropdownMenuCheckboxItem>
                      ))}
                      {selectedGigTypes.length > 0 && (
                        <>
                          <DropdownMenuSeparator />
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
                </>
              }
            />

            {/* Filtered Guides */}
            {(() => {
              const guides = getGuides(selectedCities, selectedGigTypes);

              return (
                <section>
                  <SectionHeader
                    title={selectedCities.length > 0 || selectedGigTypes.length > 0 ? 'Filtered guides' : 'All guides'}
                    hint={`${guides.length} guide${guides.length !== 1 ? 's' : ''}${selectedCities.length > 0 ? ` in ${selectedCities.join(', ')}` : ''}${selectedGigTypes.length > 0 ? ` for ${selectedGigTypes.join(', ')}` : ''}`}
                  />
                  <div className="rounded-lg border border-white/10 divide-y divide-white/5">
                    {guides.map((guide) => (
                      <Link
                        key={guide.id}
                        href={guide.actionLink || '#'}
                        className="flex items-start justify-between gap-4 px-4 py-3.5 hover:bg-slate-800/60 transition-colors group"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <BookOpen className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" strokeWidth={1.75} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">
                                {guide.title}
                              </p>
                              {guide.cities.length > 0 && !guide.cities.includes('all') && (
                                <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium bg-slate-800 text-slate-400">
                                  {guide.cities.join(', ')}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{guide.description}</p>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 shrink-0">{guide.readTime}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })()}
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <PageHeader
              eyebrow="Account"
              title="Settings"
              subtitle="Profile, notifications, and security."
            />

            {/* Profile Settings */}
            <section className="rounded-lg border border-white/10 p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <User className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                <h2 className="text-sm font-semibold text-white">Profile</h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">First name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/20 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-300 mb-1.5">Last name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-slate-900 border border-white/20 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-slate-950 border border-white/10 rounded-md px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                </div>

                {profileMessage && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-200 rounded-md text-emerald-800 text-sm">
                    {profileMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium  transition-colors disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save changes
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* Email Notifications */}
            <section className="rounded-lg border border-white/10 p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <Bell className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                <h2 className="text-sm font-semibold text-white">Email notifications</h2>
              </div>

              <form onSubmit={handleUpdateNotifications} className="space-y-5">
                <div className="divide-y divide-white/5 border border-white/10 rounded-md">
                  <div className="flex items-start gap-3 p-4">
                    <input
                      type="checkbox"
                      id="weeklyReports"
                      checked={weeklyReports}
                      onChange={(e) => setWeeklyReports(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-white/20 text-indigo-400 focus:ring-indigo-300"
                    />
                    <div className="flex-1">
                      <label htmlFor="weeklyReports" className="block text-sm font-medium text-white cursor-pointer">
                        Weekly earnings reports
                      </label>
                      <p className="text-xs text-slate-400 mt-0.5">
                        A summary of weekly income, platform breakdown, and insights every Monday morning.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4">
                    <input
                      type="checkbox"
                      id="taxReminders"
                      checked={taxReminders}
                      onChange={(e) => setTaxReminders(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-white/20 text-indigo-400 focus:ring-indigo-300"
                    />
                    <div className="flex-1">
                      <label htmlFor="taxReminders" className="block text-sm font-medium text-white cursor-pointer">
                        Quarterly tax reminders
                      </label>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Reminders before quarterly deadlines (April 15, June 15, September 15, January 15) with estimated amounts.
                      </p>
                    </div>
                  </div>
                </div>

                {notificationsMessage && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-200 rounded-md text-emerald-800 text-sm">
                    {notificationsMessage}
                  </div>
                )}

                <p className="text-xs text-slate-500">
                  Note: email notifications require SMTP to be configured on the Supabase project.
                  Until then, preferences are saved but emails won&apos;t be sent.
                </p>

                <button
                  type="submit"
                  disabled={savingNotifications}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium  transition-colors disabled:opacity-50"
                >
                  {savingNotifications ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save preferences
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* Password Settings */}
            <section className="rounded-lg border border-white/10 p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <Lock className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                <h2 className="text-sm font-semibold text-white">Change password</h2>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-300 mb-1.5">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-white/20 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    placeholder="At least 8 characters"
                    minLength={8}
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-300 mb-1.5">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-white/20 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                    placeholder="Repeat password"
                  />
                </div>

                {passwordMessage && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-200 rounded-md text-emerald-800 text-sm">
                    {passwordMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingPassword || !newPassword || !confirmPassword}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium  transition-colors disabled:opacity-50"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating…
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Update password
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* Danger Zone */}
            <section className="rounded-lg border border-red-500/30 p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <Trash2 className="w-4 h-4 text-red-500" strokeWidth={1.75} />
                <h2 className="text-sm font-semibold text-white">Danger zone</h2>
              </div>

              {/* Delete Account Section */}
              <div>
                <h3 className="text-sm font-medium text-white mb-1">Delete account</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Once you delete your account, there is no going back. All your data will be
                  permanently deleted.
                </p>

                {showDeleteConfirm && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                    <p className="text-sm font-medium text-red-800 mb-1">Are you absolutely sure?</p>
                    <p className="text-sm text-red-400">
                      This will permanently delete all your transactions, income data, and account settings.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        {showDeleteConfirm ? 'Yes, delete my account' : 'Delete account'}
                      </>
                    )}
                  </button>

                  {showDeleteConfirm && (
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-sm text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </section>

            {settingsError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-sm">
                {settingsError}
              </div>
            )}
          </div>
        )}
        </>
      )}
      {showWizard && (
        <WelcomeWizard
          userId={user.id}
          onClose={dismissWizard}
          onUploadComplete={() => {
            localStorage.setItem('stub-wizard-seen', '1');
            window.location.reload();
          }}
        />
      )}
    </AppShell>
  );
}
