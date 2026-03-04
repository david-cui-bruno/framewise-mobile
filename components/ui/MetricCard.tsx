import { View, Text } from "react-native";
import { getShadow } from "@/constants/theme";

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  icon?: React.ReactNode;
  accentClassName?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  icon,
  accentClassName = "text-primary-500",
  className = "",
}: MetricCardProps) {
  return (
    <View
      className={`rounded-card bg-surface border border-border p-4 ${className}`}
      style={getShadow("sm")}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-medium text-neutral-500">{title}</Text>
        {icon}
      </View>
      <View className="flex-row items-baseline">
        <Text className={`text-2xl font-bold ${accentClassName}`}>
          {value}
        </Text>
        {unit && (
          <Text className="text-sm text-neutral-500 ml-1">{unit}</Text>
        )}
      </View>
    </View>
  );
}
