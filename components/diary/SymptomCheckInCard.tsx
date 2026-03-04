import { View, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { getShadow } from "@/constants/theme";
import { colors } from "@/constants/colors";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface SymptomCheckInCardProps {
  hasCheckedIn: boolean;
  severityScore: number | null;
  onStartCheckIn: () => void;
}

export function SymptomCheckInCard({
  hasCheckedIn,
  severityScore,
  onStartCheckIn,
}: SymptomCheckInCardProps) {
  return (
    <View
      className="bg-neutral-0 rounded-2xl p-5 mb-4"
      style={getShadow("sm")}
    >
      <View className="flex-row items-center gap-3 mb-3">
        <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center">
          <ClipboardIcon />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-neutral-900">
            Symptom Check-in
          </Text>
          <Text className="text-sm text-neutral-500">
            {hasCheckedIn ? "Completed today" : "Track how you're feeling"}
          </Text>
        </View>
      </View>

      {hasCheckedIn && severityScore !== null ? (
        <View className="flex-row items-center gap-2 bg-success-50 rounded-xl p-3">
          <CheckIcon />
          <Text className="text-sm text-success-700">
            Severity score: {severityScore}/10
          </Text>
        </View>
      ) : (
        <PrimaryButton label="Start Check-in" onPress={onStartCheckIn} />
      )}
    </View>
  );
}

function ClipboardIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        stroke={colors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13l4 4L19 7"
        stroke={colors.success}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
