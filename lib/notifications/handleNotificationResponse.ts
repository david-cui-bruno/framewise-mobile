import { router } from "expo-router";
import type { NotificationResponse } from "expo-notifications";

const ALLOWED_ROUTES = new Set(["/home", "/diary", "/chat", "/profile"]);

export function handleNotificationResponse(response: NotificationResponse) {
  const data = response.notification.request.content.data as
    | Record<string, string>
    | undefined;

  if (!data?.type) {
    router.push("/home" as any);
    return;
  }

  switch (data.type) {
    case "medication":
      router.push("/home" as any);
      break;
    case "check_in":
      router.push("/diary" as any);
      break;
    case "nudge":
      if (data.screen && ALLOWED_ROUTES.has(data.screen)) {
        router.push(data.screen as any);
      } else {
        router.push("/home" as any);
      }
      break;
    default:
      router.push("/home" as any);
  }
}
