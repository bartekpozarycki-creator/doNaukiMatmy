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
import {
  loadContinueLearning,
  pickLatestByType,
} from "@/utils/continue-learning";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: BookOpen,
    title: "Arkusze egzaminacyjne",
    description: "Rozwiązuj arkusze maturalne i egzaminacyjne w jednym miejscu.",
    color: "from-blue-500 to-blue-600",
    bar: "from-blue-500 to-indigo-500",
    link: "Worksheets",
  },
  {
    icon: Layers,
    title: "Zbiory zadań",
    description: "Przeglądaj zadania według tematu, poziomu i typu.",
    color: "from-sky-500 to-cyan-600",
    bar: "from-sky-500 to-cyan-500",
    link: "TaskSets",
  },
  {
    icon: Heart,
    title: "Ulubione",
    description: "Zapisuj zadania i wracaj do nich z własnymi notatkami.",
    color: "from-rose-500 to-pink-600",
    bar: "from-rose-500 to-pink-500",
    link: "Favorites",
  },
  {
    icon: Users,
    title: "Społeczność",
    description: "Zadawaj pytania i pomagaj innym uczniom.",
    color: "from-violet-500 to-purple-600",
    bar: "from-violet-500 to-purple-500",
    link: "Community",
  },
  {
    icon: Target,
    title: "Kursy",
    description: "Materiały wideo i lekcje krok po kroku.",
    color: "from-purple-400 to-purple-600",
    bar: "from-purple-500 to-fuchsia-500",
    link: "Course",
  },
  {
    icon: TrendingUp,
    title: "Analiza postępów",
    description: "Śledź swoje wyniki i postępy w nauce.",
    color: "from-indigo-400 to-indigo-600",
    bar: "from-indigo-500 to-blue-500",
    link: "Progress",
    visible: false,
  },
];

const quickNavItems = [
  {
    icon: FileText,
    title: "Arkusze",
    description: "Matura i egzaminy",
    link: "Worksheets",
    bar: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-100 dark:bg-blue-950/50",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Layers,
    title: "Zbiory zadań",
    description: "Tematy i poziomy",
    link: "TaskSets",
    bar: "from-sky-500 to-cyan-500",
    iconBg: "bg-sky-100 dark:bg-sky-950/50",
    iconClass: "text-sky-600 dark:text-sky-400",
  },
  {
    icon: Heart,
    title: "Ulubione",
    description: "Twoja lista",
    link: "Favorites",
    bar: "from-rose-500 to-pink-500",
    iconBg: "bg-rose-100 dark:bg-rose-950/50",
    iconClass: "text-rose-600 dark:text-rose-400",
  },
  {
    icon: MessageCircle,
    title: "Społeczność",
    description: "Pytania i odpowiedzi",
    link: "Community",
    bar: "from-violet-500 to-purple-500",
    iconBg: "bg-violet-100 dark:bg-violet-950/50",
    iconClass: "text-violet-600 dark:text-violet-400",
  },
];

const howItWorksSteps = [
  {
    icon: Search,
    title: "Znajdź zadanie",
    description: "Przeszukaj arkusze i zbiory według tematu.",
  },
  {
    icon: BookOpen,
    title: "Ćwicz i sprawdzaj",
    description: "Rozwiązuj zadania i od razu weryfikuj odpowiedź.",
  },
  {
    icon: Heart,
    title: "Zapisuj ulubione",
    description: "Dodawaj trudniejsze zadania do własnej listy.",
  },
  {
    icon: Users,
    title: "Pytaj społeczność",
    description: "Gdy utkniesz — zapytaj innych uczniów.",
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

const tileHover = {
  whileHover: { y: -6 },
  transition: { type: "spring", stiffness: 400, damping: 28 },
};

const continueTypeMeta = {
  task: {
    label: "Ostatnie zadanie",
    icon: ClipboardCheck,
    bar: "from-sky-500 to-cyan-500",
    iconBg: "bg-sky-100 dark:bg-sky-950/50",
    iconClass: "text-sky-600 dark:text-sky-400",
  },
  worksheet: {
    label: "Ostatni arkusz",
    icon: FileText,
    bar: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-100 dark:bg-blue-950/50",
    iconClass: "text-blue-600 dark:text-blue-400",
  },
  course: {
    label: "Ostatni kurs",
    icon: BookOpen,
    bar: "from-violet-500 to-purple-500",
    iconBg: "bg-violet-100 dark:bg-violet-950/50",
    iconClass: "text-violet-600 dark:text-violet-400",
  },
};

const propType = () => null;

function SectionHeader({ title, subtitle, align = "center" }) {
  return (
    <motion.div
      {...fadeUp}
      className={cn(
        "mb-10",
        align === "center" ? "text-center" : "text-left",
      )}
    >
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-2 text-base text-slate-600 dark:text-slate-400 sm:text-lg",
            align === "center" && "mx-auto max-w-2xl",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}

function TileAccentBar({ gradient }) {
  return (
    <div
      className={cn("h-1 w-full bg-gradient-to-r", gradient)}
      aria-hidden
    />
  );
}

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
              Arkusze, zbiory zadań, ulubione i społeczność — wszystko w jednym
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
              className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
            >
              {statsData.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="rounded-2xl border border-white/80 bg-white/80 px-4 py-5 shadow-md shadow-slate-200/40 backdrop-blur dark:border-slate-700/80 dark:bg-slate-800/70 dark:shadow-none"
                >
                  <div className="text-2xl font-bold sm:text-3xl">
                    <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-snug text-slate-600 dark:text-slate-400 sm:text-sm">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {visibleContinueItems.length > 0 && (
        <section className="bg-white py-14 dark:bg-slate-900 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              align="left"
              title="Kontynuuj naukę"
              subtitle="Wróć do ostatnio otwartych materiałów."
            />

            <div className="grid gap-4 md:grid-cols-3">
              {visibleContinueItems.map((item, index) => {
                const meta = continueTypeMeta[item.type] || continueTypeMeta.task;
                const Icon = meta.icon;
                return (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    {...fadeUp}
                    {...tileHover}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Link to={item.href} className="group block h-full">
                      <Card className="h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md shadow-slate-200/50 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-slate-300/40 dark:border-slate-700/80 dark:bg-slate-800 dark:shadow-none dark:group-hover:shadow-lg dark:group-hover:shadow-black/20">
                        <TileAccentBar gradient={meta.bar} />
                        <CardContent className="flex h-full flex-col p-5 sm:p-6">
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span
                                className={cn(
                                  "flex h-11 w-11 items-center justify-center rounded-xl",
                                  meta.iconBg,
                                )}
                              >
                                <Icon className={cn("h-5 w-5", meta.iconClass)} />
                              </span>
                              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                                {meta.label}
                              </span>
                            </div>
                            <PlayCircle
                              className={cn(
                                "h-5 w-5 opacity-60 transition-opacity group-hover:opacity-100",
                                meta.iconClass,
                              )}
                            />
                          </div>
                          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900 dark:text-white">
                            {item.title}
                          </h3>
                          {item.subtitle ? (
                            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                              {item.subtitle}
                            </p>
                          ) : null}
                          <span className="mt-5 inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {item.actionLabel || "Kontynuuj"}
                            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
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

      <section className="bg-slate-50 py-14 dark:bg-slate-950/50 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Szybka nawigacja"
            subtitle="Wybierz, od czego chcesz zacząć"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickNavItems.map((item, index) => (
              <motion.div
                key={item.link}
                {...fadeUp}
                {...tileHover}
                transition={{ delay: index * 0.06 }}
              >
                <Link to={createPageUrl(item.link)} className="group block h-full">
                  <Card className="h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md shadow-slate-200/40 transition-shadow duration-300 group-hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-800 dark:shadow-none dark:group-hover:shadow-lg dark:group-hover:shadow-black/20">
                    <TileAccentBar gradient={item.bar} />
                    <CardContent className="flex flex-col items-start p-5 sm:p-6">
                      <span
                        className={cn(
                          "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
                          item.iconBg,
                        )}
                      >
                        <item.icon className={cn("h-6 w-6", item.iconClass)} />
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                      <span
                        className={cn(
                          "mt-4 inline-flex items-center text-sm font-semibold",
                          item.iconClass,
                        )}
                      >
                        Otwórz
                        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-slate-900 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Jak to działa?"
            subtitle="MathMaster łączy ćwiczenia, arkusze i współpracę z innymi — krok po kroku, bez przełączania między narzędziami."
          />

          <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-10 hidden h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-violet-200 dark:from-blue-900 dark:via-indigo-900 dark:to-violet-900 lg:block"
              aria-hidden
            />
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.title}
                {...fadeUp}
                {...tileHover}
                transition={{ delay: index * 0.08 }}
                className="relative"
              >
                <Card className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md shadow-slate-200/40 dark:border-slate-700/80 dark:bg-slate-800 dark:shadow-none">
                  <CardContent className="flex flex-col items-center p-6 text-center sm:p-7">
                    <div className="relative mb-5">
                      <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-md">
                        {index + 1}
                      </span>
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/40">
                        <step.icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-950/50 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Wszystko, czego potrzebujesz"
            subtitle="Główne moduły platformy"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                {...fadeUp}
                {...tileHover}
                transition={{ delay: index * 0.06 }}
              >
                <Link to={createPageUrl(feature.link)} className="group block h-full">
                  <Card className="h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md shadow-slate-200/40 transition-shadow duration-300 group-hover:border-blue-200/80 group-hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-800 dark:shadow-none dark:group-hover:border-blue-800/50 dark:group-hover:shadow-lg dark:group-hover:shadow-black/20">
                    <TileAccentBar gradient={feature.bar} />
                    <CardContent className="flex items-start gap-4 p-5 sm:p-6">
                      <div
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-md transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14",
                          feature.color,
                        )}
                      >
                        <feature.icon className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {feature.description}
                        </p>
                        <span className="mt-3 inline-flex items-center text-sm font-semibold text-blue-600 opacity-0 transition-all group-hover:opacity-100 dark:text-blue-400">
                          Przejdź
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
