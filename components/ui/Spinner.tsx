import { View, ActivityIndicator } from "react-native";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

const sizeMap = {
  sm: "small" as const,
  md: "small" as const,
  lg: "large" as const,
};

export function Spinner({
  size = "md",
  className = "",
  color = "#4E9FBA"
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
