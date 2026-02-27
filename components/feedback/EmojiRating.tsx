import { View, Text, Pressable } from "react-native";

const EMOJIS = [
  { emoji: "😞", label: "Very Bad" },
  { emoji: "😕", label: "Bad" },
  { emoji: "😐", label: "Okay" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😊", label: "Great" },
];

interface EmojiRatingProps {
  rating: number | null;
  onRate: (rating: number) => void;
  showLabels?: boolean;
}

export function EmojiRating({
  rating,
  onRate,
  showLabels = false,
}: EmojiRatingProps) {
  return (
    <View className="flex-row justify-center gap-3">
      {EMOJIS.map((item, index) => {
        const value = index + 1;
        const isSelected = rating === value;

        return (
          <Pressable
            key={value}
            onPress={() => onRate(value)}
            className="items-center"
          >
            <View
              className={`w-14 h-14 rounded-full items-center justify-center ${
                isSelected
                  ? "bg-primary-100 dark:bg-primary-900/30"
                  : "bg-neutral-100 dark:bg-neutral-800"
              }`}
            >
              <Text className="text-2xl">{item.emoji}</Text>
            </View>
            {showLabels && (
              <Text
                className={`text-xs mt-1 ${
                  isSelected
                    ? "text-primary-600 dark:text-primary-400 font-medium"
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {item.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
