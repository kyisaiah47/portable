'use client';

import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/components/Dashboard';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return <Dashboard user={user} onLogout={signOut} />;
}
