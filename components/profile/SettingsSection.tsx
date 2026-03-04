import { View, Text } from "react-native";
import { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="bg-neutral-0 rounded-2xl p-5 mx-4 mb-4">
      <Text className="text-sm font-medium text-neutral-500 mb-3">
        {title}
      </Text>
      {children}
    </View>
  );
}
