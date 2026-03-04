import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function registerPushToken(
  supabase: SupabaseClient,
  patientId: string
): Promise<string | null> {
  if (!Device.isDevice) {
    console.log("Push notifications require a physical device");
    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  // Android notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId,
  });
  const token = tokenData.data;

  // Upsert to push_tokens table
  const { error } = await supabase.from("push_tokens").upsert(
    {
      patient_id: patientId,
      expo_push_token: token,
      device_name: Device.deviceName ?? null,
      platform: Platform.OS,
      is_active: true,
    },
    { onConflict: "patient_id,expo_push_token" }
  );
  if (error) console.error("Error upserting push token:", error);

  return token;
}
