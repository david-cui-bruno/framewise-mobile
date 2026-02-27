import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Try to extract tokens from the deep link URL
        const url = await Linking.getInitialURL();
        if (url) {
          const hashIndex = url.indexOf("#");
          if (hashIndex !== -1) {
            const fragment = url.substring(hashIndex + 1);
            const params = new URLSearchParams(fragment);
            const accessToken = params.get("access_token");
            const refreshToken = params.get("refresh_token");

            if (accessToken && refreshToken) {
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
            }
          }
        }

        // Check if we have a session (either from URL or from _layout.tsx handler)
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Wait a bit and try once more — the _layout.tsx handler may still be processing
          await new Promise((resolve) => setTimeout(resolve, 2000));
          const { data: { user: retryUser } } = await supabase.auth.getUser();

          if (!retryUser) {
            router.replace("/login");
            return;
          }

          await redirectUser(retryUser.id);
          return;
        }

        await redirectUser(user.id);
      } catch (err) {
        console.error("Auth callback error:", err);
        router.replace("/login");
      }
    };

    const redirectUser = async (userId: string) => {
      const { data: patient } = await supabase
        .from("patients")
        .select("onboarding_completed")
        .eq("id", userId)
        .single();

      if (!patient?.onboarding_completed) {
        router.replace("/onboarding");
      } else {
        router.replace("/home");
      }
    };

    handleAuth();
  }, []);

  return (
    <View className="flex-1 bg-neutral-50 items-center justify-center">
      <ActivityIndicator size="large" color="#4E9FBA" />
      <Text className="text-neutral-600 mt-4">Signing you in...</Text>
    </View>
  );
}
