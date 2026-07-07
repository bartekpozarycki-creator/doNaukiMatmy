import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CheckCircle, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import MathText from "@/components/MathText";
import CommunityImagesCountHint from "@/components/community/CommunityImagesCountHint";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabase-config";
import { isCommunityAdmin } from "@/utils/community-admin";
import { contentImageCount } from "@/utils/community-images";

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
  ogólne: "Ogólne",
};

export default function CommunityModeration() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [adminAllowed, setAdminAllowed] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    let cancelled = false;
    setAdminAllowed(null);
    isCommunityAdmin(supabase, user?.id).then((allowed) => {
      if (!cancelled) setAdminAllowed(allowed);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const { data: pendingQuestions = [], isLoading } = useQuery({
    queryKey: ["communityModeration", "pending"],
    enabled: adminAllowed === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_questions")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ question, status, reason = null }) => {
      const { error } = await supabase
        .from("community_questions")
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          rejection_reason: status === "rejected" ? reason : null,
        })
        .eq("id", question.id);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["communityModeration"] });
      queryClient.invalidateQueries({ queryKey: ["communityQuestions"] });
      setRejectTarget(null);
      setRejectionReason("");
      toast.success(
        variables.status === "approved"
          ? "Post został zatwierdzony."
          : "Post został odrzucony.",
      );
    },
    onError: (error) => {
      toast.error(error.message || "Nie udało się zaktualizować posta");
    },
  });

  const handleApprove = (question) => {
    reviewMutation.mutate({ question, status: "approved" });
  };

  const handleReject = () => {
    const reason = rejectionReason.trim();
    if (!rejectTarget || !reason) {
      toast.error("Podaj powód odrzucenia");
      return;
    }
    reviewMutation.mutate({
      question: rejectTarget,
      status: "rejected",
      reason,
    });
  };

  if (!user) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border-0 bg-white dark:bg-slate-800">
            <CardContent className="p-8 text-center">
              <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Zaloguj się
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Panel moderacji jest dostępny tylko dla administratorów.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (adminAllowed === null) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Card className="border-0 bg-white dark:bg-slate-800">
            <CardContent className="p-8 text-center text-slate-600 dark:text-slate-300">
              Sprawdzam uprawnienia...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!adminAllowed) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="border-0 bg-white dark:bg-slate-800">
            <CardContent className="p-8 text-center">
              <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-rose-500" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Brak dostępu
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Twoje konto nie jest dodane do listy administratorów.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Moderacja społeczności
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Zatwierdzaj lub odrzucaj posty zanim pojawią się publicznie.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <Card className="border-0 bg-white dark:bg-slate-800">
            <CardContent className="p-8 text-center text-slate-600 dark:text-slate-300">
              Ładowanie postów do weryfikacji...
            </CardContent>
          </Card>
        ) : pendingQuestions.length === 0 ? (
          <Card className="border-0 bg-white dark:bg-slate-800">
            <CardContent className="p-10 text-center">
              <CheckCircle className="mx-auto mb-4 h-14 w-14 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Brak postów do weryfikacji
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Wszystkie oczekujące posty zostały już obsłużone.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingQuestions.map((question) => {
              const createdAt = question.created_at || question.created_date;
              return (
                <Card
                  key={question.id}
                  className="border-0 bg-white shadow-sm dark:bg-slate-800"
                >
                  <CardContent className="space-y-4 p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge className="bg-blue-600 text-white">
                            Oczekuje
                          </Badge>
                          <Badge
                            variant="outline"
                            className="dark:border-slate-600 dark:text-slate-300"
                          >
                            {topicNames[question.topic] || question.topic}
                          </Badge>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          <MathText text={question.title} />
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          przez {question.author_name || question.author_email}
                          {createdAt
                            ? ` • ${format(new Date(createdAt), "d MMM yyyy, HH:mm", { locale: pl })}`
                            : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          type="button"
                          className="bg-blue-600 text-white hover:bg-blue-700"
                          disabled={reviewMutation.isPending}
                          onClick={() => handleApprove(question)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Zatwierdź
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
                          disabled={reviewMutation.isPending}
                          onClick={() => {
                            setRejectTarget(question);
                            setRejectionReason("");
                          }}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Odrzuć
                        </Button>
                      </div>
                    </div>

                    <div className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                      <MathText text={question.description} />
                    </div>

                    {question.attached_task ? (
                      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                          Podpięte zadanie
                        </p>
                        <div className="text-sm text-slate-900 dark:text-white">
                          <MathText text={question.attached_task.question} />
                        </div>
                      </div>
                    ) : null}

                    {contentImageCount(question) > 0 ? (
                      <CommunityImagesCountHint record={question} />
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={Boolean(rejectTarget)} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent className="dark:border-slate-700 dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>Odrzuć post</DialogTitle>
            <DialogDescription>
              Podaj powód odrzucenia. Autor będzie mógł zobaczyć tę informację przy swoim poście.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            placeholder="Np. post jest nieczytelny, brakuje treści zadania albo narusza zasady społeczności."
            className="min-h-32 dark:border-slate-700 dark:bg-slate-800"
          />
          <DialogFooter className="gap-2 sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectTarget(null)}
            >
              Anuluj
            </Button>
            <Button
              type="button"
              className="bg-rose-600 text-white hover:bg-rose-700"
              disabled={reviewMutation.isPending}
              onClick={handleReject}
            >
              Odrzuć post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
