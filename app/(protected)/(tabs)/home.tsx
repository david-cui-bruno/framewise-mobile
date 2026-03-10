import { useState, useCallback } from "react";
import { View, ScrollView, ActivityIndicator, Text, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { ChecklistItem } from "@/components/tasks/ChecklistItem";
import { NudgeBanner } from "@/components/home/NudgeBanner";
import { computeNudges, type Nudge } from "@/lib/nudges";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { BlueGradient } from "@/components/ui/BlueGradient";
import { FramewiseMark } from "@/components/icons/FramewiseMark";
import { BellIcon } from "@/components/icons/BellIcon";
import { PlayIcon } from "@/components/icons/PlayIcon";
import { colors } from "@/constants/colors";
import Svg, { Path, Circle } from "react-native-svg";

interface DailyTask {
  id: string;
  status: string;
  scheduled_date: string;
  daily_task_templates: {
    title: string;
    description: string | null;
    task_type: "watch_video" | "answer_quiz" | "take_medication";
    target_video_id: string | null;
    target_quiz_id: string | null;
  };
}

interface CareAssignment {
  start_date: string;
  care_pathway_id: string;
  care_pathways: {
    name: string;
    duration_days: number;
  };
}

interface MedicationSchedule {
  id: string;
  medication_name: string;
  dosage: string | null;
  instructions: string | null;
  time_of_day: string;
  linked_video_id: string | null;
}

interface VideoModule {
  id: string;
  title: string;
  duration_seconds: number;
}

interface VideoProgressRecord {
  video_module_id: string;
  is_completed: boolean;
}

export default function HomeScreen() {
  const { patient } = useAuthContext();
  const router = useRouter();
  const [assignment, setAssignment] = useState<CareAssignment | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [medications, setMedications] = useState<MedicationSchedule[]>([]);
  const [videos, setVideos] = useState<VideoModule[]>([]);
  const [, setVideoProgress] = useState<VideoProgressRecord[]>([]);
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [dismissedNudges, setDismissedNudges] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [medTimeFilter, setMedTimeFilter] = useState<"Morning" | "Afternoon" | "Evening">("Morning");

  const fetchData = useCallback(async () => {
    if (!patient) return;

    setIsLoading(true);
    setError(null);

    try {
    const { data: assignmentData } = await supabase
      .from("patient_care_assignments")
      .select("start_date, care_pathway_id, care_pathways(name, duration_days)")
      .eq("patient_id", patient.id)
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    setAssignment(assignmentData as CareAssignment | null);

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const { data: tasksData } = await supabase
      .from("patient_daily_tasks")
      .select(
        "id, status, scheduled_date, daily_task_templates(title, description, task_type, target_video_id, target_quiz_id)"
      )
      .eq("patient_id", patient.id)
      .eq("scheduled_date", today);

    setTasks((tasksData as DailyTask[] | null) ?? []);

    const { data: medsData } = await supabase
      .from("medication_schedules")
      .select("id, medication_name, dosage, instructions, time_of_day, linked_video_id")
      .eq("patient_id", patient.id)
      .eq("is_active", true)
      .order("time_of_day");

    setMedications((medsData as MedicationSchedule[] | null) ?? []);

    if (assignmentData) {
      const { data: videosData } = await supabase
        .from("video_modules")
        .select("id, title, duration_seconds")
        .eq("care_pathway_id", assignmentData.care_pathway_id)
        .eq("is_active", true)
        .order("sort_order");

      setVideos((videosData as VideoModule[] | null) ?? []);

      const { data: progressData } = await supabase
        .from("video_progress")
        .select("video_module_id, is_completed")
        .eq("patient_id", patient.id);

      setVideoProgress((progressData as VideoProgressRecord[] | null) ?? []);
    }

    const { data: notifPrefs } = await supabase
      .from("patient_notification_prefs")
      .select("quiet_hours_start, quiet_hours_end")
      .eq("patient_id", patient.id)
      .maybeSingle();

    const nudgeResults = await computeNudges(
      supabase,
      patient.id,
      notifPrefs
        ? { start: notifPrefs.quiet_hours_start, end: notifPrefs.quiet_hours_end }
        : undefined
    );
    setNudges(nudgeResults);
    } catch {
      setError("We couldn't load your data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [patient]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#D6E9FD] items-center justify-center">
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#D6E9FD]">
        <ErrorMessage message={error} onRetry={fetchData} />
      </View>
    );
  }

  const totalDays = assignment?.care_pathways?.duration_days ?? 7;
  let currentDay = 1;
  if (assignment?.start_date) {
    const start = new Date(assignment.start_date);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    currentDay = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
  }

  const progressPct = Math.min(100, Math.round((currentDay / totalDays) * 100));

  const filteredMeds = medications.filter((m) => {
    const tod = m.time_of_day?.toLowerCase() ?? "";
    return tod.includes(medTimeFilter.toLowerCase());
  });

  return (
    <View className="flex-1 bg-[#D6E9FD]">
      {/* Gradient header */}
      <BlueGradient className="pb-3">
        {/* Top bar: profile, logo, bell */}
        <View className="flex-row items-center justify-between px-4 mt-14">
          <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
            <ProfileIcon />
          </View>
          <View className="flex-row items-center gap-2">
            <FramewiseMark />
            <View>
              <Text className="text-white text-sm font-bold">Framewise</Text>
              <Text className="text-white text-sm font-bold">Health</Text>
            </View>
          </View>
          <BellIcon />
        </View>

        {/* Recovery progress */}
        <View className="px-6 mt-3">
          <View className="flex-row justify-between mb-1">
            <Text className="text-[10px] font-medium text-white">
              Your Recovery
            </Text>
            <Text className="text-[10px] font-medium text-white">
              Day {Math.min(currentDay, totalDays)} of {totalDays}
            </Text>
          </View>
          <View className="h-2 bg-white rounded-full">
            <View
              className="h-2 bg-[#1008E9] rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </View>
        </View>
      </BlueGradient>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Nudge Banner */}
        {nudges
          .filter((n) => !dismissedNudges.has(n.id))
          .slice(0, 1)
          .map((nudge) => (
            <NudgeBanner
              key={nudge.id}
              nudge={nudge}
              onDismiss={() =>
                setDismissedNudges((prev) => new Set(prev).add(nudge.id))
              }
              onAction={() => router.push(nudge.actionRoute as any)}
            />
          ))}

        {/* Video Library */}
        {videos.length > 0 && (
          <>
            <Text className="text-base font-semibold text-black mt-5 mb-2">
              Video Library
            </Text>
            <Pressable
              onPress={() => {
                if (videos[0]) router.push(`/video/${videos[0].id}`);
              }}
              className="bg-[#828590] rounded-lg h-48 justify-end p-4"
            >
              <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
                <PlayIcon />
              </View>
              <Text className="text-base font-medium text-white">
                {videos[0]?.title ?? "Video"}
              </Text>
            </Pressable>
            {videos.length > 1 && (
              <View className="flex-row items-center justify-center gap-3 mt-3">
                <View className="w-2 h-2 rounded-full bg-[#1D61E7]" />
                {videos.slice(1, 3).map((_, i) => (
                  <View key={i} className="w-1.5 h-1.5 rounded-full bg-[#1D61E7]/40" />
                ))}
              </View>
            )}
          </>
        )}

        {/* Medications */}
        <Text className="text-base font-semibold text-[#0B1220] mt-5 mb-2">
          Your Medications
        </Text>
        <View className="bg-white rounded-2xl p-4">
          {/* Time-of-day filter chips */}
          <View className="flex-row gap-2 mb-4">
            {(["Morning", "Afternoon", "Evening"] as const).map((time) => (
              <Pressable
                key={time}
                onPress={() => setMedTimeFilter(time)}
                className={`px-4 py-1.5 rounded-full ${
                  medTimeFilter === time ? "bg-[#1D61E7]" : "bg-[#E6EEF6]"
                }`}
              >
                <Text
                  className={`text-[11px] font-semibold ${
                    medTimeFilter === time ? "text-white" : "text-[#6B7280]"
                  }`}
                >
                  {time}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Medication rows */}
          {filteredMeds.length === 0 ? (
            <Text className="text-sm text-[#6B7280] text-center py-2">
              No medications for {medTimeFilter.toLowerCase()}
            </Text>
          ) : (
            filteredMeds.map((med, idx) => (
              <View key={med.id}>
                {idx > 0 && <View className="h-px bg-[#E6EEF6] my-3" />}
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-[13px] font-semibold text-[#0B1220]">
                      {med.medication_name}
                    </Text>
                    {med.dosage && (
                      <Text className="text-[11px] font-medium text-[#6B7280] mt-0.5">
                        {med.dosage}{med.instructions ? ` · ${med.instructions}` : ""}
                      </Text>
                    )}
                  </View>
                  {med.linked_video_id && (
                    <Pressable
                      onPress={() => router.push(`/video/${med.linked_video_id}`)}
                      className="bg-[#E6F3FF] border border-[#1D61E7] rounded px-2 py-1"
                    >
                      <Text className="text-[10px] font-semibold text-[#1D61E7]">
                        ▶ Video
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Task Checklist */}
        {tasks.length > 0 && (
          <View className="mt-4">
            <Text className="text-base font-semibold text-[#0B1220] mb-2">
              Today's Tasks
            </Text>
            <View className="bg-white rounded-2xl px-4">
              {tasks.map((task) => {
                const tmpl = task.daily_task_templates;
                let href = "/home";
                if (tmpl.task_type === "watch_video" && tmpl.target_video_id) {
                  href = `/video/${tmpl.target_video_id}`;
                } else if (tmpl.task_type === "answer_quiz" && tmpl.target_quiz_id) {
                  href = `/quiz/${tmpl.target_quiz_id}`;
                }
                return (
                  <ChecklistItem
                    key={task.id}
                    title={tmpl.title}
                    isCompleted={task.status === "completed"}
                    href={href}
                  />
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function ProfileIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke="#FFFFFF" strokeWidth={2} />
      <Path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
