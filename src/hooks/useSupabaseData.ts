'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ParsedIncome {
  id: string;
  user_id: string;
  total_income: number;
  start_date: string;
  end_date: string;
  platforms: Record<string, number>;
  stability_score: number;
  stability_rating: string;
  weekly_average: number;
  variability: number;
  income_data: Array<{
    date: string;
    amount: number;
    platform: string;
  }>;
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

// Cache for parsed income data
const parsedIncomeCache = new Map<string, ParsedIncome | null>();

export function useParsedIncome(userId: string | null) {
  const [data, setData] = useState<ParsedIncome | null>(() => {
    // Initialize with cached data if available
    return userId ? parsedIncomeCache.get(userId) || null : null;
  });
  const [loading, setLoading] = useState(() => {
    // Only load if we don't have cached data
    return userId ? !parsedIncomeCache.has(userId) : false;
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // If we have cached data, use it immediately
    if (parsedIncomeCache.has(userId)) {
      setData(parsedIncomeCache.get(userId) || null);
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
            parsedIncomeCache.set(userId, null);
            setError(null);
          } else {
            throw fetchError;
          }
        } else {
          setData(parsedIncome);
          parsedIncomeCache.set(userId, parsedIncome);
          setError(null);
        }
      } catch (err) {
        setError(err as Error);
        setData(null);
        parsedIncomeCache.set(userId, null);
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
            parsedIncomeCache.set(userId, newData);
          } else if (payload.eventType === 'DELETE') {
            setData(null);
            parsedIncomeCache.set(userId, null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { data, loading, error };
}

// Function to clear cache when user uploads new CSV
export function clearParsedIncomeCache(userId: string) {
  parsedIncomeCache.delete(userId);
}

// Cache for transactions data
const transactionsCache = new Map<string, Transaction[]>();

export function useTransactions(userId: string | null) {
  const [data, setData] = useState<Transaction[]>(() => {
    // Initialize with cached data if available
    return userId ? transactionsCache.get(userId) || [] : [];
  });
  const [loading, setLoading] = useState(() => {
    // Only load if we don't have cached data
    return userId ? !transactionsCache.has(userId) : false;
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // If we have cached data, use it immediately
    if (transactionsCache.has(userId)) {
      setData(transactionsCache.get(userId) || []);
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
        transactionsCache.set(userId, txData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setData([]);
        transactionsCache.set(userId, []);
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
            const newData = [payload.new as Transaction, ...data];
            setData(newData);
            transactionsCache.set(userId, newData);
          } else if (payload.eventType === 'UPDATE') {
            const newData = data.map((tx) => (tx.id === payload.new.id ? (payload.new as Transaction) : tx));
            setData(newData);
            transactionsCache.set(userId, newData);
          } else if (payload.eventType === 'DELETE') {
            const newData = data.filter((tx) => tx.id !== payload.old.id);
            setData(newData);
            transactionsCache.set(userId, newData);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { data, loading, error };
}

// Function to clear cache when user uploads new CSV
export function clearTransactionsCache(userId: string) {
  transactionsCache.delete(userId);
}

// Cache for plaid items data
const plaidItemsCache = new Map<string, PlaidItem[]>();

export function usePlaidItems(userId: string | null) {
  const [data, setData] = useState<PlaidItem[]>(() => {
    // Initialize with cached data if available
    return userId ? plaidItemsCache.get(userId) || [] : [];
  });
  const [loading, setLoading] = useState(() => {
    // Only load if we don't have cached data
    return userId ? !plaidItemsCache.has(userId) : false;
  });
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // If we have cached data, use it immediately
    if (plaidItemsCache.has(userId)) {
      setData(plaidItemsCache.get(userId) || []);
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
        plaidItemsCache.set(userId, itemsData);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setData([]);
        plaidItemsCache.set(userId, []);
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
            const newData = [payload.new as PlaidItem, ...data];
            setData(newData);
            plaidItemsCache.set(userId, newData);
          } else if (payload.eventType === 'UPDATE') {
            const newData = data.map((item) => (item.id === payload.new.id ? (payload.new as PlaidItem) : item));
            setData(newData);
            plaidItemsCache.set(userId, newData);
          } else if (payload.eventType === 'DELETE') {
            const newData = data.filter((item) => item.id !== payload.old.id);
            setData(newData);
            plaidItemsCache.set(userId, newData);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { data, loading, error };
}

// Function to clear cache when user uploads new CSV
export function clearPlaidItemsCache(userId: string) {
  plaidItemsCache.delete(userId);
}

// Function to clear all caches for a user (use when uploading new CSV)
export function clearAllCaches(userId: string) {
  clearParsedIncomeCache(userId);
  clearTransactionsCache(userId);
  clearPlaidItemsCache(userId);
}
