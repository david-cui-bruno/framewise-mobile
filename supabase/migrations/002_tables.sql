SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."audit_log" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "patient_id" "uuid",
    "user_id" "uuid",
    "action" "text" NOT NULL,
    "resource_type" "text" NOT NULL,
    "resource_id" "uuid",
    "ip_address" "inet",
    "user_agent" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."audit_log" OWNER TO "postgres";

--
-- Name: avatars; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."avatars" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "image_url" "text" NOT NULL,
    "category" "text",
    "sort_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."avatars" OWNER TO "postgres";

--
-- Name: care_pathways; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."care_pathways" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "slug" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "duration_days" integer DEFAULT 7,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."care_pathways" OWNER TO "postgres";

--
-- Name: daily_task_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."daily_task_templates" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "care_pathway_id" "uuid" NOT NULL,
    "day_offset" integer NOT NULL,
    "task_type" "text" NOT NULL,
    "target_video_id" "uuid",
    "target_quiz_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "sort_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    CONSTRAINT "daily_task_templates_task_type_check" CHECK (("task_type" = ANY (ARRAY['watch_video'::"text", 'answer_quiz'::"text"])))
);


ALTER TABLE "public"."daily_task_templates" OWNER TO "postgres";

--
-- Name: discharge_scans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."discharge_scans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "physician_id" "uuid" NOT NULL,
    "image_url" "text" NOT NULL,
    "extracted_data" "jsonb",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "discharge_scans_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'processing'::"text", 'review'::"text", 'confirmed'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."discharge_scans" OWNER TO "postgres";

--
-- Name: patient_care_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."patient_care_assignments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "care_pathway_id" "uuid" NOT NULL,
    "assigned_at" timestamp with time zone DEFAULT "now"(),
    "start_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "is_active" boolean DEFAULT true,
    "physician_id" "uuid"
);


ALTER TABLE "public"."patient_care_assignments" OWNER TO "postgres";

--
-- Name: patient_daily_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."patient_daily_tasks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "template_id" "uuid" NOT NULL,
    "scheduled_date" "date" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "patient_daily_tasks_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'in_progress'::"text", 'completed'::"text", 'skipped'::"text"])))
);


ALTER TABLE "public"."patient_daily_tasks" OWNER TO "postgres";

--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."patients" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "display_name" "text",
    "avatar_id" "text" DEFAULT 'avatar_01'::"text" NOT NULL,
    "onboarding_completed" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "discharge_date" "date",
    "medications" "jsonb" DEFAULT '[]'::"jsonb",
    "restrictions" "text",
    "follow_up_date" "date"
);


ALTER TABLE "public"."patients" OWNER TO "postgres";

--
-- Name: physician_notification_prefs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."physician_notification_prefs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "physician_id" "uuid" NOT NULL,
    "onboarding_complete" boolean DEFAULT true,
    "all_videos_complete" boolean DEFAULT true,
    "qa_concern" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."physician_notification_prefs" OWNER TO "postgres";

--
-- Name: physicians; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."physicians" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "specialty" "text",
    "practice_name" "text",
    "practice_address" "text",
    "practice_phone" "text",
    "default_pathway_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."physicians" OWNER TO "postgres";

--
-- Name: qa_content; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."qa_content" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "care_pathway_id" "uuid",
    "question_text" "text" NOT NULL,
    "answer_text" "text" NOT NULL,
    "category" "text",
    "keywords" "text"[],
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "embedding" "public"."vector"(1536)
);


ALTER TABLE "public"."qa_content" OWNER TO "postgres";

--
-- Name: qa_search_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."qa_search_log" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "search_query" "text" NOT NULL,
    "results_returned" integer DEFAULT 0,
    "selected_result_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."qa_search_log" OWNER TO "postgres";

--
-- Name: quiz_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."quiz_options" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "question_id" "uuid" NOT NULL,
    "option_text" "text" NOT NULL,
    "is_correct" boolean DEFAULT false,
    "option_order" integer DEFAULT 0,
    "feedback_text" "text"
);


ALTER TABLE "public"."quiz_options" OWNER TO "postgres";

--
-- Name: quiz_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."quiz_questions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "video_module_id" "uuid" NOT NULL,
    "question_text" "text" NOT NULL,
    "question_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."quiz_questions" OWNER TO "postgres";

--
-- Name: quiz_responses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."quiz_responses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "question_id" "uuid" NOT NULL,
    "selected_option_id" "uuid" NOT NULL,
    "is_correct" boolean NOT NULL,
    "attempt_number" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."quiz_responses" OWNER TO "postgres";

--
-- Name: satisfaction_feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."satisfaction_feedback" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "context_type" "text" NOT NULL,
    "context_id" "uuid",
    "rating_type" "text" NOT NULL,
    "rating_value" integer NOT NULL,
    "reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "satisfaction_feedback_context_type_check" CHECK (("context_type" = ANY (ARRAY['video_module'::"text", 'quiz'::"text", 'daily_summary'::"text", 'qa_response'::"text"]))),
    CONSTRAINT "satisfaction_feedback_rating_type_check" CHECK (("rating_type" = ANY (ARRAY['thumbs'::"text", 'scale_5'::"text"])))
);


ALTER TABLE "public"."satisfaction_feedback" OWNER TO "postgres";

--
-- Name: video_modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."video_modules" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "care_pathway_id" "uuid" NOT NULL,
    "module_type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "video_url" "text" NOT NULL,
    "thumbnail_url" "text",
    "duration_seconds" integer NOT NULL,
    "sort_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "transcript" "text",
    CONSTRAINT "video_modules_module_type_check" CHECK (("module_type" = ANY (ARRAY['what_to_do'::"text", 'what_to_watch_for'::"text", 'what_if_wrong'::"text"])))
);


ALTER TABLE "public"."video_modules" OWNER TO "postgres";

--
-- Name: video_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."video_progress" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "video_module_id" "uuid" NOT NULL,
    "watch_count" integer DEFAULT 0,
    "total_watch_time_seconds" integer DEFAULT 0,
    "furthest_position_seconds" integer DEFAULT 0,
    "is_completed" boolean DEFAULT false,
    "completed_at" timestamp with time zone,
    "first_watched_at" timestamp with time zone,
    "last_watched_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."video_progress" OWNER TO "postgres";

--
-- Name: video_telemetry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS "public"."video_telemetry" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "video_module_id" "uuid" NOT NULL,
    "session_id" "uuid" NOT NULL,
    "event_type" "text" NOT NULL,
    "event_data" "jsonb" DEFAULT '{}'::"jsonb",
    "video_timestamp_seconds" numeric(10,2),
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "video_telemetry_event_type_check" CHECK (("event_type" = ANY (ARRAY['play'::"text", 'pause'::"text", 'seek_forward'::"text", 'seek_backward'::"text", 'complete'::"text", 'quarter_reached'::"text", 'rewatch'::"text", 'skip'::"text", 'buffer'::"text", 'error'::"text"])))
);


ALTER TABLE "public"."video_telemetry" OWNER TO "postgres";
