import * as Notifications from "expo-notifications";
import { isInQuietHours } from "@/lib/time";

interface MedicationSchedule {
  medication_name: string;
  time_of_day: string;
}

interface NotifPrefs {
  medication_reminders: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

const TIME_MAP: Record<string, { hour: number; minute: number }> = {
  morning: { hour: 8, minute: 0 },
  afternoon: { hour: 13, minute: 0 },
  evening: { hour: 19, minute: 0 },
};

export async function scheduleLocalNotifications(
  medications: MedicationSchedule[],
  prefs: NotifPrefs | null
) {
  // Cancel all existing scheduled notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!prefs?.medication_reminders) return;

  for (const med of medications) {
    const time = TIME_MAP[med.time_of_day];
    if (!time) continue;

    // Skip medications that fall during quiet hours
    if (
      prefs.quiet_hours_start &&
      prefs.quiet_hours_end &&
      isInQuietHours(time.hour * 60 + time.minute, prefs.quiet_hours_start, prefs.quiet_hours_end)
    ) {
      continue;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medication Reminder",
        body: `Time to take ${med.medication_name}`,
        data: { type: "medication" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: time.hour,
        minute: time.minute,
      },
    });
  }
}
