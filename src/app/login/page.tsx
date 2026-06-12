'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSuccess = (user: any) => {
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading…</div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <Link href="/" aria-label="Back to home" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-gray-500">Sign in to continue.</p>
          </div>

          <LoginForm isLogin={true} onSuccess={handleSuccess} />

          <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1">
              Demo account
            </p>
            <p className="text-xs font-mono text-gray-600">sarah.driver@email.com / demo123</p>
          </div>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-gray-900 hover:underline">
              Sign up
            </Link>
          </p>
          <Link href="/" className="block text-sm text-gray-400 hover:text-gray-600">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
