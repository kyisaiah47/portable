-- Add INSERT policy so users can create their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.stub_users;
CREATE POLICY "Users can insert own profile"
  ON public.stub_users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
