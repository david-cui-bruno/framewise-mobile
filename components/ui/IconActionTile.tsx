import { Pressable, Text, View } from "react-native";
import { getShadow } from "@/constants/theme";

interface IconActionTileProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  className?: string;
}

export function IconActionTile({
  label,
  icon,
  onPress,
  className = "",
}: IconActionTileProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-xl bg-surface py-3 px-2 items-center ${className}`}
      style={getShadow("sm")}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View className="w-10 h-10 rounded-full bg-sky-50 items-center justify-center mb-2">
        {icon}
      </View>
      <Text className="text-xs font-medium text-neutral-700 text-center">
        {label}
      </Text>
    </Pressable>
  );
}
