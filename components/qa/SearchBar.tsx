import { View, TextInput, Pressable } from "react-native";
import { useColorScheme } from "nativewind";
import Svg, { Path } from "react-native-svg";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask a question...",
  autoFocus = false,
}: SearchBarProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-row items-center gap-3 px-4 py-3 bg-neutral-0 dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700">
      <SearchIcon color={isDark ? "#9CA3AF" : "#6B7280"} />

      <TextInput
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={isDark ? "#6B8C73" : "#9AA99F"}
        autoFocus={autoFocus}
        returnKeyType="search"
        className="flex-1 text-base text-neutral-900 dark:text-neutral-0"
      />

      {value.length > 0 && (
        <Pressable onPress={onSubmit} className="p-1">
          <SendIcon color={isDark ? "#4FB7D3" : "#4E9FBA"} />
        </Pressable>
      )}
    </View>
  );
}

function SearchIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SendIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 5l7 7-7 7M5 12h14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
