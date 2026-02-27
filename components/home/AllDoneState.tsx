import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";

export function AllDoneState() {
  const router = useRouter();

  return (
    <View className="items-center justify-center py-12 px-6">
      <View className="w-24 h-24 bg-success-100 dark:bg-success-900/20 rounded-full items-center justify-center mb-6">
        <CheckCircleIcon />
      </View>

      <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-0 mb-2">
        All Done for Today!
      </Text>

      <Text className="text-base text-neutral-600 dark:text-neutral-400 text-center mb-8">
        Great work completing all your tasks. Come back tomorrow for more.
      </Text>

      <Pressable
        onPress={() => router.push("/qa")}
        className="bg-primary-500 rounded-full py-3 px-8"
      >
        <Text className="text-white font-semibold text-base">
          Explore Q&A
        </Text>
      </Pressable>
    </View>
  );
}

function CheckCircleIcon() {
  return (
    <Svg width={56} height={56} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="#16A34A"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
