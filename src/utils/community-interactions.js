import { supabase, publicSupabase } from "@/supabase-config.js";
import { trimField } from "@/utils/community-publish.js";

function mapRowDates(row) {
  if (!row) return row;
  return {
    ...row,
    created_date: row.created_at ?? row.created_date,
  };
}

export async function fetchCommunityAnswers(questionId) {
  if (!questionId) return [];
  const { data, error } = await publicSupabase
    .from("community_answers")
    .select("*")
    .eq("question_id", questionId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapRowDates);
}

export async function fetchCommunityComments(questionId) {
  if (!questionId) return [];
  const { data, error } = await publicSupabase
    .from("community_comments")
    .select("*")
    .eq("question_id", questionId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapRowDates);
}

function authorFields(user) {
  return {
    author_id: user.id,
    author_email: user.email || null,
    author_name:
      user.user_metadata?.full_name || user.email || "Użytkownik",
  };
}

export async function createCommunityAnswer({
  questionId,
  user,
  answerText,
  imageUrls = [],
}) {
  const text = trimField(answerText);
  if (!text) throw new Error("Podaj treść odpowiedzi");

  const urls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : [];
  const payload = {
    question_id: questionId,
    ...authorFields(user),
    answer_text: text,
    image_urls: urls,
    image_url: urls[0] ?? null,
    votes: 0,
    is_accepted: false,
  };

  const { data, error } = await supabase
    .from("community_answers")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return mapRowDates(data);
}

export async function createCommunityComment({
  questionId,
  user,
  content,
  imageUrls = [],
  answerId = null,
}) {
  const text = trimField(content);
  if (!text) throw new Error("Podaj treść komentarza");

  const urls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : [];
  const payload = {
    question_id: questionId,
    answer_id: answerId,
    ...authorFields(user),
    content: text,
    image_urls: urls,
    image_url: urls[0] ?? null,
    votes: 0,
  };

  const { data, error } = await supabase
    .from("community_comments")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return mapRowDates(data);
}

export async function acceptCommunityAnswer(questionId, answerId) {
  const { error: answerError } = await supabase
    .from("community_answers")
    .update({ is_accepted: true })
    .eq("id", answerId);

  if (answerError) throw answerError;

  const { error: questionError } = await supabase
    .from("community_questions")
    .update({ has_accepted_answer: true })
    .eq("id", questionId);

  if (questionError) throw questionError;
}

export function formatCommunityInteractionError(error) {
  const message = error?.message || "";
  if (message.includes("community_answers") || message.includes("community_comments")) {
    if (message.includes("does not exist") || message.includes("schema cache")) {
      return "Brak tabel odpowiedzi w bazie. Uruchom data/setup-community-answers-comments.sql w Supabase.";
    }
  }
  if (error?.code === "42501" || message.toLowerCase().includes("row-level security")) {
    return "Brak uprawnień. Zaloguj się i spróbuj ponownie.";
  }
  return message || "Operacja nie powiodła się";
}
