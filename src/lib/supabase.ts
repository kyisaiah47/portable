import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Database types (will be auto-generated later with `supabase gen types typescript`)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          updated_at?: string;
        };
      };
      plaid_items: {
        Row: {
          id: string;
          user_id: string;
          plaid_item_id: string;
          plaid_access_token: string;
          institution_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plaid_item_id: string;
          plaid_access_token: string;
          institution_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          plaid_access_token?: string;
          institution_name?: string | null;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          plaid_transaction_id: string;
          account_id: string;
          date: string;
          amount: number;
          name: string;
          merchant_name: string | null;
          category: string[] | null;
          pending: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plaid_transaction_id: string;
          account_id: string;
          date: string;
          amount: number;
          name: string;
          merchant_name?: string | null;
          category?: string[] | null;
          pending?: boolean;
          created_at?: string;
        };
        Update: {
          amount?: number;
          name?: string;
          merchant_name?: string | null;
          category?: string[] | null;
          pending?: boolean;
        };
      };
      parsed_income: {
        Row: {
          id: string;
          user_id: string;
          total_income: number;
          start_date: string;
          end_date: string;
          by_platform: any; // JSON object
          stability: any; // JSON object
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_income: number;
          start_date: string;
          end_date: string;
          by_platform: any;
          stability: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          total_income?: number;
          start_date?: string;
          end_date?: string;
          by_platform?: any;
          stability?: any;
          updated_at?: string;
        };
      };
    };
  };
};
