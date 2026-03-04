import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/constants/colors";

interface TopBarProps {
  displayName: string;
  avatarEmoji?: string;
  pathwayName?: string;
}

export function TopBar({ displayName, avatarEmoji, pathwayName }: TopBarProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      {/* Left: Avatar + Name */}
      <View className="flex-row items-center gap-3 flex-1">
        <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center">
          <Text className="text-2xl">
            {avatarEmoji || "👤"}
          </Text>
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-neutral-900">
            {displayName}
          </Text>
          {pathwayName && (
            <Text className="text-sm text-neutral-500">
              {pathwayName}
            </Text>
          )}
        </View>
      </View>

      {/* Right: Profile button */}
      <Pressable
        onPress={() => router.push("/profile")}
        className="w-10 h-10 rounded-full bg-neutral-100 items-center justify-center"
      >
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 5l7 7-7 7"
            stroke={colors.iconDefault}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Pressable>
    </View>
  );
}
