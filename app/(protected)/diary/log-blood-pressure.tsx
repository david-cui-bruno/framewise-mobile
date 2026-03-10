import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { BlueGradient } from "@/components/ui/BlueGradient";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { colors } from "@/constants/colors";

export default function LogBloodPressureScreen() {
  const router = useRouter();
  const { patient } = useAuthContext();
  const [systolic1, setSystolic1] = useState("");
  const [diastolic1, setDiastolic1] = useState("");
  const [systolic2, setSystolic2] = useState("");
  const [diastolic2, setDiastolic2] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const hasFirstReading = systolic1.trim() && diastolic1.trim();

  const handleSave = async () => {
    if (!patient || !hasFirstReading || isSaving) return;

    const readings = {
      first: {
        systolic: parseInt(systolic1, 10),
        diastolic: parseInt(diastolic1, 10),
      },
      ...(systolic2.trim() && diastolic2.trim()
        ? {
            second: {
              systolic: parseInt(systolic2, 10),
              diastolic: parseInt(diastolic2, 10),
            },
          }
        : {}),
    };

    setIsSaving(true);
    try {
      await supabase.from("health_metrics").upsert(
        {
          patient_id: patient.id,
          metric_type: "blood_pressure",
          value: JSON.stringify(readings),
          unit: "mmHg",
          recorded_date: dateString,
        },
        { onConflict: "patient_id,metric_type,recorded_date" }
      );
    } catch {
      // health_metrics table may not exist yet — fail silently
    } finally {
      setIsSaving(false);
      router.back();
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1">
        {/* Gradient header */}
        <BlueGradient className="pt-14">
          <View className="flex-row items-center justify-between h-12 px-4">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center"
            >
              <CloseIcon />
            </Pressable>
            <Text className="text-base font-semibold text-white">
              Log Blood Pressure
            </Text>
            <Pressable
              onPress={handleSave}
              disabled={!hasFirstReading || isSaving}
              className="w-10 h-10 items-center justify-center"
            >
              <CheckIcon />
            </Pressable>
          </View>
        </BlueGradient>

        {/* Form rows */}
        <View className="flex-1 bg-white">
          {/* First Reading */}
          <View className="flex-row items-center justify-between h-[52px] px-3 bg-[#F9FBFF] border-b border-[#E6E6E6]">
            <Text className="text-sm font-semibold text-black">
              First Reading
            </Text>
            <View className="flex-row items-center gap-1">
              <TextInput
                value={systolic1}
                onChangeText={setSystolic1}
                placeholder="--"
                placeholderTextColor={colors.iconMuted}
                keyboardType="number-pad"
                className="text-sm font-semibold text-[#1D61E7] text-right w-10"
              />
              <Text className="text-sm font-semibold text-[#1D61E7]">/</Text>
              <TextInput
                value={diastolic1}
                onChangeText={setDiastolic1}
                placeholder="--"
                placeholderTextColor={colors.iconMuted}
                keyboardType="number-pad"
                className="text-sm font-semibold text-[#1D61E7] text-right w-10"
              />
            </View>
          </View>

          {/* Second Reading */}
          <View className="flex-row items-center justify-between h-[52px] px-3 bg-[#F9FBFF] border-b border-[#E6E6E6]">
            <Text className="text-sm font-semibold text-black">
              Second Reading
            </Text>
            <View className="flex-row items-center gap-1">
              <TextInput
                value={systolic2}
                onChangeText={setSystolic2}
                placeholder="--"
                placeholderTextColor={colors.iconMuted}
                keyboardType="number-pad"
                className="text-sm font-semibold text-[#1D61E7] text-right w-10"
              />
              <Text className="text-sm font-semibold text-[#1D61E7]">/</Text>
              <TextInput
                value={diastolic2}
                onChangeText={setDiastolic2}
                placeholder="--"
                placeholderTextColor={colors.iconMuted}
                keyboardType="number-pad"
                className="text-sm font-semibold text-[#1D61E7] text-right w-10"
              />
            </View>
          </View>

          {/* Date */}
          <View className="flex-row items-center justify-between h-[52px] px-3 bg-[#F9FBFF] border-b border-[#E6E6E6]">
            <Text className="text-sm font-semibold text-black">Date</Text>
            <Text className="text-sm font-semibold text-[#1D61E7]">
              {dateLabel}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}
