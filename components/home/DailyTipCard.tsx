import { View, Text } from "react-native";
import Svg, { Path } from "react-native-svg";

const DAILY_TIPS = [
  "Remember to take deep breaths throughout the day.",
  "Stay hydrated — drink at least 8 glasses of water.",
  "Take short walks to stay active during recovery.",
  "Get plenty of rest — your body needs it to heal.",
  "Reach out if you have questions — we're here to help.",
  "Celebrate small wins in your recovery journey.",
  "Listen to your body and don't push too hard.",
];

export function DailyTipCard() {
  const dayOfWeek = new Date().getDay();
  const tip = DAILY_TIPS[dayOfWeek];

  return (
    <View className="bg-primary-50 dark:bg-primary-900/10 rounded-2xl p-4 border border-primary-200 dark:border-primary-800">
      <View className="flex-row items-start gap-3">
        <View className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full items-center justify-center">
          <LightbulbIcon />
        </View>

        <View className="flex-1">
          <Text className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-1">
            DAILY TIP
          </Text>
          <Text className="text-sm text-neutral-800 dark:text-neutral-200 leading-5">
            {tip}
          </Text>
        </View>
      </View>
    </View>
  );
}

function LightbulbIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        stroke="#4E9FBA"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
