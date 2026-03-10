import { View, Text, Pressable } from "react-native";

interface TextSizeStepProps {
  selected: string;
  onSelect: (size: string) => void;
}

const TEXT_SIZES = [
  { id: "small", label: "Small", fontSize: 14 },
  { id: "medium", label: "Medium", fontSize: 16 },
  { id: "large", label: "Large", fontSize: 20 },
  { id: "extra_large", label: "Extra Large", fontSize: 24 },
];

export function TextSizeStep({ selected, onSelect }: TextSizeStepProps) {
  return (
    <View className="gap-4">
      {TEXT_SIZES.map((size) => {
        const isSelected = selected === size.id;
        return (
          <Pressable
            key={size.id}
            onPress={() => onSelect(size.id)}
            className={`bg-white h-[76px] rounded-[40px] items-center justify-center ${
              isSelected ? "border-2 border-primary-500" : ""
            }`}
          >
            <Text
              style={{ fontSize: size.fontSize }}
              className={`font-semibold ${
                isSelected ? "text-primary-500" : "text-neutral-900"
              }`}
            >
              {size.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
