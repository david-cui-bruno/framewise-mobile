import { View, Text } from "react-native";

interface ProgressStripProps {
  currentDay: number;
  totalDays: number;
  completedTasks: number;
  totalTasks: number;
}

export function ProgressStrip({
  currentDay,
  totalDays,
  completedTasks,
  totalTasks,
}: ProgressStripProps) {
  const dayProgress = totalDays > 0 ? (currentDay / totalDays) * 100 : 0;

  return (
    <View className="px-4 py-3">
      {/* Progress bar */}
      <View className="h-2 bg-neutral-200 rounded-full overflow-hidden mb-2">
        <View
          className="h-full bg-primary-500 rounded-full"
          style={{ width: `${Math.min(dayProgress, 100)}%` }}
        />
      </View>

      {/* Labels */}
      <View className="flex-row justify-between">
        <Text className="text-sm text-neutral-500">
          Day {currentDay} of {totalDays}
        </Text>
        <Text className="text-sm text-neutral-500">
          {completedTasks}/{totalTasks} tasks complete
        </Text>
      </View>
    </View>
  );
}
