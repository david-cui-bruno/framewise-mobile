import { View, Text, Pressable, Linking } from "react-native";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = content.split(urlRegex);

  const handleLinkPress = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <View className={`mb-3 ${isUser ? "items-end" : "items-start"}`}>
      <View
        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-primary-500 rounded-br-sm"
            : "bg-neutral-0 dark:bg-neutral-800 rounded-bl-sm"
        }`}
      >
        <Text
          className={`text-base leading-6 ${
            isUser
              ? "text-white"
              : "text-neutral-900 dark:text-neutral-0"
          }`}
        >
          {parts.map((part, index) => {
            if (part.match(urlRegex)) {
              return (
                <Text
                  key={index}
                  onPress={() => handleLinkPress(part)}
                  className={`underline ${
                    isUser ? "text-white" : "text-primary-500 dark:text-primary-400"
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

      {timestamp && (
        <Text className="text-xs text-neutral-500 dark:text-neutral-500 mt-1 px-2">
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      )}
    </View>
  );
}
