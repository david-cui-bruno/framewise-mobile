import { View, Text, Pressable } from "react-native";
import { AvatarSelector, AVATARS } from "./AvatarSelector";

interface AvatarGridProps {
  selectedAvatar: string | null;
  onSelect: (avatarId: string) => void;
  columns?: 2 | 4;
  title?: string;
  subtitle?: string;
}

export function AvatarGrid({
  selectedAvatar,
  onSelect,
  columns = 2,
  title,
  subtitle,
}: AvatarGridProps) {
  return (
    <View>
      {title && (
        <Text className="text-lg font-semibold text-neutral-900 mb-1">
          {title}
        </Text>
      )}
      {subtitle && (
        <Text className="text-sm text-neutral-600 mb-4">
          {subtitle}
        </Text>
      )}

      {columns === 4 ? (
        <CompactGrid selectedAvatar={selectedAvatar} onSelect={onSelect} />
      ) : (
        <AvatarSelector selectedAvatar={selectedAvatar} onSelect={onSelect} />
      )}
    </View>
  );
}

function CompactGrid({
  selectedAvatar,
  onSelect,
}: {
  selectedAvatar: string | null;
  onSelect: (avatarId: string) => void;
}) {
  return (
    <View className="flex-row flex-wrap justify-between">
      {AVATARS.map((avatar) => {
        const isSelected = selectedAvatar === avatar.id;

        return (
          <Pressable
            key={avatar.id}
            onPress={() => onSelect(avatar.id)}
            accessibilityRole="button"
            accessibilityLabel={`Select avatar ${avatar.name}`}
            className="w-[23%] items-center mb-4"
          >
            <View
              className={`w-16 h-16 rounded-full items-center justify-center mb-1 ${
                isSelected
                  ? "bg-primary-100 border-2 border-primary-500"
                  : "bg-neutral-100 border-2 border-transparent"
              }`}
            >
              <Text className="text-3xl">
                {avatar.emoji}
              </Text>
            </View>
            <Text className="text-xs text-neutral-600">
              {avatar.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export { AVATARS };
