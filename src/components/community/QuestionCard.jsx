import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUp,
  MessageSquare,
  Eye,
  CheckCircle2,
  Paperclip,
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { motion } from "framer-motion";
import MathText from "@/components/MathText";
import CommunityImagesCountHint from "@/components/community/CommunityImagesCountHint";
import { contentImageCount } from "@/utils/community-images";
import { cn } from "@/lib/utils";

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

const topicStyles = {
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

const defaultTopicStyle = topicStyles.ogólne;

const propType = () => null;

function getAuthorInitial(name) {
  const trimmed = String(name || "?").trim();
  return trimmed.charAt(0).toUpperCase();
}

export default function QuestionCard({ question, user, onVote, onOpen }) {
  const hasVoted =
    user &&
    (question.is_liked || (question.voted_by || []).includes(user.email));
  const createdAt = question.created_at || question.created_date;
  const detailsUrl = `${createPageUrl("QuestionDetails")}?id=${question.id}`;
  const topicStyle = topicStyles[question.topic] || defaultTopicStyle;
  const imageCount = contentImageCount(question);

  const handleOpen = (e) => {
    if (!onOpen || !user?.id) return;
    e.preventDefault();
    onOpen(question, detailsUrl);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
    >
      <Card className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md shadow-slate-200/40 transition-shadow duration-300 hover:border-violet-200/80 hover:shadow-xl hover:shadow-slate-300/30 dark:border-slate-700/80 dark:bg-slate-800 dark:shadow-none dark:hover:border-violet-800/50 dark:hover:shadow-lg dark:hover:shadow-black/20">
        <div
          className={cn("h-1 w-full bg-gradient-to-r", topicStyle.bar)}
          aria-hidden
        />
        <CardContent className="p-0">
          <div className="flex">
            <div className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-slate-100 bg-slate-50/70 px-2 py-5 dark:border-slate-700/80 dark:bg-slate-900/30 sm:w-16 sm:px-3">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onVote?.();
                }}
                title={
                  user
                    ? hasVoted
                      ? "Cofnij podbicie"
                      : "Podbij pytanie"
                    : "Zaloguj się, aby podbić pytanie"
                }
                aria-label={
                  user
                    ? hasVoted
                      ? "Cofnij podbicie"
                      : "Podbij pytanie"
                    : "Zaloguj się, aby podbić pytanie"
                }
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                  hasVoted
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "bg-white text-slate-500 shadow-sm hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-400",
                )}
              >
                <ArrowUp className="h-5 w-5" />
              </button>
              <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                {question.votes || 0}
              </span>
            </div>

            <Link
              to={detailsUrl}
              state={{ question }}
              onClick={handleOpen}
              className="min-w-0 flex-1 p-4 sm:p-5"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn("font-medium", topicStyle.badge)}
                >
                  {topicNames[question.topic] || question.topic}
                </Badge>
                {question.has_accepted_answer ? (
                  <Badge className="gap-1 border-0 bg-emerald-600 text-white hover:bg-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Rozwiązane
                  </Badge>
                ) : null}
              </div>

              <h3 className="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 sm:text-xl">
                <MathText text={question.title} />
              </h3>

              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-bold text-white">
                  {getAuthorInitial(question.author_name)}
                </span>
                <span className="truncate">
                  {question.author_name}
                  {createdAt ? (
                    <>
                      {" "}
                      ·{" "}
                      {format(new Date(createdAt), "d MMM yyyy", {
                        locale: pl,
                      })}
                    </>
                  ) : null}
                </span>
              </div>

              <div className="mt-3 line-clamp-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-[0.9375rem]">
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

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-700/80">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700/70 dark:text-slate-300">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {question.answer_count || 0}{" "}
                  {(question.answer_count || 0) === 1
                    ? "odpowiedź"
                    : "odpowiedzi"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700/70 dark:text-slate-300">
                  <Eye className="h-3.5 w-3.5" />
                  {question.view_count || 0} wyświetleń
                </span>
                {imageCount > 0 ? (
                  <CommunityImagesCountHint record={question} />
                ) : null}
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

QuestionCard.propTypes = {
  question: propType,
  user: propType,
  onVote: propType,
  onOpen: propType,
};
