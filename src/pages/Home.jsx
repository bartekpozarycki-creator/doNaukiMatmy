import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTaskProgress } from "@/contexts/TaskProgressContext";
import { useWorksheetProgress, WORKSHEET_STATUS } from "@/hooks/use-worksheet-progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Target,
  TrendingUp,
  Sparkles,
  Trophy,
  Layers,
  Heart,
  Users,
  FileText,
  Search,
  MessageCircle,
  PlayCircle,
  ClipboardCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import CarouselReviews from "@/components/CarouselReviews";
import {
  loadContinueLearning,
  pickLatestByType,
} from "@/utils/continue-learning";

const features = [
  {
    icon: BookOpen,
    title: "Arkusze egzaminacyjne",
    color: "from-blue-500 to-blue-600",
    link: "Worksheets",
  },
  {
    icon: Layers,
    title: "Zbiory zadań",
    color: "from-sky-500 to-cyan-600",
    link: "TaskSets",
  },
  {
    icon: Heart,
    title: "Ulubione",
    color: "from-rose-500 to-pink-600",
    link: "Favorites",
  },
  {
    icon: Users,
    title: "Społeczność",
    color: "from-violet-500 to-purple-600",
    link: "Community",
  },
  {
    icon: Target,
    title: "Kursy",
    color: "from-purple-400 to-purple-600",
    link: "Course",
  },
  {
    icon: TrendingUp,
    title: "Analiza postępów",
    color: "from-indigo-400 to-indigo-600",
    link: "Progress",
    visible: false,
  },
];

const quickNavItems = [
  {
    icon: FileText,
    title: "Arkusze",
    link: "Worksheets",
    accent: "border-blue-200 bg-blue-50/80 dark:border-blue-800 dark:bg-blue-950/40",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Layers,
    title: "Zbiory zadań",
    link: "TaskSets",
    accent: "border-sky-200 bg-sky-50/80 dark:border-sky-800 dark:bg-sky-950/40",
    iconClass: "text-sky-600 dark:text-sky-400",
  },
  {
    icon: Heart,
    title: "Ulubione",
    link: "Favorites",
    accent: "border-rose-200 bg-rose-50/80 dark:border-rose-900 dark:bg-rose-950/40",
    iconClass: "text-rose-600 dark:text-rose-400",
  },
  {
    icon: MessageCircle,
    title: "Społeczność",
    link: "Community",
    accent: "border-violet-200 bg-violet-50/80 dark:border-violet-900 dark:bg-violet-950/40",
    iconClass: "text-violet-600 dark:text-violet-400",
  },
];

const howItWorksSteps = [
  {
    icon: Search,
    title: "Znajdź zadanie",
  },
  {
    icon: BookOpen,
    title: "Ćwicz i sprawdzaj",
  },
  {
    icon: Heart,
    title: "Zapisuj ulubione",
  },
  {
    icon: Users,
    title: "Pytaj społeczność",
  },
];

const statsData = [
  { value: 10000, label: "Aktywnych użytkowników", suffix: "+" },
  { value: 500, label: "Arkuszy maturalnych", suffix: "+" },
  { value: 95, label: "Zadowolonych uczniów", suffix: "%" },
  { value: 150, label: "Godzin materiałów", suffix: "+" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
};

const continueTypeMeta = {
  task: {
    label: "Ostatnie zadanie",
    icon: ClipboardCheck,
    accent: "border-sky-200 bg-sky-50/80 dark:border-sky-900 dark:bg-sky-950/30",
    iconClass: "text-sky-600 dark:text-sky-400",
  },
  worksheet: {
    label: "Ostatni arkusz",
    icon: FileText,
    accent: "border-blue-200 bg-blue-50/80 dark:border-blue-900 dark:bg-blue-950/30",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  course: {
    label: "Ostatni kurs",
    icon: BookOpen,
    accent: "border-violet-200 bg-violet-50/80 dark:border-violet-900 dark:bg-violet-950/30",
    iconClass: "text-violet-600 dark:text-violet-400",
  },
};

const propType = () => null;

function AnimatedCounter({ value, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep += 1;
      if (currentStep >= steps) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(increment * currentStep));
      }
    }, stepDuration);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

AnimatedCounter.propTypes = {
  value: propType,
  suffix: propType,
};

export default function HomePage() {
  const { user } = useAuth();
  const { getAllProgress } = useTaskProgress();
  const { getAll: getAllWorksheetProgress } = useWorksheetProgress();
  const [continueItems, setContinueItems] = useState([]);
  const visibleFeatures = features.filter((feature) => feature.visible !== false);
  const isDark = user?.theme === "dark";

  useEffect(() => {
    document.body.classList.add("hide-scrollbar", "overflow-x-hidden");
    return () => {
      document.body.classList.remove("hide-scrollbar", "overflow-x-hidden");
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadContinueLearning(user?.id)
      .then((items) => {
        if (!cancelled) setContinueItems(items);
      })
      .catch((error) => {
        console.error("[continue-learning] load", error);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const fallbackContinueItems = useMemo(() => {
    const taskEntries = Object.entries(getAllProgress?.() || {})
      .map(([taskId, progress]) => {
        const lastAttempt = progress?.attempts?.at(-1);
        if (!lastAttempt?.date) return null;
        return {
          type: "task",
          id: taskId,
          title: `Zadanie ${taskId}`,
          subtitle: lastAttempt.isCorrect ? "Ostatnio: poprawnie" : "Ostatnio: błędnie",
          href: `${createPageUrl("TaskDetails")}?id=${taskId}`,
          actionLabel: "Kontynuuj zadanie",
          updatedAt: lastAttempt.date,
        };
      })
      .filter(Boolean);

    const worksheetEntries = (getAllWorksheetProgress?.() || [])
      .filter((attempt) => attempt?.id)
      .map((attempt) => ({
        type: "worksheet",
        id: attempt.id,
        title: attempt.title || `Arkusz ${attempt.id}`,
        subtitle:
          attempt.status === WORKSHEET_STATUS.STARTED
            ? `${attempt.answeredCount ?? 0}/${attempt.questionCount ?? "?"} odpowiedzi`
            : attempt.score != null && attempt.total != null
              ? `Wynik: ${attempt.score}/${attempt.total}`
              : "Otwórz arkusz",
        href: `${createPageUrl("WorksheetDetails")}?id=${attempt.id}`,
        actionLabel:
          attempt.status === WORKSHEET_STATUS.STARTED
            ? "Kontynuuj arkusz"
            : "Otwórz arkusz",
        updatedAt: attempt.updatedAt || attempt.date || attempt.startedAt,
      }));

    return [...taskEntries, ...worksheetEntries];
  }, [getAllProgress, getAllWorksheetProgress]);

  const visibleContinueItems = useMemo(
    () => pickLatestByType([...continueItems, ...fallbackContinueItems]),
    [continueItems, fallbackContinueItems],
  );

  return (
    <div className={`${isDark ? "dark" : ""} overflow-x-hidden`}>
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        <motion.div
          className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-violet-400/15 blur-3xl"
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.3, 0.45, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-1.5 text-sm font-medium text-blue-800 shadow-sm backdrop-blur dark:border-blue-800 dark:bg-slate-900/70 dark:text-blue-200"
            >
              <Sparkles className="h-4 w-4 text-blue-500" />
              Przygotowanie do matury i egzaminów
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
            >
              Matematyka może być{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                prosta
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl"
            >
              Arkusze, zbiory zadań, ulubione i społeczność - wszystko w jednym
              miejscu, żebyś mógł uczyć się we własnym tempie.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            >
              {user ? (
                <>
                  <Link to={createPageUrl("Worksheets")}>
                    <Button
                      size="lg"
                      className="h-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-lg text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Rozwiąż arkusz
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl("TaskSets")}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-auto rounded-xl border-2 border-slate-300 bg-white/80 px-8 py-6 text-lg dark:border-slate-600 dark:bg-slate-900/50"
                    >
                      Zbiory zadań
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to={createPageUrl("TaskSets")}>
                    <Button
                      size="lg"
                      className="h-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-lg text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Zacznij od zadań
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl("Worksheets")}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-auto rounded-xl border-2 border-slate-300 bg-white/80 px-8 py-6 text-lg dark:border-slate-600 dark:bg-slate-900/50"
                    >
                      Arkusze maturalne
                      <Trophy className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4"
            >
              {statsData.map((stat, index) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/60 bg-white/70 px-3 py-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/60"
                >
                  <motion.div
                    className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                      />
                    </span>
                  </motion.div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {visibleContinueItems.length > 0 && (
        <section className="bg-white py-12 dark:bg-slate-800 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  Kontynuuj naukę
                </h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Wróć do ostatnio otwartych materiałów.
                </p>
              </div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-3">
              {visibleContinueItems.map((item, index) => {
                const meta = continueTypeMeta[item.type] || continueTypeMeta.task;
                const Icon = meta.icon;
                return (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    {...fadeUp}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Link to={item.href} className="group block h-full">
                      <Card className={`h-full border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${meta.accent}`}>
                        <CardContent className="flex h-full flex-col p-5">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 shadow-sm dark:bg-slate-900/70">
                                <Icon className={`h-6 w-6 ${meta.iconClass}`} />
                              </span>
                              <span className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                {meta.label}
                              </span>
                            </div>
                            <PlayCircle className={`h-5 w-5 ${meta.iconClass}`} />
                          </div>
                          <h3 className="line-clamp-2 text-lg font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </h3>
                          {item.subtitle && (
                            <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-400">
                              {item.subtitle}
                            </p>
                          )}
                          <span className="mt-4 inline-flex items-center text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {item.actionLabel || "Kontynuuj"}
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-slate-50 py-14 dark:bg-slate-900/80 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Szybka nawigacja
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Wybierz, od czego chcesz zacząć
            </p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickNavItems.map((item, index) => (
              <motion.div
                key={item.link}
                {...fadeUp}
                transition={{ delay: index * 0.06 }}
              >
                <Link to={createPageUrl(item.link)} className="group block h-full">
                  <Card
                    className={`h-full border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.accent}`}
                  >
                    <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/90 shadow-sm transition-transform group-hover:scale-105 dark:bg-slate-900/80">
                        <item.icon
                          className={`h-6 w-6 ${item.iconClass}`}
                        />
                      </span>
                      <h3 className="min-w-0 flex-1 text-base font-bold leading-snug text-slate-900 dark:text-white sm:text-lg">
                        {item.title}
                      </h3>
                      <ArrowRight
                        className={`h-5 w-5 shrink-0 ${item.iconClass} opacity-40 transition-all group-hover:translate-x-0.5 group-hover:opacity-100`}
                      />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-slate-800 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Jak to działa?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              MathMaster łączy ćwiczenia, arkusze i współpracę z innymi - krok po
              kroku, bez przełączania między narzędziami.
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorksSteps.map((step, index) => (
              <motion.div key={step.title} {...fadeUp} transition={{ delay: index * 0.08 }}>
                <Card className="h-full border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white shadow-md">
                      {index + 1}
                    </div>
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50">
                      <step.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </span>
                    <h3 className="text-base font-bold leading-snug text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-900 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Wszystko, czego potrzebujesz
            </h2>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
              Główne moduły platformy
            </p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleFeatures.map((feature, index) => (
              <motion.div key={feature.title} {...fadeUp} transition={{ delay: index * 0.06 }}>
                <Link to={createPageUrl(feature.link)} className="group block h-full">
                  <Card className="h-full overflow-hidden border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-800/60">
                    <CardContent className="flex items-center gap-4 p-4 sm:gap-5 sm:p-5">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-md transition-transform group-hover:scale-105 sm:h-14 sm:w-14 sm:rounded-2xl`}
                      >
                        <feature.icon className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                      </div>
                      <h3 className="min-w-0 flex-1 text-base font-bold leading-snug text-slate-900 dark:text-white sm:text-lg">
                        {feature.title}
                      </h3>
                      <ArrowRight className="h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600 dark:text-slate-600 dark:group-hover:text-blue-400" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-800">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <CarouselReviews />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
