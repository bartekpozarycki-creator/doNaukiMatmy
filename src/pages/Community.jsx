import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus, HelpCircle, Clock, CheckCircle, XCircle, Paperclip
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CycleFilter,
  FilterBar,
  FilterSearchField,
  PrettySelectFilter,
} from "@/components/ListFilters";
import QuestionCard from "../components/community/QuestionCard";
import QuestionCardSkeleton from "../components/community/QuestionCardSkeleton";
import AttachFavoriteTaskPicker, {
  taskToAttachedPayload,
  communityTopicFromTaskTopic,
} from "../components/community/AttachFavoriteTaskPicker";
import CommunityQuestionImagesField, {
  clearCommunityImageItems,
} from "@/components/community/CommunityQuestionImagesField";
import MathInsertToolbar from "@/components/MathInsertToolbar";
import MathText from "@/components/MathText";
import { toast } from "sonner";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, publicSupabase } from "@/supabase-config";
import {
  resolveQuestionTitle,
  trimField,
  buildCommunityQuestionPayload,
  formatCommunityPublishError,
  getValidSession,
  countAuthorQuestionsToday,
  publishCommunityQuestion,
} from "@/utils/community-publish";
import { consumeCommunityPrefillTask, clearCommunityPrefillTask } from "@/utils/community-prefill";
import { uploadCommunityQuestionImages } from "@/utils/community-images";
import { registerQuestionView } from "@/utils/register-question-view";
import {
  bannedContentMessage,
  containsBannedContent,
} from "@/utils/content-moderation/moderate-content";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { motion } from "framer-motion";

const topicNames = {
  liczby_rzeczywiste: "Liczby rzeczywiste",
  wyrazenia_algebraiczne: "Wyrażenia algebraiczne",
  funkcje: "Funkcje",
  ciagi: "Ciągi",
  trygonometria: "Trygonometria",
  planimetria: "Planimetria",
  geometria_analityczna: "Geometria analityczna",
  stereometria: "Stereometria",
  kombinatoryka_i_statystyka: "Kombinatoryka i statystyka",
  optymalizacja_i_rozniczkowy: "Optymalizacja",
  ogólne: "Ogólne"
};

const topicCardStyles = {
  liczby_rzeczywiste: {
    bar: "from-blue-500 to-indigo-500",
    badge: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  },
  wyrazenia_algebraiczne: {
    bar: "from-sky-500 to-cyan-500",
    badge: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300",
  },
  funkcje: {
    bar: "from-violet-500 to-purple-500",
    badge: "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
  },
  ciagi: {
    bar: "from-indigo-500 to-blue-500",
    badge: "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300",
  },
  trygonometria: {
    bar: "from-fuchsia-500 to-pink-500",
    badge: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-800 dark:bg-fuchsia-950/40 dark:text-fuchsia-300",
  },
  planimetria: {
    bar: "from-emerald-500 to-teal-500",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  geometria_analityczna: {
    bar: "from-cyan-500 to-blue-500",
    badge: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300",
  },
  stereometria: {
    bar: "from-teal-500 to-emerald-500",
    badge: "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300",
  },
  kombinatoryka_i_statystyka: {
    bar: "from-orange-500 to-rose-500",
    badge: "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300",
  },
  optymalizacja_i_rozniczkowy: {
    bar: "from-rose-500 to-pink-500",
    badge: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
  },
  ogólne: {
    bar: "from-slate-500 to-slate-600",
    badge: "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300",
  },
};

const questionStatusMeta = {
  pending: {
    label: "Czeka na weryfikację",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
    icon: Clock,
  },
  approved: {
    label: "Opublikowane",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    icon: CheckCircle,
  },
  rejected: {
    label: "Odrzucone",
    className:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
    icon: XCircle,
  },
};

const REJECTED_QUESTION_TTL_HOURS = 24;

const isRejectedQuestionExpired = (question) => {
  if (question?.status !== "rejected" || !question.reviewed_at) return false;
  const expiresAt =
    new Date(question.reviewed_at).getTime() +
    REJECTED_QUESTION_TTL_HOURS * 60 * 60 * 1000;
  return Number.isFinite(expiresAt) && expiresAt <= Date.now();
};


export default function CommunityPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [attachedTask, setAttachedTask] = useState(null);
  const [questionImages, setQuestionImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const prefillHandledRef = useRef(false);

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
    topic: "ogólne",
    difficulty: 3
  });

  useEffect(() => {
    if (location.state?.skipPrefill || location.state?.fromPublish) {
      clearCommunityPrefillTask();
      if (location.state?.prefillTask || location.state?.skipPrefill || location.state?.fromPublish) {
        navigate(location.pathname, { replace: true, state: {} });
      }
      return;
    }

    if (prefillHandledRef.current) return;

    const prefillTask =
      location.state?.prefillTask ?? consumeCommunityPrefillTask();
    if (!prefillTask) return;

    prefillHandledRef.current = true;
    setAttachedTask(prefillTask);
    setNewQuestion((prev) => ({
      ...prev,
      description: prev.description || "",
      topic: communityTopicFromTaskTopic(prefillTask.topic),
    }));

    if (!user) {
      setLoginDialogOpen(true);
      return;
    }

    setDialogOpen(true);
    if (location.state?.prefillTask) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, user, navigate]);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['communityQuestions', user?.id],
    queryFn: async () => {
      const { data, error } = await publicSupabase
        .from("community_questions")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const list = data || [];
      if (!list.length) return [];
      const ids = list.map((q) => q.id);
      const { data: likes, error: likesError } = await publicSupabase
        .from("community_question_likes")
        .select("question_id, user_id")
        .in("question_id", ids);
      if (likesError) throw likesError;
      const counts = {};
      const likedSet = new Set();
      (likes || []).forEach((like) => {
        counts[like.question_id] = (counts[like.question_id] || 0) + 1;
        if (user?.id && like.user_id === user.id) {
          likedSet.add(like.question_id);
        }
      });
      return list.map((q) => ({
        ...q,
        votes: counts[q.id] || 0,
        is_liked: likedSet.has(q.id),
      }));
    },
  });

  const { data: myQuestions = [], isLoading: myQuestionsLoading } = useQuery({
    queryKey: ["myCommunityQuestions", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const cutoff = new Date(
        Date.now() - REJECTED_QUESTION_TTL_HOURS * 60 * 60 * 1000,
      ).toISOString();
      const { error: cleanupError } = await supabase
        .from("community_questions")
        .delete()
        .eq("author_id", user.id)
        .eq("status", "rejected")
        .lt("reviewed_at", cutoff);
      if (cleanupError) {
        console.warn("[Community] cleanup rejected questions", cleanupError);
      }

      const { data, error } = await supabase
        .from("community_questions")
        .select("*")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).filter((question) => !isRejectedQuestionExpired(question));
    },
  });

  const createQuestionMutation = useMutation({
    mutationFn: (payload) => publishCommunityQuestion(supabase, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityQuestions'] });
      queryClient.invalidateQueries({ queryKey: ["myCommunityQuestions"] });
      clearCommunityPrefillTask();
      setDialogOpen(false);
      setNewQuestion({
        title: "",
        description: "",
        topic: "ogólne",
        difficulty: 3
      });
      setQuestionImages([]);
      setAttachedTask(null);
      toast.success("Pytanie trafiło do weryfikacji.");
    },
    onError: (error) => {
      toast.error(formatCommunityPublishError(error));
    },
  });

  const voteQuestionMutation = useMutation({
    onMutate: async (question) => {
      const queryKey = ["communityQuestions", user?.id];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old) =>
        (old || []).map((q) => {
          if (q.id !== question.id) return q;
          const liked = q.is_liked;
          return {
            ...q,
            is_liked: !liked,
            votes: Math.max(0, (q.votes || 0) + (liked ? -1 : 1)),
          };
        })
      );
      return { previous, queryKey };
    },
    onError: (_err, _question, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
      toast.error("Nie udało się zaktualizować podbicia");
    },
    onSuccess: (data, question) => {
      const queryKey = ["communityQuestions", user?.id];
      queryClient.setQueryData(queryKey, (old) =>
        (old || []).map((q) =>
          q.id === question.id
            ? {
                ...q,
                votes: data.count,
                is_liked: !question.is_liked,
              }
            : q
        )
      );
    },
    mutationFn: async (question) => {
      const { data: existing, error: existingError } = await supabase
        .from("community_question_likes")
        .select("id")
        .eq("question_id", question.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (existingError) throw existingError;
      if (existing?.id) {
        const { error } = await supabase
          .from("community_question_likes")
          .delete()
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("community_question_likes")
          .insert({ question_id: question.id, user_id: user.id });
        if (error) throw error;
      }
      const { count, error: countError } = await publicSupabase
        .from("community_question_likes")
        .select("id", { count: "exact", head: true })
        .eq("question_id", question.id);
      if (countError) throw countError;
      const { error: updateError } = await supabase.rpc("sync_question_votes", {
        question_id: question.id,
        votes_count: count || 0,
      });
      if (updateError) throw updateError;
      return { count: count || 0 };
    },
  });

  const resolvedTitle = resolveQuestionTitle(newQuestion.title);
  const resolvedDescription = trimField(newQuestion.description);
  const canPublish =
    !!user &&
    resolvedTitle.length > 0 &&
    resolvedDescription.length > 0 &&
    !createQuestionMutation.isPending &&
    !uploadingImages;

  const handleCreateQuestion = async (event) => {
    event?.preventDefault?.();

    const { session, error: sessionError } = await getValidSession(supabase);

    if (sessionError || !session?.user) {
      toast.error("Sesja wygasła. Zaloguj się ponownie.");
      setLoginDialogOpen(true);
      return;
    }

    const title = resolveQuestionTitle(newQuestion.title);
    const description = trimField(newQuestion.description);

    if (!title) {
      toast.error("Podaj tytuł pytania.");
      return;
    }
    if (!description) {
      toast.error("Podaj opis problemu");
      return;
    }
    if (containsBannedContent(`${title} ${description}`)) {
      toast.error(bannedContentMessage);
      return;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { data: todayQuestions, error: todayCountError } = await supabase
      .from("community_questions")
      .select("created_at, author_id")
      .eq("author_id", session.user.id)
      .gte("created_at", todayStart.toISOString());
    if (todayCountError) {
      toast.error("Nie udało się sprawdzić limitu pytań");
      return;
    }
    const todayCount = countAuthorQuestionsToday(todayQuestions, session.user.id);
    if (todayCount >= 3) {
      toast.error("Limit 3 pytań dziennie został osiągnięty");
      return;
    }

    const payload = buildCommunityQuestionPayload({
      newQuestion,
      attachedTask,
      user: session.user,
      imageUrls: [],
    });

    let uploadedUrls = [];
    if (questionImages.length) {
      setUploadingImages(true);
      try {
        uploadedUrls = await uploadCommunityQuestionImages(
          session.user.id,
          questionImages.map((item) => item.file),
        );
      } catch (error) {
        toast.error(error.message || "Nie udało się przesłać zdjęć");
        setUploadingImages(false);
        return;
      } finally {
        setUploadingImages(false);
      }
    }

    payload.image_urls = uploadedUrls;
    payload.image_url = uploadedUrls[0] ?? null;

    try {
      await createQuestionMutation.mutateAsync(payload);
      clearCommunityImageItems(questionImages);
    } catch {
      // onError w mutacji pokazuje toast
    }
  };

  const handleVote = (question) => {
    if (!user) {
      toast.error("Zaloguj się, aby podbić pytanie");
      return;
    }
    voteQuestionMutation.mutate(question);
  };

  const handleQuestionOpen = async (question, detailsUrl) => {
    if (!user?.id) {
      navigate(detailsUrl, { state: { question } });
      return;
    }

    const { viewCount, error, incremented } = await registerQuestionView(
      question.id,
      user.id,
    );

    if (error) {
      console.warn("[Community] register_question_view", error);
    }

    const resolvedCount =
      viewCount != null ? viewCount : question.view_count ?? 0;
    const updatedQuestion = { ...question, view_count: resolvedCount };

    if (viewCount != null || incremented) {
      const queryKey = ["communityQuestions", user.id];
      queryClient.setQueryData(queryKey, (old) =>
        (old || []).map((q) =>
          q.id === question.id ? { ...question, view_count: resolvedCount } : q,
        ),
      );
    }

    navigate(detailsUrl, { state: { question: updatedQuestion } });
  };

  const handleAskQuestionClick = () => {
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }
    setDialogOpen(true);
  };

  const handleAttachFavoriteTask = (task) => {
    const payload = taskToAttachedPayload(task);
    setAttachedTask(payload);
    setNewQuestion((prev) => ({
      ...prev,
      topic: communityTopicFromTaskTopic(task.topic),
    }));
  };

  const handleDetachTask = () => {
    setAttachedTask(null);
    setNewQuestion((prev) => ({
      ...prev,
      topic: "ogólne",
    }));
  };

  const handleQuestionDialogOpenChange = (open) => {
    if (!open) {
      clearCommunityImageItems(questionImages);
      setQuestionImages([]);
    }
    setDialogOpen(open);
  };

  const list = questions;

  const moderationQuestions = myQuestions.filter(
    (question) => question.status === "pending" || question.status === "rejected",
  );

  // filter by search & topic
  const filteredQuestions = list.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === "all" || question.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  // sort according to sortOption
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortOption === "oldest") return new Date(a.created_at || 0) - new Date(b.created_at || 0);
    if (sortOption === "boosts") return (b.votes || 0) - (a.votes || 0);
    // newest default
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  const isDark = document.documentElement.classList.contains("dark");

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Społeczność
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-300">
              Zadawaj pytania i pomagaj innym
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={handleQuestionDialogOpenChange}>
            <Button
              onClick={handleAskQuestionClick}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Zadaj pytanie
            </Button>
            <DialogContent className="flex max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl flex-col gap-0 overflow-hidden bg-white p-0 dark:bg-slate-800 sm:w-full">
              <DialogHeader className="shrink-0 px-6 pb-2 pt-6 pr-12">
                <DialogTitle className="dark:text-white">Zadaj pytanie</DialogTitle>
              </DialogHeader>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4">
              <form className="space-y-4" onSubmit={handleCreateQuestion}>
                <AttachFavoriteTaskPicker
                  attachedTask={attachedTask}
                  onAttach={handleAttachFavoriteTask}
                  onDetach={handleDetachTask}
                />

                <div className="space-y-2">
                  <Label
                    htmlFor="question-title"
                    className="text-slate-900 dark:text-white"
                  >
                    Tytuł pytania
                  </Label>
                  <Input
                    ref={titleInputRef}
                    id="question-title"
                    value={newQuestion.title}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, title: e.target.value })
                    }
                    placeholder="Krótki tytuł pytania"
                    className="bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                  <MathInsertToolbar
                    targetRef={titleInputRef}
                    value={newQuestion.title}
                    onChange={(title) =>
                      setNewQuestion((prev) => ({ ...prev, title }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label
                    htmlFor="question-topic"
                    className="text-slate-900 dark:text-white"
                  >
                    Dział / temat
                    {attachedTask && (
                      <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                        (z podpiętego zadania)
                      </span>
                    )}
                  </Label>
                  <Select
                    value={newQuestion.topic || undefined}
                    onValueChange={(value) =>
                      setNewQuestion({ ...newQuestion, topic: value })
                    }
                    disabled={!!attachedTask}
                  >
                    <SelectTrigger
                      id="question-topic"
                      disabled={!!attachedTask}
                      className="bg-white disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:disabled:bg-slate-800/80"
                    >
                      <SelectValue placeholder="Wybierz dział" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-600">
                      {Object.entries(topicNames).map(([key, label]) => (
                        <SelectItem
                          key={key}
                          value={key}
                          className="dark:text-slate-300"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label
                    htmlFor="question-description"
                    className="text-slate-900 dark:text-white"
                  >
                    Opis problemu
                    <span className="ml-1 text-rose-500">*</span>
                  </Label>
                  <Textarea
                    ref={descriptionInputRef}
                    id="question-description"
                    value={newQuestion.description}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        description: e.target.value,
                      })
                    }
                    placeholder={
                      attachedTask
                        ? "Napisz, co sprawia trudność w tym zadaniu: który krok, jakie podejście, gdzie wynik się rozjeżdża..."
                        : "Opisz swój problem: kontekst, próby rozwiązania, miejsce, w którym utknąłeś..."
                    }
                    rows={attachedTask ? 8 : 6}
                    className="min-h-[140px] resize-y bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:min-h-[160px]"
                  />
                  <MathInsertToolbar
                    targetRef={descriptionInputRef}
                    value={newQuestion.description}
                    onChange={(description) =>
                      setNewQuestion((prev) => ({ ...prev, description }))
                    }
                  />
                </div>

                <CommunityQuestionImagesField
                  items={questionImages}
                  onChange={setQuestionImages}
                  disabled={createQuestionMutation.isPending}
                  uploading={uploadingImages}
                  variant="question"
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  disabled={!canPublish}
                >
                  {createQuestionMutation.isPending || uploadingImages
                    ? uploadingImages
                      ? "Przesyłanie zdjęć…"
                      : "Publikowanie…"
                    : "Opublikuj pytanie"}
                </Button>
                {!canPublish && !createQuestionMutation.isPending && (
                  <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                    {!user
                      ? "Zaloguj się, aby opublikować pytanie"
                      : !resolvedDescription
                        ? "Uzupełnij opis problemu"
                        : !resolvedTitle
                          ? "Podaj tytuł pytania"
                          : null}
                  </p>
                )}
              </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
          <DialogContent className="dark:bg-slate-800 bg-white max-w-md">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Zaloguj się</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-slate-300">
                Musisz się zalogować, aby zadać pytanie. Przeglądanie pytań jest dostępne bez logowania.
              </p>
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={() => setLoginDialogOpen(false)}>
                  Anuluj
                </Button>
                <Link to={createPageUrl("Login")}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Przejdź do logowania
                  </Button>
                </Link>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {user && (myQuestionsLoading || moderationQuestions.length > 0) ? (
          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Twoje pytania
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Zgłoszenia oczekujące na moderację albo odrzucone. Po
                  zatwierdzeniu pojawią się na liście poniżej.
                </p>
              </div>
            </div>

            {myQuestionsLoading ? (
              <div className="space-y-4">
                <QuestionCardSkeleton />
              </div>
            ) : (
              <div className="space-y-4">
                {moderationQuestions.map((question) => {
                  const status = question.status || "pending";
                  const meta =
                    questionStatusMeta[status] || questionStatusMeta.pending;
                  const StatusIcon = meta.icon;
                  const createdAt = question.created_at || question.created_date;
                  const topicStyle =
                    topicCardStyles[question.topic] || topicCardStyles.ogólne;

                  return (
                    <motion.div
                      key={question.id}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    >
                      <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-800 dark:shadow-none">
                        <div
                          className={cn("h-1 w-full bg-gradient-to-r", topicStyle.bar)}
                          aria-hidden
                        />
                        <CardContent className="p-4 sm:p-5">
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "inline-flex items-center gap-1.5 font-medium",
                                meta.className,
                              )}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {meta.label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={cn("font-medium", topicStyle.badge)}
                            >
                              {topicNames[question.topic] || question.topic}
                            </Badge>
                          </div>

                          <h3 className="text-lg font-bold leading-snug text-slate-900 dark:text-white sm:text-xl">
                            <MathText text={question.title} />
                          </h3>

                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {createdAt
                              ? format(new Date(createdAt), "d MMM yyyy, HH:mm", {
                                  locale: pl,
                                })
                              : "Brak daty"}
                          </p>

                          <div className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            <MathText text={question.description} />
                          </div>

                          {question.attached_task ? (
                            <div className="mt-4 rounded-xl border border-blue-200/80 bg-blue-50/70 p-3 dark:border-slate-600 dark:bg-slate-900/40">
                              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                                <Paperclip className="h-3.5 w-3.5" />
                                Podpięte zadanie
                              </p>
                              <div className="line-clamp-2 text-sm text-slate-800 dark:text-slate-200">
                                <MathText text={question.attached_task.question} />
                              </div>
                            </div>
                          ) : null}

                          {status === "rejected" && question.rejection_reason ? (
                            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
                              <span className="font-semibold">
                                Powód odrzucenia:
                              </span>{" "}
                              {question.rejection_reason}
                            </div>
                          ) : null}
                          {status === "rejected" ? (
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                              Odrzucone pytanie zostanie automatycznie usunięte po
                              24 godzinach od weryfikacji.
                            </p>
                          ) : null}
                          {status === "pending" ? (
                            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                              Po zatwierdzeniu pytanie pojawi się na liście
                              społeczności poniżej.
                            </p>
                          ) : null}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        ) : null}

        {/* Search and Filter */}
        <Card className="mb-6 dark:bg-slate-800 bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <FilterBar
              columnsClassName="grid-cols-2"
              search={
                <FilterSearchField
                  placeholder="Szukaj pytań..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              }
            >
              <PrettySelectFilter
                label="Temat"
                value={selectedTopic}
                options={[
                  { value: "all", label: "Wszystkie" },
                  ...Object.entries(topicNames).map(([key, label]) => ({
                    value: key,
                    label,
                  })),
                ]}
                onChange={setSelectedTopic}
              />
              <CycleFilter
                label="Sortuj"
                value={sortOption}
                options={[
                  { value: "newest", label: "Od najnowszych" },
                  { value: "oldest", label: "Od najstarszych" },
                  { value: "boosts", label: "Najwięcej podbić" },
                ]}
                onChange={setSortOption}
              />
            </FilterBar>
          </CardContent>
        </Card>

        {/* Questions List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <QuestionCardSkeleton key={`community-skeleton-${index}`} />
            ))}
          </div>
        ) : sortedQuestions.length === 0 ? (
          <Card className="dark:bg-slate-800 bg-white border-0">
            <CardContent className="p-12 text-center">
              <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Brak pytań
              </h3>
              <p className="text-gray-600 dark:text-slate-400">
                Bądź pierwszy i zadaj pytanie!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                user={user}
                onVote={() => handleVote(question)}
                onOpen={handleQuestionOpen}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}