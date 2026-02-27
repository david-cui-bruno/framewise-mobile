import { View, Text, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import Svg, { Path } from "react-native-svg";
import { getShadow } from "@/constants/theme";

interface VideoThumbCardProps {
  title: string;
  duration?: string;
  completed?: boolean;
  onPress: () => void;
}

export function VideoThumbCard({
  title,
  duration,
  completed = false,
  onPress,
}: VideoThumbCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Pressable onPress={onPress} className="w-[48%] mb-4">
      <View
        className="rounded-xl overflow-hidden mb-2 bg-neutral-100 dark:bg-neutral-800"
        style={[{ aspectRatio: 16 / 9 }, getShadow(isDark, "sm")]}
      >
        <View className="w-full h-full items-center justify-center">
          <View
            className={`w-12 h-12 rounded-full items-center justify-center ${
              completed
                ? "bg-success-100 dark:bg-success-900/20"
                : "bg-primary-100 dark:bg-primary-900/20"
            }`}
          >
            {completed ? (
              <CheckIcon color={isDark ? "#22C55E" : "#16A34A"} />
            ) : (
              <PlayIcon color={isDark ? "#4FB7D3" : "#4E9FBA"} />
            )}
          </View>

          {duration && (
            <View className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded">
              <Text className="text-xs text-white font-medium">
                {duration}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Text
        className={`text-sm font-medium ${
          completed
            ? "text-neutral-500 dark:text-neutral-500"
            : "text-neutral-900 dark:text-neutral-0"
        }`}
        numberOfLines={2}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function PlayIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M8 5v14l11-7z" fill={color} />
    </Svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
