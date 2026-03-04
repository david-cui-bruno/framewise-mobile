import { View, Text, Pressable, Linking } from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "@/constants/colors";

interface RiskBannerProps {
  severity: "warning" | "urgent";
  emergencyPhone?: string;
}

export function RiskBanner({
  severity,
  emergencyPhone = "911",
}: RiskBannerProps) {
  const isUrgent = severity === "urgent";

  const handleCall = () => {
    Linking.openURL(`tel:${emergencyPhone}`);
  };

  return (
    <View
      className={`mx-4 mb-3 rounded-2xl p-4 ${
        isUrgent ? "bg-error-50" : "bg-warning-50"
      }`}
    >
      <View className="flex-row items-start gap-3">
        <View
          className={`w-8 h-8 rounded-full items-center justify-center ${
            isUrgent ? "bg-error-100" : "bg-warning-100"
          }`}
        >
          <AlertIcon color={isUrgent ? colors.danger : colors.warning} />
        </View>

        <View className="flex-1">
          <Text
            className={`text-sm font-semibold mb-1 ${
              isUrgent ? "text-error-600" : "text-warning-600"
            }`}
          >
            {isUrgent
              ? "This sounds urgent"
              : "This may need medical attention"}
          </Text>
          <Text
            className={`text-sm ${
              isUrgent ? "text-error-500" : "text-warning-500"
            }`}
          >
            {isUrgent
              ? "If you are experiencing a medical emergency, please call emergency services immediately."
              : "If your symptoms are concerning, please contact your care team."}
          </Text>

          {isUrgent && (
            <Pressable
              onPress={handleCall}
              className="bg-error-500 rounded-full py-2.5 px-6 mt-3 self-start flex-row items-center gap-2"
            >
              <PhoneIcon />
              <Text className="text-white font-semibold text-sm">
                Call {emergencyPhone}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

function AlertIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        stroke={color}
        strokeWidth={2}
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
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
