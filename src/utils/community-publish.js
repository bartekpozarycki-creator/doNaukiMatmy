import { assertAllowedContent } from "@/utils/content-moderation/moderate-content";

export function trimField(value) {
  return String(value ?? "").trim();
}

export function resolveQuestionTitle(formTitle) {
  return trimField(formTitle);
}

export function buildCommunityQuestionPayload({
  newQuestion,
  attachedTask,
  user,
  imageUrls = [],
}) {
  const title = resolveQuestionTitle(newQuestion.title);
  const description = trimField(newQuestion.description);
  const urls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : [];

  assertAllowedContent(`${title} ${description}`);

  return {
    title,
    description,
    topic: trimField(newQuestion.topic) || "ogólne",
    difficulty: newQuestion.difficulty ?? 3,
    attached_task: attachedTask
      ? {
          id: attachedTask.id,
          question: attachedTask.question,
          level: attachedTask.level,
          source: attachedTask.source,
          topic: attachedTask.topic,
        }
      : null,
    image_urls: urls,
    image_url: urls[0] ?? null,
    author_id: user.id,
    author_email: user.email || "demo@example.com",
    author_name:
      user.user_metadata?.full_name || user.email || "Użytkownik",
    votes: 0,
    answer_count: 0,
    has_accepted_answer: false,
    view_count: 0,
    status: "pending",
    rejection_reason: null,
  };
}

const SESSION_BUFFER_MS = 60_000;

async function clearLocalAuth(supabaseClient) {
  try {
    await supabaseClient.auth.signOut({ scope: "local" });
  } catch {
    // ignore
  }
}

function sessionStillValid(session) {
  if (!session?.access_token) return false;
  if (!session.expires_at) return true;
  return session.expires_at * 1000 > Date.now() + SESSION_BUFFER_MS;
}

/** Sesja z localStorage + refresh — bez GET /auth/v1/user (unika 403 w konsoli). */
export async function getValidSession(supabaseClient) {
  const { data: sessionData } = await supabaseClient.auth.getSession();
  let session = sessionData.session;

  if (sessionStillValid(session)) {
    return { session, error: null };
  }

  if (session?.refresh_token) {
    const { data: refreshed, error: refreshError } =
      await supabaseClient.auth.refreshSession();
    if (!refreshError && refreshed.session?.access_token) {
      return { session: refreshed.session, error: null };
    }
  }

  await clearLocalAuth(supabaseClient);
  return {
    session: null,
    error: new Error("Sesja wygasła lub konto wymaga ponownego logowania"),
  };
}

export async function publishCommunityQuestion(supabaseClient, payload) {
  const { session, error: sessionError } = await getValidSession(supabaseClient);
  if (!session?.access_token) {
    throw sessionError ?? new Error("Brak sesji");
  }

  const runInsert = () =>
    supabaseClient.from("community_questions").insert(payload).select().single();

  let result = await runInsert();

  if (
    result.error &&
    (result.error.status === 401 ||
      result.error.status === 403 ||
      result.error.code === "PGRST301")
  ) {
    const { data: refreshed, error: refreshError } =
      await supabaseClient.auth.refreshSession();
    if (refreshError || !refreshed.session?.access_token) {
      throw result.error;
    }
    result = await runInsert();
  }

  if (result.error) throw result.error;
  return result.data;
}

export function countAuthorQuestionsToday(questions, authorId) {
  if (!authorId) return 0;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return (questions || []).filter((q) => {
    if (q.author_id !== authorId) return false;
    const created = q.created_at || q.created_date;
    if (!created) return false;
    return new Date(created) >= todayStart;
  }).length;
}

export function formatCommunityPublishError(error) {
  const code = error?.code;
  const message = error?.message || "";
  const status = error?.status;

  if (
    status === 401 ||
    status === 403 ||
    code === "PGRST301" ||
    message.includes("JWT") ||
    message.toLowerCase().includes("unauthorized") ||
    message.toLowerCase().includes("forbidden")
  ) {
    return "Sesja wygasła lub konto nie jest aktywne. Wyloguj się, zaloguj ponownie (ew. potwierdź e-mail).";
  }

  if (code === "23503" || message.includes("author_id_fkey")) {
    return "Konto nie jest jeszcze gotowe do publikacji. Wyloguj się i zaloguj ponownie, albo dokończ rejestrację.";
  }
  if (code === "42501" || message.toLowerCase().includes("row-level security")) {
    return "Brak uprawnień do publikacji. Zaloguj się i spróbuj ponownie.";
  }
  return message || "Nie udało się opublikować pytania";
}
