import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useTaskProgress } from "@/contexts/TaskProgressContext";
import { motion } from "framer-motion";
import tasks from "@/data/tasksets.json";
import MathText from "@/components/MathText";
import {
  getReviewStatusBadgeClass,
  getReviewStatusMeta,
  isReviewDue,
  resolveTaskSchedule,
  statusToPriority,
} from "@/utils/review-schedule";

export default function UnfinishedPage() {
  const { getAllProgress } = useTaskProgress();
  const progress = getAllProgress();

  const tasksToReview = tasks
    .filter((t) => {
      const entry = progress[t.id];
      if (!entry?.attempts?.length) return false;
      const schedule = resolveTaskSchedule(entry);
      if (isReviewDue(schedule?.nextReviewAt)) return true;
      return statusToPriority(schedule?.reviewStatus) >= statusToPriority("trudne");
    })
    .sort((a, b) => {
      const scheduleA = resolveTaskSchedule(progress[a.id]);
      const scheduleB = resolveTaskSchedule(progress[b.id]);
      return (
        statusToPriority(scheduleB?.reviewStatus) -
        statusToPriority(scheduleA?.reviewStatus)
      );
    });

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-7 h-7 text-purple-500" />
            Niezaliczone zadania
          </h1>
          <p className="mt-2 text-gray-600 dark:text-slate-300">
            Zadania, które wymagają powtórki — według terminu i statusu trudności.
          </p>
        </div>

        {tasksToReview.length === 0 ? (
          <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Brak zadań do powtórki
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-4">
                Rozwiąż kilka zadań ze zbiorów, a te wymagające powtórki pojawią się tutaj.
              </p>
              <Link
                to={createPageUrl("TaskSets")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white hover:from-purple-600 hover:to-fuchsia-700 transition"
              >
                Przejdź do zbiorów zadań <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasksToReview.map((t, idx) => {
              const entry = progress[t.id];
              const schedule = resolveTaskSchedule(entry);
              const statusMeta = getReviewStatusMeta(schedule?.reviewStatus);
              const lastAttempt = entry.attempts[entry.attempts.length - 1];
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Link to={`${createPageUrl("TaskDetails")}?id=${t.id}`} className="block">
                    <Card className="bg-white dark:bg-slate-800 border-0 shadow hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-900 dark:text-white font-medium truncate">
                              <MathText text={t.question} className="math-text-ui--flow" />
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="border-blue-500 text-blue-700 dark:text-blue-400 text-xs">
                                {t.level}
                              </Badge>
                              <Badge variant="outline" className="border-gray-400 text-gray-600 dark:text-gray-300 text-xs">
                                {t.topic}
                              </Badge>
                              <Badge variant="outline" className="border-gray-400 text-gray-600 dark:text-gray-300 text-xs">
                                {t.type === "closed" ? "zamknięte" : "otwarte"}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
                              Prób: {entry.attempts.length} • Ostatnia: {new Date(lastAttempt.date).toLocaleDateString("pl-PL")}
                            </p>
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-center gap-1">
                            <Badge className={`${getReviewStatusBadgeClass(statusMeta.id)} text-sm px-3 py-1`}>
                              {statusMeta.label}
                            </Badge>
                            <span className="text-[10px] text-gray-400 dark:text-slate-500">status</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
