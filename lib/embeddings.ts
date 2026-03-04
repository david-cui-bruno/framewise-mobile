import { supabase } from "@/lib/supabase";

/**
 * Calls the embed-query edge function to get an embedding vector for a search query.
 * Falls back to null if the function is not deployed or fails.
 */
export async function getQueryEmbedding(
  query: string
): Promise<number[] | null> {
  try {
    const { data, error } = await supabase.functions.invoke("embed-query", {
      body: { query },
    });

    if (error) {
      console.warn("Embedding function error, falling back to text search:", error);
      return null;
    }

    return data?.embedding ?? null;
  } catch (err) {
    console.warn("Embedding function unavailable, falling back to text search:", err);
    return null;
  }
}

/**
 * Performs semantic search using match_qa_content RPC.
 * Falls back to ilike text search if embedding fails.
 */
export async function semanticSearch(
  query: string,
  carePathwayId?: string
): Promise<{
  results: {
    id: string;
    question_text: string;
    answer_text: string;
    category: string | null;
    similarity?: number;
  }[];
  method: "semantic" | "text";
}> {
  const embedding = await getQueryEmbedding(query);

  if (embedding) {
    const { data, error } = await supabase.rpc("match_qa_content", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 10,
      filter_care_pathway_id: carePathwayId ?? null,
    });

    if (!error && data && data.length > 0) {
      return { results: data, method: "semantic" };
    }
  }

  // Fallback to text search — escape ilike wildcards in user input
  const escapedQuery = query.replace(/[%_\\]/g, "\\$&");
  const { data, error } = await supabase
    .from("qa_content")
    .select("id, question_text, answer_text, category")
    .ilike("question_text", `%${escapedQuery}%`)
    .eq("is_active", true)
    .limit(10);

  if (error) {
    console.error("Q&A search error:", error);
    return { results: [], method: "text" };
  }

  return { results: data ?? [], method: "text" };
}
