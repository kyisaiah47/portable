-- Add INSERT policy so users can create their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.portable_users;
CREATE POLICY "Users can insert own profile"
  ON public.portable_users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
