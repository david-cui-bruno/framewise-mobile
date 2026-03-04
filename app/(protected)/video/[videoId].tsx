import { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { ModuleTabs } from "@/components/video/ModuleTabs";
import {
  telemetryQueue,
  generateSessionId,
} from "@/lib/telemetry/eventQueue";
import { colors } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";
import { useTextSize } from "@/contexts/TextSizeContext";

interface VideoModule {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  transcript: string | null;
  duration_seconds: number;
}

export default function VideoScreen() {
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const { patient } = useAuthContext();
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const sessionIdRef = useRef(generateSessionId());

  const [videoModule, setVideoModule] = useState<VideoModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"video" | "transcript">("video");
  const [hasCompleted, setHasCompleted] = useState(false);
  const { scaledStyle } = useTextSize();

  useEffect(() => {
    if (!videoId) return;

    const fetchVideo = async () => {
      const { data, error } = await supabase
        .from("video_modules")
        .select("id, title, description, video_url, transcript, duration_seconds")
        .eq("id", videoId)
        .single();

      if (error) {
        console.error("Error fetching video:", error);
      }

      setVideoModule(data as VideoModule | null);
      setIsLoading(false);
    };

    fetchVideo();
  }, [videoId]);

  const trackEvent = useCallback(
    (eventType: "play" | "pause" | "complete", positionSeconds: number) => {
      if (!patient || !videoId) return;

      telemetryQueue.enqueue({
        patient_id: patient.id,
        video_module_id: videoId,
        session_id: sessionIdRef.current,
        event_type: eventType,
        event_data: {},
        video_timestamp_seconds: Math.round(positionSeconds * 100) / 100,
      });
    },
    [patient, videoId]
  );

  const handlePlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;

      if (status.didJustFinish && !hasCompleted) {
        setHasCompleted(true);
        trackEvent("complete", (status.positionMillis ?? 0) / 1000);

        // Upsert video progress
        if (patient && videoId) {
          const now = new Date().toISOString();
          supabase
            .from("video_progress")
            .upsert(
              {
                patient_id: patient.id,
                video_module_id: videoId,
                is_completed: true,
                watch_count: 1,
                completed_at: now,
                first_watched_at: now,
                last_watched_at: now,
                furthest_position_seconds: Math.floor(
                  (status.durationMillis ?? 0) / 1000
                ),
                updated_at: now,
              },
              { onConflict: "patient_id,video_module_id" }
            )
            .then(({ error }) => {
              if (error) console.error("Error saving video progress:", error);
            });
        }
      }
    },
    [hasCompleted, patient, videoId, trackEvent]
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!videoModule) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 items-center justify-center">
        <Text className="text-neutral-500 text-base">Video not found.</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-primary-500 font-semibold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-neutral-100 items-center justify-center"
        >
          <BackIcon />
        </Pressable>
        <Text
          className="flex-1 text-lg font-semibold text-neutral-900 text-center mr-10"
          numberOfLines={1}
        >
          {videoModule.title}
        </Text>
      </View>

      {/* Video Player */}
      <View className="bg-black" style={{ aspectRatio: 16 / 9 }}>
        <Video
          ref={videoRef}
          source={{ uri: videoModule.video_url }}
          rate={patient?.playback_speed ?? 1.0}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          style={{ flex: 1 }}
        />
      </View>

      {/* Tabs */}
      <ModuleTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasTranscript={!!videoModule.transcript}
      />

      {/* Tab Content */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 32 }}
      >
        {activeTab === "video" ? (
          <View>
            <Text className="text-xl font-bold text-neutral-900 mb-2">
              {videoModule.title}
            </Text>
            {videoModule.duration_seconds != null && (
              <Text className="text-sm text-neutral-500 mb-4">
                {Math.ceil(videoModule.duration_seconds / 60)} min
              </Text>
            )}
            {videoModule.description && (
              <Text className="text-base text-neutral-700 leading-6" style={scaledStyle("base")}>
                {videoModule.description}
              </Text>
            )}
          </View>
        ) : (
          <Text className="text-base text-neutral-700 leading-7" style={scaledStyle("base")}>
            {videoModule.transcript ?? "No transcript available."}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function BackIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 19l-7-7 7-7"
        stroke={colors.iconDefault}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
