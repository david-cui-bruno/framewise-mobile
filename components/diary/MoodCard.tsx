import { View, Text } from "react-native";
import { EmojiRating } from "@/components/feedback/EmojiRating";
import { getShadow } from "@/constants/theme";

interface MoodCardProps {
  rating: number | null;
  onRate: (rating: number) => void;
  isSubmitting?: boolean;
}

export function MoodCard({ rating, onRate, isSubmitting }: MoodCardProps) {
  return (
    <View
      className="bg-neutral-0 rounded-2xl p-5 mb-4"
      style={getShadow("sm")}
    >
      <Text className="text-base font-semibold text-neutral-900 mb-1">
        How are you feeling today?
      </Text>
      <Text className="text-sm text-neutral-500 mb-4">
        Tap an emoji to log your mood
      </Text>

      <EmojiRating rating={rating} onRate={onRate} showLabels />

      {rating !== null && !isSubmitting && (
        <Text className="text-sm text-success-600 text-center mt-3">
          Mood logged!
        </Text>
      )}
    </View>
  );
}
