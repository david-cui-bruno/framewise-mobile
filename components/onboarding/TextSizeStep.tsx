import { View, Text, Pressable } from "react-native";

interface TextSizeStepProps {
  selected: string;
  onSelect: (size: string) => void;
}

const TEXT_SIZES = [
  { id: "small", label: "Small", fontSize: 14 },
  { id: "medium", label: "Medium", fontSize: 16 },
  { id: "large", label: "Large", fontSize: 18 },
  { id: "extra_large", label: "Extra Large", fontSize: 20 },
];

export function TextSizeStep({ selected, onSelect }: TextSizeStepProps) {
  return (
    <View>
      <Text className="text-2xl font-bold text-neutral-900 mb-2">
        Choose your text size
      </Text>
      <Text className="text-base text-neutral-600 mb-6">
        You can change this later in Settings
      </Text>

      <View className="gap-3">
        {TEXT_SIZES.map((size) => {
          const isSelected = selected === size.id;
          return (
            <Pressable
              key={size.id}
              onPress={() => onSelect(size.id)}
              className={`rounded-2xl p-4 border-2 ${
                isSelected
                  ? "border-primary-500 bg-primary-50"
                  : "border-neutral-200 bg-neutral-0"
              }`}
            >
              <Text className="text-sm font-medium text-neutral-500 mb-1">
                {size.label}
              </Text>
              <Text
                style={{ fontSize: size.fontSize }}
                className="text-neutral-900"
              >
                The quick brown fox jumps over the lazy dog
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
