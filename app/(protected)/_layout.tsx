import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";

export default function ProtectedLayout() {
  const { user, patient, isLoading } = useAuthContext();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inProtectedGroup = segments[0] === "(protected)";

    if (!user && inProtectedGroup) {
      // Not authenticated, redirect to login
      router.replace("/login");
    } else if (user && patient && !patient.onboarding_completed) {
      // Authenticated but not onboarded
      router.replace("/onboarding");
    }
  }, [user, patient, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-neutral-50 dark:bg-neutral-900 items-center justify-center">
        <ActivityIndicator size="large" color="#4E9FBA" />
      </View>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
