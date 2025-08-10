-- Script untuk memperbaiki masalah authentication
-- Jalankan di Supabase SQL Editor

-- 1. Drop existing trigger dan function jika ada
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 2. Buat function baru yang lebih robust
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error tapi jangan gagalkan signup
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Buat trigger baru
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4. Enable email confirmations untuk development (opsional)
-- Jika ingin disable email confirmation, jalankan ini:
-- UPDATE auth.config SET email_confirm = false WHERE id = 1;

-- 5. Test data untuk development (opsional)
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
-- VALUES (
--   gen_random_uuid(),
--   'test@example.com',
--   crypt('password123', gen_salt('bf')),
--   NOW(),
--   '{"name": "Test User", "role": "teacher"}'::jsonb
-- );
-
- 6. Disable email confirmation untuk development
-- Jalankan ini jika ingin disable email confirmation
UPDATE auth.config SET email_confirm = false;

-- 7. Atau bisa juga dengan cara ini (pilih salah satu)
-- Di Supabase Dashboard: Authentication > Settings > Email Auth
-- Uncheck "Enable email confirmations"