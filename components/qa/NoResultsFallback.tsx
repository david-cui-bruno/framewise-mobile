import { View, Text } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { colors } from "@/constants/colors";

interface NoResultsFallbackProps {
  query: string;
}

export function NoResultsFallback({ query }: NoResultsFallbackProps) {
  return (
    <View className="flex-1 items-center justify-center p-6 py-12">
      <View className="w-16 h-16 mb-4 items-center justify-center">
        <SearchXIcon color={colors.textSubtle} />
      </View>

      <Text className="text-lg font-semibold text-neutral-900 mb-2 text-center">
        No results found
      </Text>

      <Text className="text-base text-neutral-600 text-center mb-1">
        We couldn't find anything for "{query}"
      </Text>

      <Text className="text-sm text-neutral-500 text-center mt-4">
        Try rephrasing your question or asking about a different topic.
      </Text>
    </View>
  );
}

function SearchXIcon({ color }: { color: string }) {
  return (
    <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={2} />
      <Path
        d="M21 21l-4.35-4.35"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M8 8l6 6m-6 0l6-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
