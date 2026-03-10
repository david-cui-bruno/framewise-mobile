import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { AVATARS } from "@/components/avatar/AvatarSelector";
import { BlueGradient } from "@/components/ui/BlueGradient";
const MENU_ITEMS = [
  { label: "Date of Birth", route: null },
  { label: "Emergency Contact", route: "/profile/emergency-contacts" },
  { label: "Text Size", route: null },
  { label: "Notifications", route: "/profile/notifications" },
  { label: "Help", route: null },
];

export default function ProfileScreen() {
  const { patient, signOut } = useAuthContext();
  const router = useRouter();
  const avatarEmoji =
    AVATARS.find((a) => a.id === patient?.avatar_id)?.emoji ?? "👤";
  const displayName = patient?.display_name || "Patient";

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <View className="flex-1">
      {/* Gradient background with avatar */}
      <BlueGradient className="items-center pt-20 pb-10">
        {/* Avatar */}
        <View className="w-28 h-28 rounded-full bg-white/20 items-center justify-center">
          <Text className="text-5xl">{avatarEmoji}</Text>
        </View>

        {/* Name */}
        <Text className="text-[32px] font-semibold text-white mt-3">
          {displayName}
        </Text>
      </BlueGradient>

      {/* White card with menu items */}
      <View className="flex-1 bg-white -mt-5 rounded-t-[20px] px-8 pt-3">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {MENU_ITEMS.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => {
                if (item.route) router.push(item.route as any);
              }}
              className="py-5"
            >
              <Text className="text-base font-semibold text-[#6B7280]">
                {item.label}
              </Text>
            </Pressable>
          ))}

          {/* Sign Out */}
          <Pressable
            onPress={handleSignOut}
            className="mt-4 bg-error-50 rounded-2xl py-4 items-center"
          >
            <Text className="text-base font-semibold text-error-600">
              Sign Out
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}
