-- Disable the problematic trigger
DROP TRIGGER IF EXISTS on_auth_user_created_portable ON auth.users;
