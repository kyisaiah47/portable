'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardDataProvider from '@/components/dashboard/DashboardDataProvider';
import HomePage from '@/components/dashboard/HomePage';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user} onLogout={signOut}>
      <DashboardDataProvider user={user}>
        {(dashboardData, user) => (
          <HomePage dashboardData={dashboardData} user={user} />
        )}
      </DashboardDataProvider>
    </DashboardLayout>
  );
}