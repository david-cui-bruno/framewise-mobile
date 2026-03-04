import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { registerPushToken } from "@/lib/notifications/registerPushToken";
import { handleNotificationResponse } from "@/lib/notifications/handleNotificationResponse";

// Configure foreground notification display
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const { patient } = useAuthContext();
  const patientIdRef = useRef<string | null>(null);
  const responseListenerRef = useRef<Notifications.EventSubscription | null>(
    null
  );

  useEffect(() => {
    if (!patient) return;

    // Only re-register if patient ID changed (not on every object reference change)
    if (patientIdRef.current !== patient.id) {
      patientIdRef.current = patient.id;
      registerPushToken(supabase, patient.id).catch((err) =>
        console.error("Failed to register push token:", err)
      );
    }

    // Listen for notification taps
    if (!responseListenerRef.current) {
      responseListenerRef.current =
        Notifications.addNotificationResponseReceivedListener(
          handleNotificationResponse
        );
    }

    return () => {
      if (responseListenerRef.current) {
        responseListenerRef.current.remove();
        responseListenerRef.current = null;
      }
    };
  }, [patient]);
}
