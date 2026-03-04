import { View, TextInput } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/constants/colors";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  className?: string;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = "Search...",
  onSubmit,
  className = "",
}: SearchInputProps) {
  return (
    <View
      className={`flex-row items-center rounded-control bg-surface border border-border px-3 py-2 ${className}`}
    >
      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
        <Path
          d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          stroke={colors.iconMuted}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <TextInput
        className="flex-1 ml-2 text-sm text-neutral-900"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
    </View>
  );
}
