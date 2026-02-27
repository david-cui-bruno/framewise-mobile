-- 005_demo_mode.sql
-- Demo mode: create demo patient row and reset RPC function

-- Insert demo patient (requires demo user to exist in auth.users first)
-- To create the demo user: Supabase Dashboard → Auth → Users → Add User
--   Email: demo@framewise.health
--   Password: FramewiseDemo2026!
--   Auto Confirm: Yes
INSERT INTO public.patients (id, email, avatar_id, onboarding_completed)
SELECT id, email, 'avatar_01', false
FROM auth.users
WHERE email = 'demo@framewise.health'
ON CONFLICT (id) DO NOTHING;

-- Atomic reset function for demo mode
-- Called via supabase.rpc("reset_demo_patient") after signing in
-- Deletes all patient activity and resets profile to fresh onboarding state
CREATE OR REPLACE FUNCTION public.reset_demo_patient()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_patient_id uuid;
  v_demo_email text := 'demo@framewise.health';
BEGIN
  v_patient_id := auth.uid();

  -- Safety: only the demo account can call this
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = v_patient_id AND email = v_demo_email
  ) THEN
    RAISE EXCEPTION 'reset_demo_patient can only be called by the demo account';
  END IF;

  -- Delete all activity (leaf tables first for FK safety)
  DELETE FROM public.audit_log            WHERE patient_id = v_patient_id;
  DELETE FROM public.qa_search_log        WHERE patient_id = v_patient_id;
  DELETE FROM public.video_telemetry      WHERE patient_id = v_patient_id;
  DELETE FROM public.video_progress       WHERE patient_id = v_patient_id;
  DELETE FROM public.satisfaction_feedback WHERE patient_id = v_patient_id;
  DELETE FROM public.quiz_responses       WHERE patient_id = v_patient_id;
  DELETE FROM public.patient_daily_tasks  WHERE patient_id = v_patient_id;
  DELETE FROM public.patient_care_assignments WHERE patient_id = v_patient_id;

  -- Reset profile (don't delete the row)
  UPDATE public.patients
  SET avatar_id = 'avatar_01',
      display_name = NULL,
      onboarding_completed = false
  WHERE id = v_patient_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.reset_demo_patient() TO authenticated;
