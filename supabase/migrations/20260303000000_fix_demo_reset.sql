-- Update reset_demo_patient() to clean up tables added in stages 2-5
CREATE OR REPLACE FUNCTION "public"."reset_demo_patient"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
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
  DELETE FROM public.bookmarked_qa          WHERE patient_id = v_patient_id;
  DELETE FROM public.medication_adherence   WHERE patient_id = v_patient_id;
  DELETE FROM public.symptom_check_ins      WHERE patient_id = v_patient_id;
  DELETE FROM public.diary_entries          WHERE patient_id = v_patient_id;
  DELETE FROM public.mood_logs              WHERE patient_id = v_patient_id;
  DELETE FROM public.health_metrics          WHERE patient_id = v_patient_id;
  DELETE FROM public.push_tokens            WHERE patient_id = v_patient_id;
  DELETE FROM public.patient_notification_prefs WHERE patient_id = v_patient_id;
  DELETE FROM public.emergency_contacts     WHERE patient_id = v_patient_id;
  DELETE FROM public.audit_log              WHERE patient_id = v_patient_id;
  DELETE FROM public.qa_search_log          WHERE patient_id = v_patient_id;
  DELETE FROM public.video_telemetry        WHERE patient_id = v_patient_id;
  DELETE FROM public.video_progress         WHERE patient_id = v_patient_id;
  DELETE FROM public.satisfaction_feedback  WHERE patient_id = v_patient_id;
  DELETE FROM public.quiz_responses         WHERE patient_id = v_patient_id;
  DELETE FROM public.patient_daily_tasks    WHERE patient_id = v_patient_id;
  DELETE FROM public.patient_care_assignments WHERE patient_id = v_patient_id;

  -- Reset profile (don't delete the row)
  UPDATE public.patients
  SET avatar_id = 'avatar_01',
      display_name = NULL,
      onboarding_completed = false,
      text_size = 'medium',
      playback_speed = 1.0,
      preferred_language = 'en'
  WHERE id = v_patient_id;
END;
$$;
