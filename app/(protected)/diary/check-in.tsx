import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { colors } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

const QUESTIONS = [
  {
    id: "pain",
    question: "How is your pain level?",
    options: ["No pain", "Mild", "Moderate", "Severe"],
  },
  {
    id: "energy",
    question: "How is your energy level?",
    options: ["Very low", "Low", "Normal", "High"],
  },
  {
    id: "sleep",
    question: "How did you sleep last night?",
    options: ["Very poorly", "Poorly", "Okay", "Well"],
  },
  {
    id: "appetite",
    question: "How is your appetite?",
    options: ["No appetite", "Low", "Normal", "Good"],
  },
  {
    id: "mobility",
    question: "How is your mobility today?",
    options: ["Very limited", "Limited", "Improving", "Good"],
  },
];

export default function CheckInScreen() {
  const { patient } = useAuthContext();
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = QUESTIONS[currentStep];
  const isLastStep = currentStep === QUESTIONS.length - 1;

  const handleOptionSelect = (optionIndex: number) => {
    setResponses((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleNext = async () => {
    if (isLastStep) {
      await handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!patient || !date) return;
    setIsSubmitting(true);

    // Calculate severity score (0-10 based on responses)
    const totalScore = Object.values(responses).reduce((sum, val) => sum + val, 0);
    const maxPossible = QUESTIONS.length * 3;
    const severityScore = Math.round((totalScore / maxPossible) * 10);

    const { error } = await supabase.from("symptom_check_ins").upsert(
      {
        patient_id: patient.id,
        check_in_date: date,
        responses,
        severity_score: severityScore,
      },
      { onConflict: "patient_id,check_in_date" }
    );

    if (error) {
      console.error("Error saving check-in:", error);
      setIsSubmitting(false);
      return;
    }
    router.back();
  };

  const selectedOption = responses[currentQuestion?.id];

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-neutral-100 items-center justify-center"
        >
          <BackIcon />
        </Pressable>
        <Text className="flex-1 text-lg font-semibold text-neutral-900 text-center mr-10">
          Symptom Check-in
        </Text>
      </View>

      {/* Progress */}
      <View className="flex-row gap-1 px-4 mb-6">
        {QUESTIONS.map((_, index) => (
          <View
            key={index}
            className={`flex-1 h-1 rounded-full ${
              index <= currentStep ? "bg-primary-500" : "bg-neutral-200"
            }`}
          />
        ))}
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Question */}
        <Text className="text-xl font-bold text-neutral-900 mb-6">
          {currentQuestion.question}
        </Text>

        {/* Options */}
        {currentQuestion.options.map((option, index) => (
          <Pressable
            key={index}
            onPress={() => handleOptionSelect(index)}
            className={`rounded-2xl p-4 mb-3 border-2 ${
              selectedOption === index
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-200 bg-neutral-0"
            }`}
          >
            <Text
              className={`text-base font-medium ${
                selectedOption === index
                  ? "text-primary-700"
                  : "text-neutral-900"
              }`}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Footer */}
      <View className="p-4">
        <PrimaryButton
          label={isLastStep ? "Submit" : "Next"}
          onPress={handleNext}
          disabled={selectedOption === undefined}
          isLoading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
}

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 19l-7-7 7-7"
        stroke={colors.iconDefault}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
