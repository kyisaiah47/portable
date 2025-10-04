'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
    }
  }, [searchParams]);

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
            {referralCode && (
              <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-400 text-sm font-semibold">
                  You're signing up with a referral code!
                </p>
                <p className="text-green-300 text-xs mt-1">
                  You'll get $10 after completing your profile
                </p>
              </div>
            )}
          </div>

          <LoginForm isLogin={false} onSuccess={handleSuccess} referralCode={referralCode} />

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