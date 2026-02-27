import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import * as Linking from "expo-linking";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { loadThemePreference } from "@/lib/theme";
import { supabase } from "@/lib/supabase";

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    loadThemePreference().then((pref) => {
      setColorScheme(pref);
    });
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
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      }
    };

    // Handle URL that opened the app
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Listen for incoming links while app is open
    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, []);

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? "#1A1F1D" : "#F1F5F2",
          },
        }}
      />
    </AuthProvider>
  );
}
