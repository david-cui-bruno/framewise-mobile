import { ScrollView } from "react-native";
import { Chip } from "@/components/ui/Chip";

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
        <Chip
          key={index}
          label={suggestion}
          isSelected={false}
          onPress={() => onSelect(suggestion)}
        />
      ))}
    </ScrollView>
  );
}
