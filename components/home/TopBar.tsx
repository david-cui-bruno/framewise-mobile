import { View, Text } from "react-native";

interface TopBarProps {
  displayName: string;
  avatarEmoji?: string;
  pathwayName?: string;
}

export function TopBar({ displayName, avatarEmoji, pathwayName }: TopBarProps) {
  return (
    <View className="flex-row items-center px-4 py-3">
      <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center">
        <Text className="text-2xl">
          {avatarEmoji || "👤"}
        </Text>
      </View>

      <View className="ml-3 flex-1">
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
  );
}
