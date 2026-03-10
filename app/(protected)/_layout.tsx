import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect, Stack, useRouter } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { colors } from "@/constants/colors";

export default function ProtectedLayout() {
  const { user, patient, isLoading } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (isLoading) return;

    if (user && patient && !patient.onboarding_completed) {
      router.replace("/onboarding");
    }
  }, [user, patient, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-neutral-50 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
