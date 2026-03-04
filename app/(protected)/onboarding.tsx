import { View, Text, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { ensurePatientHasCareAssignment } from "@/lib/tasks";
import { registerPushToken } from "@/lib/notifications/registerPushToken";
import { AvatarGrid } from "@/components/avatar/AvatarGrid";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { TextSizeStep } from "@/components/onboarding/TextSizeStep";
import { NotificationStep } from "@/components/onboarding/NotificationStep";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export default function OnboardingScreen() {
  const { patient, refreshSession } = useAuthContext();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedTextSize, setSelectedTextSize] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleComplete = async () => {
    if (!patient || !selectedAvatar || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase
        .from("patients")
        .update({
          avatar_id: selectedAvatar,
          text_size: selectedTextSize,
          onboarding_completed: true,
        })
        .eq("id", patient.id);

      if (error) {
        setErrorMessage("Something went wrong. Please try again.");
        return;
      }

      // Create default notification prefs
      await supabase
        .from("patient_notification_prefs")
        .upsert({ patient_id: patient.id }, { onConflict: "patient_id" });

      await ensurePatientHasCareAssignment(supabase, patient.id);
      await refreshSession();
      router.replace("/home");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canContinue =
    (step === 1 && selectedAvatar !== null) ||
    step === 2 ||
    step === 3;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <StepIndicator currentStep={step} totalSteps={3} />

      {step === 1 && (
        <>
          <ScrollView className="flex-1 p-4">
            <View className="py-4">
              <Text className="text-3xl font-bold text-neutral-900 mb-2">
                Welcome! 👋
              </Text>
              <Text className="text-base text-neutral-600 mb-8">
                Choose an avatar to get started
              </Text>

              <AvatarGrid
                selectedAvatar={selectedAvatar}
                onSelect={setSelectedAvatar}
                title="Pick your avatar"
                subtitle="This will be shown on your profile"
              />
            </View>
          </ScrollView>

          <View className="p-4">
            {errorMessage && (
              <Text className="text-error-500 text-center text-sm mb-3">
                {errorMessage}
              </Text>
            )}
            <PrimaryButton
              label="Continue"
              onPress={handleNext}
              disabled={!canContinue}
            />
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <ScrollView className="flex-1 p-4">
            <View className="py-4">
              <TextSizeStep
                selected={selectedTextSize}
                onSelect={setSelectedTextSize}
              />
            </View>
          </ScrollView>

          <View className="p-4">
            <PrimaryButton
              label="Continue"
              onPress={handleNext}
            />
          </View>
        </>
      )}

      {step === 3 && (
        <NotificationStep
          onEnable={async () => {
            if (patient) {
              await registerPushToken(supabase, patient.id);
            }
            handleComplete();
          }}
          onSkip={handleComplete}
        />
      )}

      {isSubmitting && (
        <View className="absolute inset-0 bg-neutral-900/20 items-center justify-center">
          <View className="bg-neutral-0 rounded-2xl p-6 items-center">
            <Text className="text-neutral-600">Getting started...</Text>
          </View>
        </View>
      )}
    </View>
  );
}
