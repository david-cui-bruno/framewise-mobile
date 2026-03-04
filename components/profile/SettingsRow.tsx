import { View, Text, Pressable } from "react-native";
import { ReactNode } from "react";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/constants/colors";

interface SettingsRowProps {
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: ReactNode;
  showChevron?: boolean;
  isLast?: boolean;
}

export function SettingsRow({
  label,
  value,
  onPress,
  rightElement,
  showChevron,
  isLast = false,
}: SettingsRowProps) {
  const showArrow = showChevron ?? !!onPress;

  const content = (
    <View
      className={`flex-row items-center py-3 ${
        isLast ? "" : "border-b border-neutral-100"
      }`}
    >
      <View className="flex-1">
        <Text className="text-base text-neutral-900">{label}</Text>
      </View>

      {value && (
        <Text className="text-base text-neutral-500 mr-2">{value}</Text>
      )}

      {rightElement}

      {showArrow && !rightElement && <ChevronIcon />}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

function ChevronIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5l7 7-7 7"
        stroke={colors.iconMuted}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
