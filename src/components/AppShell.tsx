'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  DollarSign,
  Receipt,
  FileText,
  Shield,
  Target,
  Users,
  BookOpen,
  Settings,
  LogOut,
  ChevronsUpDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from '@/components/Logo';

interface ShellUser {
  firstName: string;
  email: string;
}

interface AppShellProps {
  user: ShellUser;
  onLogout: () => void;
  children: ReactNode;
}

const MAIN_NAV = [
  { id: 'home', label: 'Home', icon: LayoutGrid, path: '/dashboard' },
  { id: 'income', label: 'Income', icon: DollarSign, path: '/dashboard/income' },
  { id: 'expenses', label: 'Expenses', icon: Receipt, path: '/dashboard/expenses' },
  { id: 'taxes', label: 'Taxes', icon: FileText, path: '/dashboard/taxes' },
  { id: 'benefits', label: 'Benefits', icon: Shield, path: '/dashboard/benefits' },
];

const SECONDARY_NAV = [
  { id: 'insights', label: 'Insights', icon: Target, path: '/dashboard/insights' },
  { id: 'referrals', label: 'Referrals', icon: Users, path: '/dashboard/referrals' },
  { id: 'learn', label: 'Learn', icon: BookOpen, path: '/dashboard/learn' },
];

function NavLink({
  item,
  active,
}: {
  item: { id: string; label: string; icon: typeof LayoutGrid; path: string };
  active: boolean;
}) {
  return (
    <Link
      href={item.path}
      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors ${
        active
          ? 'bg-indigo-500/10 text-indigo-300 font-medium'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <item.icon className="w-4 h-4" strokeWidth={1.75} />
      <span>{item.label}</span>
    </Link>
  );
}

/**
 * Dashboard shell: thin left sidebar navigation (icon + label), white
 * content canvas, hairline borders throughout.
 */
export default function AppShell({ user, onLogout, children }: AppShellProps) {
  const pathname = usePathname();
  const activeTab = pathname === '/dashboard' ? 'home' : pathname.split('/').pop() || 'home';

  return (
    <div className="dark min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-white/10 bg-slate-950/60 sticky top-0 h-screen">
        <div className="px-4 pt-5 pb-4">
          <Link href="/dashboard" aria-label="Stub home">
            <Logo />
          </Link>
        </div>

        <nav className="flex-1 px-2.5 space-y-0.5 overflow-y-auto">
          {MAIN_NAV.map((item) => (
            <NavLink key={item.id} item={item} active={activeTab === item.id} />
          ))}

          <div className="pt-5 pb-1.5 px-2.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">
            Workspace
          </div>
          {SECONDARY_NAV.map((item) => (
            <NavLink key={item.id} item={item} active={activeTab === item.id} />
          ))}
        </nav>

        {/* User block */}
        <div className="border-t border-white/10 p-2.5">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-slate-800 transition-colors text-left">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-300 flex items-center justify-center text-xs font-semibold shrink-0">
                {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-white truncate">{user.firstName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              </div>
              <ChevronsUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-52">
              <DropdownMenuLabel className="text-slate-400 text-xs">My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={onLogout}
                className="cursor-pointer flex items-center text-red-400 focus:text-red-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 bg-slate-900 border-b border-white/10">
          <div className="flex items-center justify-between px-4 h-12">
            <Link href="/dashboard" aria-label="Stub home">
              <Logo />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-300 flex items-center justify-center text-xs font-semibold">
                {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={onLogout}
                  className="cursor-pointer flex items-center text-red-400 focus:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <nav className="flex items-center gap-1 px-2 pb-2 overflow-x-auto">
            {[...MAIN_NAV, ...SECONDARY_NAV].map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={`px-2.5 py-1 rounded-md text-[13px] whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-indigo-500/10 text-indigo-300 font-medium'
                    : 'text-slate-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-6 py-8 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
