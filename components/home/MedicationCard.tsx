import { View, Text, Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { getShadow } from "@/constants/theme";
import { colors } from "@/constants/colors";

interface MedicationCardProps {
  medicationName: string;
  dosage: string | null;
  instructions: string | null;
  linkedVideoId: string | null;
  onVideoPress?: (videoId: string) => void;
}

export function MedicationCard({
  medicationName,
  dosage,
  instructions,
  linkedVideoId,
  onVideoPress,
}: MedicationCardProps) {
  return (
    <View
      className="bg-neutral-0 rounded-xl p-4 mb-2"
      style={getShadow("sm")}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <PillIcon />
            <Text className="text-base font-semibold text-neutral-900">
              {medicationName}
            </Text>
          </View>
          {dosage && (
            <Text className="text-sm text-neutral-600 ml-7">{dosage}</Text>
          )}
          {instructions && (
            <Text className="text-sm text-neutral-500 ml-7 mt-1">
              {instructions}
            </Text>
          )}
        </View>

        {linkedVideoId && onVideoPress && (
          <Pressable
            onPress={() => onVideoPress(linkedVideoId)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Watch video for ${medicationName}`}
            className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center"
          >
            <PlayIcon />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function PillIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h.008v.008H10.5v-.008zm3 0h.008v.008H13.5v-.008z"
        stroke={colors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlayIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M8 5v14l11-7z" fill={colors.primary} />
    </Svg>
  );
}
