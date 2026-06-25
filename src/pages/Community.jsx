import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Plus, Search, HelpCircle
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
import { uploadCommunityQuestionImages } from "@/utils/community-images";
import { registerQuestionView } from "@/utils/register-question-view";

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

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
    topic: "ogólne",
    difficulty: 3
  });

  useEffect(() => {
    const prefillTask = location.state?.prefillTask;
    if (!prefillTask) return;
    setAttachedTask(prefillTask);
    if (!user) {
      setLoginDialogOpen(true);
      return;
    }
    setDialogOpen(true);

    setNewQuestion((prev) => ({
      ...prev,
      title: prefillTask.question,
      description: prev.description || "",
      topic: communityTopicFromTaskTopic(prefillTask.topic),
    }));
  }, [location.state, user]);

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ['communityQuestions', user?.id],
    queryFn: async () => {
      const { data, error } = await publicSupabase
        .from("community_questions")
        .select("*")
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

  const createQuestionMutation = useMutation({
    mutationFn: (payload) => publishCommunityQuestion(supabase, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityQuestions'] });
      setDialogOpen(false);
      setNewQuestion({
        title: "",
        description: "",
        topic: "ogólne",
        difficulty: 3
      });
      setQuestionImages([]);
      setAttachedTask(null);
      toast.success("Pytanie zostało opublikowane!");
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

  const resolvedTitle = resolveQuestionTitle(newQuestion.title, attachedTask);
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

    const title = resolveQuestionTitle(newQuestion.title, attachedTask);
    const description = trimField(newQuestion.description);

    if (!title) {
      toast.error("Podaj tytuł pytania lub podpnij zadanie z treścią");
      return;
    }
    if (!description) {
      toast.error("Podaj opis problemu");
      return;
    }

    const todayCount = countAuthorQuestionsToday(questions, session.user.id);
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
      title: task.question,
      topic: communityTopicFromTaskTopic(task.topic),
    }));
  };

  const handleDetachTask = () => {
    setAttachedTask(null);
    setNewQuestion((prev) => ({
      ...prev,
      title: "",
      topic: "",
    }));
  };

  const handleQuestionDialogOpenChange = (open) => {
    if (!open) {
      clearCommunityImageItems(questionImages);
      setQuestionImages([]);
    }
    setDialogOpen(open);
  };

  const list = questions.length ? questions : [];

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
                    {attachedTask && (
                      <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                        (z podpiętego zadania)
                      </span>
                    )}
                  </Label>
                  <Input
                    ref={titleInputRef}
                    id="question-title"
                    value={newQuestion.title}
                    onChange={(e) =>
                      setNewQuestion({ ...newQuestion, title: e.target.value })
                    }
                    disabled={!!attachedTask}
                    readOnly={!!attachedTask}
                    placeholder={
                      attachedTask
                        ? "Tytuł ustawiony z zadania"
                        : "Krótki tytuł pytania"
                    }
                    className="bg-white disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:disabled:bg-slate-800/80"
                  />
                  {!attachedTask && (
                    <MathInsertToolbar
                      targetRef={titleInputRef}
                      value={newQuestion.title}
                      onChange={(title) =>
                        setNewQuestion((prev) => ({ ...prev, title }))
                      }
                    />
                  )}
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
                          ? "Podaj tytuł lub podpnij zadanie z treścią"
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

        {/* Search and Filter */}
        <Card className="mb-6 dark:bg-slate-800 bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Szukaj pytań..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white bg-white"
                />
              </div>

              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-full sm:w-48 dark:bg-slate-700 dark:border-slate-600 dark:text-white bg-white">
                  <SelectValue placeholder="Wszystkie tematy" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-800 dark:border-slate-600">
                  <SelectItem value="all" className="dark:text-slate-300">Wszystkie</SelectItem>
                  {Object.entries(topicNames).map(([key, label]) => (
                    <SelectItem key={key} value={key} className="dark:text-slate-300">{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Sort Filter */}
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 bg-white">
                  <SelectValue placeholder="Sortuj" />
                </SelectTrigger>
                <SelectContent side="bottom" align="start">
                  <SelectItem value="newest">Od najnowszych</SelectItem>
                  <SelectItem value="oldest">Od najstarszych</SelectItem>
                  <SelectItem value="boosts">Najwięcej podbić</SelectItem>
                </SelectContent>
              </Select>
            </div>
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