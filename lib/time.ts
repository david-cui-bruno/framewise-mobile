/**
 * Check whether a given time (in minutes since midnight) falls within a
 * quiet-hours window expressed as "HH:MM" strings. Handles overnight ranges
 * (e.g. 22:00–06:00).
 */
export function isInQuietHours(nowMinutes: number, start: string, end: string): boolean {
  const sParts = start.split(":");
  const eParts = end.split(":");
  const s = parseInt(sParts[0], 10) * 60 + parseInt(sParts[1] ?? "0", 10);
  const e = parseInt(eParts[0], 10) * 60 + parseInt(eParts[1] ?? "0", 10);
  return s <= e ? nowMinutes >= s && nowMinutes < e : nowMinutes >= s || nowMinutes < e;
}
