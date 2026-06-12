'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import Link from 'next/link';
import Logo from '@/components/Logo';

function SignupContent() {
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
    // Check if user has any parsed income data
    // If not, redirect to onboarding
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <Link href="/" aria-label="Back to home" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 mb-1">
              Create your account
            </h1>
            <p className="text-sm text-gray-500">Free to start. No card required.</p>
            {referralCode && (
              <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-sm font-medium text-emerald-800">
                  You&apos;re signing up with a referral code
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  You&apos;ll get $10 after completing your profile.
                </p>
              </div>
            )}
          </div>

          <LoginForm isLogin={false} onSuccess={handleSuccess} referralCode={referralCode} />
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-gray-900 hover:underline">
              Log in
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

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-sm text-gray-500">Loading…</div>
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
