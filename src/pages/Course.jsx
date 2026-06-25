import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  GraduationCap,
  Layers,
  Play,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createPageUrl } from "@/utils";
import { sampleCoursesByLevel, allSampleCourses } from "@/utils/sample-courses";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const levelOptions = [
  {
    value: "podstawówka",
    label: "Podstawówka",
    shortLabel: "Klasa 7-8",
    description: "Spokojne przejście przez podstawy, rachunki i geometrię.",
    gradient: "from-emerald-500 to-teal-600",
    soft: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900",
  },
  {
    value: "podstawowy",
    label: "Matura podstawowa",
    shortLabel: "Poziom podstawowy",
    description: "Najważniejsze typy zadań maturalnych ułożone w konkretną trasę.",
    gradient: "from-blue-500 to-indigo-600",
    soft: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900",
  },
  {
    value: "rozszerzony",
    label: "Matura rozszerzona",
    shortLabel: "Poziom rozszerzony",
    description: "Trudniejsze działy, dowody i zadania wymagające kilku pomysłów.",
    gradient: "from-violet-500 to-fuchsia-600",
    soft: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-900",
  },
];

const topicLabels = {
  liczby_rzeczywiste: "Liczby i działania",
  wyrazenia_algebraiczne: "Algebra",
  funkcje: "Funkcje",
  ciagi: "Ciągi",
  trygonometria: "Trygonometria",
  planimetria: "Geometria płaska",
  geometria_analityczna: "Geometria analityczna",
  stereometria: "Stereometria",
  kombinatoryka_i_statystyka: "Kombinatoryka i statystyka",
  optymalizacja_i_rozniczkowy: "Analiza i optymalizacja",
};

const heroStats = [
  { label: "poziomy nauki", value: "3" },
  { label: "lekcje krok po kroku", value: "40+" },
  { label: "tryb od podstaw", value: "100%" },
];

const workflow = [
  {
    title: "Diagnoza",
    text: "Zaczynasz od poziomu, który pasuje do Twojego celu i widzisz tylko właściwe ścieżki.",
    icon: Target,
  },
  {
    title: "Lekcje",
    text: "Każdy kurs jest podzielony na krótkie moduły, więc łatwo wrócić do przerwanego miejsca.",
    icon: BookOpen,
  },
  {
    title: "Praktyka",
    text: "Po teorii przechodzisz do przykładów, zadań i powtórek z konkretnych działów.",
    icon: Brain,
  },
];

const levelMap = {
  osma_klasa: "podstawówka",
  matura_podstawowa: "podstawowy",
  matura_rozszerzona: "rozszerzony",
};

export default function CoursePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { userLevel } = useAuth();
  const enforcedLevel = userLevel && userLevel !== "brak" ? levelMap[userLevel] : null;
  const [selectedLevel, setSelectedLevel] = useState(enforcedLevel || "podstawowy");

  useEffect(() => {
    if (enforcedLevel) {
      setSelectedLevel(enforcedLevel);
    }
  }, [enforcedLevel]);

  const courses = useMemo(() => sampleCoursesByLevel[selectedLevel] || allSampleCourses, [selectedLevel]);
  const featuredCourse = courses[0];
  const totalLessons = courses.reduce((sum, course) => sum + (course.lessons_count || course.lessons?.length || 0), 0);
  const totalMinutes = courses.reduce((sum, course) => sum + (course.duration_minutes || 0), 0);
  const selectedLevelConfig = levelOptions.find((level) => level.value === selectedLevel) || levelOptions[1];

  const goToCourse = (courseObj) => {
    navigate(`${createPageUrl("CourseOverview")}?id=${encodeURIComponent(courseObj.id)}`, {
      state: { course: courseObj },
    });
  };

  return (
    <div key={location.key} className="overflow-hidden">
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.16),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col justify-center"
          >
            <Badge className="mb-5 w-fit border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Nowa strona kursów
            </Badge>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Wybierz ścieżkę i ucz się matematyki krok po kroku.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
              Kursy są teraz ułożone jak przejrzysty plan nauki: poziom, moduły, czas i szybkie przejście do lekcji bez starego widoku.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="text-2xl font-black text-slate-950 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-2xl shadow-blue-950/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
          >
            <div className={`rounded-[1.5rem] bg-gradient-to-br ${selectedLevelConfig.gradient} p-6 text-white`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Aktualna ścieżka</p>
                  <h2 className="mt-3 text-3xl font-black">{selectedLevelConfig.label}</h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                  <GraduationCap className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-white/85">{selectedLevelConfig.description}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/15 p-4">
                  <p className="text-2xl font-black">{courses.length}</p>
                  <p className="text-sm text-white/75">kursy</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-4">
                  <p className="text-2xl font-black">{totalLessons}</p>
                  <p className="text-sm text-white/75">lekcji</p>
                </div>
              </div>
            </div>
            {featuredCourse ? (
              <button
                type="button"
                onClick={() => goToCourse(featuredCourse)}
                className="mt-4 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-700 dark:hover:bg-blue-950/30"
              >
                <span>
                  <span className="block text-sm font-semibold text-slate-500 dark:text-slate-400">Polecany start</span>
                  <span className="mt-1 block font-bold text-slate-950 dark:text-white">{featuredCourse.title}</span>
                </span>
                <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </button>
            ) : null}
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-10 px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {levelOptions.map((level) => {
            const isActive = selectedLevel === level.value;
            return (
              <button
                key={level.value}
                type="button"
                onClick={() => setSelectedLevel(level.value)}
                disabled={!!enforcedLevel}
                className={`rounded-3xl border p-5 text-left transition ${
                  isActive
                    ? "border-blue-300 bg-white shadow-xl shadow-blue-950/10 dark:border-blue-800 dark:bg-slate-900"
                    : "border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
                } ${enforcedLevel ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge variant="outline" className={level.soft}>{level.shortLabel}</Badge>
                    <h3 className="mt-4 text-xl font-black text-slate-950 dark:text-white">{level.label}</h3>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${level.gradient} text-white`}>
                    <Layers className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{level.description}</p>
              </button>
            );
          })}
        </motion.div>

        <section className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <Card className="border-0 bg-slate-950 text-white shadow-xl shadow-slate-950/20 dark:bg-slate-900">
            <CardContent className="p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Clock className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-2xl font-black">Plan na ten poziom</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Zestaw dla wybranego poziomu ma {courses.length} kursy, {totalLessons} lekcji i około {totalMinutes} minut nauki.
              </p>
              <div className="mt-6 space-y-3">
                {workflow.map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-2xl bg-white/5 p-4">
                    <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-300">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((course, index) => {
              const topic = topicLabels[course.topic] || "Matematyka";
              const lessonsCount = course.lessons_count || course.lessons?.length || 0;
              const level = levelOptions.find((item) => item.value === course.level) || selectedLevelConfig;

              return (
                <motion.article
                  key={`${course.id}-${selectedLevel}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <Card
                    onClick={() => goToCourse(course)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") goToCourse(course);
                    }}
                    role="button"
                    tabIndex={0}
                    className="group h-full cursor-pointer overflow-hidden border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/10 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <CardContent className="flex h-full flex-col p-0">
                      <div className={`h-2 bg-gradient-to-r ${level.gradient}`} />
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${level.gradient} text-white shadow-lg`}>
                            <BookOpen className="h-6 w-6" />
                          </div>
                          <Badge variant="outline" className={level.soft}>{topic}</Badge>
                        </div>
                        <h3 className="mt-5 text-xl font-black text-slate-950 dark:text-white">{course.title}</h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{course.description}</p>
                        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                            <p className="font-black text-slate-950 dark:text-white">{lessonsCount}</p>
                            <p className="text-slate-500 dark:text-slate-400">lekcje</p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                            <p className="font-black text-slate-950 dark:text-white">{course.duration_minutes || 0} min</p>
                            <p className="text-slate-500 dark:text-slate-400">czas</p>
                          </div>
                        </div>
                        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
                            <Play className="h-4 w-4" />
                            Otwórz kurs
                          </span>
                          <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="outline" className="border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                Jak korzystać
              </Badge>
              <h2 className="mt-4 text-2xl font-black text-slate-950 dark:text-white">Nowy układ bez przeładowania nauki</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                Wybierz poziom, otwórz pierwszy kurs i przechodź przez lekcje po kolei. Szczegóły kursu nadal pokazują listę lekcji i pozwalają wejść do materiału.
              </p>
            </div>
            {featuredCourse ? (
              <Button
                type="button"
                onClick={() => goToCourse(featuredCourse)}
                className={`bg-gradient-to-r ${selectedLevelConfig.gradient} text-white shadow-lg shadow-blue-950/10 hover:opacity-95`}
              >
                Zacznij od pierwszego kursu
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
