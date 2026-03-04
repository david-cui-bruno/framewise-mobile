import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import * as Linking from "expo-linking";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { telemetryQueue } from "@/lib/telemetry/eventQueue";
import { useNotifications } from "@/hooks/useNotifications";
import { TextSizeProvider } from "@/contexts/TextSizeContext";
import { colors } from "@/constants/colors";

export default function RootLayout() {
  useEffect(() => {
    telemetryQueue.initialize(supabase);
    return () => {
      telemetryQueue.destroy();
    };
  }, []);

  // Handle deep link sessions (magic link auth)
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      // Extract tokens from the URL fragment (#access_token=...&refresh_token=...)
      const hashIndex = url.indexOf("#");
      if (hashIndex === -1) return;

      const fragment = url.substring(hashIndex + 1);
      const params = new URLSearchParams(fragment);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (error) {
          console.error("Failed to set session from deep link:", error.message);
        }
      }
    };

    // Handle URL that opened the app
    Linking.getInitialURL()
      .then((url) => {
        if (url) handleDeepLink(url);
      })
      .catch((err) => console.error("Failed to get initial URL:", err));

    // Listen for incoming links while app is open
    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, []);

  return (
    <AuthProvider>
      <TextSizeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: colors.background,
            },
          }}
        />
        <NotificationInitializer />
      </TextSizeProvider>
    </AuthProvider>
  );
}

function NotificationInitializer() {
  useNotifications();
  return null;
}
