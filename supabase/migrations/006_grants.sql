--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


--
-- Name: FUNCTION "get_physician_id"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_physician_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_physician_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_physician_id"() TO "service_role";


--
-- Name: FUNCTION "match_qa_content"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_care_pathway_id" "uuid"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."match_qa_content"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_care_pathway_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."match_qa_content"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_care_pathway_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."match_qa_content"("query_embedding" "public"."vector", "match_threshold" double precision, "match_count" integer, "filter_care_pathway_id" "uuid") TO "service_role";


--
-- Name: FUNCTION "reset_demo_patient"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."reset_demo_patient"() TO "anon";
GRANT ALL ON FUNCTION "public"."reset_demo_patient"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."reset_demo_patient"() TO "service_role";


--
-- Name: FUNCTION "update_updated_at_column"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


--
-- Name: TABLE "audit_log"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."audit_log" TO "anon";
GRANT ALL ON TABLE "public"."audit_log" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_log" TO "service_role";


--
-- Name: TABLE "avatars"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."avatars" TO "anon";
GRANT ALL ON TABLE "public"."avatars" TO "authenticated";
GRANT ALL ON TABLE "public"."avatars" TO "service_role";


--
-- Name: TABLE "care_pathways"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."care_pathways" TO "anon";
GRANT ALL ON TABLE "public"."care_pathways" TO "authenticated";
GRANT ALL ON TABLE "public"."care_pathways" TO "service_role";


--
-- Name: TABLE "daily_task_templates"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."daily_task_templates" TO "anon";
GRANT ALL ON TABLE "public"."daily_task_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."daily_task_templates" TO "service_role";


--
-- Name: TABLE "discharge_scans"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."discharge_scans" TO "anon";
GRANT ALL ON TABLE "public"."discharge_scans" TO "authenticated";
GRANT ALL ON TABLE "public"."discharge_scans" TO "service_role";


--
-- Name: TABLE "patient_care_assignments"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."patient_care_assignments" TO "anon";
GRANT ALL ON TABLE "public"."patient_care_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."patient_care_assignments" TO "service_role";


--
-- Name: TABLE "patient_daily_tasks"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."patient_daily_tasks" TO "anon";
GRANT ALL ON TABLE "public"."patient_daily_tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."patient_daily_tasks" TO "service_role";


--
-- Name: TABLE "patients"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."patients" TO "anon";
GRANT ALL ON TABLE "public"."patients" TO "authenticated";
GRANT ALL ON TABLE "public"."patients" TO "service_role";


--
-- Name: TABLE "physician_notification_prefs"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."physician_notification_prefs" TO "anon";
GRANT ALL ON TABLE "public"."physician_notification_prefs" TO "authenticated";
GRANT ALL ON TABLE "public"."physician_notification_prefs" TO "service_role";


--
-- Name: TABLE "physicians"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."physicians" TO "anon";
GRANT ALL ON TABLE "public"."physicians" TO "authenticated";
GRANT ALL ON TABLE "public"."physicians" TO "service_role";


--
-- Name: TABLE "qa_content"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."qa_content" TO "anon";
GRANT ALL ON TABLE "public"."qa_content" TO "authenticated";
GRANT ALL ON TABLE "public"."qa_content" TO "service_role";


--
-- Name: TABLE "qa_search_log"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."qa_search_log" TO "anon";
GRANT ALL ON TABLE "public"."qa_search_log" TO "authenticated";
GRANT ALL ON TABLE "public"."qa_search_log" TO "service_role";


--
-- Name: TABLE "quiz_options"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."quiz_options" TO "anon";
GRANT ALL ON TABLE "public"."quiz_options" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz_options" TO "service_role";


--
-- Name: TABLE "quiz_questions"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."quiz_questions" TO "anon";
GRANT ALL ON TABLE "public"."quiz_questions" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz_questions" TO "service_role";


--
-- Name: TABLE "quiz_responses"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."quiz_responses" TO "anon";
GRANT ALL ON TABLE "public"."quiz_responses" TO "authenticated";
GRANT ALL ON TABLE "public"."quiz_responses" TO "service_role";


--
-- Name: TABLE "satisfaction_feedback"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."satisfaction_feedback" TO "anon";
GRANT ALL ON TABLE "public"."satisfaction_feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."satisfaction_feedback" TO "service_role";


--
-- Name: TABLE "video_modules"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."video_modules" TO "anon";
GRANT ALL ON TABLE "public"."video_modules" TO "authenticated";
GRANT ALL ON TABLE "public"."video_modules" TO "service_role";


--
-- Name: TABLE "video_progress"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."video_progress" TO "anon";
GRANT ALL ON TABLE "public"."video_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."video_progress" TO "service_role";


--
-- Name: TABLE "video_telemetry"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."video_telemetry" TO "anon";
GRANT ALL ON TABLE "public"."video_telemetry" TO "authenticated";
GRANT ALL ON TABLE "public"."video_telemetry" TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";


--
-- PostgreSQL database dump complete
--
