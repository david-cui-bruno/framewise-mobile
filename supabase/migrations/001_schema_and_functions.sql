--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.9 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";

--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: get_physician_id(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."get_physician_id"() RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
    SELECT id FROM physicians WHERE user_id = auth.uid()
$$;


ALTER FUNCTION "public"."get_physician_id"() OWNER TO "postgres";

--
-- Name: match_qa_content("public"."vector", double precision, integer, "uuid"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."match_qa_content"("query_embedding" "public"."vector", "match_threshold" double precision DEFAULT 0.7, "match_count" integer DEFAULT 5, "filter_care_pathway_id" "uuid" DEFAULT NULL::"uuid") RETURNS TABLE("id" "uuid", "question_text" "text", "answer_text" "text", "category" "text", "similarity" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    qa.id,
    qa.question_text,
    qa.answer_text,
    qa.category,
    1 - (qa.embedding <=> query_embedding) AS similarity
  FROM public.qa_content qa
  WHERE 1 - (qa.embedding <=> query_embedding) > match_threshold
    AND qa.is_active = true
    AND (filter_care_pathway_id IS NULL OR qa.care_pathway_id = filter_care_pathway_id)
  ORDER BY qa.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;


ALTER FUNCTION "public"."match_qa_content"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_care_pathway_id" "uuid") OWNER TO "postgres";

--
-- Name: reset_demo_patient(); Type: FUNCTION; Schema: public; Owner: postgres
--

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


ALTER FUNCTION "public"."reset_demo_patient"() OWNER TO "postgres";

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";
