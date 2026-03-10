import { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/components/auth/AuthProvider";
import {
  telemetryQueue,
  generateSessionId,
} from "@/lib/telemetry/eventQueue";
import { colors } from "@/constants/colors";
import { ChevronIcon } from "@/components/icons/ChevronIcon";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { useTextSize } from "@/contexts/TextSizeContext";
import Svg, { Path, Rect, Line } from "react-native-svg";

interface VideoModuleData {
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

  const [videoModule, setVideoModule] = useState<VideoModuleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"video" | "transcript">("video");
  const [hasCompleted, setHasCompleted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
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

      setVideoModule(data as VideoModuleData | null);
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
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </View>
    );
  }

  if (!videoModule) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-neutral-500 text-base">Video not found.</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-[#1D61E7] font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Video area */}
      <View className="bg-black h-[220px] justify-between">
        {/* Back button */}
        <Pressable
          onPress={() => router.back()}
          className="mt-14 ml-3 w-10 h-10 items-center justify-center"
        >
          <ChevronIcon direction="left" color="#FFFFFF" />
        </Pressable>

        {/* Play button centered */}
        <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
          <Video
            ref={videoRef}
            source={{ uri: videoModule.video_url }}
            rate={patient?.playback_speed ?? 1.0}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />
        </View>
      </View>

      {/* Content area */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "video" ? (
          <>
            {/* Title & description */}
            <View className="px-4 pt-4 pb-3 bg-white border-b border-[#E6E6E6]">
              <Text className="text-xl font-semibold text-black mb-2">
                {videoModule.title}
              </Text>
              {videoModule.description && (
                <>
                  <Text
                    className="text-xs text-[#2D353F] leading-4"
                    numberOfLines={showFullDescription ? undefined : 3}
                    style={scaledStyle("base")}
                  >
                    {videoModule.description}
                  </Text>
                  <Pressable
                    onPress={() => setShowFullDescription(!showFullDescription)}
                    className="flex-row items-center mt-2"
                  >
                    <Text className="text-xs font-semibold text-[#9198A2]">
                      {showFullDescription ? "less" : "more"}
                    </Text>
                    <ChevronIcon
                      direction={showFullDescription ? "up" : "down"}
                      color="#9198A2"
                      size={16}
                    />
                  </Pressable>
                </>
              )}
            </View>

            {/* Bookmark & Transcript actions */}
            <View className="flex-row border-b border-[#E6E6E6] bg-white">
              <View className="flex-1 items-center py-2">
                <BookmarkIcon />
                <Text className="text-[10px] font-medium text-[#27282B] mt-1">
                  Bookmark
                </Text>
              </View>
              <Pressable
                onPress={() => setActiveTab("transcript")}
                className="flex-1 items-center py-2"
              >
                <TranscriptIcon />
                <Text className="text-[10px] font-medium text-[#27282B] mt-1">
                  Transcript
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View className="flex-1">
            {/* Transcript header */}
            <View className="flex-row items-center justify-between px-6 h-16 border-b border-[#E5E7EB]">
              <Text className="text-xl font-semibold text-black">
                Transcript
              </Text>
              <Pressable
                onPress={() => setActiveTab("video")}
                className="w-6 h-6 items-center justify-center"
              >
                <CloseIcon color="#000000" size={20} />
              </Pressable>
            </View>

            {/* Transcript lines */}
            {videoModule.transcript ? (
              (() => {
                const lines = videoModule.transcript
                  .split("\n")
                  .filter((l) => l.trim().length > 0);
                return lines.map((line, index) => {
                  const isActive = index === 0;
                  const minutes = Math.floor((index * 2) / 60);
                  const seconds = (index * 2) % 60;
                  const timeCode = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
                  return (
                    <View
                      key={index}
                      className={`flex-row items-start px-8 ${
                        isActive ? "bg-[#EAF5FF]" : "bg-white"
                      }`}
                      style={{ minHeight: line.length > 38 ? 56 : 40 }}
                    >
                      {isActive && (
                        <View className="absolute left-0 top-0 bottom-0 w-1 bg-[#1D61E7] rounded-r" />
                      )}
                      <Text className="text-sm text-[#6A7282] w-[50px] mt-2.5">
                        {timeCode}
                      </Text>
                      <Text
                        className={`flex-1 text-sm leading-[18px] ml-4 mt-2 ${
                          isActive ? "font-medium text-[#1D61E7]" : "text-black"
                        }`}
                        style={scaledStyle("base")}
                      >
                        {line}
                      </Text>
                    </View>
                  );
                });
              })()
            ) : (
              <View className="items-center py-12">
                <Text className="text-sm text-neutral-500">
                  No transcript available.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function BookmarkIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
        stroke="#27282B"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function TranscriptIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={4} width={16} height={16} rx={2} stroke="#27282B" strokeWidth={2} />
      <Line x1={8} y1={9} x2={16} y2={9} stroke="#27282B" strokeWidth={2} strokeLinecap="round" />
      <Line x1={8} y1={13} x2={14} y2={13} stroke="#27282B" strokeWidth={2} strokeLinecap="round" />
      <Line x1={8} y1={17} x2={12} y2={17} stroke="#27282B" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
