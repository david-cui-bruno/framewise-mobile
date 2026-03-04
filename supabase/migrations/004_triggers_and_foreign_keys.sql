--
-- Name: discharge_scans update_discharge_scans_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "update_discharge_scans_updated_at" BEFORE UPDATE ON "public"."discharge_scans" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();


--
-- Name: physician_notification_prefs update_notification_prefs_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "update_notification_prefs_updated_at" BEFORE UPDATE ON "public"."physician_notification_prefs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();


--
-- Name: patient_daily_tasks update_patient_daily_tasks_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "update_patient_daily_tasks_updated_at" BEFORE UPDATE ON "public"."patient_daily_tasks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();


--
-- Name: patients update_patients_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "update_patients_updated_at" BEFORE UPDATE ON "public"."patients" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();


--
-- Name: physicians update_physicians_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "update_physicians_updated_at" BEFORE UPDATE ON "public"."physicians" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();


--
-- Name: qa_content update_qa_content_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "update_qa_content_updated_at" BEFORE UPDATE ON "public"."qa_content" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();


--
-- Name: video_modules update_video_modules_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "update_video_modules_updated_at" BEFORE UPDATE ON "public"."video_modules" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();


--
-- Name: video_progress update_video_progress_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE OR REPLACE TRIGGER "update_video_progress_updated_at" BEFORE UPDATE ON "public"."video_progress" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();


--
-- Name: audit_log audit_log_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."audit_log"
    ADD CONSTRAINT "audit_log_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id");


--
-- Name: daily_task_templates daily_task_templates_care_pathway_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."daily_task_templates"
    ADD CONSTRAINT "daily_task_templates_care_pathway_id_fkey" FOREIGN KEY ("care_pathway_id") REFERENCES "public"."care_pathways"("id") ON DELETE CASCADE;


--
-- Name: daily_task_templates daily_task_templates_target_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."daily_task_templates"
    ADD CONSTRAINT "daily_task_templates_target_quiz_id_fkey" FOREIGN KEY ("target_quiz_id") REFERENCES "public"."quiz_questions"("id");


--
-- Name: daily_task_templates daily_task_templates_target_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."daily_task_templates"
    ADD CONSTRAINT "daily_task_templates_target_video_id_fkey" FOREIGN KEY ("target_video_id") REFERENCES "public"."video_modules"("id");


--
-- Name: discharge_scans discharge_scans_physician_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."discharge_scans"
    ADD CONSTRAINT "discharge_scans_physician_id_fkey" FOREIGN KEY ("physician_id") REFERENCES "public"."physicians"("id") ON DELETE CASCADE;


--
-- Name: patient_care_assignments patient_care_assignments_care_pathway_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."patient_care_assignments"
    ADD CONSTRAINT "patient_care_assignments_care_pathway_id_fkey" FOREIGN KEY ("care_pathway_id") REFERENCES "public"."care_pathways"("id");


--
-- Name: patient_care_assignments patient_care_assignments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."patient_care_assignments"
    ADD CONSTRAINT "patient_care_assignments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;


--
-- Name: patient_care_assignments patient_care_assignments_physician_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."patient_care_assignments"
    ADD CONSTRAINT "patient_care_assignments_physician_id_fkey" FOREIGN KEY ("physician_id") REFERENCES "public"."physicians"("id") ON DELETE SET NULL;


--
-- Name: patient_daily_tasks patient_daily_tasks_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."patient_daily_tasks"
    ADD CONSTRAINT "patient_daily_tasks_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;


--
-- Name: patient_daily_tasks patient_daily_tasks_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."patient_daily_tasks"
    ADD CONSTRAINT "patient_daily_tasks_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."daily_task_templates"("id") ON DELETE CASCADE;


--
-- Name: patients patients_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: physician_notification_prefs physician_notification_prefs_physician_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."physician_notification_prefs"
    ADD CONSTRAINT "physician_notification_prefs_physician_id_fkey" FOREIGN KEY ("physician_id") REFERENCES "public"."physicians"("id") ON DELETE CASCADE;


--
-- Name: physicians physicians_default_pathway_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."physicians"
    ADD CONSTRAINT "physicians_default_pathway_id_fkey" FOREIGN KEY ("default_pathway_id") REFERENCES "public"."care_pathways"("id");


--
-- Name: physicians physicians_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."physicians"
    ADD CONSTRAINT "physicians_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: qa_content qa_content_care_pathway_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."qa_content"
    ADD CONSTRAINT "qa_content_care_pathway_id_fkey" FOREIGN KEY ("care_pathway_id") REFERENCES "public"."care_pathways"("id") ON DELETE CASCADE;


--
-- Name: qa_search_log qa_search_log_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."qa_search_log"
    ADD CONSTRAINT "qa_search_log_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;


--
-- Name: qa_search_log qa_search_log_selected_result_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."qa_search_log"
    ADD CONSTRAINT "qa_search_log_selected_result_id_fkey" FOREIGN KEY ("selected_result_id") REFERENCES "public"."qa_content"("id");


--
-- Name: quiz_options quiz_options_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quiz_options"
    ADD CONSTRAINT "quiz_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE CASCADE;


--
-- Name: quiz_questions quiz_questions_video_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quiz_questions"
    ADD CONSTRAINT "quiz_questions_video_module_id_fkey" FOREIGN KEY ("video_module_id") REFERENCES "public"."video_modules"("id") ON DELETE CASCADE;


--
-- Name: quiz_responses quiz_responses_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quiz_responses"
    ADD CONSTRAINT "quiz_responses_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;


--
-- Name: quiz_responses quiz_responses_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quiz_responses"
    ADD CONSTRAINT "quiz_responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_questions"("id") ON DELETE CASCADE;


--
-- Name: quiz_responses quiz_responses_selected_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quiz_responses"
    ADD CONSTRAINT "quiz_responses_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "public"."quiz_options"("id");


--
-- Name: satisfaction_feedback satisfaction_feedback_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."satisfaction_feedback"
    ADD CONSTRAINT "satisfaction_feedback_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;


--
-- Name: video_modules video_modules_care_pathway_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."video_modules"
    ADD CONSTRAINT "video_modules_care_pathway_id_fkey" FOREIGN KEY ("care_pathway_id") REFERENCES "public"."care_pathways"("id") ON DELETE CASCADE;


--
-- Name: video_progress video_progress_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."video_progress"
    ADD CONSTRAINT "video_progress_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;


--
-- Name: video_progress video_progress_video_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."video_progress"
    ADD CONSTRAINT "video_progress_video_module_id_fkey" FOREIGN KEY ("video_module_id") REFERENCES "public"."video_modules"("id");


--
-- Name: video_telemetry video_telemetry_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."video_telemetry"
    ADD CONSTRAINT "video_telemetry_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;


--
-- Name: video_telemetry video_telemetry_video_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."video_telemetry"
    ADD CONSTRAINT "video_telemetry_video_module_id_fkey" FOREIGN KEY ("video_module_id") REFERENCES "public"."video_modules"("id");
