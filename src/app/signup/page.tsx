'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();

  const handleSuccess = (user: any) => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-inter">
      <div className="max-w-md w-full">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2 font-space-grotesk">
              Create your account
            </h2>
            <p className="text-slate-400">
              Start building your safety net
            </p>
          </div>

          <LoginForm isLogin={false} onSuccess={handleSuccess} />

          <div className="mt-6 text-center space-y-4">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-white hover:text-slate-300 font-semibold">
                Log in
              </Link>
            </p>
            <Link
              href="/"
              className="text-slate-400 hover:text-white text-sm font-medium block"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}