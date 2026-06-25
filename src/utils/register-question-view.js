import { supabase, publicSupabase } from "@/supabase-config";
import { getAccountViewerId } from "@/utils/community-viewer";
import { getValidSession } from "@/utils/community-publish";

const VIEWED_STORAGE_PREFIX = "mm_question_viewed";

async function fetchViewCount(questionId) {
  const { data, error } = await publicSupabase
    .from("community_questions")
    .select("view_count")
    .eq("id", questionId)
    .maybeSingle();
  if (error) return null;
  return typeof data?.view_count === "number" ? data.view_count : null;
}

function hasLocalViewRecord(userId, questionId) {
  try {
    return (
      localStorage.getItem(`${VIEWED_STORAGE_PREFIX}:${userId}:${questionId}`) ===
      "1"
    );
  } catch {
    return false;
  }
}

function markLocalViewRecord(userId, questionId) {
  try {
    localStorage.setItem(
      `${VIEWED_STORAGE_PREFIX}:${userId}:${questionId}`,
      "1",
    );
  } catch {
    // ignore
  }
}

async function registerViaNewRpc(client, questionId, viewerId) {
  return client.rpc("register_question_view", {
    p_question_id: questionId,
    p_viewer_id: viewerId,
  });
}

async function registerViaLegacyRpc(client, questionId) {
  return client.rpc("increment_question_view", { question_id: questionId });
}

export async function registerQuestionView(questionId, userId) {
  if (!questionId || !userId) {
    return { incremented: false, viewCount: null, error: null };
  }

  const viewerId = getAccountViewerId(userId);
  const { session } = await getValidSession(supabase);
  const client = session?.access_token ? supabase : publicSupabase;

  let { data, error } = await registerViaNewRpc(client, questionId, viewerId);

  if (error?.code === "PGRST202") {
    if (hasLocalViewRecord(userId, questionId)) {
      const viewCount = await fetchViewCount(questionId);
      return { incremented: false, viewCount, error: null };
    }

    const legacy = await registerViaLegacyRpc(client, questionId);
    if (legacy.error) {
      return { incremented: false, viewCount: null, error: legacy.error };
    }

    markLocalViewRecord(userId, questionId);
    const viewCount = await fetchViewCount(questionId);
    return {
      incremented: true,
      viewCount,
      error: null,
      legacy: true,
    };
  }

  if (error) {
    return { incremented: false, viewCount: null, error };
  }

  const viewCount =
    typeof data?.view_count === "number"
      ? data.view_count
      : await fetchViewCount(questionId);

  return {
    incremented: Boolean(data?.incremented),
    viewCount,
    error: null,
  };
}
