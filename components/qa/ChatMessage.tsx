import { View, Text, Linking, Pressable } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTextSize } from "@/contexts/TextSizeContext";
import { colors } from "@/constants/colors";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export function ChatMessage({ role, content, timestamp, onBookmark, isBookmarked }: ChatMessageProps) {
  const isUser = role === "user";
  const { scaledStyle } = useTextSize();

  const urlRegex = /(https?:\/\/[^\s.,;!?)]+(?:[.,;!?)]+[^\s.,;!?)]+)*)/g;
  const parts = content.split(urlRegex);

  const handleLinkPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Failed to open URL:", error);
    }
  };

  return (
    <View className={`mb-3 ${isUser ? "items-end" : "items-start"}`}>
      <View
        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-primary-500 rounded-br-sm"
            : "bg-neutral-0 rounded-bl-sm"
        }`}
      >
        <Text
          className={`text-base leading-6 ${
            isUser
              ? "text-white"
              : "text-neutral-900"
          }`}
          style={scaledStyle("base")}
        >
          {parts.map((part, index) => {
            if (part.match(urlRegex)) {
              return (
                <Text
                  key={index}
                  onPress={() => handleLinkPress(part)}
                  className={`underline ${
                    isUser ? "text-white" : "text-primary-500"
                  }`}
                >
                  {part}
                </Text>
              );
            }
            return <Text key={index}>{part}</Text>;
          })}
        </Text>
      </View>

      <View className="flex-row items-center gap-2 mt-1 px-2">
        {timestamp && (
          <Text className="text-xs text-neutral-500">
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        )}
        {!isUser && onBookmark && (
          <Pressable
            onPress={onBookmark}
            className="p-1"
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <BookmarkIcon filled={isBookmarked} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function BookmarkIcon({ filled }: { filled?: boolean }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        stroke={filled ? colors.primary : colors.iconMuted}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? colors.primary : "none"}
      />
    </Svg>
  );
}
