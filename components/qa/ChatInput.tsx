import { View, TextInput, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import Svg, { Path } from "react-native-svg";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Type your message...",
  disabled = false,
}: ChatInputProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSubmit();
    }
  };

  return (
    <View className="flex-row items-end gap-2 p-3 bg-neutral-0 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700">
      <View className="flex-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-4 py-2">
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#7C8A82" : "#9AA99F"}
          multiline
          numberOfLines={1}
          maxLength={500}
          editable={!disabled}
          className="text-base text-neutral-900 dark:text-neutral-0 max-h-24"
          style={{ minHeight: 24 }}
        />
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={!value.trim() || disabled}
        className={`w-10 h-10 rounded-full items-center justify-center ${
          value.trim() && !disabled
            ? "bg-primary-500"
            : "bg-neutral-300 dark:bg-neutral-700"
        }`}
      >
        <SendIcon
          color={
            value.trim() && !disabled
              ? "#ffffff"
              : isDark
                ? "#5F6B64"
                : "#9AA99F"
          }
        />
      </Pressable>
    </View>
  );
}

function SendIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 2L11 13"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 2L15 22l-4-9-9-4 20-7z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
