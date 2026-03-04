import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { colors } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

export default function JournalScreen() {
  const { patient } = useAuthContext();
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date: string }>();
  const [content, setContent] = useState("");
  const [existingEntryId, setExistingEntryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!patient || !date) return;

    const fetchEntry = async () => {
      const { data } = await supabase
        .from("diary_entries")
        .select("id, content")
        .eq("patient_id", patient.id)
        .eq("entry_date", date)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setContent(data.content);
        setExistingEntryId(data.id);
      }
      setIsLoading(false);
    };

    fetchEntry();
  }, [patient, date]);

  const handleSave = async () => {
    if (!patient || !date || !content.trim()) return;
    setIsSaving(true);

    let saveError;
    if (existingEntryId) {
      const { error } = await supabase
        .from("diary_entries")
        .update({ content: content.trim() })
        .eq("id", existingEntryId);
      saveError = error;
    } else {
      const { error } = await supabase.from("diary_entries").insert({
        patient_id: patient.id,
        entry_date: date,
        content: content.trim(),
      });
      saveError = error;
    }

    setIsSaving(false);
    if (saveError) {
      console.error("Error saving diary entry:", saveError);
      return;
    }
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const dateLabel = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-neutral-100 items-center justify-center"
          >
            <BackIcon />
          </Pressable>
          <Text className="text-lg font-semibold text-neutral-900">
            Journal
          </Text>
          <Pressable
            onPress={handleSave}
            disabled={!content.trim() || isSaving}
            className="px-4 py-2"
          >
            <Text
              className={`font-semibold ${
                content.trim() && !isSaving
                  ? "text-primary-500"
                  : "text-neutral-400"
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </Text>
          </Pressable>
        </View>

        {/* Date label */}
        <View className="px-4 pb-2">
          <Text className="text-sm text-neutral-500">{dateLabel}</Text>
        </View>

        {/* Editor */}
        <View className="flex-1 px-4">
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Write about your day, how you're feeling, any concerns..."
            placeholderTextColor={colors.placeholder}
            multiline
            textAlignVertical="top"
            autoFocus
            className="flex-1 text-base text-neutral-900 bg-neutral-0 rounded-2xl p-4"
            style={{ minHeight: 200 }}
          />
        </View>

        {/* Character count */}
        <View className="px-4 py-2">
          <Text className="text-xs text-neutral-400 text-right">
            {content.length} characters
          </Text>
        </View>
      </KeyboardAvoidingView>
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
