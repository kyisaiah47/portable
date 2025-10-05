'use client';

import { Plus } from 'lucide-react';

interface PlaidLinkProps {
  userId: string;
  onSuccess?: () => void;
  variant?: 'button' | 'card';
}

export default function PlaidLink({ userId, onSuccess, variant = 'button' }: PlaidLinkProps) {
  if (variant === 'card') {
    return (
      <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-lg p-8 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-2 font-space-grotesk">
          Connect your bank
        </h3>
        <p className="text-sm text-slate-300 mb-6">
          Securely link your bank account to automatically track income and expenses.
        </p>
        <button
          disabled
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Coming Soon
        </button>
        <p className="text-xs text-slate-400 mt-4">
          🔒 Bank-level security. Your credentials are never stored on our servers.
        </p>
      </div>
    );
  }

  return (
    <button
      disabled
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold opacity-50 cursor-not-allowed inline-flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Coming Soon
    </button>
  );
}
