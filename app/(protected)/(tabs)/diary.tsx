import { useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { colors } from "@/constants/colors";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { BlueGradient } from "@/components/ui/BlueGradient";
import { ChevronIcon } from "@/components/icons/ChevronIcon";
import { StreakIcon } from "@/components/icons/StreakIcon";
import { CircleCheckIcon } from "@/components/icons/CircleCheckIcon";
import { WeightIcon } from "@/components/icons/WeightIcon";
import { HeartPulseIcon } from "@/components/icons/HeartPulseIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import Svg, { Path } from "react-native-svg";

interface AdherenceRecord {
  id: string;
  medication_schedule_id: string;
  medication_name: string;
  status: "pending" | "taken" | "skipped" | "flagged";
  time_of_day: string;
}

interface MedicationSchedule {
  id: string;
  medication_name: string;
  time_of_day: string;
}

export default function DiaryScreen() {
  const { patient } = useAuthContext();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [adherenceRecords, setAdherenceRecords] = useState<AdherenceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  const isToday = (() => {
    const now = new Date();
    return (
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate()
    );
  })();

  const navigateDate = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const fetchData = useCallback(async () => {
    if (!patient) return;
    setIsLoading(true);
    setError(null);

    try {
      // Fetch medication schedules + adherence
      const { data: medsData } = await supabase
        .from("medication_schedules")
        .select("id, medication_name, time_of_day")
        .eq("patient_id", patient.id)
        .eq("is_active", true);

      if (medsData && medsData.length > 0) {
        const { data: adherenceData } = await supabase
          .from("medication_adherence")
          .select("id, medication_schedule_id, status")
          .eq("patient_id", patient.id)
          .eq("adherence_date", dateString);

        const records: AdherenceRecord[] = (medsData as MedicationSchedule[]).map((med) => {
          const adherence = adherenceData?.find(
            (a: any) => a.medication_schedule_id === med.id
          );
          return {
            id: adherence?.id ?? "",
            medication_schedule_id: med.id,
            medication_name: med.medication_name,
            status: (adherence?.status as AdherenceRecord["status"]) ?? "pending",
            time_of_day: med.time_of_day,
          };
        });
        setAdherenceRecords(records);
      } else {
        setAdherenceRecords([]);
      }

      // Simple streak calc (count consecutive days with any adherence)
      const { count } = await supabase
        .from("medication_adherence")
        .select("*", { count: "exact", head: true })
        .eq("patient_id", patient.id)
        .eq("status", "taken");
      setStreak(Math.min(count ?? 0, 99));
    } catch {
      setError("We couldn't load your data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [patient, dateString]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleAdherenceToggle = async (medicationScheduleId: string) => {
    if (!patient) return;
    const record = adherenceRecords.find(
      (r) => r.medication_schedule_id === medicationScheduleId
    );
    const newStatus = record?.status === "taken" ? "pending" : "taken";

    const { error } = await supabase
      .from("medication_adherence")
      .upsert(
        {
          patient_id: patient.id,
          medication_schedule_id: medicationScheduleId,
          adherence_date: dateString,
          status: newStatus,
        },
        { onConflict: "patient_id,medication_schedule_id,adherence_date" }
      );
    if (error) {
      console.error("Error updating medication adherence:", error);
      return;
    }

    setAdherenceRecords((prev) =>
      prev.map((r) =>
        r.medication_schedule_id === medicationScheduleId
          ? { ...r, status: newStatus }
          : r
      )
    );
  };

  // Group meds by time of day
  const groupedMeds = {
    Morning: adherenceRecords.filter((r) => r.time_of_day?.toLowerCase().includes("morning")),
    Afternoon: adherenceRecords.filter((r) => r.time_of_day?.toLowerCase().includes("afternoon")),
    Evening: adherenceRecords.filter((r) => r.time_of_day?.toLowerCase().includes("evening")),
  };

  return (
    <View className="flex-1">
      {/* Gradient header */}
      <BlueGradient className="pt-14 pb-2">
        {/* Date navigation bar */}
        <View className="flex-row items-center justify-between px-4 py-1">
          <View className="flex-row items-center flex-1">
            <Pressable
              onPress={() => navigateDate(-1)}
              className="w-8 h-8 items-center justify-center"
            >
              <ChevronIcon direction="left" />
            </Pressable>
            <View className="flex-row items-center">
              <Text className="text-base font-semibold text-white">
                {isToday ? "Today" : selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </Text>
              <DropdownIcon />
            </View>
            <Pressable
              onPress={() => navigateDate(1)}
              className="w-8 h-8 items-center justify-center"
            >
              <ChevronIcon direction="right" />
            </Pressable>
          </View>

          {/* Streak */}
          <View className="flex-row items-center gap-1">
            <Text className="text-base font-semibold text-white">{streak}</Text>
            <StreakIcon />
          </View>
        </View>
      </BlueGradient>

      {/* Content */}
      <LinearGradient
        colors={["rgba(124,184,247,0.88)", "#D6E9FD"]}
        className="flex-1"
      >
        {error ? (
          <ErrorMessage message={error} onRetry={fetchData} />
        ) : isLoading ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color={colors.primaryBlue} />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Medication sections */}
            {(["Morning", "Afternoon", "Evening"] as const).map((timeOfDay) => {
              const meds = groupedMeds[timeOfDay];
              if (meds.length === 0) return null;
              return (
                <View key={timeOfDay} className="bg-white rounded-lg overflow-hidden">
                  <View className="flex-row items-center justify-between px-4 pt-3.5 pb-3">
                    <Text className="text-xl font-semibold text-[#0B1220]">
                      {timeOfDay}
                    </Text>
                    <ChevronIcon direction="right" color="#000" size={20} />
                  </View>
                  {meds.map((med, idx) => (
                    <View key={med.medication_schedule_id}>
                      {idx > 0 && <View className="h-px bg-[#E6EEF6] mx-4" />}
                      <Pressable
                        onPress={() => handleAdherenceToggle(med.medication_schedule_id)}
                        className="flex-row items-center h-10 px-4"
                      >
                        <CircleCheckIcon checked={med.status === "taken"} />
                        <Text
                          className={`text-sm font-semibold ml-4 ${
                            med.status === "taken" ? "text-[#1D61E7]" : "text-black"
                          }`}
                        >
                          {med.medication_name}
                        </Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              );
            })}

            {/* Health section */}
            <Text className="text-base font-semibold text-[#0B1220] mt-4">
              Health
            </Text>
            <View className="flex-row gap-6">
              {/* Weight card */}
              <Pressable
                onPress={() => router.push("/diary/add-weight")}
                className="flex-1 bg-white rounded-lg px-3 py-2.5 h-[108px]"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1">
                    <WeightIcon />
                    <Text className="text-xs font-semibold text-black">Weight</Text>
                  </View>
                  <PlusIcon />
                </View>
                <Text className="text-2xl font-semibold text-[#9198A2] text-center mt-3.5">
                  0 lbs
                </Text>
              </Pressable>

              {/* Blood Pressure card */}
              <Pressable
                onPress={() => router.push("/diary/log-blood-pressure")}
                className="flex-1 bg-white rounded-lg px-3 py-2.5 h-[108px]"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-0.5">
                    <HeartPulseIcon />
                    <Text className="text-xs font-semibold text-black">Blood Pressure</Text>
                  </View>
                  <PlusIcon />
                </View>
                <Text className="text-base font-semibold text-[#9198A2] text-center mt-3.5">
                  Take your blood pressure
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </LinearGradient>
    </View>
  );
}

function DropdownIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M7 10l5 5 5-5" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
