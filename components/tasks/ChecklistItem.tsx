import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";

interface ChecklistItemProps {
  title: string;
  isCompleted: boolean;
  href: string;
}

export function ChecklistItem({ title, isCompleted, href }: ChecklistItemProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(href as any)}
      className="flex-row items-center gap-3 py-3 px-1"
    >
      {/* Checkbox */}
      <View
        className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
          isCompleted
            ? "bg-success-500 border-success-500 dark:bg-success-600 dark:border-success-600"
            : "border-neutral-300 dark:border-neutral-600 bg-neutral-0 dark:bg-neutral-800"
        }`}
      >
        {isCompleted && (
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              stroke="#FFFFFF"
              d="M5 13l4 4L19 7"
            />
          </Svg>
        )}
      </View>

      {/* Title */}
      <Text
        className={`text-base flex-1 ${
          isCompleted
            ? "text-neutral-400 dark:text-neutral-500 line-through"
            : "text-neutral-900 dark:text-neutral-0"
        }`}
      >
        {title}
      </Text>
    </Pressable>
  );
}
