-- Health metrics table for weight, blood pressure, etc.
CREATE TABLE IF NOT EXISTS health_metrics (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id      uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  metric_type     text NOT NULL CHECK (metric_type IN ('weight', 'blood_pressure')),
  value           text NOT NULL,
  unit            text NOT NULL,
  recorded_date   date NOT NULL DEFAULT CURRENT_DATE,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (patient_id, metric_type, recorded_date)
);

-- Index for date-based lookups
CREATE INDEX idx_health_metrics_patient_date ON health_metrics(patient_id, recorded_date);

-- Updated_at trigger
CREATE TRIGGER set_health_metrics_updated_at
  BEFORE UPDATE ON health_metrics
  FOR EACH ROW
  EXECUTE FUNCTION "public"."update_updated_at_column"();

-- RLS
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY health_metrics_select ON health_metrics
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY health_metrics_insert ON health_metrics
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY health_metrics_update ON health_metrics
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY health_metrics_delete ON health_metrics
  FOR DELETE USING (auth.uid() = patient_id);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON health_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON health_metrics TO service_role;
