-- Medication schedules for patients
CREATE TABLE IF NOT EXISTS "public"."medication_schedules" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "patient_id" uuid NOT NULL,
  "medication_name" text NOT NULL,
  "dosage" text,
  "time_of_day" text NOT NULL,
  "instructions" text,
  "linked_video_id" uuid,
  "is_active" boolean DEFAULT true,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "medication_schedules_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "medication_schedules_patient_id_fkey"
    FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE,
  CONSTRAINT "medication_schedules_linked_video_id_fkey"
    FOREIGN KEY ("linked_video_id") REFERENCES "public"."video_modules"("id") ON DELETE SET NULL,
  CONSTRAINT "medication_schedules_time_of_day_check"
    CHECK ("time_of_day" IN ('morning', 'afternoon', 'evening'))
);

ALTER TABLE "public"."medication_schedules" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "medication_schedules_select_own" ON "public"."medication_schedules"
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "medication_schedules_insert_own" ON "public"."medication_schedules"
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "medication_schedules_update_own" ON "public"."medication_schedules"
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE TRIGGER "update_medication_schedules_updated_at"
  BEFORE UPDATE ON "public"."medication_schedules"
  FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

GRANT ALL ON TABLE "public"."medication_schedules" TO "anon";
GRANT ALL ON TABLE "public"."medication_schedules" TO "authenticated";
GRANT ALL ON TABLE "public"."medication_schedules" TO "service_role";

CREATE INDEX "idx_medication_schedules_patient" ON "public"."medication_schedules" USING "btree" ("patient_id");

-- Extend daily_task_templates to support medication tasks
ALTER TABLE "public"."daily_task_templates"
  DROP CONSTRAINT "daily_task_templates_task_type_check";
ALTER TABLE "public"."daily_task_templates"
  ADD CONSTRAINT "daily_task_templates_task_type_check"
  CHECK ("task_type" IN ('watch_video', 'answer_quiz', 'take_medication'));
