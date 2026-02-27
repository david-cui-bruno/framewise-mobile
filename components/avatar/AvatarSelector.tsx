import { View, Text, Pressable } from "react-native";

const AVATARS = [
  { id: "lion", emoji: "🦁", name: "Lion" },
  { id: "tiger", emoji: "🐯", name: "Tiger" },
  { id: "bear", emoji: "🐻", name: "Bear" },
  { id: "panda", emoji: "🐼", name: "Panda" },
  { id: "koala", emoji: "🐨", name: "Koala" },
  { id: "fox", emoji: "🦊", name: "Fox" },
  { id: "wolf", emoji: "🐺", name: "Wolf" },
  { id: "monkey", emoji: "🐵", name: "Monkey" },
];

interface AvatarSelectorProps {
  selectedAvatar: string | null;
  onSelect: (avatarId: string) => void;
}

export { AVATARS };

export function AvatarSelector({
  selectedAvatar,
  onSelect,
}: AvatarSelectorProps) {
  return (
    <View className="flex-row flex-wrap justify-between">
      {AVATARS.map((avatar) => (
        <Pressable
          key={avatar.id}
          onPress={() => onSelect(avatar.id)}
          className={`w-[48%] bg-neutral-0 dark:bg-neutral-800 rounded-2xl p-6 mb-4 items-center ${
            selectedAvatar === avatar.id
              ? "border-2 border-primary-500"
              : "border-2 border-transparent"
          }`}
        >
          <Text className="text-5xl mb-2">{avatar.emoji}</Text>
          <Text className="text-base font-medium text-neutral-900 dark:text-neutral-0">
            {avatar.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
