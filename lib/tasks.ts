import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Ensures the patient has at least one care assignment.
 * Called after onboarding completes. Idempotent — safe to call multiple times.
 */
export async function ensurePatientHasCareAssignment(
  supabase: SupabaseClient,
  patientId: string
): Promise<void> {
  const { data: existing, error: selectError } = await supabase
    .from("patient_care_assignments")
    .select("id")
    .eq("patient_id", patientId)
    .limit(1)
    .maybeSingle();

  if (selectError) {
    console.error("Error checking care assignment:", selectError);
    throw selectError;
  }

  if (existing) {
    return;
  }

  // Look up a default active care pathway
  const { data: pathway, error: pathwayError } = await supabase
    .from("care_pathways")
    .select("id")
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (pathwayError) {
    console.error("Error looking up care pathway:", pathwayError);
    throw pathwayError;
  }

  if (!pathway) {
    console.warn("No active care pathway found — skipping care assignment");
    return;
  }

  const { error: insertError } = await supabase
    .from("patient_care_assignments")
    .insert({ patient_id: patientId, care_pathway_id: pathway.id });

  if (insertError) {
    console.error("Error creating care assignment:", insertError);
    throw insertError;
  }
}
