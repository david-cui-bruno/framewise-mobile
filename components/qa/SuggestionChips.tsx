import { ScrollView, Text, Pressable } from "react-native";

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function SuggestionChips({
  suggestions,
  onSelect,
}: SuggestionChipsProps) {
  if (suggestions.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 12 }}
    >
      {suggestions.map((suggestion, index) => (
        <Pressable
          key={index}
          onPress={() => onSelect(suggestion)}
          className="px-4 py-2 bg-neutral-0 dark:bg-neutral-800 rounded-full border border-primary-300 dark:border-primary-700"
        >
          <Text className="text-sm font-medium text-primary-700 dark:text-primary-300">
            {suggestion}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
