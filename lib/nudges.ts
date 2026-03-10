import type { SupabaseClient } from "@supabase/supabase-js";

export interface Nudge {
  id: string;
  type: "tasks_remaining";
  title: string;
  message: string;
  actionLabel: string;
  actionRoute: string;
}

export async function computeNudges(
  supabase: SupabaseClient,
  patientId: string,
  quietHours?: { start: string; end: string }
): Promise<Nudge[]> {
  // Suppress nudges during quiet hours
  if (quietHours) {
    const d = new Date();
    const nowMinutes = d.getHours() * 60 + d.getMinutes();
    const sParts = quietHours.start.split(":");
    const eParts = quietHours.end.split(":");
    const s = parseInt(sParts[0], 10) * 60 + parseInt(sParts[1] ?? "0", 10);
    const e = parseInt(eParts[0], 10) * 60 + parseInt(eParts[1] ?? "0", 10);
    const inQuiet = s <= e ? nowMinutes >= s && nowMinutes < e : nowMinutes >= s || nowMinutes < e;
    if (inQuiet) return [];
  }

  const nudges: Nudge[] = [];
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Check for incomplete tasks today
  const { data: incompleteTasks } = await supabase
    .from("patient_daily_tasks")
    .select("id")
    .eq("patient_id", patientId)
    .eq("scheduled_date", today)
    .neq("status", "completed");

  if (incompleteTasks && incompleteTasks.length > 0) {
    const count = incompleteTasks.length;
    nudges.push({
      id: "tasks_remaining",
      type: "tasks_remaining",
      title: `${count} task${count > 1 ? "s" : ""} remaining`,
      message: "Complete your daily tasks to stay on track with your recovery.",
      actionLabel: "View Tasks",
      actionRoute: "/home",
    });
  }

  return nudges;
}
