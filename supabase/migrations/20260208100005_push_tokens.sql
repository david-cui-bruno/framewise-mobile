-- Push Tokens table for expo push notifications
CREATE TABLE IF NOT EXISTS push_tokens (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id  uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  expo_push_token text NOT NULL,
  device_name text,
  platform    text CHECK (platform IN ('ios', 'android', 'web')),
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (patient_id, expo_push_token)
);

-- Index for lookups by patient
CREATE INDEX idx_push_tokens_patient ON push_tokens(patient_id) WHERE is_active = true;

-- Updated_at trigger
CREATE TRIGGER set_push_tokens_updated_at
  BEFORE UPDATE ON push_tokens
  FOR EACH ROW
  EXECUTE FUNCTION "public"."update_updated_at_column"();

-- RLS
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY push_tokens_select ON push_tokens
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY push_tokens_insert ON push_tokens
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY push_tokens_update ON push_tokens
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY push_tokens_delete ON push_tokens
  FOR DELETE USING (auth.uid() = patient_id);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON push_tokens TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON push_tokens TO service_role;
