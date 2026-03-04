-- Bookmarked Q&A content
CREATE TABLE IF NOT EXISTS "public"."bookmarked_qa" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "patient_id" uuid NOT NULL,
  "qa_content_id" uuid NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "bookmarked_qa_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "bookmarked_qa_unique" UNIQUE ("patient_id", "qa_content_id"),
  CONSTRAINT "bookmarked_qa_patient_id_fkey"
    FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE,
  CONSTRAINT "bookmarked_qa_qa_content_id_fkey"
    FOREIGN KEY ("qa_content_id") REFERENCES "public"."qa_content"("id") ON DELETE CASCADE
);

ALTER TABLE "public"."bookmarked_qa" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmarked_qa_select_own" ON "public"."bookmarked_qa"
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "bookmarked_qa_insert_own" ON "public"."bookmarked_qa"
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "bookmarked_qa_delete_own" ON "public"."bookmarked_qa"
  FOR DELETE USING (auth.uid() = patient_id);

GRANT ALL ON TABLE "public"."bookmarked_qa" TO "anon";
GRANT ALL ON TABLE "public"."bookmarked_qa" TO "authenticated";
GRANT ALL ON TABLE "public"."bookmarked_qa" TO "service_role";

CREATE INDEX "idx_bookmarked_qa_patient" ON "public"."bookmarked_qa" USING "btree" ("patient_id");

-- Add risk flagging columns to qa_search_log
ALTER TABLE "public"."qa_search_log"
  ADD COLUMN "is_flagged" boolean DEFAULT false,
  ADD COLUMN "flag_reason" text;
