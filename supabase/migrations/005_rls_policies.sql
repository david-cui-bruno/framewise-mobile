--
-- Name: audit_log; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."audit_log" ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_log audit_log_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "audit_log_insert_own" ON "public"."audit_log" FOR INSERT WITH CHECK ((("auth"."uid"() = "patient_id") OR ("auth"."uid"() = "user_id")));


--
-- Name: avatars; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."avatars" ENABLE ROW LEVEL SECURITY;

--
-- Name: avatars avatars_select_active; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "avatars_select_active" ON "public"."avatars" FOR SELECT USING (("is_active" = true));


--
-- Name: patient_care_assignments care_assignments_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "care_assignments_insert_own" ON "public"."patient_care_assignments" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));


--
-- Name: patient_care_assignments care_assignments_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "care_assignments_select_own" ON "public"."patient_care_assignments" FOR SELECT USING (("auth"."uid"() = "patient_id"));


--
-- Name: care_pathways; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."care_pathways" ENABLE ROW LEVEL SECURITY;

--
-- Name: care_pathways care_pathways_select_active; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "care_pathways_select_active" ON "public"."care_pathways" FOR SELECT USING (("is_active" = true));


--
-- Name: daily_task_templates; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."daily_task_templates" ENABLE ROW LEVEL SECURITY;

--
-- Name: patient_daily_tasks daily_tasks_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "daily_tasks_insert_own" ON "public"."patient_daily_tasks" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));


--
-- Name: patient_daily_tasks daily_tasks_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "daily_tasks_select_own" ON "public"."patient_daily_tasks" FOR SELECT USING (("auth"."uid"() = "patient_id"));


--
-- Name: patient_daily_tasks daily_tasks_update_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "daily_tasks_update_own" ON "public"."patient_daily_tasks" FOR UPDATE USING (("auth"."uid"() = "patient_id"));


--
-- Name: discharge_scans; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."discharge_scans" ENABLE ROW LEVEL SECURITY;

--
-- Name: discharge_scans discharge_scans_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "discharge_scans_insert_own" ON "public"."discharge_scans" FOR INSERT WITH CHECK (("physician_id" = "public"."get_physician_id"()));


--
-- Name: discharge_scans discharge_scans_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "discharge_scans_select_own" ON "public"."discharge_scans" FOR SELECT USING (("physician_id" = "public"."get_physician_id"()));


--
-- Name: discharge_scans discharge_scans_update_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "discharge_scans_update_own" ON "public"."discharge_scans" FOR UPDATE USING (("physician_id" = "public"."get_physician_id"()));


--
-- Name: satisfaction_feedback feedback_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "feedback_insert_own" ON "public"."satisfaction_feedback" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));


--
-- Name: satisfaction_feedback feedback_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "feedback_select_own" ON "public"."satisfaction_feedback" FOR SELECT USING (("auth"."uid"() = "patient_id"));


--
-- Name: physician_notification_prefs notif_prefs_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "notif_prefs_insert_own" ON "public"."physician_notification_prefs" FOR INSERT WITH CHECK (("physician_id" = "public"."get_physician_id"()));


--
-- Name: physician_notification_prefs notif_prefs_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "notif_prefs_select_own" ON "public"."physician_notification_prefs" FOR SELECT USING (("physician_id" = "public"."get_physician_id"()));


--
-- Name: physician_notification_prefs notif_prefs_update_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "notif_prefs_update_own" ON "public"."physician_notification_prefs" FOR UPDATE USING (("physician_id" = "public"."get_physician_id"()));


--
-- Name: patient_care_assignments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."patient_care_assignments" ENABLE ROW LEVEL SECURITY;

--
-- Name: patient_daily_tasks; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."patient_daily_tasks" ENABLE ROW LEVEL SECURITY;

--
-- Name: patients; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."patients" ENABLE ROW LEVEL SECURITY;

--
-- Name: patients patients_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "patients_insert_own" ON "public"."patients" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));


--
-- Name: patients patients_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "patients_select_own" ON "public"."patients" FOR SELECT USING (("auth"."uid"() = "id"));


--
-- Name: patients patients_update_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "patients_update_own" ON "public"."patients" FOR UPDATE USING (("auth"."uid"() = "id"));


--
-- Name: physician_notification_prefs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."physician_notification_prefs" ENABLE ROW LEVEL SECURITY;

--
-- Name: physicians; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."physicians" ENABLE ROW LEVEL SECURITY;

--
-- Name: patient_care_assignments physicians_insert_assignments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "physicians_insert_assignments" ON "public"."patient_care_assignments" FOR INSERT WITH CHECK (("physician_id" = "public"."get_physician_id"()));


--
-- Name: physicians physicians_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "physicians_select_own" ON "public"."physicians" FOR SELECT USING (("user_id" = "auth"."uid"()));


--
-- Name: physicians physicians_update_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "physicians_update_own" ON "public"."physicians" FOR UPDATE USING (("user_id" = "auth"."uid"()));


--
-- Name: patients physicians_view_assigned_patients; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "physicians_view_assigned_patients" ON "public"."patients" FOR SELECT USING (("id" IN ( SELECT "patient_care_assignments"."patient_id"
   FROM "public"."patient_care_assignments"
  WHERE ("patient_care_assignments"."physician_id" = "public"."get_physician_id"()))));


--
-- Name: patient_care_assignments physicians_view_own_assignments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "physicians_view_own_assignments" ON "public"."patient_care_assignments" FOR SELECT USING (("physician_id" = "public"."get_physician_id"()));


--
-- Name: qa_search_log physicians_view_qa_search_log; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "physicians_view_qa_search_log" ON "public"."qa_search_log" FOR SELECT USING (("patient_id" IN ( SELECT "patient_care_assignments"."patient_id"
   FROM "public"."patient_care_assignments"
  WHERE ("patient_care_assignments"."physician_id" = "public"."get_physician_id"()))));


--
-- Name: quiz_responses physicians_view_quiz_responses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "physicians_view_quiz_responses" ON "public"."quiz_responses" FOR SELECT USING (("patient_id" IN ( SELECT "patient_care_assignments"."patient_id"
   FROM "public"."patient_care_assignments"
  WHERE ("patient_care_assignments"."physician_id" = "public"."get_physician_id"()))));


--
-- Name: satisfaction_feedback physicians_view_satisfaction; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "physicians_view_satisfaction" ON "public"."satisfaction_feedback" FOR SELECT USING (("patient_id" IN ( SELECT "patient_care_assignments"."patient_id"
   FROM "public"."patient_care_assignments"
  WHERE ("patient_care_assignments"."physician_id" = "public"."get_physician_id"()))));


--
-- Name: video_telemetry physicians_view_telemetry; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "physicians_view_telemetry" ON "public"."video_telemetry" FOR SELECT USING (("patient_id" IN ( SELECT "patient_care_assignments"."patient_id"
   FROM "public"."patient_care_assignments"
  WHERE ("patient_care_assignments"."physician_id" = "public"."get_physician_id"()))));


--
-- Name: video_progress physicians_view_video_progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "physicians_view_video_progress" ON "public"."video_progress" FOR SELECT USING (("patient_id" IN ( SELECT "patient_care_assignments"."patient_id"
   FROM "public"."patient_care_assignments"
  WHERE ("patient_care_assignments"."physician_id" = "public"."get_physician_id"()))));


--
-- Name: video_progress progress_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "progress_insert_own" ON "public"."video_progress" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));


--
-- Name: video_progress progress_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "progress_select_own" ON "public"."video_progress" FOR SELECT USING (("auth"."uid"() = "patient_id"));


--
-- Name: video_progress progress_update_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "progress_update_own" ON "public"."video_progress" FOR UPDATE USING (("auth"."uid"() = "patient_id"));


--
-- Name: qa_content; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."qa_content" ENABLE ROW LEVEL SECURITY;

--
-- Name: qa_content qa_content_select_active; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "qa_content_select_active" ON "public"."qa_content" FOR SELECT USING (("is_active" = true));


--
-- Name: qa_search_log qa_search_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "qa_search_insert_own" ON "public"."qa_search_log" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));


--
-- Name: qa_search_log; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."qa_search_log" ENABLE ROW LEVEL SECURITY;

--
-- Name: qa_search_log qa_search_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "qa_search_select_own" ON "public"."qa_search_log" FOR SELECT USING (("auth"."uid"() = "patient_id"));


--
-- Name: quiz_options; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."quiz_options" ENABLE ROW LEVEL SECURITY;

--
-- Name: quiz_options quiz_options_select_all; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "quiz_options_select_all" ON "public"."quiz_options" FOR SELECT USING (true);


--
-- Name: quiz_questions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."quiz_questions" ENABLE ROW LEVEL SECURITY;

--
-- Name: quiz_questions quiz_questions_select_active; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "quiz_questions_select_active" ON "public"."quiz_questions" FOR SELECT USING (("is_active" = true));


--
-- Name: quiz_responses; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."quiz_responses" ENABLE ROW LEVEL SECURITY;

--
-- Name: quiz_responses quiz_responses_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "quiz_responses_insert_own" ON "public"."quiz_responses" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));


--
-- Name: quiz_responses quiz_responses_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "quiz_responses_select_own" ON "public"."quiz_responses" FOR SELECT USING (("auth"."uid"() = "patient_id"));


--
-- Name: satisfaction_feedback; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."satisfaction_feedback" ENABLE ROW LEVEL SECURITY;

--
-- Name: daily_task_templates task_templates_select_active; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "task_templates_select_active" ON "public"."daily_task_templates" FOR SELECT USING (("is_active" = true));


--
-- Name: video_telemetry telemetry_insert_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "telemetry_insert_own" ON "public"."video_telemetry" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));


--
-- Name: video_telemetry telemetry_select_own; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "telemetry_select_own" ON "public"."video_telemetry" FOR SELECT USING (("auth"."uid"() = "patient_id"));


--
-- Name: video_modules; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."video_modules" ENABLE ROW LEVEL SECURITY;

--
-- Name: video_modules video_modules_select_active; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "video_modules_select_active" ON "public"."video_modules" FOR SELECT USING (("is_active" = true));


--
-- Name: video_progress; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."video_progress" ENABLE ROW LEVEL SECURITY;

--
-- Name: video_telemetry; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."video_telemetry" ENABLE ROW LEVEL SECURITY;
