import { View, Text, Pressable } from "react-native";
import type { Nudge } from "@/lib/nudges";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/constants/colors";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface NudgeBannerProps {
  nudge: Nudge;
  onDismiss: () => void;
  onAction: () => void;
}

export function NudgeBanner({ nudge, onDismiss, onAction }: NudgeBannerProps) {
  return (
    <View className="bg-primary-50 rounded-2xl p-4 mb-3">
      <View className="flex-row items-start justify-between mb-2">
        <Text className="text-base font-semibold text-neutral-900 flex-1 mr-2">
          {nudge.title}
        </Text>
        <Pressable
          onPress={onDismiss}
          className="w-6 h-6 items-center justify-center"
          hitSlop={8}
        >
          <CloseIcon />
        </Pressable>
      </View>

      <Text className="text-sm text-neutral-600 mb-3">{nudge.message}</Text>

      <PrimaryButton
        label={nudge.actionLabel}
        onPress={onAction}
        fullWidth={false}
        className="self-start px-5"
      />
    </View>
  );
}

function CloseIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 18L18 6M6 6l12 12"
        stroke={colors.iconDefault}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
