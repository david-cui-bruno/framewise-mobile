import { View, Text, Pressable, Switch, ActivityIndicator } from "react-native";
import { useRouter, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePatientPrefs } from "@/hooks/usePatientPrefs";
import { colors } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const amPm = i < 12 ? "AM" : "PM";
  return { value: `${String(i).padStart(2, "0")}:00`, label: `${hour}:00 ${amPm}` };
});

export default function NotificationPreferencesScreen() {
  const router = useRouter();
  const { notificationPrefs, isLoading, updateNotificationPrefs } =
    usePatientPrefs();

  const handleToggle = (
    key: "medication_reminders" | "daily_check_in_reminders" | "engagement_nudges",
    value: boolean
  ) => {
    updateNotificationPrefs({ [key]: value });
  };

  const handleQuietHoursChange = (
    key: "quiet_hours_start" | "quiet_hours_end",
    value: string
  ) => {
    updateNotificationPrefs({ [key]: value });
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView className="flex-1 bg-neutral-50 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-neutral-50">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-neutral-100 items-center justify-center"
          >
            <BackIcon />
          </Pressable>
          <Text className="flex-1 text-lg font-semibold text-neutral-900 text-center mr-10">
            Notifications
          </Text>
        </View>

        <View className="flex-1 px-4">
          {/* Notification Toggles */}
          <View className="bg-neutral-0 rounded-2xl p-5 mb-4">
            <Text className="text-sm font-medium text-neutral-500 mb-4">
              Notification Types
            </Text>

            <ToggleRow
              label="Medication Reminders"
              description="Get reminders to take your medications on time"
              value={notificationPrefs?.medication_reminders ?? true}
              onToggle={(v) => handleToggle("medication_reminders", v)}
            />

            <ToggleRow
              label="Daily Check-in Reminders"
              description="Reminders to complete your daily mood check-in"
              value={notificationPrefs?.daily_check_in_reminders ?? true}
              onToggle={(v) => handleToggle("daily_check_in_reminders", v)}
            />

            <ToggleRow
              label="Engagement Nudges"
              description="Gentle nudges when you have incomplete tasks"
              value={notificationPrefs?.engagement_nudges ?? true}
              onToggle={(v) => handleToggle("engagement_nudges", v)}
              isLast
            />
          </View>

          {/* Quiet Hours */}
          <View className="bg-neutral-0 rounded-2xl p-5 mb-4">
            <Text className="text-sm font-medium text-neutral-500 mb-4">
              Quiet Hours
            </Text>
            <Text className="text-sm text-neutral-600 mb-4">
              No notifications will be sent during quiet hours.
            </Text>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base text-neutral-900">Start</Text>
              <TimePicker
                value={notificationPrefs?.quiet_hours_start ?? "22:00"}
                onChange={(v) => handleQuietHoursChange("quiet_hours_start", v)}
              />
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-base text-neutral-900">End</Text>
              <TimePicker
                value={notificationPrefs?.quiet_hours_end ?? "08:00"}
                onChange={(v) => handleQuietHoursChange("quiet_hours_end", v)}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  isLast?: boolean;
}

function ToggleRow({
  label,
  description,
  value,
  onToggle,
  isLast,
}: ToggleRowProps) {
  return (
    <View
      className={`flex-row items-center justify-between py-3 ${
        !isLast ? "border-b border-neutral-100" : ""
      }`}
    >
      <View className="flex-1 mr-4">
        <Text className="text-base font-medium text-neutral-900">{label}</Text>
        <Text className="text-sm text-neutral-500 mt-0.5">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
        thumbColor={colors.switchThumb}
      />
    </View>
  );
}

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

function TimePicker({ value, onChange }: TimePickerProps) {
  const currentIndex = HOUR_OPTIONS.findIndex((h) => h.value === value);
  const displayLabel =
    HOUR_OPTIONS.find((h) => h.value === value)?.label ?? value;

  const cycleNext = () => {
    const nextIndex = (currentIndex + 1) % HOUR_OPTIONS.length;
    onChange(HOUR_OPTIONS[nextIndex].value);
  };

  return (
    <Pressable
      onPress={cycleNext}
      className="bg-neutral-50 px-4 py-2 rounded-xl"
    >
      <Text className="text-base font-medium text-primary-600">
        {displayLabel}
      </Text>
    </Pressable>
  );
}

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 19l-7-7 7-7"
        stroke={colors.textPrimary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
