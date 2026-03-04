import { useState, useCallback } from "react";
import { View, ScrollView, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { AVATARS } from "@/components/avatar/AvatarSelector";
import { TopBar } from "@/components/home/TopBar";
import { ProgressRing } from "@/components/home/ProgressRing";
import { ProgressStrip } from "@/components/home/ProgressStrip";
import { FeaturedTaskCard } from "@/components/home/FeaturedTaskCard";
import { DailyTipCard } from "@/components/home/DailyTipCard";
import { AllDoneState } from "@/components/home/AllDoneState";
import { ChecklistItem } from "@/components/tasks/ChecklistItem";
import { VideoThumbCard } from "@/components/home/VideoThumbCard";
import { MedicationSection } from "@/components/home/MedicationSection";
import { NudgeBanner } from "@/components/home/NudgeBanner";
import { computeNudges, type Nudge } from "@/lib/nudges";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { IconActionTile } from "@/components/ui/IconActionTile";
import { colors } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

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
  const [videoProgress, setVideoProgress] = useState<VideoProgressRecord[]>([]);
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [dismissedNudges, setDismissedNudges] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    // Fetch medications
    const { data: medsData } = await supabase
      .from("medication_schedules")
      .select("id, medication_name, dosage, instructions, time_of_day, linked_video_id")
      .eq("patient_id", patient.id)
      .eq("is_active", true)
      .order("time_of_day");

    setMedications((medsData as MedicationSchedule[] | null) ?? []);

    // Fetch pathway videos
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

    // Fetch nudges with quiet hours
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
      <SafeAreaView className="flex-1 bg-neutral-50 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50">
        <ErrorMessage message={error} onRetry={fetchData} />
      </SafeAreaView>
    );
  }

  const avatarEmoji = AVATARS.find((a) => a.id === patient?.avatar_id)?.emoji;
  const displayName = patient?.display_name || patient?.email || "Patient";
  const pathwayName = assignment?.care_pathways?.name;
  const totalDays = assignment?.care_pathways?.duration_days ?? 7;

  let currentDay = 1;
  if (assignment?.start_date) {
    const start = new Date(assignment.start_date);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    currentDay = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
  }

  const completedTasks = tasks.filter((t) => t.status === "completed");
  const incompleteTasks = tasks.filter((t) => t.status !== "completed");
  const allDone = tasks.length > 0 && incompleteTasks.length === 0;
  const nextTask = incompleteTasks[0];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <TopBar
        displayName={displayName}
        avatarEmoji={avatarEmoji}
        pathwayName={pathwayName}
      />

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
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

        {/* Progress Ring */}
        <View className="items-center py-4">
          <ProgressRing currentDay={currentDay} totalDays={totalDays} />
        </View>

        {/* Progress Strip */}
        <ProgressStrip
          currentDay={currentDay}
          totalDays={totalDays}
          completedTasks={completedTasks.length}
          totalTasks={tasks.length}
        />

        {/* Featured task or All Done */}
        {allDone ? (
          <AllDoneState />
        ) : nextTask ? (
          <View className="mb-4">
            <FeaturedTaskCard
              title={nextTask.daily_task_templates.title}
              description={nextTask.daily_task_templates.description}
              taskType={nextTask.daily_task_templates.task_type}
              onPress={() => {
                const tmpl = nextTask.daily_task_templates;
                if (tmpl.task_type === "watch_video" && tmpl.target_video_id) {
                  router.push(`/video/${tmpl.target_video_id}`);
                } else if (tmpl.task_type === "answer_quiz" && tmpl.target_quiz_id) {
                  router.push(`/quiz/${tmpl.target_quiz_id}`);
                }
              }}
            />
          </View>
        ) : null}

        {/* Medication Section */}
        <MedicationSection
          medications={medications}
          onVideoPress={(videoId) => router.push(`/video/${videoId}`)}
        />

        {/* Task Checklist */}
        {tasks.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-neutral-900 mb-2">
              Today's Tasks
            </Text>
            <View className="bg-neutral-0 rounded-2xl px-4">
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

        {/* Quick Actions */}
        <View className="flex-row gap-3 mb-4">
          <IconActionTile
            label="Check In"
            icon={<ClipboardIcon />}
            onPress={() => router.push("/diary" as any)}
            className="flex-1"
          />
          <IconActionTile
            label="Ask a Question"
            icon={<ChatBubbleIcon />}
            onPress={() => router.push("/chat" as any)}
            className="flex-1"
          />
        </View>

        {/* Video Grid */}
        {videos.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-neutral-900 mb-3">
              Your Videos
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {videos.map((video) => {
                const progress = videoProgress.find(
                  (p) => p.video_module_id === video.id
                );
                return (
                  <VideoThumbCard
                    key={video.id}
                    title={video.title}
                    duration={formatDuration(video.duration_seconds)}
                    completed={progress?.is_completed}
                    onPress={() => router.push(`/video/${video.id}`)}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* Daily Tip */}
        <View className="mt-2">
          <DailyTipCard />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ClipboardIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        stroke={colors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChatBubbleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        stroke={colors.primary}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
