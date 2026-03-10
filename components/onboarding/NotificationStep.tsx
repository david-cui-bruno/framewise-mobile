import { View, Text, Pressable } from "react-native";
import { BlueGradient } from "@/components/ui/BlueGradient";
import Svg, { Path, Rect, Circle, Ellipse, Line } from "react-native-svg";

interface NotificationStepProps {
  onEnable: () => void;
  onSkip: () => void;
}

export function NotificationStep({ onEnable, onSkip }: NotificationStepProps) {
  return (
    <BlueGradient className="flex-1">
      {/* Text content at top */}
      <View className="px-8 mt-16">
        <Text className="text-[28px] font-bold text-white leading-10 mb-4">
          Don't forget to turn on notifications
        </Text>
        <Text className="text-xl text-white font-normal leading-7">
          We'd like to send you notifications from time to time to deepen your
          experience with us.
        </Text>
      </View>

      {/* Illustration */}
      <View className="flex-1 items-center justify-center">
        <NotificationIllustration />
      </View>

      {/* Buttons */}
      <View className="px-6 pb-4 gap-3">
        <Pressable
          onPress={onEnable}
          className="bg-[#1D61E7] h-14 rounded-full items-center justify-center"
        >
          <Text className="text-xl font-bold text-white">
            Enable Notifications
          </Text>
        </Pressable>
        <Pressable
          onPress={onSkip}
          className="bg-white h-14 rounded-full items-center justify-center"
        >
          <Text className="text-base font-bold text-[#0B1220]">Not Now</Text>
        </Pressable>
      </View>
    </BlueGradient>
  );
}

function NotificationIllustration() {
  return (
    <Svg width={236} height={250} viewBox="0 0 236 250" fill="none">
      <Rect x={90} y={20} width={120} height={210} rx={16} fill="#FFFFFF" stroke="#E2E8F0" strokeWidth={2} />
      <Rect x={96} y={40} width={108} height={170} fill="#F8FAFC" />
      <Rect x={130} y={24} width={40} height={8} rx={4} fill="#E2E8F0" />
      <Path
        d="M150 55c-6 0-10 5-10 10v8c-3 1-5 4-5 7h30c0-3-2-6-5-7v-8c0-5-4-10-10-10z"
        stroke="#2D3748"
        strokeWidth={1.5}
        fill="none"
      />
      <Circle cx={150} cy={82} r={2.5} fill="#2D3748" />
      <Line x1={150} y1={50} x2={150} y2={53} stroke="#2D3748" strokeWidth={1.5} strokeLinecap="round" />
      <Rect x={105} y={92} width={90} height={22} rx={11} fill="#E8F0FE" />
      <Rect x={112} y={100} width={40} height={5} rx={2.5} fill="#93B4F5" />
      <Rect x={105} y={120} width={90} height={22} rx={11} fill="#E8F0FE" />
      <Rect x={112} y={128} width={50} height={5} rx={2.5} fill="#93B4F5" />
      <Rect x={105} y={148} width={90} height={22} rx={11} fill="#E8F0FE" />
      <Rect x={112} y={156} width={35} height={5} rx={2.5} fill="#93B4F5" />
      <Circle cx={150} cy={188} r={12} fill="#3B7BF7" />
      <Path d="M144 185h12M144 189h8" stroke="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M155 195l5 5v-5z" fill="#3B7BF7" />
      <Circle cx={60} cy={120} r={16} fill="#D4A574" />
      <Path d="M45 115c1-12 8-16 15-16s14 5 15 14" fill="#2D3748" />
      <Rect x={47} y={135} width={26} height={45} rx={6} fill="#3B7BF7" />
      <Path d="M50 142c-5 8-8 18-6 28" stroke="#3B7BF7" strokeWidth={9} strokeLinecap="round" fill="none" />
      <Path d="M71 145c8 5 15 10 20 15" stroke="#3B7BF7" strokeWidth={9} strokeLinecap="round" fill="none" />
      <Circle cx={92} cy={161} r={5} fill="#D4A574" />
      <Rect x={49} y={180} width={10} height={40} rx={4} fill="#1A202C" />
      <Rect x={61} y={180} width={10} height={40} rx={4} fill="#1A202C" />
      <Ellipse cx={54} cy={221} rx={7} ry={3.5} fill="#2D3748" />
      <Ellipse cx={66} cy={221} rx={7} ry={3.5} fill="#2D3748" />
      <Rect x={30} y={224} width={180} height={1.5} rx={0.75} fill="#FFFFFF" opacity={0.15} />
    </Svg>
  );
}
