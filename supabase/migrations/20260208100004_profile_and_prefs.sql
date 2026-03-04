-- Add preference columns to patients
ALTER TABLE "public"."patients"
  ADD COLUMN "preferred_language" text DEFAULT 'en',
  ADD COLUMN "text_size" text DEFAULT 'medium',
  ADD COLUMN "playback_speed" numeric(2,1) DEFAULT 1.0;

ALTER TABLE "public"."patients"
  ADD CONSTRAINT "patients_text_size_check"
  CHECK ("text_size" IN ('small', 'medium', 'large', 'extra_large'));

ALTER TABLE "public"."patients"
  ADD CONSTRAINT "patients_playback_speed_check"
  CHECK ("playback_speed" IN (0.5, 0.75, 1.0, 1.25, 1.5, 2.0));

-- Emergency contacts
CREATE TABLE IF NOT EXISTS "public"."emergency_contacts" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "patient_id" uuid NOT NULL,
  "name" text NOT NULL,
  "relationship" text NOT NULL,
  "phone" text NOT NULL,
  "is_primary" boolean DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "emergency_contacts_patient_id_fkey"
    FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE
);

ALTER TABLE "public"."emergency_contacts" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "emergency_contacts_select_own" ON "public"."emergency_contacts"
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "emergency_contacts_insert_own" ON "public"."emergency_contacts"
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "emergency_contacts_update_own" ON "public"."emergency_contacts"
  FOR UPDATE USING (auth.uid() = patient_id);
CREATE POLICY "emergency_contacts_delete_own" ON "public"."emergency_contacts"
  FOR DELETE USING (auth.uid() = patient_id);

CREATE TRIGGER "update_emergency_contacts_updated_at"
  BEFORE UPDATE ON "public"."emergency_contacts"
  FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

GRANT ALL ON TABLE "public"."emergency_contacts" TO "anon";
GRANT ALL ON TABLE "public"."emergency_contacts" TO "authenticated";
GRANT ALL ON TABLE "public"."emergency_contacts" TO "service_role";

-- Patient notification preferences
CREATE TABLE IF NOT EXISTS "public"."patient_notification_prefs" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "patient_id" uuid NOT NULL,
  "medication_reminders" boolean DEFAULT true,
  "daily_check_in_reminders" boolean DEFAULT true,
  "engagement_nudges" boolean DEFAULT true,
  "quiet_hours_start" time DEFAULT '22:00',
  "quiet_hours_end" time DEFAULT '07:00',
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "patient_notification_prefs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "patient_notification_prefs_patient_id_key" UNIQUE ("patient_id"),
  CONSTRAINT "patient_notification_prefs_patient_id_fkey"
    FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE
);

ALTER TABLE "public"."patient_notification_prefs" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "patient_notif_prefs_select_own" ON "public"."patient_notification_prefs"
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "patient_notif_prefs_insert_own" ON "public"."patient_notification_prefs"
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "patient_notif_prefs_update_own" ON "public"."patient_notification_prefs"
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE TRIGGER "update_patient_notif_prefs_updated_at"
  BEFORE UPDATE ON "public"."patient_notification_prefs"
  FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();

GRANT ALL ON TABLE "public"."patient_notification_prefs" TO "anon";
GRANT ALL ON TABLE "public"."patient_notification_prefs" TO "authenticated";
GRANT ALL ON TABLE "public"."patient_notification_prefs" TO "service_role";
