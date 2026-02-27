import { View, Text, Pressable } from "react-native";

type TabId = "video" | "transcript";

interface ModuleTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  hasTranscript?: boolean;
}

export function ModuleTabs({
  activeTab,
  onTabChange,
  hasTranscript = true,
}: ModuleTabsProps) {
  const tabs: { id: TabId; label: string }[] = [
    { id: "video", label: "Details" },
    ...(hasTranscript ? [{ id: "transcript" as TabId, label: "Transcript" }] : []),
  ];

  return (
    <View className="flex-row border-b border-neutral-200 dark:border-neutral-700">
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          className="flex-1 py-3 relative"
        >
          <Text
            className={`text-center font-medium ${
              activeTab === tab.id
                ? "text-primary-600 dark:text-primary-400"
                : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            {tab.label}
          </Text>
          {activeTab === tab.id && (
            <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />
          )}
        </Pressable>
      ))}
    </View>
  );
}
