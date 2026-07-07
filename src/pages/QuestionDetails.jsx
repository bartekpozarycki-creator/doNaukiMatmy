import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, ThumbsUp, CheckCircle, MessageSquare,
  Send, Eye,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import MathText from "@/components/MathText";
import CommunityQuestionImages from "@/components/community/CommunityQuestionImages";
import LoginRequiredDialog from "@/components/LoginRequiredDialog";
import CommunityImagesField, {
  clearCommunityImageItems,
} from "@/components/community/CommunityImagesField";
import { publicSupabase, supabase } from "@/supabase-config";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  uploadCommunityImages,
} from "@/utils/community-images";
import {
  bannedContentMessage,
  containsBannedContent,
} from "@/utils/content-moderation/moderate-content";
import {
  fetchCommunityAnswers,
  fetchCommunityComments,
  createCommunityAnswer,
  createCommunityComment,
  acceptCommunityAnswer,
  formatCommunityInteractionError,
} from "@/utils/community-interactions";
import { getValidSession } from "@/utils/community-publish";

const topicNames = {
  algebra: "Algebra",
  geometria: "Geometria",
  analiza: "Analiza",
  funkcje: "Funkcje",
  trygonometria: "Trygonometria",
  statystyka: "Statystyka",
  kombinatoryka: "Kombinatoryka",
  rachunek_prawdopodobienstwa: "Rachunek prawdopodobieństwa",
  ogólne: "Ogólne",
  liczby_rzeczywiste: "Liczby rzeczywiste",
  wyrazenia_algebraiczne: "Wyrażenia algebraiczne",
  ciagi: "Ciągi",
  planimetria: "Planimetria",
  geometria_analityczna: "Geometria analityczna",
  stereometria: "Stereometria",
  kombinatoryka_i_statystyka: "Kombinatoryka i statystyka",
  optymalizacja_i_rozniczkowy: "Optymalizacja",
};

export default function QuestionDetailsPage() {
  const location = useLocation();
  const { user } = useAuth();
  const [newAnswer, setNewAnswer] = useState("");
  const [newComment, setNewComment] = useState("");
  const [answerImages, setAnswerImages] = useState([]);
  const [commentImages, setCommentImages] = useState([]);
  const [uploadingAnswerImages, setUploadingAnswerImages] = useState(false);
  const [uploadingCommentImages, setUploadingCommentImages] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginDialogDescription, setLoginDialogDescription] = useState(
    "Musisz się zalogować, aby skorzystać z tej funkcji.",
  );
  const queryClient = useQueryClient();

  const urlParams = new URLSearchParams(window.location.search);
  const questionId = urlParams.get("id");

  const { data: question, isLoading } = useQuery({
    queryKey: ["communityQuestion", questionId],
    queryFn: async () => {
      const { data, error } = await publicSupabase
        .from("community_questions")
        .select("*")
        .eq("id", questionId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!questionId,
    initialData: location.state?.question || null,
  });

  const { data: answers = [], isLoading: answersLoading } = useQuery({
    queryKey: ["questionAnswers", questionId],
    queryFn: () => fetchCommunityAnswers(questionId),
    enabled: !!questionId,
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["questionComments", questionId],
    queryFn: () => fetchCommunityComments(questionId),
    enabled: !!questionId,
  });

  const createAnswerMutation = useMutation({
    mutationFn: async ({ text, imageUrls }) => {
      const { session, error: sessionError } = await getValidSession(supabase);
      if (sessionError || !session?.user) {
        throw sessionError ?? new Error("Zaloguj się ponownie");
      }
      return createCommunityAnswer({
        questionId,
        user: session.user,
        answerText: text,
        imageUrls,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionAnswers", questionId] });
      queryClient.invalidateQueries({ queryKey: ["communityQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["communityQuestion", questionId] });
      setNewAnswer("");
      clearCommunityImageItems(answerImages);
      setAnswerImages([]);
      toast.success("Odpowiedź opublikowana");
    },
    onError: (error) => {
      toast.error(formatCommunityInteractionError(error));
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async ({ content, imageUrls }) => {
      const { session, error: sessionError } = await getValidSession(supabase);
      if (sessionError || !session?.user) {
        throw sessionError ?? new Error("Zaloguj się ponownie");
      }
      return createCommunityComment({
        questionId,
        user: session.user,
        content,
        imageUrls,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionComments", questionId] });
      setNewComment("");
      clearCommunityImageItems(commentImages);
      setCommentImages([]);
      toast.success("Komentarz dodany");
    },
    onError: (error) => {
      toast.error(formatCommunityInteractionError(error));
    },
  });

  const acceptAnswerMutation = useMutation({
    mutationFn: (answerId) => acceptCommunityAnswer(questionId, answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionAnswers", questionId] });
      queryClient.invalidateQueries({ queryKey: ["communityQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["communityQuestion", questionId] });
      toast.success("Odpowiedź zaakceptowana");
    },
    onError: (error) => {
      toast.error(formatCommunityInteractionError(error));
    },
  });

  const publishAnswer = async () => {
    if (!user) {
      setLoginDialogDescription("Musisz się zalogować, aby dodać odpowiedź.");
      setLoginDialogOpen(true);
      return;
    }
    if (!newAnswer.trim()) return;
    if (containsBannedContent(newAnswer)) {
      toast.error(bannedContentMessage);
      return;
    }

    let imageUrls = [];
    if (answerImages.length) {
      setUploadingAnswerImages(true);
      try {
        imageUrls = await uploadCommunityImages(
          user.id,
          answerImages.map((item) => item.file),
        );
      } catch (error) {
        toast.error(error.message || "Nie udało się przesłać zdjęć");
        setUploadingAnswerImages(false);
        return;
      }
      setUploadingAnswerImages(false);
    }

    createAnswerMutation.mutate({ text: newAnswer, imageUrls });
  };

  const publishComment = async () => {
    if (!user) {
      setLoginDialogDescription("Musisz się zalogować, aby dodać komentarz.");
      setLoginDialogOpen(true);
      return;
    }
    if (!newComment.trim()) return;
    if (containsBannedContent(newComment)) {
      toast.error(bannedContentMessage);
      return;
    }

    let imageUrls = [];
    if (commentImages.length) {
      setUploadingCommentImages(true);
      try {
        imageUrls = await uploadCommunityImages(
          user.id,
          commentImages.map((item) => item.file),
        );
      } catch (error) {
        toast.error(error.message || "Nie udało się przesłać zdjęć");
        setUploadingCommentImages(false);
        return;
      }
      setUploadingCommentImages(false);
    }

    createCommentMutation.mutate({ content: newComment, imageUrls });
  };

  const isDark = user?.theme === "dark";
  const createdAt = question?.created_at || question?.created_date;
  const answerBusy =
    createAnswerMutation.isPending || uploadingAnswerImages;
  const commentBusy =
    createCommentMutation.isPending || uploadingCommentImages;

  if (isLoading || !question) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="mb-6 h-10 w-40 dark:bg-slate-700" />
          <Card className="mb-6 border-0 bg-white shadow-lg dark:bg-slate-800">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-8 w-[85%] dark:bg-slate-700" />
              <Skeleton className="h-4 w-48 dark:bg-slate-700" />
              <Skeleton className="h-24 w-full dark:bg-slate-700" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.is_accepted) return -1;
    if (b.is_accepted) return 1;
    return (b.votes || 0) - (a.votes || 0);
  });

  const questionComments = comments.filter((c) => !c.answer_id);
  const isQuestionAuthor =
    user &&
    (question.author_id === user.id || question.author_email === user.email);

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={createPageUrl("Community")}>
          <Button variant="ghost" className="mb-6 dark:text-slate-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do pytań
          </Button>
        </Link>

        <Card className="mb-6 dark:bg-slate-800 bg-white border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl text-slate-900 dark:text-white mb-2">
                  <MathText text={question.title} />
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                  <span>przez {question.author_name}</span>
                  <span>•</span>
                  <span>
                    {createdAt
                      ? format(new Date(createdAt), "d MMMM yyyy", { locale: pl })
                      : ""}
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {question.view_count || 0} wyświetleń
                  </div>
                </div>
              </div>
              {question.has_accepted_answer && (
                <Badge className="bg-emerald-600 text-white flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Rozwiązane
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <div className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                <MathText text={question.description} />
              </div>
            </div>

            {question.attached_task && (
              <div className="rounded-lg border border-blue-200 dark:border-slate-700 bg-blue-50/60 dark:bg-slate-700/40 p-4">
                <div className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-300 mb-2">
                  Podpięte zadanie
                </div>
                <div className="text-sm text-slate-900 dark:text-white">
                  <MathText text={question.attached_task.question} />
                </div>
                <div className="mt-2">
                  <Link
                    to={`${createPageUrl("TaskDetails")}?id=${question.attached_task.id}`}
                    className="text-xs text-blue-600 dark:text-blue-300 hover:underline"
                  >
                    Otwórz zadanie
                  </Link>
                </div>
              </div>
            )}

            <CommunityQuestionImages question={question} />

            <div className="flex items-center gap-3 border-t border-gray-200 pt-4 dark:border-slate-700">
              <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-300">
                {topicNames[question.topic] || question.topic}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 dark:bg-slate-800 bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Odpowiedzi ({answers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {user ? (
              <div className="space-y-4 rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-white p-4 dark:border-emerald-900/40 dark:from-emerald-950/20 dark:to-slate-800/80 sm:p-5">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  Pomóż rozwiązać ten problem
                </h4>
                <Textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Opisz rozwiązanie krok po kroku..."
                  rows={6}
                  className="resize-y bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
                <CommunityImagesField
                  items={answerImages}
                  onChange={setAnswerImages}
                  disabled={answerBusy}
                  uploading={uploadingAnswerImages}
                  variant="answer"
                  label="Zdjęcia do odpowiedzi"
                  hint="Dodaj zdjęcia rozwiązania, rysunku lub obliczeń"
                />
                <Button
                  onClick={publishAnswer}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={!newAnswer.trim() || answerBusy}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {answerBusy ? "Publikowanie…" : "Opublikuj odpowiedź"}
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 text-center dark:border-blue-900/50 dark:bg-blue-950/20 sm:p-5">
                <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
                  Zaloguj się, aby dodać odpowiedź i pomóc autorowi pytania.
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    setLoginDialogDescription("Musisz się zalogować, aby dodać odpowiedź.");
                    setLoginDialogOpen(true);
                  }}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Dodaj odpowiedź
                </Button>
              </div>
            )}

            {answersLoading ? (
              <Skeleton className="h-24 w-full dark:bg-slate-700" />
            ) : sortedAnswers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                Brak odpowiedzi. Bądź pierwszy i pomóż!
              </div>
            ) : (
              <div className="space-y-4">
                {sortedAnswers.map((answer) => {
                  const created = answer.created_at || answer.created_date;
                  const canAccept =
                    isQuestionAuthor && !question.has_accepted_answer;

                  return (
                    <div
                      key={answer.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        answer.is_accepted
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/35 dark:border-emerald-600"
                          : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <div className="p-2 rounded-lg bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-slate-300">
                            <ThumbsUp className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                            {answer.votes || 0}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {answer.author_name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                {created
                                  ? format(new Date(created), "d MMM yyyy, HH:mm", {
                                      locale: pl,
                                    })
                                  : ""}
                              </p>
                            </div>
                            {answer.is_accepted && (
                              <Badge className="bg-emerald-600 text-white shrink-0">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Zaakceptowana
                              </Badge>
                            )}
                          </div>

                          <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap mb-3">
                            {answer.answer_text}
                          </p>

                          <CommunityQuestionImages
                            record={answer}
                            altPrefix="Zdjęcie w odpowiedzi"
                            className="mb-3"
                            singleClassName="mb-3 max-h-64 w-full rounded-xl object-contain border border-slate-200 dark:border-slate-600"
                            thumbnailClassName="max-h-40"
                          />

                          {canAccept && !answer.is_accepted && (
                            <Button
                              size="sm"
                              onClick={() => acceptAnswerMutation.mutate(answer.id)}
                              disabled={acceptAnswerMutation.isPending}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Zaakceptuj odpowiedź
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Komentarze ({questionComments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <div className="space-y-4 rounded-xl border border-purple-200/80 bg-gradient-to-br from-purple-50/80 to-white p-4 dark:border-purple-900/40 dark:from-purple-950/20 dark:to-slate-800/80 sm:p-5">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Dodaj komentarz lub wyjaśnienie..."
                  rows={3}
                  className="resize-y bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
                <CommunityImagesField
                  items={commentImages}
                  onChange={setCommentImages}
                  disabled={commentBusy}
                  uploading={uploadingCommentImages}
                  variant="comment"
                  compact
                  label="Zdjęcia do komentarza"
                  hint="Dodaj zrzut ekranu lub zdjęcie notatki"
                />
                <Button
                  onClick={publishComment}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!newComment.trim() || commentBusy}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {commentBusy ? "Publikowanie…" : "Dodaj komentarz"}
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-purple-200 bg-purple-50/80 p-4 text-center dark:border-purple-900/50 dark:bg-purple-950/20 sm:p-5">
                <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
                  Zaloguj się, aby dołączyć do dyskusji.
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    setLoginDialogDescription("Musisz się zalogować, aby dodać komentarz.");
                    setLoginDialogOpen(true);
                  }}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  Dodaj komentarz
                </Button>
              </div>
            )}

            {commentsLoading ? (
              <Skeleton className="h-16 w-full dark:bg-slate-700" />
            ) : questionComments.length === 0 ? (
              <div className="text-center py-6 text-gray-500 dark:text-slate-400">
                Brak komentarzy. Zacznij dyskusję!
              </div>
            ) : (
              <div className="space-y-3">
                {questionComments.map((comment) => {
                  const created = comment.created_at || comment.created_date;
                  return (
                    <div
                      key={comment.id}
                      className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                    >
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <ThumbsUp className="w-3 h-3 text-slate-400" />
                          <span className="text-xs font-semibold text-slate-900 dark:text-white tabular-nums">
                            {comment.votes || 0}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-sm text-slate-900 dark:text-white">
                              {comment.author_name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                              {created
                                ? format(new Date(created), "d MMM yyyy, HH:mm", {
                                    locale: pl,
                                  })
                                : ""}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap mb-2">
                            {comment.content}
                          </p>
                          <CommunityQuestionImages
                            record={comment}
                            altPrefix="Zdjęcie w komentarzu"
                            singleClassName="max-h-48 rounded-lg border border-slate-200 dark:border-slate-600"
                            thumbnailClassName="max-h-32"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        <LoginRequiredDialog
          open={loginDialogOpen}
          onOpenChange={setLoginDialogOpen}
          description={loginDialogDescription}
        />
      </div>
    </div>
  );
}
