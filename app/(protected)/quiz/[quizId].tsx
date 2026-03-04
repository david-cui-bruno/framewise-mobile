import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { MultipleChoiceQuestion, type QuizOption } from "@/components/quiz/MultipleChoiceQuestion";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { colors } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

interface QuizQuestion {
  id: string;
  question_text: string;
  question_order: number;
  options: QuizOption[];
}

interface VideoModule {
  title: string;
}

export default function QuizScreen() {
  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  const { patient } = useAuthContext();
  const router = useRouter();

  const [videoModule, setVideoModule] = useState<VideoModule | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      // Fetch video module title
      const { data: moduleData } = await supabase
        .from("video_modules")
        .select("title")
        .eq("id", quizId)
        .single();

      setVideoModule(moduleData as VideoModule | null);

      // Fetch questions
      const { data: questionsData, error } = await supabase
        .from("quiz_questions")
        .select("id, question_text, question_order")
        .eq("video_module_id", quizId)
        .order("question_order", { ascending: true });

      if (error) {
        console.error("Error fetching quiz questions:", error);
        setIsLoading(false);
        return;
      }

      const rawQuestions = (questionsData ?? []) as {
        id: string;
        question_text: string;
        question_order: number;
      }[];

      // Fetch options for all questions
      const questionIds = rawQuestions.map((q) => q.id);
      const { data: optionsData } = await supabase
        .from("quiz_options")
        .select("id, question_id, option_text, is_correct, feedback_text, option_order")
        .in("question_id", questionIds)
        .order("option_order", { ascending: true });

      const optionsByQuestion = new Map<string, QuizOption[]>();
      for (const opt of (optionsData ?? []) as Array<{
        id: string;
        question_id: string;
        option_text: string;
        is_correct: boolean;
        feedback_text: string | null;
        option_order: number;
      }>) {
        const existing = optionsByQuestion.get(opt.question_id) ?? [];
        existing.push({
          id: opt.id,
          option_text: opt.option_text,
          is_correct: opt.is_correct,
          feedback_text: opt.feedback_text,
        });
        optionsByQuestion.set(opt.question_id, existing);
      }

      setQuestions(
        rawQuestions.map((q) => ({
          ...q,
          options: optionsByQuestion.get(q.id) ?? [],
        }))
      );
      setIsLoading(false);
    };

    fetchQuiz();
  }, [quizId]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const handleSubmit = useCallback(async () => {
    if (!selectedOptionId || !currentQuestion || !patient || !quizId) return;

    // Show feedback
    setShowFeedback(true);

    const selectedOption = currentQuestion.options.find(
      (o) => o.id === selectedOptionId
    );
    if (selectedOption?.is_correct) {
      setScore((prev) => prev + 1);
    }

    // Record response
    await supabase.from("quiz_responses").insert({
      patient_id: patient.id,
      question_id: currentQuestion.id,
      selected_option_id: selectedOptionId,
      is_correct: selectedOption?.is_correct ?? false,
    });
  }, [selectedOptionId, currentQuestion, patient, quizId]);

  const handleNext = () => {
    if (isLastQuestion) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowFeedback(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 items-center justify-center">
        <Text className="text-neutral-500 text-base">
          No quiz questions found.
        </Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-primary-500 font-semibold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (isFinished) {
    const passed = score >= Math.ceil(questions.length * 0.7);

    return (
      <SafeAreaView className="flex-1 bg-neutral-50">
        <View className="flex-1 items-center justify-center px-6">
          <View
            className={`w-24 h-24 rounded-full items-center justify-center mb-6 ${
              passed ? "bg-success-100" : "bg-warning-100"
            }`}
          >
            <Text className="text-5xl">{passed ? "🎉" : "📝"}</Text>
          </View>

          <Text className="text-2xl font-bold text-neutral-900 mb-2">
            {passed ? "Great Job!" : "Keep Practicing"}
          </Text>

          <Text className="text-lg text-neutral-600 mb-1">
            You scored {score} out of {questions.length}
          </Text>

          <Text
            className={`text-base font-medium mb-8 ${
              passed ? "text-success-600" : "text-warning-600"
            }`}
          >
            {passed ? "You passed!" : "You need 70% to pass"}
          </Text>

          <Pressable
            onPress={() => router.back()}
            className="bg-primary-500 rounded-full py-4 px-12"
          >
            <Text className="text-white font-semibold text-base">Done</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text
          className="flex-1 text-lg font-semibold text-neutral-900 text-center mr-10"
          numberOfLines={1}
        >
          {videoModule?.title ?? "Quiz"}
        </Text>
      </View>

      {/* Progress indicator */}
      <View className="px-4 pb-2">
        <Text className="text-sm text-neutral-500">
          Question {currentIndex + 1} of {questions.length}
        </Text>
        <View className="h-1.5 bg-neutral-200 rounded-full mt-2">
          <View
            className="h-1.5 bg-primary-500 rounded-full"
            style={{
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 32 }}
      >
        <MultipleChoiceQuestion
          question={currentQuestion.question_text}
          options={currentQuestion.options}
          selectedOptionId={selectedOptionId}
          onSelect={handleSelect}
          showFeedback={showFeedback}
        />

        {/* Feedback text */}
        {showFeedback && selectedOptionId && (
          <View className="mt-4 p-4 bg-neutral-0 rounded-2xl">
            <Text className="text-base text-neutral-700">
              {currentQuestion.options.find((o) => o.id === selectedOptionId)
                ?.feedback_text ?? ""}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom button */}
      <View className="p-4">
        {!showFeedback ? (
          <PrimaryButton
            label="Check Answer"
            onPress={handleSubmit}
            disabled={!selectedOptionId}
          />
        ) : (
          <PrimaryButton
            label={isLastQuestion ? "See Results" : "Next Question"}
            onPress={handleNext}
          />
        )}
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
