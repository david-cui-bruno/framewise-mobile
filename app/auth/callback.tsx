import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { colors } from "@/constants/colors";

export default function AuthCallback() {
  const router = useRouter();
  const { user, patient, isLoading } = useAuthContext();

  useEffect(() => {
    // Wait for auth state to settle (session set by _layout.tsx handler)
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (patient && !patient.onboarding_completed) {
      router.replace("/onboarding");
    } else {
      router.replace("/home");
    }
  }, [user, patient, isLoading]);

  return (
    <View className="flex-1 bg-neutral-50 items-center justify-center">
      <ActivityIndicator size="large" color={colors.primary} />
      <Text className="text-neutral-600 mt-4">Signing you in...</Text>
    </View>
  );
}
