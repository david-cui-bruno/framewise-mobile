-- Mood logs
CREATE TABLE IF NOT EXISTS "public"."mood_logs" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "patient_id" uuid NOT NULL,
  "log_date" date NOT NULL,
  "rating" integer NOT NULL,
  "notes" text,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "mood_logs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "mood_logs_patient_date_unique" UNIQUE ("patient_id", "log_date"),
  CONSTRAINT "mood_logs_patient_id_fkey"
    FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE,
  CONSTRAINT "mood_logs_rating_check" CHECK ("rating" >= 1 AND "rating" <= 5)
);

ALTER TABLE "public"."mood_logs" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mood_logs_select_own" ON "public"."mood_logs"
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "mood_logs_insert_own" ON "public"."mood_logs"
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "mood_logs_update_own" ON "public"."mood_logs"
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE TRIGGER "update_mood_logs_updated_at"
  BEFORE UPDATE ON "public"."mood_logs"
  FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

GRANT ALL ON TABLE "public"."mood_logs" TO "anon";
GRANT ALL ON TABLE "public"."mood_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."mood_logs" TO "service_role";

CREATE INDEX "idx_mood_logs_patient_date" ON "public"."mood_logs" USING "btree" ("patient_id", "log_date");

-- Diary entries
CREATE TABLE IF NOT EXISTS "public"."diary_entries" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "patient_id" uuid NOT NULL,
  "entry_date" date NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "diary_entries_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "diary_entries_patient_id_fkey"
    FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE
);

ALTER TABLE "public"."diary_entries" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "diary_entries_select_own" ON "public"."diary_entries"
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "diary_entries_insert_own" ON "public"."diary_entries"
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "diary_entries_update_own" ON "public"."diary_entries"
  FOR UPDATE USING (auth.uid() = patient_id);
CREATE POLICY "diary_entries_delete_own" ON "public"."diary_entries"
  FOR DELETE USING (auth.uid() = patient_id);

CREATE TRIGGER "update_diary_entries_updated_at"
  BEFORE UPDATE ON "public"."diary_entries"
  FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

GRANT ALL ON TABLE "public"."diary_entries" TO "anon";
GRANT ALL ON TABLE "public"."diary_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."diary_entries" TO "service_role";

CREATE INDEX "idx_diary_entries_patient_date" ON "public"."diary_entries" USING "btree" ("patient_id", "entry_date");

-- Symptom check-ins
CREATE TABLE IF NOT EXISTS "public"."symptom_check_ins" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "patient_id" uuid NOT NULL,
  "check_in_date" date NOT NULL,
  "responses" jsonb NOT NULL DEFAULT '{}',
  "severity_score" integer,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "symptom_check_ins_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "symptom_check_ins_patient_date_unique" UNIQUE ("patient_id", "check_in_date"),
  CONSTRAINT "symptom_check_ins_patient_id_fkey"
    FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE
);

ALTER TABLE "public"."symptom_check_ins" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "symptom_check_ins_select_own" ON "public"."symptom_check_ins"
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "symptom_check_ins_insert_own" ON "public"."symptom_check_ins"
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "symptom_check_ins_update_own" ON "public"."symptom_check_ins"
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE TRIGGER "update_symptom_check_ins_updated_at"
  BEFORE UPDATE ON "public"."symptom_check_ins"
  FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

GRANT ALL ON TABLE "public"."symptom_check_ins" TO "anon";
GRANT ALL ON TABLE "public"."symptom_check_ins" TO "authenticated";
GRANT ALL ON TABLE "public"."symptom_check_ins" TO "service_role";

CREATE INDEX "idx_symptom_check_ins_patient_date" ON "public"."symptom_check_ins" USING "btree" ("patient_id", "check_in_date");

-- Medication adherence
CREATE TABLE IF NOT EXISTS "public"."medication_adherence" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "patient_id" uuid NOT NULL,
  "medication_schedule_id" uuid NOT NULL,
  "adherence_date" date NOT NULL,
  "status" text NOT NULL DEFAULT 'pending',
  "side_effect_notes" text,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "medication_adherence_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "medication_adherence_patient_med_date_unique" UNIQUE ("patient_id", "medication_schedule_id", "adherence_date"),
  CONSTRAINT "medication_adherence_patient_id_fkey"
    FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE,
  CONSTRAINT "medication_adherence_medication_schedule_id_fkey"
    FOREIGN KEY ("medication_schedule_id") REFERENCES "public"."medication_schedules"("id") ON DELETE CASCADE,
  CONSTRAINT "medication_adherence_status_check"
    CHECK ("status" IN ('pending', 'taken', 'skipped', 'flagged'))
);

ALTER TABLE "public"."medication_adherence" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "medication_adherence_select_own" ON "public"."medication_adherence"
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "medication_adherence_insert_own" ON "public"."medication_adherence"
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "medication_adherence_update_own" ON "public"."medication_adherence"
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE TRIGGER "update_medication_adherence_updated_at"
  BEFORE UPDATE ON "public"."medication_adherence"
  FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

GRANT ALL ON TABLE "public"."medication_adherence" TO "anon";
GRANT ALL ON TABLE "public"."medication_adherence" TO "authenticated";
GRANT ALL ON TABLE "public"."medication_adherence" TO "service_role";

CREATE INDEX "idx_medication_adherence_patient_date" ON "public"."medication_adherence" USING "btree" ("patient_id", "adherence_date");
