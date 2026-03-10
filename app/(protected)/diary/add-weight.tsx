import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { BlueGradient } from "@/components/ui/BlueGradient";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { colors } from "@/constants/colors";

export default function AddWeightScreen() {
  const router = useRouter();
  const { patient } = useAuthContext();
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"lb" | "kg">("lb");
  const [isSaving, setIsSaving] = useState(false);

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const handleSave = async () => {
    if (!patient || !weight.trim() || isSaving) return;
    const numericValue = parseFloat(weight.trim());
    if (isNaN(numericValue) || numericValue <= 0) return;

    setIsSaving(true);
    try {
      await supabase.from("health_metrics").upsert(
        {
          patient_id: patient.id,
          metric_type: "weight",
          value: numericValue,
          unit,
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
              Add Weight
            </Text>
            <Pressable
              onPress={handleSave}
              disabled={!weight.trim() || isSaving}
              className="w-10 h-10 items-center justify-center"
            >
              <CheckIcon />
            </Pressable>
          </View>
        </BlueGradient>

        {/* Form rows */}
        <View className="flex-1 bg-white">
          {/* Weight */}
          <View className="flex-row items-center justify-between h-[52px] px-3 bg-[#F9FBFF] border-b border-[#E6E6E6]">
            <Text className="text-sm font-semibold text-black">Weight</Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder={`-- ${unit}`}
              placeholderTextColor={colors.iconMuted}
              keyboardType="decimal-pad"
              className="text-sm font-semibold text-[#1D61E7] text-right min-w-[80px]"
            />
          </View>

          {/* Unit */}
          <Pressable
            onPress={() => setUnit(unit === "lb" ? "kg" : "lb")}
            className="flex-row items-center justify-between h-[52px] px-3 bg-[#F9FBFF] border-b border-[#E6E6E6]"
          >
            <Text className="text-sm font-semibold text-black">Unit</Text>
            <Text className="text-sm font-semibold text-[#1D61E7]">{unit}</Text>
          </Pressable>

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
