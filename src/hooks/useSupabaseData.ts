'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ParsedIncome {
  id: string;
  user_id: string;
  total_income: number;
  start_date: string;
  end_date: string;
  by_platform: Record<string, number>; // Changed from platforms
  stability: {
    score: number;
    rating: string;
    weeklyAverage: number;
    variability: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  plaid_transaction_id: string;
  plaid_item_id: string;
  account_id: string;
  date: string;
  amount: number;
  name: string;
  merchant_name: string | null;
  category: string[] | null;
  pending: boolean;
  created_at: string;
}

export interface PlaidItem {
  id: string;
  user_id: string;
  plaid_item_id: string;
  plaid_access_token: string;
  institution_name: string | null;
  cursor: string | null;
  created_at: string;
  updated_at: string;
}

// Helper functions for localStorage cache
function getCachedData<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    // Check if cache is less than 5 minutes old
    if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
      return parsed.data;
    }
    // Cache expired, remove it
    localStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
}

function setCachedData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now(),
    }));
  } catch {
    // localStorage full or unavailable, ignore
  }
}

function clearCachedData(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function useParsedIncome(userId: string | null) {
  const cacheKey = `parsed_income_${userId}`;

  const [data, setData] = useState<ParsedIncome | null>(() => {
    // Initialize with cached data if available
    return userId ? getCachedData<ParsedIncome>(cacheKey) : null;
  });
  const [loading, setLoading] = useState(() => {
    // Only load if we don't have cached data
    return userId ? !getCachedData<ParsedIncome>(cacheKey) : false;
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // If we have cached data, use it immediately
    const cached = getCachedData<ParsedIncome>(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    const fetchParsedIncome = async () => {
      try {
        setLoading(true);

        const { data: parsedIncome, error: fetchError } = await supabase
          .from('portable_parsed_income')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // No rows found - not an error, just no data yet
            setData(null);
            setCachedData(cacheKey, null);
            setError(null);
          } else {
            throw fetchError;
          }
        } else {
          setData(parsedIncome);
          setCachedData(cacheKey, parsedIncome);
          setError(null);
        }
      } catch (err) {
        setError(err as Error);
        setData(null);
        setCachedData(cacheKey, null);
      } finally {
        setLoading(false);
      }
    };

    fetchParsedIncome();

    // Set up real-time subscription
    const channel = supabase
      .channel('parsed_income_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portable_parsed_income',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newData = payload.new as ParsedIncome;
            setData(newData);
            setCachedData(cacheKey, newData);
          } else if (payload.eventType === 'DELETE') {
            setData(null);
            clearCachedData(cacheKey);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, cacheKey]);

  return { data, loading, error };
}

// Function to clear cache when user uploads new CSV
export function clearParsedIncomeCache(userId: string) {
  clearCachedData(`parsed_income_${userId}`);
}

export function useTransactions(userId: string | null) {
  const cacheKey = `transactions_${userId}`;

  const [data, setData] = useState<Transaction[]>(() => {
    // Initialize with cached data if available
    return userId ? getCachedData<Transaction[]>(cacheKey) || [] : [];
  });
  const [loading, setLoading] = useState(() => {
    // Only load if we don't have cached data
    return userId ? !getCachedData<Transaction[]>(cacheKey) : false;
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // If we have cached data, use it immediately
    const cached = getCachedData<Transaction[]>(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const { data: transactions, error: fetchError } = await supabase
          .from('portable_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false });

        if (fetchError) throw fetchError;

        const txData = transactions || [];
        setData(txData);
        setCachedData(cacheKey, txData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setData([]);
        setCachedData(cacheKey, []);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Set up real-time subscription
    const channel = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portable_transactions',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prevData) => {
              const newData = [payload.new as Transaction, ...prevData];
              setCachedData(cacheKey, newData);
              return newData;
            });
          } else if (payload.eventType === 'UPDATE') {
            setData((prevData) => {
              const newData = prevData.map((tx) => (tx.id === payload.new.id ? (payload.new as Transaction) : tx));
              setCachedData(cacheKey, newData);
              return newData;
            });
          } else if (payload.eventType === 'DELETE') {
            setData((prevData) => {
              const newData = prevData.filter((tx) => tx.id !== payload.old.id);
              setCachedData(cacheKey, newData);
              return newData;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, cacheKey]);

  return { data, loading, error };
}

// Function to clear cache when user uploads new CSV
export function clearTransactionsCache(userId: string) {
  clearCachedData(`transactions_${userId}`);
}

export function usePlaidItems(userId: string | null) {
  const cacheKey = `plaid_items_${userId}`;

  const [data, setData] = useState<PlaidItem[]>(() => {
    // Initialize with cached data if available
    return userId ? getCachedData<PlaidItem[]>(cacheKey) || [] : [];
  });
  const [loading, setLoading] = useState(() => {
    // Only load if we don't have cached data
    return userId ? !getCachedData<PlaidItem[]>(cacheKey) : false;
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // If we have cached data, use it immediately
    const cached = getCachedData<PlaidItem[]>(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    const fetchPlaidItems = async () => {
      try {
        setLoading(true);
        const { data: items, error: fetchError } = await supabase
          .from('portable_plaid_items')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const itemsData = items || [];
        setData(itemsData);
        setCachedData(cacheKey, itemsData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setData([]);
        setCachedData(cacheKey, []);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaidItems();

    // Set up real-time subscription
    const channel = supabase
      .channel('plaid_items_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portable_plaid_items',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prevData) => {
              const newData = [payload.new as PlaidItem, ...prevData];
              setCachedData(cacheKey, newData);
              return newData;
            });
          } else if (payload.eventType === 'UPDATE') {
            setData((prevData) => {
              const newData = prevData.map((item) => (item.id === payload.new.id ? (payload.new as PlaidItem) : item));
              setCachedData(cacheKey, newData);
              return newData;
            });
          } else if (payload.eventType === 'DELETE') {
            setData((prevData) => {
              const newData = prevData.filter((item) => item.id !== payload.old.id);
              setCachedData(cacheKey, newData);
              return newData;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, cacheKey]);

  return { data, loading, error };
}

// Function to clear cache when user uploads new CSV
export function clearPlaidItemsCache(userId: string) {
  clearCachedData(`plaid_items_${userId}`);
}

// Function to clear all caches for a user (use when uploading new CSV)
export function clearAllCaches(userId: string) {
  clearParsedIncomeCache(userId);
  clearTransactionsCache(userId);
  clearPlaidItemsCache(userId);
}
