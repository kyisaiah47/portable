-- ============================================================================
-- Portable — fresh init migration
-- ============================================================================
-- All application tables are prefixed with portable_ because this Supabase
-- project is SHARED with another live app (playbooks, items, comments,
-- playbook_likes, subscriptions, usage). This migration only creates
-- portable_* objects and never touches the shared tables.
--
-- NOTE: intentionally NOT applied automatically. Review and run via the
-- Supabase SQL editor / CLI when ready.
-- ============================================================================

-- Enable UUID extension (safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

-- portable_users (extends auth.users)
CREATE TABLE IF NOT EXISTS public.portable_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.portable_users(id),
  total_referrals INTEGER DEFAULT 0,
  referral_earnings NUMERIC(10, 2) DEFAULT 0.00,
  email_reports_enabled BOOLEAN DEFAULT true,
  email_preferences JSONB DEFAULT '{"weeklyReports": true, "taxReminders": true}'::jsonb,
  savings_goal NUMERIC(10, 2) DEFAULT 5000.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- portable_plaid_items (bank connections)
CREATE TABLE IF NOT EXISTS public.portable_plaid_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.portable_users(id) ON DELETE CASCADE,
  plaid_item_id TEXT UNIQUE NOT NULL,
  plaid_access_token TEXT NOT NULL,
  institution_name TEXT,
  cursor TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- portable_transactions (from CSV uploads and, later, Plaid)
-- classification holds the hybrid regex/Claude result:
--   { kind, source, confidence, platform?, incomeCategory?,
--     expenseCategory?, subcategory?, deductible?, deductionRate?, rationale? }
CREATE TABLE IF NOT EXISTS public.portable_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.portable_users(id) ON DELETE CASCADE,
  plaid_transaction_id TEXT UNIQUE NOT NULL,
  plaid_item_id UUID REFERENCES public.portable_plaid_items(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  name TEXT NOT NULL,
  merchant_name TEXT,
  category TEXT[],
  pending BOOLEAN DEFAULT FALSE,
  classification JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- portable_parsed_income (aggregated income snapshot per user)
-- user_id is UNIQUE because the app upserts with onConflict: 'user_id'
CREATE TABLE IF NOT EXISTS public.portable_parsed_income (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.portable_users(id) ON DELETE CASCADE,
  total_income NUMERIC(12, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  by_platform JSONB NOT NULL,
  stability JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- portable_referrals
CREATE TABLE IF NOT EXISTS public.portable_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES public.portable_users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES public.portable_users(id) ON DELETE SET NULL,
  referral_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
  reward_amount NUMERIC(10, 2) DEFAULT 10.00,
  referee_email TEXT,
  completed_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Indexes
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_portable_plaid_items_user_id ON public.portable_plaid_items(user_id);
CREATE INDEX IF NOT EXISTS idx_portable_transactions_user_id ON public.portable_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_portable_transactions_date ON public.portable_transactions(date);
CREATE INDEX IF NOT EXISTS idx_portable_transactions_plaid_item_id ON public.portable_transactions(plaid_item_id);
CREATE INDEX IF NOT EXISTS idx_portable_parsed_income_user_id ON public.portable_parsed_income(user_id);
CREATE INDEX IF NOT EXISTS idx_portable_referrals_referrer ON public.portable_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_portable_referrals_referee ON public.portable_referrals(referee_id);
CREATE INDEX IF NOT EXISTS idx_portable_referrals_code ON public.portable_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_portable_referrals_status ON public.portable_referrals(status);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------

ALTER TABLE public.portable_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portable_plaid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portable_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portable_parsed_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portable_referrals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "portable_users_select_own" ON public.portable_users;
DROP POLICY IF EXISTS "portable_users_insert_own" ON public.portable_users;
DROP POLICY IF EXISTS "portable_users_update_own" ON public.portable_users;
DROP POLICY IF EXISTS "portable_users_delete_own" ON public.portable_users;
DROP POLICY IF EXISTS "portable_plaid_items_select_own" ON public.portable_plaid_items;
DROP POLICY IF EXISTS "portable_plaid_items_insert_own" ON public.portable_plaid_items;
DROP POLICY IF EXISTS "portable_plaid_items_update_own" ON public.portable_plaid_items;
DROP POLICY IF EXISTS "portable_plaid_items_delete_own" ON public.portable_plaid_items;
DROP POLICY IF EXISTS "portable_transactions_select_own" ON public.portable_transactions;
DROP POLICY IF EXISTS "portable_transactions_insert_own" ON public.portable_transactions;
DROP POLICY IF EXISTS "portable_transactions_update_own" ON public.portable_transactions;
DROP POLICY IF EXISTS "portable_transactions_delete_own" ON public.portable_transactions;
DROP POLICY IF EXISTS "portable_parsed_income_select_own" ON public.portable_parsed_income;
DROP POLICY IF EXISTS "portable_parsed_income_insert_own" ON public.portable_parsed_income;
DROP POLICY IF EXISTS "portable_parsed_income_update_own" ON public.portable_parsed_income;
DROP POLICY IF EXISTS "portable_parsed_income_delete_own" ON public.portable_parsed_income;
DROP POLICY IF EXISTS "portable_referrals_select_own" ON public.portable_referrals;
DROP POLICY IF EXISTS "portable_referrals_insert_own" ON public.portable_referrals;
DROP POLICY IF EXISTS "portable_referrals_update_system" ON public.portable_referrals;

-- Users: full self-service on own row
CREATE POLICY "portable_users_select_own" ON public.portable_users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "portable_users_insert_own" ON public.portable_users
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "portable_users_update_own" ON public.portable_users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "portable_users_delete_own" ON public.portable_users
  FOR DELETE USING (auth.uid() = id);

-- Plaid items
CREATE POLICY "portable_plaid_items_select_own" ON public.portable_plaid_items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "portable_plaid_items_insert_own" ON public.portable_plaid_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "portable_plaid_items_update_own" ON public.portable_plaid_items
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "portable_plaid_items_delete_own" ON public.portable_plaid_items
  FOR DELETE USING (auth.uid() = user_id);

-- Transactions: UPDATE/DELETE are required by CSV re-upload (upsert) and
-- account deletion flows
CREATE POLICY "portable_transactions_select_own" ON public.portable_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "portable_transactions_insert_own" ON public.portable_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "portable_transactions_update_own" ON public.portable_transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "portable_transactions_delete_own" ON public.portable_transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Parsed income
CREATE POLICY "portable_parsed_income_select_own" ON public.portable_parsed_income
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "portable_parsed_income_insert_own" ON public.portable_parsed_income
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "portable_parsed_income_update_own" ON public.portable_parsed_income
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "portable_parsed_income_delete_own" ON public.portable_parsed_income
  FOR DELETE USING (auth.uid() = user_id);

-- Referrals
CREATE POLICY "portable_referrals_select_own" ON public.portable_referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);
CREATE POLICY "portable_referrals_insert_own" ON public.portable_referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);
CREATE POLICY "portable_referrals_update_system" ON public.portable_referrals
  FOR UPDATE USING (true);

-- ----------------------------------------------------------------------------
-- Functions & triggers (all prefixed to avoid collisions with the shared app)
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.portable_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_portable_users_updated_at ON public.portable_users;
CREATE TRIGGER update_portable_users_updated_at
  BEFORE UPDATE ON public.portable_users
  FOR EACH ROW
  EXECUTE FUNCTION public.portable_update_updated_at_column();

DROP TRIGGER IF EXISTS update_portable_plaid_items_updated_at ON public.portable_plaid_items;
CREATE TRIGGER update_portable_plaid_items_updated_at
  BEFORE UPDATE ON public.portable_plaid_items
  FOR EACH ROW
  EXECUTE FUNCTION public.portable_update_updated_at_column();

DROP TRIGGER IF EXISTS update_portable_parsed_income_updated_at ON public.portable_parsed_income;
CREATE TRIGGER update_portable_parsed_income_updated_at
  BEFORE UPDATE ON public.portable_parsed_income
  FOR EACH ROW
  EXECUTE FUNCTION public.portable_update_updated_at_column();

-- Create a portable_users profile when a new auth user signs up.
-- SECURITY DEFINER so it can insert despite RLS. ON CONFLICT keeps it safe
-- for auth users that belong to the other app sharing this project.
CREATE OR REPLACE FUNCTION public.portable_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.portable_users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_portable ON auth.users;
CREATE TRIGGER on_auth_user_created_portable
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.portable_handle_new_user();

-- Referral code generation
CREATE OR REPLACE FUNCTION public.portable_generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.portable_assign_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  IF NEW.referral_code IS NULL THEN
    LOOP
      new_code := public.portable_generate_referral_code();
      SELECT EXISTS(SELECT 1 FROM public.portable_users WHERE referral_code = new_code) INTO code_exists;
      EXIT WHEN NOT code_exists;
    END LOOP;
    NEW.referral_code := new_code;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS assign_portable_user_referral_code ON public.portable_users;
CREATE TRIGGER assign_portable_user_referral_code
  BEFORE INSERT ON public.portable_users
  FOR EACH ROW
  EXECUTE FUNCTION public.portable_assign_referral_code();
