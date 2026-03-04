import { Pressable, Text } from "react-native";

interface ChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  className?: string;
}

export function Chip({
  label,
  isSelected,
  onPress,
  className = "",
}: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-chip px-3 py-1.5 border ${
        isSelected
          ? "bg-sky-50 border-primary-500"
          : "bg-surface border-border"
      } ${className}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
    >
      <Text
        className={`text-xs font-medium ${
          isSelected ? "text-primary-500" : "text-neutral-700"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
