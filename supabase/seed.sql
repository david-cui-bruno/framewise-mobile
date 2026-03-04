-- seed.sql

-- Default care pathway so onboarding can assign patients
INSERT INTO public.care_pathways (slug, name, description, is_active)
VALUES ('general-recovery', 'General Recovery', 'Default recovery care pathway', true)
ON CONFLICT DO NOTHING;

-- Demo mode: insert demo patient row (requires demo user to exist in auth.users first)
-- To create the demo user: Supabase Dashboard -> Auth -> Users -> Add User
--   Email: demo@framewise.health
--   Password: FramewiseDemo2026!
--   Auto Confirm: Yes
INSERT INTO public.patients (id, email, avatar_id, onboarding_completed)
SELECT id, email, 'avatar_01', false
FROM auth.users
WHERE email = 'demo@framewise.health'
ON CONFLICT (id) DO NOTHING;
