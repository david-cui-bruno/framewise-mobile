import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { colors } from "@/constants/colors";

export default function Index() {
  const { user, patient, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <View className="flex-1 bg-neutral-50 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Redirect href="/login" />;
  }

  // Authenticated but not onboarded - redirect to onboarding
  if (patient && !patient.onboarding_completed) {
    return <Redirect href="/onboarding" />;
  }

  // Authenticated and onboarded - redirect to home
  return <Redirect href="/home" />;
}
