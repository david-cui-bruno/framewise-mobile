import { View, Text, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { getShadow } from "@/constants/theme";

interface FeaturedTaskCardProps {
  title: string;
  description?: string | null;
  taskType: "watch_video" | "answer_quiz";
  onPress: () => void;
}

export function FeaturedTaskCard({
  title,
  description,
  taskType,
  onPress,
}: FeaturedTaskCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Pressable onPress={onPress}>
      <View
        className="rounded-2xl overflow-hidden"
        style={[{ height: 180 }, getShadow(isDark, "card")]}
      >
        <LinearGradient
          colors={isDark ? ["#0097A7", "#16A34A"] : ["#4E9FBA", "#26B866"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: "100%", height: "100%" }}
        >
          <View className="flex-1 justify-between p-5">
            {/* Top: badge + play icon */}
            <View className="flex-row items-center justify-between">
              <View className="bg-white/20 px-3 py-1 rounded-full">
                <Text className="text-xs font-semibold text-white">
                  UP NEXT
                </Text>
              </View>

              {taskType === "watch_video" && (
                <View className="w-12 h-12 bg-white/90 rounded-full items-center justify-center">
                  <PlayIcon />
                </View>
              )}

              {taskType === "answer_quiz" && (
                <View className="w-12 h-12 bg-white/90 rounded-full items-center justify-center">
                  <QuizIcon />
                </View>
              )}
            </View>

            {/* Bottom: text */}
            <View>
              <Text className="text-lg font-bold text-white mb-1" numberOfLines={2}>
                {title}
              </Text>
              {description && (
                <Text className="text-sm text-white/80" numberOfLines={1}>
                  {description}
                </Text>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    </Pressable>
  );
}

function PlayIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M8 5v14l11-7z" fill="#4E9FBA" />
    </Svg>
  );
}

function QuizIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="#4E9FBA"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
