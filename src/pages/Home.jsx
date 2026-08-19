import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTaskProgress } from "@/contexts/TaskProgressContext";
import { useWorksheetProgress, WORKSHEET_STATUS } from "@/hooks/use-worksheet-progress";
import {
  ArrowRight,
  BookOpen,
  Target,
  Sparkles,
  Layers,
  Heart,
  Users,
  FileText,
  Search,
  PlayCircle,
  ClipboardCheck,
  Compass,
  ListOrdered,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  loadContinueLearning,
  pickLatestByType,
} from "@/utils/continue-learning";
import { cn } from "@/lib/utils";
import TypewriterWords from "@/components/TypewriterWords";

const platformModules = [
  {
    icon: FileText,
    title: "Arkusze egzaminacyjne",
    description: "Rozwiązuj arkusze maturalne i egzaminacyjne w jednym miejscu.",
    link: "Worksheets",
    featured: true,
  },
  {
    icon: Layers,
    title: "Zbiory zadań",
    description: "Przeglądaj zadania według tematu, poziomu i typu.",
    link: "TaskSets",
    featured: true,
  },
  {
    icon: Heart,
    title: "Ulubione",
    description: "Zapisuj zadania i wracaj do nich z własnymi notatkami.",
    link: "Favorites",
  },
  {
    icon: Users,
    title: "Społeczność",
    description: "Zadawaj pytania i pomagaj innym uczniom.",
    link: "Community",
  },
  {
    icon: Target,
    title: "Kursy i dydaktyka",
    description: "Kursy wideo i lekcje dopasowane do Twojego poziomu.",
    link: "Course",
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
    description: "Gdy utkniesz - zapytaj innych uczniów.",
  },
];

const heroMathSymbols = [
  { symbol: "∑", top: "8%", left: "6%", size: "text-4xl sm:text-5xl", rotate: -12, delay: 0 },
  { symbol: "∫", top: "18%", left: "88%", size: "text-5xl sm:text-6xl", rotate: 8, delay: 0.4 },
  { symbol: "π", top: "62%", left: "10%", size: "text-3xl sm:text-4xl", rotate: 14, delay: 0.8 },
  { symbol: "√", top: "70%", left: "82%", size: "text-4xl sm:text-5xl", rotate: -6, delay: 1.2 },
  { symbol: "∞", top: "38%", left: "4%", size: "text-3xl sm:text-4xl", rotate: 0, delay: 0.2 },
  { symbol: "Δ", top: "12%", left: "72%", size: "text-3xl sm:text-4xl", rotate: -18, delay: 0.6 },
  { symbol: "θ", top: "78%", left: "48%", size: "text-2xl sm:text-3xl", rotate: 10, delay: 1 },
  { symbol: "±", top: "48%", left: "92%", size: "text-2xl sm:text-3xl", rotate: -4, delay: 1.4 },
  { symbol: "≈", top: "28%", left: "18%", size: "text-2xl sm:text-3xl", rotate: 6, delay: 0.5 },
  { symbol: "x²", top: "55%", left: "68%", size: "text-2xl sm:text-3xl", rotate: -8, delay: 0.9 },
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
    label: "Zadanie",
    icon: ClipboardCheck,
  },
  worksheet: {
    label: "Arkusz",
    icon: FileText,
  },
  course: {
    label: "Kurs",
    icon: BookOpen,
  },
};

const glassTileClass =
  "rounded-2xl border border-blue-200/60 bg-white/70 shadow-sm shadow-blue-100/40 backdrop-blur-md transition-all duration-300 group-hover:border-blue-300/80 group-hover:bg-white/90 group-hover:shadow-md group-hover:shadow-blue-100/60 dark:border-blue-800/40 dark:bg-slate-900/60 dark:shadow-none dark:group-hover:border-blue-700/50 dark:group-hover:bg-slate-900/80";

function SectionBackdrop({ symbols = [] }) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <motion.div
        className="absolute -right-16 top-0 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-10 bottom-0 h-72 w-72 rounded-full bg-violet-400/12 blur-3xl"
        animate={{ scale: [1.05, 1, 1.05], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {symbols.length > 0 ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {symbols.map((item) => (
            <span
              key={`${item.symbol}-${item.left}`}
              className="absolute select-none font-serif text-3xl font-semibold text-blue-600/15 dark:text-blue-300/12 sm:text-4xl"
              style={{
                top: item.top,
                left: item.left,
                rotate: `${item.rotate}deg`,
              }}
            >
              {item.symbol}
            </span>
          ))}
        </div>
      ) : null}
    </>
  );
}

function SectionIntro({ badge, badgeIcon: BadgeIcon, title, subtitle }) {
  return (
    <motion.div {...fadeUp} className="mb-8 sm:mb-10">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-3.5 py-1.5 text-sm font-medium text-blue-800 shadow-sm backdrop-blur dark:border-blue-800 dark:bg-slate-900/70 dark:text-blue-200">
        <BadgeIcon className="h-4 w-4 text-blue-500" />
        {badge}
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400 sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}

function PlatformModuleCard({ module, index, featured = false }) {
  const Icon = module.icon;

  return (
    <motion.div
      {...fadeUp}
      {...tileHover}
      transition={{ delay: index * 0.06 }}
      className={cn(featured && "lg:col-span-1")}
    >
      <Link to={createPageUrl(module.link)} className="group block h-full">
        <div
          className={cn(
            "flex h-full gap-4 p-5 sm:p-6",
            glassTileClass,
            featured ? "flex-col justify-between sm:p-7 lg:min-h-[220px]" : "items-start",
          )}
        >
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105",
              featured ? "h-14 w-14 sm:h-16 sm:w-16" : "h-12 w-12 sm:h-14 sm:w-14",
            )}
          >
            <Icon
              className={cn(
                "text-white",
                featured ? "h-7 w-7 sm:h-8 sm:w-8" : "h-6 w-6 sm:h-7 sm:w-7",
              )}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                "font-bold tracking-tight text-slate-900 dark:text-white",
                featured ? "text-xl sm:text-2xl" : "text-lg",
              )}
            >
              {module.title}
            </h3>
            <p
              className={cn(
                "mt-1.5 leading-relaxed text-slate-600 dark:text-slate-400",
                featured ? "text-sm sm:text-base" : "text-sm",
              )}
            >
              {module.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 dark:text-blue-400">
              Otwórz
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const { getAllProgress } = useTaskProgress();
  const { getAll: getAllWorksheetProgress } = useWorksheetProgress();
  const [continueItems, setContinueItems] = useState([]);
  const isDark = user?.theme === "dark";

  const featuredModules = platformModules.filter((module) => module.featured);
  const regularModules = platformModules.filter((module) => !module.featured);

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

        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {heroMathSymbols.map((item) => (
            <motion.span
              key={`${item.symbol}-${item.left}-${item.top}`}
              className={cn(
                "absolute select-none font-serif font-semibold text-blue-600/25 dark:text-blue-300/20",
                item.size,
              )}
              style={{
                top: item.top,
                left: item.left,
                rotate: `${item.rotate}deg`,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: [0.35, 0.7, 0.35],
                y: [0, -10, 0],
              }}
              transition={{
                opacity: {
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay,
                },
                y: {
                  duration: 6 + item.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay,
                },
              }}
            >
              {item.symbol}
            </motion.span>
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 sm:py-40 lg:px-8 lg:py-44">
          <div className="relative mx-auto max-w-4xl text-center">
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
              className="relative z-10 whitespace-nowrap text-[clamp(1rem,2.4vw+0.55rem,3.75rem)] font-bold leading-tight tracking-tight text-slate-900 dark:text-white"
            >
              Matematyka może być{" "}
              <TypewriterWords />
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
          </div>
        </div>
      </section>

      {visibleContinueItems.length > 0 && (
        <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
          <SectionBackdrop
            symbols={[
              { symbol: "∑", top: "18%", left: "8%", rotate: -10 },
              { symbol: "π", top: "70%", left: "90%", rotate: 12 },
              { symbol: "∞", top: "22%", left: "86%", rotate: 4 },
              { symbol: "√", top: "78%", left: "6%", rotate: -8 },
            ]}
          />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <SectionIntro
              badge="Wróć do nauki"
              badgeIcon={PlayCircle}
              title="Kontynuuj naukę"
              subtitle="Ostatnio otwarte materiały - gotowe do dalszej pracy."
            />

            <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
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
                      <div className={cn("flex h-full flex-col p-5 sm:p-6", glassTileClass)}>
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/80 px-3 py-1 text-xs font-semibold text-blue-700 backdrop-blur dark:border-blue-800 dark:bg-slate-900/70 dark:text-blue-300">
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            {meta.label}
                          </span>
                          <ArrowRight className="h-4 w-4 text-blue-500 opacity-50 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-blue-400" />
                        </div>

                        <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-slate-900 dark:text-white sm:text-xl">
                          {item.title}
                        </h3>
                        {item.subtitle ? (
                          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            {item.subtitle}
                          </p>
                        ) : (
                          <div className="flex-1" />
                        )}

                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 dark:text-blue-400">
                          {item.actionLabel || "Kontynuuj"}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
        <SectionBackdrop
          symbols={[
            { symbol: "Δ", top: "14%", left: "92%", rotate: -14 },
            { symbol: "∫", top: "68%", left: "4%", rotate: 8 },
            { symbol: "≈", top: "24%", left: "6%", rotate: 6 },
            { symbol: "θ", top: "76%", left: "88%", rotate: -6 },
          ]}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionIntro
            badge="Moduły platformy"
            badgeIcon={Compass}
            title="Odkrywaj platformę"
            subtitle="Wybierz moduł i zacznij naukę od razu."
          />

          <div className="grid gap-4 lg:grid-cols-2">
            {featuredModules.map((module, index) => (
              <PlatformModuleCard
                key={module.link}
                module={module}
                index={index}
                featured
              />
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {regularModules.map((module, index) => (
              <PlatformModuleCard
                key={module.link}
                module={module}
                index={index + featuredModules.length}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
        <SectionBackdrop
          symbols={[
            { symbol: "±", top: "16%", left: "10%", rotate: -8 },
            { symbol: "x²", top: "20%", left: "88%", rotate: 10 },
            { symbol: "∞", top: "74%", left: "8%", rotate: 4 },
            { symbol: "π", top: "72%", left: "90%", rotate: -12 },
          ]}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionIntro
            badge="Prosta ścieżka"
            badgeIcon={ListOrdered}
            title="Jak to działa?"
            subtitle="Ćwiczenia, arkusze i współpraca - krok po kroku, bez przełączania między narzędziami."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorksSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  {...fadeUp}
                  {...tileHover}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className={cn("flex h-full flex-col p-5 sm:p-6", glassTileClass)}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm shadow-blue-500/20">
                        {index + 1}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200/70 bg-white/80 dark:border-blue-800 dark:bg-slate-900/70">
                        <StepIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </span>
                    </div>
                    <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
