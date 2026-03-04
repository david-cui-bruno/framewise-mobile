import { View, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/constants/colors";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";

interface NotificationStepProps {
  onEnable: () => void;
  onSkip: () => void;
}

export function NotificationStep({ onEnable, onSkip }: NotificationStepProps) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="w-20 h-20 rounded-full bg-primary-100 items-center justify-center mb-6">
        <BellIcon />
      </View>

      <Text className="text-2xl font-bold text-neutral-900 mb-3 text-center">
        Stay on track with reminders
      </Text>

      <Text className="text-base text-neutral-600 text-center mb-8 leading-6">
        Get medication reminders and daily check-in alerts to help you stay on
        track with your recovery program.
      </Text>

      <PrimaryButton label="Enable Notifications" onPress={onEnable} className="mb-3" />

      <SecondaryButton label="Maybe Later" onPress={onSkip} />
    </View>
  );
}

function BellIcon() {
  return (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        stroke={colors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
