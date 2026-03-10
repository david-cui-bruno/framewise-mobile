import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { MultipleChoiceQuestion, type QuizOption } from "@/components/quiz/MultipleChoiceQuestion";
import { BlueGradient } from "@/components/ui/BlueGradient";
import { ChevronIcon } from "@/components/icons/ChevronIcon";
import { colors } from "@/constants/colors";
import Svg, { Path, Circle } from "react-native-svg";

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
  const { quizId, taskId } = useLocalSearchParams<{ quizId: string; taskId?: string }>();
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
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      const { data: moduleData } = await supabase
        .from("video_modules")
        .select("title")
        .eq("id", quizId)
        .single();

      setVideoModule(moduleData as VideoModule | null);

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

    setShowFeedback(true);

    const selectedOption = currentQuestion.options.find(
      (o) => o.id === selectedOptionId
    );
    const correct = selectedOption?.is_correct ?? false;
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
    }

    await supabase.from("quiz_responses").insert({
      patient_id: patient.id,
      question_id: currentQuestion.id,
      selected_option_id: selectedOptionId,
      is_correct: correct,
    });
  }, [selectedOptionId, currentQuestion, patient, quizId]);

  const markTaskCompleted = async (id: string) => {
    await supabase
      .from("patient_daily_tasks")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", id);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      if (taskId) {
        markTaskCompleted(taskId);
      }
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-neutral-500 text-base">
          No quiz questions found.
        </Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-[#1D61E7] font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (isFinished) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <View className="mb-6">
          <CorrectCheckmark />
        </View>

        <Text className="text-2xl font-bold text-neutral-900 mb-2">
          Quiz Complete!
        </Text>

        <Text className="text-lg text-neutral-600 mb-8">
          You scored {score} out of {questions.length}
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="bg-[#1D61E7] rounded-full py-4 px-12"
        >
          <Text className="text-white font-semibold text-base">Done</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Gradient header */}
      <BlueGradient className="pt-14">
        <View className="flex-row items-center h-12 px-1">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <ChevronIcon direction="left" />
          </Pressable>
          <View className="flex-1 items-center mr-10">
            <Text className="text-base font-semibold text-white">
              {videoModule?.title ? `Quick Check: ${videoModule.title}` : "Quiz"}
            </Text>
          </View>
        </View>
      </BlueGradient>

      {/* White content area */}
      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <MultipleChoiceQuestion
            question={currentQuestion.question_text}
            options={currentQuestion.options}
            selectedOptionId={selectedOptionId}
            onSelect={handleSelect}
            showFeedback={showFeedback}
          />

          {showFeedback && selectedOptionId && (
            <View className="mt-4 p-4 bg-neutral-0 rounded-2xl">
              <Text className="text-base text-neutral-700">
                {currentQuestion.options.find((o) => o.id === selectedOptionId)
                  ?.feedback_text ?? ""}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Green checkmark overlay when correct */}
        {showFeedback && isCorrect && (
          <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center pointer-events-none">
            <View className="mt-16">
              <CorrectCheckmark />
            </View>
          </View>
        )}
      </View>

      {/* Submit button area */}
      <View className="bg-white px-4 pt-4 pb-2">
        {!showFeedback ? (
          <Pressable
            onPress={handleSubmit}
            disabled={!selectedOptionId}
            className={`h-10 rounded-xl items-center justify-center ${
              selectedOptionId ? "bg-[#1D61E7]" : "bg-[#1D61E7]/50"
            }`}
          >
            <Text className="text-xs font-semibold text-white">
              Submit Answer
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleNext}
            className="bg-[#1D61E7] h-10 rounded-xl items-center justify-center"
          >
            <Text className="text-xs font-semibold text-white">
              {isLastQuestion ? "See Results" : "Next Question"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function CorrectCheckmark() {
  return (
    <Svg width={120} height={120} viewBox="0 0 120 120" fill="none">
      <Circle cx={60} cy={60} r={56} fill="#4CAF50" />
      <Path
        d="M35 62l18 18 32-40"
        stroke="#FFFFFF"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
