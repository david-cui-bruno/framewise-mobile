import { useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { colors } from "@/constants/colors";
import { DateNavigator } from "@/components/tasks/DateNavigator";
import { MoodCard } from "@/components/diary/MoodCard";
import { SymptomCheckInCard } from "@/components/diary/SymptomCheckInCard";
import { MedicationAdherenceList } from "@/components/diary/MedicationAdherenceList";
import { JournalCard } from "@/components/diary/JournalCard";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface MoodLog {
  id: string;
  rating: number;
  notes: string | null;
}

interface SymptomCheckIn {
  id: string;
  severity_score: number | null;
}

interface AdherenceRecord {
  id: string;
  medication_schedule_id: string;
  medication_name: string;
  status: "pending" | "taken" | "skipped" | "flagged";
}

interface DiaryEntry {
  id: string;
  content: string;
}

export default function DiaryScreen() {
  const { patient } = useAuthContext();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [moodLog, setMoodLog] = useState<MoodLog | null>(null);
  const [symptomCheckIn, setSymptomCheckIn] = useState<SymptomCheckIn | null>(null);
  const [adherenceRecords, setAdherenceRecords] = useState<AdherenceRecord[]>([]);
  const [diaryEntry, setDiaryEntry] = useState<DiaryEntry | null>(null);
  const [isMoodSubmitting, setIsMoodSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  const fetchData = useCallback(async () => {
    if (!patient) return;
    setIsLoading(true);
    setError(null);

    try {

    // Fetch mood log
    const { data: moodData } = await supabase
      .from("mood_logs")
      .select("id, rating, notes")
      .eq("patient_id", patient.id)
      .eq("log_date", dateString)
      .maybeSingle();
    setMoodLog(moodData);

    // Fetch symptom check-in
    const { data: symptomData } = await supabase
      .from("symptom_check_ins")
      .select("id, severity_score")
      .eq("patient_id", patient.id)
      .eq("check_in_date", dateString)
      .maybeSingle();
    setSymptomCheckIn(symptomData);

    // Fetch medication schedules + adherence
    const { data: medsData } = await supabase
      .from("medication_schedules")
      .select("id, medication_name")
      .eq("patient_id", patient.id)
      .eq("is_active", true);

    if (medsData && medsData.length > 0) {
      const { data: adherenceData } = await supabase
        .from("medication_adherence")
        .select("id, medication_schedule_id, status")
        .eq("patient_id", patient.id)
        .eq("adherence_date", dateString);

      const records: AdherenceRecord[] = medsData.map((med) => {
        const adherence = adherenceData?.find(
          (a: any) => a.medication_schedule_id === med.id
        );
        return {
          id: adherence?.id ?? "",
          medication_schedule_id: med.id,
          medication_name: med.medication_name,
          status: (adherence?.status as AdherenceRecord["status"]) ?? "pending",
        };
      });
      setAdherenceRecords(records);
    } else {
      setAdherenceRecords([]);
    }

    // Fetch diary entry
    const { data: entryData } = await supabase
      .from("diary_entries")
      .select("id, content")
      .eq("patient_id", patient.id)
      .eq("entry_date", dateString)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setDiaryEntry(entryData);
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

  const handleMoodRate = async (rating: number) => {
    if (!patient || isMoodSubmitting) return;
    setIsMoodSubmitting(true);

    try {
      if (moodLog) {
        const { error } = await supabase
          .from("mood_logs")
          .update({ rating })
          .eq("id", moodLog.id);
        if (error) {
          console.error("Error updating mood:", error);
          return;
        }
        setMoodLog({ ...moodLog, rating });
      } else {
        const { data, error } = await supabase
          .from("mood_logs")
          .upsert(
            { patient_id: patient.id, log_date: dateString, rating },
            { onConflict: "patient_id,log_date" }
          )
          .select()
          .single();
        if (error) {
          console.error("Error saving mood:", error);
          return;
        }
        if (data) setMoodLog(data);
      }
    } finally {
      setIsMoodSubmitting(false);
    }
  };

  const handleAdherenceToggle = async (
    medicationScheduleId: string,
    status: "taken" | "skipped" | "flagged"
  ) => {
    if (!patient) return;

    const { error } = await supabase
      .from("medication_adherence")
      .upsert(
        {
          patient_id: patient.id,
          medication_schedule_id: medicationScheduleId,
          adherence_date: dateString,
          status,
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
          ? { ...r, status }
          : r
      )
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="px-4 py-3">
        <Text className="text-lg font-semibold text-neutral-900 text-center">
          Diary
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {error ? (
          <ErrorMessage message={error} onRetry={fetchData} />
        ) : isLoading ? (
          <View className="items-center py-12">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <MoodCard
              rating={moodLog?.rating ?? null}
              onRate={handleMoodRate}
              isSubmitting={isMoodSubmitting}
            />

            <SymptomCheckInCard
              hasCheckedIn={!!symptomCheckIn}
              severityScore={symptomCheckIn?.severity_score ?? null}
              onStartCheckIn={() =>
                router.push(`/diary/check-in?date=${dateString}` as any)
              }
            />

            <MedicationAdherenceList
              records={adherenceRecords}
              onToggle={handleAdherenceToggle}
            />

            <JournalCard
              entryPreview={diaryEntry?.content ?? null}
              onPress={() =>
                router.push(`/diary/journal?date=${dateString}` as any)
              }
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
