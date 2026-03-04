import { View, Text, Pressable, Linking } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/constants/colors";

interface Physician {
  name: string;
  specialty: string | null;
  practice_name: string | null;
  practice_phone: string | null;
}

interface CareTeamCardProps {
  physician: Physician | null;
}

export function CareTeamCard({ physician }: CareTeamCardProps) {
  if (!physician) {
    return (
      <View className="items-center py-4">
        <Text className="text-neutral-500 text-sm">
          No care team assigned yet.
        </Text>
      </View>
    );
  }

  const handleCallPress = () => {
    if (physician.practice_phone) {
      const phoneUrl = `tel:${physician.practice_phone.replace(/[^\d+]/g, "")}`;
      Linking.openURL(phoneUrl).catch((err) =>
        console.error("Failed to open phone:", err)
      );
    }
  };

  return (
    <View>
      <View className="flex-row items-center gap-3 mb-3">
        <View className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center">
          <DoctorIcon />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-neutral-900">
            {physician.name}
          </Text>
          {physician.specialty && (
            <Text className="text-sm text-neutral-500">
              {physician.specialty}
            </Text>
          )}
        </View>
      </View>

      {physician.practice_name && (
        <Text className="text-sm text-neutral-600 mb-1">
          {physician.practice_name}
        </Text>
      )}

      {physician.practice_phone && (
        <Pressable
          onPress={handleCallPress}
          className="flex-row items-center gap-2 mt-2"
        >
          <PhoneIcon />
          <Text className="text-sm font-medium text-primary-600">
            {physician.practice_phone}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function DoctorIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        stroke={colors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PhoneIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        stroke={colors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
