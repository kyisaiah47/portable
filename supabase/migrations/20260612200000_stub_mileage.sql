-- Mileage log — biggest gig deduction (IRS standard mileage rate).
-- Shared Supabase project: touches ONLY stub_mileage.

CREATE TABLE IF NOT EXISTS public.stub_mileage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  miles NUMERIC(7,1) NOT NULL CHECK (miles > 0),
  purpose TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS stub_mileage_user_date_idx
  ON public.stub_mileage (user_id, date DESC);

ALTER TABLE public.stub_mileage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "stub_mileage_select_own" ON public.stub_mileage;
CREATE POLICY "stub_mileage_select_own" ON public.stub_mileage
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "stub_mileage_insert_own" ON public.stub_mileage;
CREATE POLICY "stub_mileage_insert_own" ON public.stub_mileage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "stub_mileage_delete_own" ON public.stub_mileage;
CREATE POLICY "stub_mileage_delete_own" ON public.stub_mileage
  FOR DELETE USING (auth.uid() = user_id);
