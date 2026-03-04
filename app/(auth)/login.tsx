import { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { isDemoMode, startDemo } from "@/lib/demo";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { colors } from "@/constants/colors";

export default function LoginScreen() {
  const router = useRouter();
  const { refreshSession } = useAuthContext();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendLink = async () => {
    const trimmed = email.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({ email: trimmed });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push("/verify");
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = async () => {
    setIsDemoLoading(true);
    setErrorMessage(null);

    try {
      await startDemo();
      await refreshSession();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Demo login failed.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center px-6"
      >
        {/* Icon */}
        <View className="w-20 h-20 rounded-full bg-primary-100 items-center justify-center self-center mb-6">
          <Text className="text-4xl">💚</Text>
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-neutral-900 text-center mb-2">
          Welcome to Framewise
        </Text>

        {/* Subtitle */}
        <Text className="text-base text-neutral-600 text-center mb-8">
          Enter your email to sign in
        </Text>

        {/* Email input */}
        <TextInput
          className="border border-neutral-300 rounded-xl px-4 py-3 text-base text-neutral-900 bg-neutral-0 mb-4"
          placeholder="you@example.com"
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          editable={!isLoading && !isDemoLoading}
        />

        {/* Error message */}
        {errorMessage && (
          <Text className="text-error-500 text-center text-sm mb-3">
            {errorMessage}
          </Text>
        )}

        {/* Send magic link button */}
        <PrimaryButton
          label="Send magic link"
          onPress={handleSendLink}
          disabled={!email.trim() || isDemoLoading}
          isLoading={isLoading}
          className="mb-4"
        />

        {/* Demo button */}
        {isDemoMode && (
          <SecondaryButton
            label={isDemoLoading ? "Starting demo..." : "Try Demo"}
            onPress={handleDemo}
            disabled={isLoading || isDemoLoading}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
