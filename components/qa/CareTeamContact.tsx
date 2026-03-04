import { View, Text, Pressable, Linking } from "react-native";
import Svg, { Path } from "react-native-svg";
import { getShadow } from "@/constants/theme";
import { colors } from "@/constants/colors";

interface CareTeamContactProps {
  physicianName: string;
  specialty: string | null;
  phone: string | null;
}

export function CareTeamContact({
  physicianName,
  specialty,
  phone,
}: CareTeamContactProps) {
  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  return (
    <View
      className="bg-neutral-0 rounded-2xl p-4 mx-4 mb-3"
      style={getShadow("sm")}
    >
      <View className="flex-row items-center gap-3">
        <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center">
          <DoctorIcon />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-semibold text-neutral-900">
            {physicianName}
          </Text>
          {specialty && (
            <Text className="text-xs text-neutral-500">{specialty}</Text>
          )}
        </View>

        {phone && (
          <Pressable
            onPress={handleCall}
            className="w-10 h-10 rounded-full bg-success-100 items-center justify-center"
          >
            <PhoneIcon />
          </Pressable>
        )}
      </View>
    </View>
  );
}

function DoctorIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
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
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        stroke={colors.success}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
