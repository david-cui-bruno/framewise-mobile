import { Pressable, ActivityIndicator, Text } from "react-native";
import { colors } from "@/constants/colors";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  isLoading = false,
  fullWidth = true,
  className = "",
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`bg-primary-500 rounded-control h-12 items-center justify-center px-4 ${
        fullWidth ? "w-full" : ""
      } ${disabled || isLoading ? "opacity-50" : ""} ${className}`}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.textInverse} />
      ) : (
        <Text className="text-white text-sm font-semibold">{label}</Text>
      )}
    </Pressable>
  );
}
