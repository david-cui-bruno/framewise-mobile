import { View, ActivityIndicator } from "react-native";
import { colors } from "@/constants/colors";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

const sizeMap = {
  sm: "small" as const,
  md: 28,
  lg: "large" as const,
};

export function Spinner({
  size = "md",
  className = "",
  color = colors.primary
}: SpinnerProps) {
  return (
    <View className={className}>
      <ActivityIndicator
        size={sizeMap[size]}
        color={color}
      />
    </View>
  );
}
