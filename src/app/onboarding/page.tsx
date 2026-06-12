'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CSVUpload from '@/components/CSVUpload';
import { ArrowRight, Check, Upload, Zap } from 'lucide-react';
import { seedDemoData } from '@/lib/demo-data';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/Logo';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'csv' | 'demo' | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleMethodSelect = (selectedMethod: 'csv' | 'demo') => {
    setMethod(selectedMethod);
    if (selectedMethod === 'demo') {
      handleDemoData();
    } else {
      setStep(2);
    }
  };

  const handleDemoData = async () => {
    if (!user) return;

    const success = await seedDemoData(user.id, supabase);
    if (success) {
      router.push('/dashboard');
    }
  };

  const handleComplete = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress bar */}
      <div className="w-full h-0.5 bg-gray-200">
        <div
          className="h-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${(step / 2) * 100}%` }}
        ></div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Step 1: Welcome & Method Selection */}
        {step === 1 && (
          <div className="space-y-10">
            <div className="text-center">
              <Logo className="mx-auto mb-8" />
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-3">
                Welcome, {user.firstName}.
              </h1>
              <p className="text-gray-500">
                Bring in some income data and we&apos;ll take it from there.
              </p>
            </div>

            {/* Method Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* CSV Option */}
              <button
                onClick={() => handleMethodSelect('csv')}
                className="group bg-white rounded-lg border border-gray-200 p-6 text-left hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="w-9 h-9 rounded-md bg-indigo-50 flex items-center justify-center mb-4">
                  <Upload className="w-4.5 h-4.5 w-[18px] h-[18px] text-indigo-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  Upload a bank statement
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  A CSV export from your bank. Best for seeing your real numbers.
                </p>
                <ul className="space-y-1.5 mb-4">
                  {['No bank login needed', 'Works with any bank', 'Quick setup'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600">
                  Upload CSV
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>

              {/* Demo Data Option */}
              <button
                onClick={() => handleMethodSelect('demo')}
                className="group bg-white rounded-lg border border-gray-200 p-6 text-left hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center mb-4">
                  <Zap className="w-[18px] h-[18px] text-gray-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">Try demo data</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Explore Stub with realistic sample gig income before bringing your own.
                </p>
                <ul className="space-y-1.5 mb-4">
                  {['Instant setup', 'Realistic data', 'Replace anytime'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  Use sample data
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Skip for now →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Execute Selected Method */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">
                Upload a bank statement
              </h2>
              <p className="text-sm text-gray-500">
                A CSV of your recent transactions — we&apos;ll classify everything automatically.
              </p>
            </div>

            {method === 'csv' && (
              <CSVUpload userId={user.id} onUploadComplete={handleComplete} />
            )}

            <div className="text-center">
              <button
                onClick={() => setStep(1)}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                ← Go back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
