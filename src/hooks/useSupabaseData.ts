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

export function useParsedIncome(userId: string | null) {
  const [data, setData] = useState<ParsedIncome | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchParsedIncome = async () => {
      try {
        setLoading(true);
        console.log('Fetching parsed income for user:', userId);

        const { data: parsedIncome, error: fetchError } = await supabase
          .from('portable_parsed_income')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        console.log('Parsed income result:', { parsedIncome, fetchError });

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // No rows found - not an error, just no data yet
            console.log('No parsed income found for user');
            setData(null);
            setError(null);
          } else {
            console.error('Parsed income fetch error:', fetchError);
            throw fetchError;
          }
        } else {
          setData(parsedIncome);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching parsed income:', err);
        setError(err as Error);
      } finally {
        console.log('Parsed income loading complete');
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
            setData(payload.new as ParsedIncome);
          } else if (payload.eventType === 'DELETE') {
            setData(null);
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

export function useTransactions(userId: string | null) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
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

        setData(transactions || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError(err as Error);
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
            setData((prev) => [payload.new as Transaction, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((tx) => (tx.id === payload.new.id ? (payload.new as Transaction) : tx))
            );
          } else if (payload.eventType === 'DELETE') {
            setData((prev) => prev.filter((tx) => tx.id !== payload.old.id));
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

export function usePlaidItems(userId: string | null) {
  const [data, setData] = useState<PlaidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
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

        setData(items || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching Plaid items:', err);
        setError(err as Error);
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
            setData((prev) => [payload.new as PlaidItem, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item) => (item.id === payload.new.id ? (payload.new as PlaidItem) : item))
            );
          } else if (payload.eventType === 'DELETE') {
            setData((prev) => prev.filter((item) => item.id !== payload.old.id));
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
