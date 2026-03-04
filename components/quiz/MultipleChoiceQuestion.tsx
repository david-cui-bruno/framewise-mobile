import { View, Text, Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/constants/colors";

export interface QuizOption {
  id: string;
  option_text: string;
  is_correct: boolean;
  feedback_text: string | null;
}

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
      <Text className="text-lg font-semibold text-neutral-900">
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
                  ? "border-success-500 bg-success-50"
                  : showWrong
                  ? "border-error-500 bg-error-50"
                  : isSelected
                  ? "border-primary-500 bg-primary-50"
                  : "border-neutral-300 bg-neutral-0"
              }`}
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className={`flex-1 text-base ${
                    showCorrect
                      ? "text-success-700"
                      : showWrong
                      ? "text-error-700"
                      : isSelected
                      ? "text-primary-700"
                      : "text-neutral-900"
                  }`}
                >
                  {option.option_text}
                </Text>
                {showFeedback && (isCorrect || showWrong) && (
                  <View className="ml-2">
                    {isCorrect ? (
                      <CheckCircleIcon color={colors.success} />
                    ) : (
                      <XCircleIcon color={colors.danger} />
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
