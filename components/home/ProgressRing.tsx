import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { getRingColors } from "@/constants/theme";

interface ProgressRingProps {
  currentDay: number;
  totalDays: number;
  size?: number;
}

export function ProgressRing({
  currentDay,
  totalDays,
  size = 144,
}: ProgressRingProps) {
  const colors = getRingColors();

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(currentDay / totalDays, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View
      className="relative items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          position: "absolute",
          transform: [{ rotate: "-90deg" }],
        }}
      >
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.bg}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.progress}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>
      <View className="items-center z-10">
        <Text className="text-3xl font-bold text-primary-500">
          Day {currentDay}
        </Text>
        <Text className="text-sm text-neutral-500">
          of {totalDays}
        </Text>
      </View>
    </View>
  );
}
