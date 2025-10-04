'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import CSVUpload from '@/components/CSVUpload';
import PlaidLink from '@/components/PlaidLink';
import { ArrowRight, Check, Upload, Link as LinkIcon, Sparkles, Zap } from 'lucide-react';
import { seedDemoData } from '@/lib/demo-data';
import { supabase } from '@/lib/supabase';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'plaid' | 'csv' | null>(null);

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

  const handleMethodSelect = (selectedMethod: 'plaid' | 'csv' | 'demo') => {
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
    <div className="min-h-screen bg-slate-950 font-inter">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-900">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
          style={{ width: `${(step / 2) * 100}%` }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Step 1: Welcome & Method Selection */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="flex -space-x-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600"></div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-space-grotesk">
                Welcome to Portable, {user.firstName}! 🎉
              </h1>
              <p className="text-xl text-slate-300">
                Let's get your income tracked so we can show you insights that actually matter
              </p>
            </div>

            {/* Method Selection */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Plaid Option */}
              <button
                onClick={() => handleMethodSelect('plaid')}
                className="group bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/50 transition-all text-left"
              >
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <LinkIcon className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">Connect Your Bank</h3>
                <p className="text-slate-300 mb-4">
                  Automatically sync transactions from your checking account. Most secure and easiest option.
                </p>
                <div className="flex items-center gap-2 text-blue-400 font-semibold">
                  <span>Recommended</span>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Automatic updates</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Bank-level security</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>All platforms detected</span>
                  </div>
                </div>
              </button>

              {/* CSV Option */}
              <button
                onClick={() => handleMethodSelect('csv')}
                className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/50 transition-all text-left"
              >
                <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">Upload Bank Statement</h3>
                <p className="text-slate-300 mb-4">
                  Upload a CSV export from your bank. Good for one-time setup or testing.
                </p>
                <div className="flex items-center gap-2 text-purple-400 font-semibold">
                  <span>Manual upload</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>No bank login needed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Works with any bank</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Quick setup</span>
                  </div>
                </div>
              </button>

              {/* Demo Data Option */}
              <button
                onClick={() => handleMethodSelect('demo')}
                className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-8 border border-green-500/20 hover:border-green-500/50 transition-all text-left"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-space-grotesk">Try Demo Data</h3>
                <p className="text-slate-300 mb-4">
                  Explore Portable with sample gig worker data. Perfect for testing before connecting real accounts.
                </p>
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  <span>Just testing</span>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Instant setup</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Realistic data</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Replace anytime</span>
                  </div>
                </div>
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-slate-400 hover:text-white text-sm"
              >
                Skip for now →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Execute Selected Method */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 font-space-grotesk">
                {method === 'plaid' ? 'Connect Your Bank' : 'Upload Bank Statement'}
              </h2>
              <p className="text-slate-300">
                {method === 'plaid'
                  ? 'Securely connect your bank account to automatically track income'
                  : 'Upload a CSV file of your recent transactions'}
              </p>
            </div>

            {method === 'plaid' && (
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <PlaidLink
                  userId={user.id}
                  onSuccess={() => {
                    setTimeout(handleComplete, 2000);
                  }}
                />
              </div>
            )}

            {method === 'csv' && (
              <CSVUpload userId={user.id} onUploadComplete={handleComplete} />
            )}

            <div className="text-center">
              <button
                onClick={() => setStep(1)}
                className="text-slate-400 hover:text-white text-sm"
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
