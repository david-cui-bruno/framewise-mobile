import type { SupabaseClient } from "@supabase/supabase-js";
import { isInQuietHours } from "@/lib/time";

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
    if (isInQuietHours(nowMinutes, quietHours.start, quietHours.end)) return [];
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
