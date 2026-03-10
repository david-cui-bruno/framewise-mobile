import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { ensurePatientHasCareAssignment } from "@/lib/tasks";
import { registerPushToken } from "@/lib/notifications/registerPushToken";
import { AvatarGrid } from "@/components/avatar/AvatarGrid";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { TextSizeStep } from "@/components/onboarding/TextSizeStep";
import { NotificationStep } from "@/components/onboarding/NotificationStep";
import { BlueGradient } from "@/components/ui/BlueGradient";
import Svg, { Path, Circle, Rect, Ellipse, Line } from "react-native-svg";

export default function OnboardingScreen() {
  const { patient, refreshSession } = useAuthContext();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedTextSize, setSelectedTextSize] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 6 steps total: 3 welcome slides + avatar + text size + notifications
  const TOTAL_STEPS = 6;

  const handleComplete = async () => {
    if (!patient || !selectedAvatar || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase
        .from("patients")
        .update({
          avatar_id: selectedAvatar,
          text_size: selectedTextSize,
          onboarding_completed: true,
        })
        .eq("id", patient.id);

      if (error) {
        setErrorMessage("Something went wrong. Please try again.");
        return;
      }

      await supabase
        .from("patient_notification_prefs")
        .upsert({ patient_id: patient.id }, { onConflict: "patient_id" });

      await ensurePatientHasCareAssignment(supabase, patient.id);
      await refreshSession();
      router.replace("/home");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canContinue =
    step <= 3 || // welcome slides always continuable
    (step === 4 && selectedAvatar !== null) ||
    step === 5 ||
    step === 6;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  // Step 1: Welcome
  if (step === 1) {
    return (
      <LinearGradient
        colors={["#1D61E7", "#2B6DEA", "#1D61E7"]}
        className="flex-1"
      >
        <View className="items-center mt-24 mb-8">
          <MedicalIllustration />
        </View>
        <View className="flex-1 justify-end px-6 pb-4">
          <Text className="text-[32px] font-bold text-white leading-tight mb-3">
            Healing starts at{"\n"}home
          </Text>
          <Text className="text-base text-white/80 leading-relaxed mb-10">
            Your care doesn't end at discharge. We're with you every step of the way.
          </Text>
          <View className="flex-row items-center justify-center gap-2 mb-8">
            <View className="w-2.5 h-2.5 rounded-full bg-white" />
            <View className="w-2 h-2 rounded-full bg-white/40" />
            <View className="w-2 h-2 rounded-full bg-white/40" />
          </View>
          <Pressable
            onPress={handleNext}
            className="bg-white h-14 rounded-full items-center justify-center mb-2"
          >
            <Text className="text-lg font-bold text-neutral-900">Continue</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  // Step 2: Video explanation
  if (step === 2) {
    return (
      <View className="flex-1 bg-[#1D61E7]">
        <View className="items-center mt-20 mb-8">
          <MediaPlayerIllustration />
        </View>
        <View className="flex-1 justify-end px-8 pb-4">
          <Text className="text-[32px] font-bold text-white leading-10 mb-4">
            Your recovery,{"\n"}explained
          </Text>
          <Text className="text-base text-white font-normal leading-6 mb-10">
            Personalized videos made just for you, so you always know what to do next.
          </Text>
          <View className="flex-row items-center justify-center gap-3 mb-8">
            <View className="w-2 h-2 rounded-full bg-white/40" />
            <View className="w-2.5 h-2.5 rounded-full bg-white" />
            <View className="w-2 h-2 rounded-full bg-white/40" />
          </View>
          <Pressable
            onPress={handleNext}
            className="bg-white h-14 rounded-full items-center justify-center mb-2"
          >
            <Text className="text-xl font-bold text-[#002240]">Continue</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Step 3: Track progress
  if (step === 3) {
    return (
      <View className="flex-1 bg-[#1D61E7]">
        <View className="items-center mt-24 mb-8">
          <HighFiveIllustration />
        </View>
        <View className="flex-1 justify-end px-8 pb-4">
          <Text className="text-[32px] font-bold text-white leading-10 mb-4">
            Stay on track, stay{"\n"}well
          </Text>
          <Text className="text-base text-white font-normal leading-6 mb-10">
            Patients who follow their discharge plan are 3x less likely to receive
            additional care.
          </Text>
          <Pressable
            onPress={handleNext}
            className="bg-white h-14 rounded-full items-center justify-center mb-2"
          >
            <Text className="text-xl font-bold text-[#002240]">Continue</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Step 4: Choose Avatar
  if (step === 4) {
    return (
      <BlueGradient className="flex-1">
        <Text className="text-[28px] font-bold text-white text-center mt-16">
          Choose your avatar
        </Text>
        <StepIndicator currentStep={1} totalSteps={3} />

        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ gap: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white rounded-3xl p-5">
            <AvatarGrid
              selectedAvatar={selectedAvatar}
              onSelect={setSelectedAvatar}
              columns={4}
            />
          </View>
        </ScrollView>

        <View className="px-6 pb-4">
          {errorMessage && (
            <Text className="text-white text-center text-sm mb-3">
              {errorMessage}
            </Text>
          )}
          <Pressable
            onPress={handleNext}
            disabled={!canContinue}
            className={`h-14 rounded-full items-center justify-center ${
              canContinue ? "bg-[#1D61E7]" : "bg-[#1D61E7]/50"
            }`}
          >
            <Text className="text-xl font-bold text-white">Continue</Text>
          </Pressable>
        </View>
      </BlueGradient>
    );
  }

  // Step 5: Text Size
  if (step === 5) {
    return (
      <BlueGradient className="flex-1">
        <Text className="text-[28px] font-bold text-white text-center mt-16">
          Select your text size
        </Text>
        <StepIndicator currentStep={2} totalSteps={3} />

        <View className="flex-1 px-10 mt-4">
          <TextSizeStep
            selected={selectedTextSize}
            onSelect={setSelectedTextSize}
          />
        </View>

        <View className="px-6 pb-4">
          <Pressable
            onPress={handleNext}
            className="bg-[#1D61E7] h-14 rounded-full items-center justify-center"
          >
            <Text className="text-xl font-bold text-white">Continue</Text>
          </Pressable>
        </View>
      </BlueGradient>
    );
  }

  // Step 6: Notifications
  return (
    <>
      <NotificationStep
        onEnable={async () => {
          if (patient) {
            await registerPushToken(supabase, patient.id);
          }
          handleComplete();
        }}
        onSkip={handleComplete}
      />

      {isSubmitting && (
        <View className="absolute inset-0 bg-neutral-900/20 items-center justify-center">
          <View className="bg-neutral-0 rounded-2xl p-6 items-center">
            <Text className="text-neutral-600">Getting started...</Text>
          </View>
        </View>
      )}
    </>
  );
}

/* ---- Onboarding Illustrations ---- */

function MedicalIllustration() {
  return (
    <Svg width={300} height={220} viewBox="0 0 300 220" fill="none">
      <Rect x={60} y={30} width={180} height={160} rx={12} fill="#2B6DEA" opacity={0.4} />
      <Rect x={80} y={50} width={30} height={40} rx={4} fill="#3A78ED" opacity={0.6} />
      <Rect x={120} y={50} width={30} height={40} rx={4} fill="#3A78ED" opacity={0.6} />
      <Rect x={190} y={50} width={30} height={40} rx={4} fill="#3A78ED" opacity={0.6} />
      <Rect x={80} y={100} width={30} height={40} rx={4} fill="#3A78ED" opacity={0.6} />
      <Rect x={190} y={100} width={30} height={40} rx={4} fill="#3A78ED" opacity={0.6} />
      <Path d="M150 55c-5-15-25-18-30-5s5 25 30 40c25-15 35-27 30-40s-25-10-30 5z" fill="#7CB8F7" opacity={0.6} />
      <Path d="M132 72h8l4-8 6 16 5-12 4 4h10" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Rect x={20} y={190} width={260} height={2} rx={1} fill="#2B6DEA" opacity={0.3} />
      <Rect x={30} y={160} width={28} height={30} rx={4} fill="#3D3D3D" />
      <Rect x={33} y={155} width={22} height={8} rx={3} fill="#4A4A4A" />
      <Path d="M44 155c-8-20-20-15-18-5s10 10 18 5z" fill="#5A9B6B" />
      <Path d="M44 155c5-22 18-18 16-6s-10 10-16 6z" fill="#4A8B5B" />
      <Path d="M44 148c-3-18-14-14-12-4s8 8 12 4z" fill="#6AAB7B" />
      <Circle cx={130} cy={105} r={14} fill="#D4A574" />
      <Path d="M117 100c0-10 8-16 14-16s12 6 12 14" fill="#4A3728" />
      <Rect x={117} y={118} width={26} height={50} rx={4} fill="#FFFFFF" />
      <Path d="M127 118v20" stroke="#E5E5E5" strokeWidth={1} />
      <Path d="M133 118v20" stroke="#E5E5E5" strokeWidth={1} />
      <Rect x={120} y={168} width={10} height={22} rx={3} fill="#3D5A80" />
      <Rect x={132} y={168} width={10} height={22} rx={3} fill="#3D5A80" />
      <Ellipse cx={125} cy={190} rx={6} ry={3} fill="#2D2D2D" />
      <Ellipse cx={137} cy={190} rx={6} ry={3} fill="#2D2D2D" />
      <Circle cx={200} cy={108} r={13} fill="#D4A574" />
      <Path d="M188 105c1-12 8-16 13-16s11 5 12 13c1 4 2 15-2 20" fill="#5C3A1E" />
      <Rect x={189} y={120} width={22} height={35} rx={4} fill="#FFFFFF" />
      <Path d="M197 120v15" stroke="#E5E5E5" strokeWidth={1} />
      <Path d="M189 155h22l4 18h-30z" fill="#1A1A2E" />
      <Rect x={192} y={173} width={7} height={17} rx={2} fill="#D4A574" />
      <Rect x={203} y={173} width={7} height={17} rx={2} fill="#D4A574" />
      <Ellipse cx={195} cy={190} rx={5} ry={3} fill="#1A1A2E" />
      <Ellipse cx={207} cy={190} rx={5} ry={3} fill="#1A1A2E" />
      <Rect x={213} y={130} width={14} height={18} rx={2} fill="#E8E8E8" />
      <Rect x={215} y={134} width={10} height={2} rx={1} fill="#C0C0C0" />
      <Rect x={215} y={138} width={8} height={2} rx={1} fill="#C0C0C0" />
      <Rect x={215} y={142} width={10} height={2} rx={1} fill="#C0C0C0" />
    </Svg>
  );
}

function MediaPlayerIllustration() {
  return (
    <Svg width={287} height={300} viewBox="0 0 287 300" fill="none">
      <Rect x={60} y={30} width={200} height={150} rx={10} fill="#FFFFFF" />
      <Rect x={60} y={30} width={200} height={28} rx={10} fill="#EEF0F4" />
      <Circle cx={78} cy={44} r={4} fill="#D1D5DB" />
      <Circle cx={92} cy={44} r={4} fill="#D1D5DB" />
      <Rect x={108} y={38} width={120} height={12} rx={6} fill="#D1D5DB" />
      <Line x1={242} y1={40} x2={254} y2={40} stroke="#C0C4CC" strokeWidth={2} />
      <Line x1={242} y1={44} x2={254} y2={44} stroke="#C0C4CC" strokeWidth={2} />
      <Line x1={242} y1={48} x2={254} y2={48} stroke="#C0C4CC" strokeWidth={2} />
      <Rect x={70} y={65} width={180} height={105} fill="#E8EDF4" />
      <Circle cx={160} cy={100} r={28} fill="#3B7BF7" opacity={0.9} />
      <Path d="M153 87l20 13-20 13z" fill="#FFFFFF" />
      <Rect x={160} y={155} width={80} height={6} rx={3} fill="#D1D5DB" />
      <Rect x={160} y={155} width={40} height={6} rx={3} fill="#C0C4CC" />
      <Circle cx={135} cy={175} r={16} fill="#5B9BD5" opacity={0.3} />
      <Circle cx={135} cy={175} r={14} fill="#D4A574" />
      <Path d="M122 170c1-10 7-14 13-14s12 4 13 12" fill="#2D3748" />
      <Path d="M120 172c0-10 7-17 15-17s15 7 15 17" stroke="#5B9BD5" strokeWidth={4} fill="none" />
      <Rect x={123} y={188} width={24} height={40} rx={6} fill="#2D3748" />
      <Path d="M125 195c-8-20-5-50 5-70" stroke="#D4A574" strokeWidth={8} strokeLinecap="round" fill="none" />
      <Circle cx={130} cy={125} r={6} fill="#D4A574" />
      <Path d="M147 200c5 5 10 15 12 25" stroke="#D4A574" strokeWidth={8} strokeLinecap="round" fill="none" />
      <Rect x={125} y={228} width={10} height={42} rx={4} fill="#1A202C" />
      <Rect x={137} y={228} width={10} height={42} rx={4} fill="#1A202C" />
      <Rect x={121} y={268} width={16} height={8} rx={4} fill="#4A5568" />
      <Rect x={135} y={268} width={16} height={8} rx={4} fill="#4A5568" />
      <Rect x={60} y={275} width={200} height={2} rx={1} fill="#2B6DEA" opacity={0.3} />
    </Svg>
  );
}

function HighFiveIllustration() {
  return (
    <Svg width={309} height={222} viewBox="0 0 309 222" fill="none">
      <Circle cx={80} cy={40} r={22} fill="#F4A340" />
      <Ellipse cx={95} cy={52} rx={28} ry={12} fill="#FFFFFF" opacity={0.9} />
      <Ellipse cx={75} cy={50} rx={20} ry={10} fill="#FFFFFF" opacity={0.9} />
      <Rect x={248} y={150} width={8} height={50} rx={3} fill="#2B6DEA" opacity={0.3} />
      <Ellipse cx={252} cy={130} rx={35} ry={45} fill="#FFFFFF" opacity={0.15} />
      <Ellipse cx={255} cy={140} rx={30} ry={38} fill="#FFFFFF" opacity={0.12} />
      <Rect x={30} y={200} width={250} height={1.5} rx={0.75} fill="#FFFFFF" opacity={0.2} />
      <Circle cx={125} cy={100} r={14} fill="#D4A574" />
      <Path d="M112 96c1-10 7-14 13-14s12 5 13 12" fill="#3D2E1E" />
      <Rect x={113} y={113} width={24} height={38} rx={5} fill="#7CB8F7" />
      <Path d="M120 118c-5-8-2-18 5-25" stroke="#7CB8F7" strokeWidth={9} strokeLinecap="round" fill="none" />
      <Circle cx={125} cy={90} r={5} fill="#D4A574" />
      <Path d="M135 118c3-5 8-12 15-18" stroke="#7CB8F7" strokeWidth={9} strokeLinecap="round" fill="none" />
      <Circle cx={150} cy={98} r={5} fill="#D4A574" />
      <Rect x={116} y={151} width={9} height={38} rx={3} fill="#2D3748" />
      <Rect x={127} y={151} width={9} height={38} rx={3} fill="#2D3748" />
      <Ellipse cx={120} cy={190} rx={7} ry={3.5} fill="#1A202C" />
      <Ellipse cx={132} cy={190} rx={7} ry={3.5} fill="#1A202C" />
      <Circle cx={175} cy={100} r={13} fill="#D4A574" />
      <Path d="M163 97c1-11 7-15 12-15s11 5 12 13c0 3 1 10-1 16" fill="#2D2040" />
      <Rect x={164} y={112} width={22} height={38} rx={5} fill="#3B5998" />
      <Path d="M166 118c-4-6-8-14-12-20" stroke="#3B5998" strokeWidth={8} strokeLinecap="round" fill="none" />
      <Circle cx={153} cy={97} r={5} fill="#D4A574" />
      <Path d="M184 120c5 5 10 15 12 25" stroke="#D4A574" strokeWidth={7} strokeLinecap="round" fill="none" />
      <Rect x={167} y={150} width={9} height={38} rx={3} fill="#2D3748" />
      <Rect x={178} y={150} width={9} height={38} rx={3} fill="#2D3748" />
      <Ellipse cx={171} cy={189} rx={6} ry={3.5} fill="#1A202C" />
      <Ellipse cx={183} cy={189} rx={6} ry={3.5} fill="#1A202C" />
    </Svg>
  );
}
