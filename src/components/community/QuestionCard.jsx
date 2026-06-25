import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, MessageSquare, Eye, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import MathText from "@/components/MathText";
import CommunityImagesCountHint from "@/components/community/CommunityImagesCountHint";
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

const propType = () => null;

export default function QuestionCard({ question, user, onVote, onOpen }) {
  const hasVoted =
    user &&
    (question.is_liked || (question.voted_by || []).includes(user.email));
  const createdAt = question.created_at || question.created_date;
  const detailsUrl = `${createPageUrl("QuestionDetails")}?id=${question.id}`;

  const handleOpen = (e) => {
    if (!onOpen || !user?.id) return;
    e.preventDefault();
    onOpen(question, detailsUrl);
  };

  return (
    <Card className="group border-0 bg-white transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
      <CardContent className="p-6">
        <div className="mb-2 flex items-start gap-3">
          <Link
            to={detailsUrl}
            state={{ question }}
            className="min-w-0 flex-1"
            onClick={handleOpen}
          >
            <h3 className="mb-1 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              <MathText text={question.title} />
            </h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              przez {question.author_name} •{" "}
              {createdAt
                ? format(new Date(createdAt), "d MMM yyyy", { locale: pl })
                : ""}
            </p>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {question.has_accepted_answer && (
              <Badge className="flex items-center gap-1 bg-emerald-600 text-white">
                <CheckCircle className="h-3 w-3" />
                Rozwiązane
              </Badge>
            )}
            <div className="flex flex-col items-center gap-0.5">
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
                className={`rounded-lg p-2 transition-colors ${
                  hasVoted
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                }`}
              >
                <ArrowUp className="h-5 w-5" />
              </button>
              <span className="text-center text-xs font-bold tabular-nums text-slate-900 dark:text-white">
                {question.votes || 0}
              </span>
            </div>
          </div>
        </div>

        <Link to={detailsUrl} state={{ question }} className="block" onClick={handleOpen}>
          <div className="mb-4 line-clamp-2 whitespace-pre-wrap text-gray-700 dark:text-slate-300">
            <MathText text={question.description} />
          </div>

          {question.attached_task && (
            <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50/60 p-3 dark:border-slate-700 dark:bg-slate-700/40">
              <p className="mb-1 text-xs uppercase tracking-wide text-blue-600 dark:text-blue-300">
                Podpięte zadanie
              </p>
              <div className="text-sm text-slate-900 dark:text-white">
                <MathText text={question.attached_task.question} />
              </div>
            </div>
          )}

          {contentImageCount(question) > 0 && (
            <div className="mb-4">
              <CommunityImagesCountHint record={question} />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Badge
              variant="outline"
              className="dark:border-slate-600 dark:text-slate-300"
            >
              {topicNames[question.topic] || question.topic}
            </Badge>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {question.answer_count || 0} odpowiedzi
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {question.view_count || 0} wyświetleń
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

QuestionCard.propTypes = {
  question: propType,
  user: propType,
  onVote: propType,
  onOpen: propType,
};
