--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."audit_log"
    ADD CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id");


--
-- Name: avatars avatars_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."avatars"
    ADD CONSTRAINT "avatars_pkey" PRIMARY KEY ("id");


--
-- Name: care_pathways care_pathways_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."care_pathways"
    ADD CONSTRAINT "care_pathways_pkey" PRIMARY KEY ("id");


--
-- Name: care_pathways care_pathways_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."care_pathways"
    ADD CONSTRAINT "care_pathways_slug_key" UNIQUE ("slug");


--
-- Name: daily_task_templates daily_task_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."daily_task_templates"
    ADD CONSTRAINT "daily_task_templates_pkey" PRIMARY KEY ("id");


--
-- Name: discharge_scans discharge_scans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."discharge_scans"
    ADD CONSTRAINT "discharge_scans_pkey" PRIMARY KEY ("id");


--
-- Name: patient_care_assignments patient_care_assignments_patient_id_care_pathway_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."patient_care_assignments"
    ADD CONSTRAINT "patient_care_assignments_patient_id_care_pathway_id_key" UNIQUE ("patient_id", "care_pathway_id");


--
-- Name: patient_care_assignments patient_care_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."patient_care_assignments"
    ADD CONSTRAINT "patient_care_assignments_pkey" PRIMARY KEY ("id");


--
-- Name: patient_daily_tasks patient_daily_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."patient_daily_tasks"
    ADD CONSTRAINT "patient_daily_tasks_pkey" PRIMARY KEY ("id");


--
-- Name: patients patients_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_email_key" UNIQUE ("email");


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_pkey" PRIMARY KEY ("id");


--
-- Name: physician_notification_prefs physician_notification_prefs_physician_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."physician_notification_prefs"
    ADD CONSTRAINT "physician_notification_prefs_physician_id_key" UNIQUE ("physician_id");


--
-- Name: physician_notification_prefs physician_notification_prefs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."physician_notification_prefs"
    ADD CONSTRAINT "physician_notification_prefs_pkey" PRIMARY KEY ("id");


--
-- Name: physicians physicians_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."physicians"
    ADD CONSTRAINT "physicians_pkey" PRIMARY KEY ("id");


--
-- Name: physicians physicians_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."physicians"
    ADD CONSTRAINT "physicians_user_id_key" UNIQUE ("user_id");


--
-- Name: qa_content qa_content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."qa_content"
    ADD CONSTRAINT "qa_content_pkey" PRIMARY KEY ("id");


--
-- Name: qa_search_log qa_search_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."qa_search_log"
    ADD CONSTRAINT "qa_search_log_pkey" PRIMARY KEY ("id");


--
-- Name: quiz_options quiz_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quiz_options"
    ADD CONSTRAINT "quiz_options_pkey" PRIMARY KEY ("id");


--
-- Name: quiz_questions quiz_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quiz_questions"
    ADD CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id");


--
-- Name: quiz_responses quiz_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."quiz_responses"
    ADD CONSTRAINT "quiz_responses_pkey" PRIMARY KEY ("id");


--
-- Name: satisfaction_feedback satisfaction_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."satisfaction_feedback"
    ADD CONSTRAINT "satisfaction_feedback_pkey" PRIMARY KEY ("id");


--
-- Name: video_modules video_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."video_modules"
    ADD CONSTRAINT "video_modules_pkey" PRIMARY KEY ("id");


--
-- Name: video_progress video_progress_patient_id_video_module_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."video_progress"
    ADD CONSTRAINT "video_progress_patient_id_video_module_id_key" UNIQUE ("patient_id", "video_module_id");


--
-- Name: video_progress video_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."video_progress"
    ADD CONSTRAINT "video_progress_pkey" PRIMARY KEY ("id");


--
-- Name: video_telemetry video_telemetry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."video_telemetry"
    ADD CONSTRAINT "video_telemetry_pkey" PRIMARY KEY ("id");


--
-- Name: idx_audit_log_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_audit_log_created" ON "public"."audit_log" USING "btree" ("created_at");


--
-- Name: idx_audit_log_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_audit_log_patient" ON "public"."audit_log" USING "btree" ("patient_id");


--
-- Name: idx_audit_log_patient_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_audit_log_patient_created" ON "public"."audit_log" USING "btree" ("patient_id", "created_at");


--
-- Name: idx_discharge_scans_physician; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_discharge_scans_physician" ON "public"."discharge_scans" USING "btree" ("physician_id");


--
-- Name: idx_discharge_scans_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_discharge_scans_status" ON "public"."discharge_scans" USING "btree" ("status");


--
-- Name: idx_patient_care_assignments_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_patient_care_assignments_patient" ON "public"."patient_care_assignments" USING "btree" ("patient_id");


--
-- Name: idx_patient_daily_tasks_patient_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_patient_daily_tasks_patient_date" ON "public"."patient_daily_tasks" USING "btree" ("patient_id", "scheduled_date");


--
-- Name: idx_patient_tasks_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_patient_tasks_date" ON "public"."patient_daily_tasks" USING "btree" ("patient_id", "scheduled_date");


--
-- Name: idx_pca_physician; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_pca_physician" ON "public"."patient_care_assignments" USING "btree" ("physician_id");


--
-- Name: idx_physicians_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_physicians_user_id" ON "public"."physicians" USING "btree" ("user_id");


--
-- Name: idx_qa_content_embedding; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_qa_content_embedding" ON "public"."qa_content" USING "hnsw" ("embedding" "public"."vector_cosine_ops");


--
-- Name: idx_qa_search_log_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_qa_search_log_patient" ON "public"."qa_search_log" USING "btree" ("patient_id", "created_at");


--
-- Name: idx_qa_search_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_qa_search_patient" ON "public"."qa_search_log" USING "btree" ("patient_id");


--
-- Name: idx_quiz_responses_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_quiz_responses_patient" ON "public"."quiz_responses" USING "btree" ("patient_id");


--
-- Name: idx_satisfaction_feedback_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_satisfaction_feedback_patient" ON "public"."satisfaction_feedback" USING "btree" ("patient_id");


--
-- Name: idx_satisfaction_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_satisfaction_patient" ON "public"."satisfaction_feedback" USING "btree" ("patient_id");


--
-- Name: idx_video_telemetry_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_video_telemetry_created" ON "public"."video_telemetry" USING "btree" ("created_at");


--
-- Name: idx_video_telemetry_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_video_telemetry_patient" ON "public"."video_telemetry" USING "btree" ("patient_id");


--
-- Name: idx_video_telemetry_session; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "idx_video_telemetry_session" ON "public"."video_telemetry" USING "btree" ("session_id");


--
-- Name: qa_content_embedding_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "qa_content_embedding_idx" ON "public"."qa_content" USING "ivfflat" ("embedding" "public"."vector_cosine_ops") WITH ("lists"='100');
