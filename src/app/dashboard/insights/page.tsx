'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardDataProvider from '@/components/dashboard/DashboardDataProvider';
import InsightsPage from '@/components/dashboard/InsightsPage';
import { useAuth } from '@/contexts/AuthContext';

export default function InsightsRoute() {
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
          <InsightsPage dashboardData={dashboardData} user={user} />
        )}
      </DashboardDataProvider>
    </DashboardLayout>
  );
}
