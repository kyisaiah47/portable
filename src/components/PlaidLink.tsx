'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Plus, Loader2 } from 'lucide-react';

interface PlaidLinkProps {
  userId: string;
  onSuccess?: () => void;
  variant?: 'button' | 'card';
}

export default function PlaidLink({ userId, onSuccess, variant = 'button' }: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch link token when component mounts
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await fetch('/api/plaid/create-link-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        if (data.link_token) {
          setLinkToken(data.link_token);
        }
      } catch (error) {
        console.error('Error fetching link token:', error);
      }
    };

    fetchLinkToken();
  }, [userId]);

  const onSuccessCallback = useCallback(
    async (public_token: string, metadata: any) => {
      setLoading(true);
      try {
        // Exchange public token for access token
        const response = await fetch('/api/plaid/exchange-public-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_token, userId }),
        });

        const data = await response.json();

        if (data.success) {
          // Sync transactions immediately after connecting
          await fetch('/api/plaid/sync-transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          });

          onSuccess?.();
        }
      } catch (error) {
        console.error('Error exchanging token:', error);
      } finally {
        setLoading(false);
      }
    },
    [userId, onSuccess]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onSuccessCallback,
  });

  if (variant === 'card') {
    return (
      <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-lg p-8 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-2 font-space-grotesk">
          Connect your bank
        </h3>
        <p className="text-sm text-slate-300 mb-6">
          Securely link your bank account to automatically track income and expenses. Powered by Plaid.
        </p>
        <button
          onClick={() => open()}
          disabled={!ready || loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Connect Bank Account
            </>
          )}
        </button>
        <p className="text-xs text-slate-400 mt-4">
          🔒 Bank-level security. Your credentials are never stored on our servers.
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={() => open()}
      disabled={!ready || loading}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          Connect Bank
        </>
      )}
    </button>
  );
}
