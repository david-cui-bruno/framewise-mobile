import { View, Text, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { ensurePatientHasCareAssignment } from "@/lib/tasks";
import { AvatarSelector } from "@/components/avatar/AvatarSelector";
import { AvatarGrid } from "@/components/avatar/AvatarGrid";

export default function OnboardingScreen() {
  const { patient, refreshSession } = useAuthContext();
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (!patient || !selectedAvatar) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("patients")
        .update({
          avatar_id: selectedAvatar,
          onboarding_completed: true,
        })
        .eq("id", patient.id);

      if (!error) {
        await ensurePatientHasCareAssignment(supabase, patient.id);
        await refreshSession();
        router.replace("/home");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <ScrollView className="flex-1 p-4">
        <View className="py-8">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-neutral-0 mb-2">
            Welcome! 👋
          </Text>
          <Text className="text-base text-neutral-600 dark:text-neutral-400 mb-8">
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
        <Pressable
          onPress={handleComplete}
          disabled={!selectedAvatar || isSubmitting}
          className={`rounded-full py-4 items-center ${
            selectedAvatar && !isSubmitting
              ? "bg-primary-500"
              : "bg-neutral-300 dark:bg-neutral-700"
          }`}
        >
          <Text
            className={`font-semibold text-base ${
              selectedAvatar && !isSubmitting
                ? "text-white"
                : "text-neutral-500"
            }`}
          >
            {isSubmitting ? "Getting started..." : "Continue"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
