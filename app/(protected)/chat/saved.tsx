import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { ChatMessage } from "@/components/qa/ChatMessage";
import { colors } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

interface BookmarkedQA {
  id: string;
  qa_content_id: string;
  qa_content: {
    id: string;
    question_text: string;
    answer_text: string;
    category: string | null;
  };
}

export default function SavedAnswersScreen() {
  const { patient } = useAuthContext();
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<BookmarkedQA[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    if (!patient) return;

    const { data, error } = await supabase
      .from("bookmarked_qa")
      .select("id, qa_content_id, qa_content(id, question_text, answer_text, category)")
      .eq("patient_id", patient.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookmarks:", error);
    }

    setBookmarks((data as unknown as BookmarkedQA[]) ?? []);
    setIsLoading(false);
  }, [patient]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const removeBookmark = async (bookmarkId: string) => {
    await supabase.from("bookmarked_qa").delete().eq("id", bookmarkId);
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-neutral-100 items-center justify-center"
        >
          <BackIcon />
        </Pressable>
        <Text className="flex-1 text-lg font-semibold text-neutral-900 text-center mr-10">
          Saved Answers
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : bookmarks.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-lg font-semibold text-neutral-900 mb-2">
            No saved answers yet
          </Text>
          <Text className="text-base text-neutral-500 text-center">
            Bookmark answers from the Q&A to find them here later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 16 }}
          renderItem={({ item }) => (
            <View>
              <ChatMessage
                role="user"
                content={item.qa_content.question_text}
              />
              <ChatMessage
                role="assistant"
                content={item.qa_content.answer_text}
                onBookmark={() => removeBookmark(item.id)}
                isBookmarked={true}
              />
            </View>
          )}
        />
      )}
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
