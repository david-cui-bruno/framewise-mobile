import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/components/auth/AuthProvider";
import type { Patient } from "@/hooks/useAuth";

interface NotificationPrefs {
  id: string;
  medication_reminders: boolean;
  daily_check_in_reminders: boolean;
  engagement_nudges: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

export function usePatientPrefs() {
  const { patient, refreshSession } = useAuthContext();
  const [notificationPrefs, setNotificationPrefs] =
    useState<NotificationPrefs | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!patient) return;

    const fetchPrefs = async () => {
      const { data } = await supabase
        .from("patient_notification_prefs")
        .select("*")
        .eq("patient_id", patient.id)
        .maybeSingle();
      setNotificationPrefs(data);
      setIsLoading(false);
    };

    fetchPrefs();
  }, [patient]);

  const updatePatientPref = useCallback(
    async (
      updates: Partial<
        Pick<Patient, "text_size" | "playback_speed" | "preferred_language">
      >
    ) => {
      if (!patient) return;
      const { error } = await supabase
        .from("patients")
        .update(updates)
        .eq("id", patient.id);
      if (!error) await refreshSession();
      return error;
    },
    [patient, refreshSession]
  );

  const updateNotificationPrefs = useCallback(
    async (updates: Partial<Omit<NotificationPrefs, "id">>) => {
      if (!patient) return;
      const { data, error } = await supabase
        .from("patient_notification_prefs")
        .upsert(
          { patient_id: patient.id, ...updates },
          { onConflict: "patient_id" }
        )
        .select()
        .single();
      if (!error && data) setNotificationPrefs(data);
      return error;
    },
    [patient]
  );

  return {
    notificationPrefs,
    isLoading,
    updatePatientPref,
    updateNotificationPrefs,
  };
}
