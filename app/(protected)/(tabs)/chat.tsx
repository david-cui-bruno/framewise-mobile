import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { semanticSearch } from "@/lib/embeddings";
import { detectRisk } from "@/lib/riskDetection";
import { SuggestionChips } from "@/components/qa/SuggestionChips";
import { ChatMessage } from "@/components/qa/ChatMessage";
import { ChatInput } from "@/components/qa/ChatInput";
import { NoResultsFallback } from "@/components/qa/NoResultsFallback";
import { RiskBanner } from "@/components/qa/RiskBanner";
import { CareTeamContact } from "@/components/qa/CareTeamContact";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { colors } from "@/constants/colors";
import Svg, { Path } from "react-native-svg";

interface QAResult {
  id: string;
  question_text: string;
  answer_text: string;
  category: string | null;
  similarity?: number;
}

interface Physician {
  name: string;
  specialty: string | null;
  practice_phone: string | null;
}

const SUGGESTIONS = [
  "What should I expect after surgery?",
  "How do I manage pain?",
  "When can I return to normal activities?",
  "What are warning signs to watch for?",
];

export default function ChatScreen() {
  const { patient } = useAuthContext();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QAResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [riskSeverity, setRiskSeverity] = useState<"none" | "warning" | "urgent">("none");
  const [physician, setPhysician] = useState<Physician | null>(null);
  const [carePathwayId, setCarePathwayId] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  // Fetch physician info, care pathway, and bookmarks on mount
  useEffect(() => {
    if (!patient) return;

    const fetchInitialData = async () => {
      try {
        const { data: assignmentData } = await supabase
          .from("patient_care_assignments")
          .select("care_pathway_id, physicians(name, specialty, practice_phone)")
          .eq("patient_id", patient.id)
          .eq("is_active", true)
          .limit(1)
          .maybeSingle();

        if (assignmentData?.care_pathway_id) {
          setCarePathwayId(assignmentData.care_pathway_id);
        }
        if (assignmentData?.physicians) {
          setPhysician(assignmentData.physicians as unknown as Physician);
        }

        const { data: bookmarkData } = await supabase
          .from("bookmarked_qa")
          .select("qa_content_id")
          .eq("patient_id", patient.id);

        if (bookmarkData) {
          setBookmarkedIds(new Set(bookmarkData.map((b: any) => b.qa_content_id)));
        }
      } catch {
        setInitError("We couldn't load your data. Please try again.");
      }
    };

    fetchInitialData();
  }, [patient]);

  const handleSearch = useCallback(
    async (searchQuery?: string) => {
      const q = (searchQuery ?? query).trim();
      if (!q) return;

      // Check for risk keywords
      const risk = detectRisk(q);
      setRiskSeverity(risk.severity);

      setIsSearching(true);
      setHasSearched(true);

      try {
        const { results: searchResults } = await semanticSearch(q, carePathwayId ?? undefined);
        setResults(searchResults);

        // Log search (includes risk flag info if applicable)
        if (patient) {
          supabase.from("qa_search_log").insert({
            patient_id: patient.id,
            search_query: q,
            results_returned: searchResults.length,
            is_flagged: risk.isRisky,
            flag_reason: risk.isRisky ? risk.matchedKeywords.join(", ") : null,
          }).then(({ error }) => {
            if (error) console.error("Error logging search:", error);
          });
        }
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [query, patient, carePathwayId]
  );

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const toggleBookmark = async (qaContentId: string) => {
    if (!patient) return;

    const isCurrentlyBookmarked = bookmarkedIds.has(qaContentId);

    if (isCurrentlyBookmarked) {
      const { error } = await supabase
        .from("bookmarked_qa")
        .delete()
        .eq("patient_id", patient.id)
        .eq("qa_content_id", qaContentId);
      if (error) {
        console.error("Error removing bookmark:", error);
        return;
      }

      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(qaContentId);
        return next;
      });
    } else {
      const { error } = await supabase.from("bookmarked_qa").insert({
        patient_id: patient.id,
        qa_content_id: qaContentId,
      });
      if (error) {
        console.error("Error adding bookmark:", error);
        return;
      }

      setBookmarkedIds((prev) => new Set([...prev, qaContentId]));
    }
  };

  if (initError) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50">
        <ErrorMessage message={initError} onRetry={() => { setInitError(null); }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-lg font-semibold text-neutral-900 flex-1 text-center">
            Q&A
          </Text>
          <Pressable
            onPress={() => router.push("/chat/saved" as any)}
            className="absolute right-4"
          >
            <BookmarkHeaderIcon />
          </Pressable>
        </View>

        {/* Risk Banner */}
        {riskSeverity !== "none" && <RiskBanner severity={riskSeverity} />}

        {/* Care Team Contact */}
        {physician && (
          <CareTeamContact
            physicianName={physician.name}
            specialty={physician.specialty}
            phone={physician.practice_phone}
          />
        )}

        {/* Suggestions (shown before first search) */}
        {!hasSearched && (
          <SuggestionChips
            suggestions={SUGGESTIONS}
            onSelect={handleSuggestionSelect}
          />
        )}

        {/* Results */}
        {isSearching ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : hasSearched && results.length === 0 ? (
          <NoResultsFallback query={query} />
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, gap: 8 }}
            renderItem={({ item }) => (
              <View>
                <ChatMessage role="user" content={item.question_text} />
                <ChatMessage
                  role="assistant"
                  content={item.answer_text}
                  onBookmark={() => toggleBookmark(item.id)}
                  isBookmarked={bookmarkedIds.has(item.id)}
                />
              </View>
            )}
          />
        )}

        {/* Chat Input */}
        <ChatInput
          value={query}
          onChange={setQuery}
          onSubmit={() => handleSearch()}
          placeholder="Ask a question..."
          disabled={isSearching}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function BookmarkHeaderIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        stroke={colors.iconDefault}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
