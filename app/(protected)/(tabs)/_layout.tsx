import { Tabs } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#9198A2",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E6EEF6",
          borderTopWidth: 2,
          paddingBottom: 4,
          paddingTop: 4,
          height: 72,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: "Diary",
          tabBarIcon: ({ color }) => <TabBarIcon name="diary" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="profile" color={color} />,
        }}
      />
    </Tabs>
  );
}
