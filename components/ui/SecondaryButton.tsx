import { Pressable, Text } from "react-native";

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

export function SecondaryButton({
  label,
  onPress,
  disabled = false,
  className = "",
}: SecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`bg-surface border border-border rounded-control h-12 items-center justify-center px-4 ${
        disabled ? "opacity-50" : ""
      } ${className}`}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text className="text-primary-500 text-sm font-semibold">{label}</Text>
    </Pressable>
  );
}
