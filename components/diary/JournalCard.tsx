import { View, Text, Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { getShadow } from "@/constants/theme";
import { colors } from "@/constants/colors";
import { useTextSize } from "@/contexts/TextSizeContext";

interface JournalCardProps {
  entryPreview: string | null;
  onPress: () => void;
}

export function JournalCard({ entryPreview, onPress }: JournalCardProps) {
  const { scaledStyle } = useTextSize();

  return (
    <Pressable onPress={onPress}>
      <View
        className="bg-neutral-0 rounded-2xl p-5 mb-4"
        style={getShadow("sm")}
      >
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-10 h-10 rounded-full bg-primary-50 items-center justify-center">
            <PencilIcon />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-neutral-900">
              Journal
            </Text>
            <Text className="text-sm text-neutral-500">
              {entryPreview ? "View entry" : "Write about your day"}
            </Text>
          </View>
          <ChevronIcon />
        </View>

        {entryPreview && (
          <Text
            className="text-sm text-neutral-600 mt-1 ml-[52px]"
            numberOfLines={2}
            style={scaledStyle("sm")}
          >
            {entryPreview}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

function PencilIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        stroke={colors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
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
