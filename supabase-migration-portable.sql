-- Portable App Migration with portable_ prefix
-- Safe to run on existing Supabase projects
-- All tables prefixed with portable_

-- Enable UUID extension (safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- portable_users table
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

-- portable_transactions from Plaid
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- portable_parsed_income data
CREATE TABLE IF NOT EXISTS public.portable_parsed_income (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.portable_users(id) ON DELETE CASCADE,
  total_income NUMERIC(12, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  by_platform JSONB NOT NULL,
  stability JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- portable_referrals table
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_portable_plaid_items_user_id ON public.portable_plaid_items(user_id);
CREATE INDEX IF NOT EXISTS idx_portable_transactions_user_id ON public.portable_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_portable_transactions_date ON public.portable_transactions(date);
CREATE INDEX IF NOT EXISTS idx_portable_transactions_plaid_item_id ON public.portable_transactions(plaid_item_id);
CREATE INDEX IF NOT EXISTS idx_portable_parsed_income_user_id ON public.portable_parsed_income(user_id);
CREATE INDEX IF NOT EXISTS idx_portable_referrals_referrer ON public.portable_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_portable_referrals_referee ON public.portable_referrals(referee_id);
CREATE INDEX IF NOT EXISTS idx_portable_referrals_code ON public.portable_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_portable_referrals_status ON public.portable_referrals(status);

-- Enable RLS
ALTER TABLE public.portable_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portable_plaid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portable_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portable_parsed_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portable_referrals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.portable_users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.portable_users;
DROP POLICY IF EXISTS "Users can view own plaid items" ON public.portable_plaid_items;
DROP POLICY IF EXISTS "Users can insert own plaid items" ON public.portable_plaid_items;
DROP POLICY IF EXISTS "Users can update own plaid items" ON public.portable_plaid_items;
DROP POLICY IF EXISTS "Users can delete own plaid items" ON public.portable_plaid_items;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.portable_transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.portable_transactions;
DROP POLICY IF EXISTS "Users can view own parsed income" ON public.portable_parsed_income;
DROP POLICY IF EXISTS "Users can insert own parsed income" ON public.portable_parsed_income;
DROP POLICY IF EXISTS "Users can update own parsed income" ON public.portable_parsed_income;
DROP POLICY IF EXISTS "Users can view own referrals" ON public.portable_referrals;
DROP POLICY IF EXISTS "Users can create referrals" ON public.portable_referrals;
DROP POLICY IF EXISTS "System can update referrals" ON public.portable_referrals;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.portable_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.portable_users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own plaid items" ON public.portable_plaid_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plaid items" ON public.portable_plaid_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plaid items" ON public.portable_plaid_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plaid items" ON public.portable_plaid_items FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON public.portable_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.portable_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own parsed income" ON public.portable_parsed_income FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own parsed income" ON public.portable_parsed_income FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own parsed income" ON public.portable_parsed_income FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own referrals" ON public.portable_referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);
CREATE POLICY "Users can create referrals" ON public.portable_referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);
CREATE POLICY "System can update referrals" ON public.portable_referrals FOR UPDATE USING (true);

-- Functions
CREATE OR REPLACE FUNCTION portable_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers if they exist
DROP TRIGGER IF EXISTS update_portable_users_updated_at ON public.portable_users;
DROP TRIGGER IF EXISTS update_portable_plaid_items_updated_at ON public.portable_plaid_items;
DROP TRIGGER IF EXISTS update_portable_parsed_income_updated_at ON public.portable_parsed_income;

-- Create triggers
CREATE TRIGGER update_portable_users_updated_at
  BEFORE UPDATE ON public.portable_users
  FOR EACH ROW
  EXECUTE FUNCTION portable_update_updated_at_column();

CREATE TRIGGER update_portable_plaid_items_updated_at
  BEFORE UPDATE ON public.portable_plaid_items
  FOR EACH ROW
  EXECUTE FUNCTION portable_update_updated_at_column();

CREATE TRIGGER update_portable_parsed_income_updated_at
  BEFORE UPDATE ON public.portable_parsed_income
  FOR EACH ROW
  EXECUTE FUNCTION portable_update_updated_at_column();

-- User creation function
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

-- Drop and recreate auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created_portable ON auth.users;
CREATE TRIGGER on_auth_user_created_portable
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.portable_handle_new_user();

-- Referral code generation
CREATE OR REPLACE FUNCTION portable_generate_referral_code()
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

CREATE OR REPLACE FUNCTION portable_assign_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  IF NEW.referral_code IS NULL THEN
    LOOP
      new_code := portable_generate_referral_code();
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
  EXECUTE FUNCTION portable_assign_referral_code();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Portable tables successfully created!';
  RAISE NOTICE 'Tables: portable_users, portable_plaid_items, portable_transactions, portable_parsed_income, portable_referrals';
  RAISE NOTICE 'All RLS policies enabled for security.';
  RAISE NOTICE 'Auto-triggers configured for referral codes and timestamps.';
END $$;
