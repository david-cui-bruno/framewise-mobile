import * as Notifications from "expo-notifications";

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

function isInQuietHours(hour: number, minute: number, start: string, end: string): boolean {
  const sParts = start.split(":");
  const eParts = end.split(":");
  const s = parseInt(sParts[0], 10) * 60 + parseInt(sParts[1] ?? "0", 10);
  const e = parseInt(eParts[0], 10) * 60 + parseInt(eParts[1] ?? "0", 10);
  const current = hour * 60 + minute;
  return s <= e ? current >= s && current < e : current >= s || current < e;
}

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
      isInQuietHours(time.hour, time.minute, prefs.quiet_hours_start, prefs.quiet_hours_end)
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
