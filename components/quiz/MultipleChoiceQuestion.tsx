import { View, Text, Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { QuizOption } from "@/app/(protected)/quiz/[quizId]";

interface MultipleChoiceQuestionProps {
  question: string;
  options: QuizOption[];
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  showFeedback: boolean;
}

export function MultipleChoiceQuestion({
  question,
  options,
  selectedOptionId,
  onSelect,
  showFeedback,
}: MultipleChoiceQuestionProps) {
  return (
    <View className="gap-4">
      <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-0">
        {question}
      </Text>
      <View className="gap-3">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.is_correct;
          const showCorrect = showFeedback && isCorrect;
          const showWrong = showFeedback && isSelected && !isCorrect;

          return (
            <Pressable
              key={option.id}
              onPress={() => !showFeedback && onSelect(option.id)}
              disabled={showFeedback}
              className={`rounded-2xl p-4 border-2 ${
                showCorrect
                  ? "border-success-500 bg-success-50 dark:bg-success-900/20"
                  : showWrong
                  ? "border-error-500 bg-error-50 dark:bg-error-900/20"
                  : isSelected
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "border-neutral-300 dark:border-neutral-700 bg-neutral-0 dark:bg-neutral-800"
              }`}
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className={`flex-1 text-base ${
                    showCorrect
                      ? "text-success-700 dark:text-success-300"
                      : showWrong
                      ? "text-error-700 dark:text-error-300"
                      : isSelected
                      ? "text-primary-700 dark:text-primary-300"
                      : "text-neutral-900 dark:text-neutral-0"
                  }`}
                >
                  {option.option_text}
                </Text>
                {showFeedback && (isCorrect || showWrong) && (
                  <View className="ml-2">
                    {isCorrect ? (
                      <CheckCircleIcon color="#16A34A" />
                    ) : (
                      <XCircleIcon color="#DC2626" />
                    )}
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function CheckCircleIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function XCircleIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
