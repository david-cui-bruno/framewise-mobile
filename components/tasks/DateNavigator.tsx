import { View, Text, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import Svg, { Path } from "react-native-svg";

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateNavigator({
  selectedDate,
  onDateChange,
}: DateNavigatorProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  const isToday = selected.getTime() === today.getTime();

  const goToPreviousDay = () => {
    const prev = new Date(selected);
    prev.setDate(prev.getDate() - 1);
    onDateChange(prev);
  };

  const goToNextDay = () => {
    const next = new Date(selected);
    next.setDate(next.getDate() + 1);
    onDateChange(next);
  };

  const formatDate = (date: Date) => {
    const daysDiff = Math.round(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) return "Today";
    if (daysDiff === -1) return "Yesterday";
    if (daysDiff === 1) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const chevronColor = isDark ? "#9CA3AF" : "#6B7280";

  return (
    <View className="bg-neutral-0 dark:bg-neutral-800 rounded-2xl p-4 mb-4">
      <View className="flex-row items-center justify-between">
        <Pressable onPress={goToPreviousDay} className="p-2">
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 19l-7-7 7-7"
              stroke={chevronColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>

        <View className="flex-1 items-center">
          <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-0">
            {formatDate(selected)}
          </Text>
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            {selected.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        <Pressable onPress={goToNextDay} className="p-2">
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 5l7 7-7 7"
              stroke={chevronColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </View>

      {!isToday && (
        <Pressable
          onPress={() => onDateChange(new Date())}
          className="mt-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
        >
          <Text className="text-center text-sm font-medium text-primary-700 dark:text-primary-300">
            Jump to Today
          </Text>
        </Pressable>
      )}
    </View>
  );
}
