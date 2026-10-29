import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Clock, Construction, FileText, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CycleFilter, FilterBar, FilterSearchField, PrettySelectFilter } from "@/components/ListFilters";
import { createPageUrl } from "@/utils";
import { sampleCoursesByLevel, allSampleCourses } from "@/utils/sample-courses";
import {
  sampleArticles,
  articleContentModeLabel,
  defaultArticleContentModes,
  getArticleContentModes,
  isArticleUnavailable,
} from "@/utils/sample-articles";
import { fetchNotes } from "@/utils/notes";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

function articleContentModeChipClass(mode, active, unavailable) {
  if (unavailable) {
    return "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-500";
  }
  if (!active) {
    return "border-slate-200 bg-white text-slate-500 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400";
  }
  if (mode === "rozszerzenie") {
    return "border-violet-500 bg-violet-100 text-violet-800 dark:border-violet-400 dark:bg-violet-950/50 dark:text-violet-200";
  }
  if (mode === "podstawowka") {
    return "border-green-500 bg-green-100 text-green-800 dark:border-green-400 dark:bg-green-950/50 dark:text-green-200";
  }
  return "border-blue-500 bg-blue-100 text-blue-800 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-200";
}

const levelTheme = {
  podstawówka: {
    label: "Egzamin ósmoklasisty",
    shortLabel: "E8",
    gradient: "from-green-400 to-green-600",
    badge: "border-green-500 text-green-700 dark:text-green-400",
    btn: "bg-green-600 hover:bg-green-700",
    soft: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-300",
  },
  podstawowy: {
    label: "Matura podstawowa",
    shortLabel: "Matura PP",
    gradient: "from-blue-400 to-blue-600",
    badge: "border-blue-500 text-blue-700 dark:text-blue-400",
    btn: "bg-blue-600 hover:bg-blue-700",
    soft: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-300",
  },
  rozszerzony: {
    label: "Matura rozszerzona",
    shortLabel: "Matura PR",
    gradient: "from-purple-400 to-purple-600",
    badge: "border-purple-500 text-purple-700 dark:text-purple-400",
    btn: "bg-purple-600 hover:bg-purple-700",
    soft: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-700 dark:text-purple-300",
  },
};

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

const levelMap = {
  osma_klasa: "podstawówka",
  matura_podstawowa: "podstawowy",
  matura_rozszerzona: "rozszerzony",
};

const goalNames = {
  osma_klasa: "Ósma klasa",
  matura_podstawowa: "Matura podstawowa",
  matura_rozszerzona: "Matura rozszerzona",
};

const levelFilterOptions = [
  { value: "podstawówka", label: "Egzamin ósmoklasisty" },
  { value: "podstawowy", label: "Matura podstawowa" },
  { value: "rozszerzony", label: "Matura rozszerzona" },
];

const articleLevelFilterOptions = [
  { value: "all", label: "Wszystkie poziomy" },
  ...levelFilterOptions,
];

const levelLabelByValue = Object.fromEntries(
  levelFilterOptions.map((option) => [option.value, option.label]),
);

function ComingSoonCourseCard({ level }) {
  const theme = levelTheme[level] || levelTheme.podstawowy;

  return (
    <Card className="relative h-full overflow-hidden border-0 border-dashed bg-white opacity-95 shadow-md dark:bg-slate-800">
      <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <Badge variant="outline" className={`${theme.badge} shrink-0`}>
              Wkrótce
            </Badge>
            <CardTitle className="text-lg leading-tight text-slate-900 dark:text-white">
              Pracujemy nad tym...
            </CardTitle>
          </div>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.soft} ${theme.text}`}>
            <Construction className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Kursy są w przygotowaniu. Wróć tu wkrótce — tymczasem zajrzyj do notatek poniżej.
        </p>
        <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${theme.soft} ${theme.text}`}>
          W trakcie tworzenia
        </div>
      </CardContent>
    </Card>
  );
}

function CourseCard({ course, onOpen }) {
  const theme = levelTheme[course.level] || levelTheme.podstawowy;
  const topic = topicLabels[course.topic] || "Matematyka";
  const lessonsCount = course.lessons_count || course.lessons?.length || 0;

  return (
    <Card className="group relative h-full overflow-hidden border-0 bg-white transition-all duration-300 hover:shadow-xl dark:bg-slate-800">
      <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg leading-tight text-slate-900 dark:text-white">
              {course.title}
            </CardTitle>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
              <BookOpen className={`h-4 w-4 ${theme.text}`} />
              <span>{topic}</span>
              <span>·</span>
              <Clock className="h-4 w-4" />
              <span>{course.duration_minutes || 0} min</span>
            </div>
          </div>
          <Badge variant="outline" className={`${theme.badge} shrink-0`}>
            {theme.shortLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {course.description}
        </p>
        <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${theme.soft} ${theme.text}`}>
          {lessonsCount} {lessonsCount === 1 ? "lekcja" : "lekcji"}
        </div>
        <Button className={`h-10 w-full ${theme.btn}`} onClick={() => onOpen(course)}>
          <Play className="h-4 w-4" />
          Otwórz kurs
        </Button>
      </CardContent>
    </Card>
  );
}

function ArticleCard({ item, onOpen }) {
  const availableModes = getArticleContentModes(item);
  const unavailable = isArticleUnavailable(item);
  const [selectedModes, setSelectedModes] = useState(() => defaultArticleContentModes(item));

  const toggleMode = (mode) => {
    if (unavailable) return;
    setSelectedModes((prev) => {
      if (prev.includes(mode)) {
        if (prev.length === 1) return prev;
        return prev.filter((value) => value !== mode);
      }
      return [...prev, mode];
    });
  };

  const openArticle = () => {
    if (unavailable) return;
    onOpen(item, selectedModes);
  };

  return (
    <Card
      role={unavailable ? undefined : "button"}
      tabIndex={unavailable ? -1 : 0}
      aria-disabled={unavailable || undefined}
      onClick={unavailable ? undefined : openArticle}
      onKeyDown={
        unavailable
          ? undefined
          : (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openArticle();
              }
            }
      }
      className={cn(
        "flex h-full flex-col border-0 bg-white shadow-md dark:bg-slate-800",
        unavailable
          ? "opacity-80"
          : "cursor-pointer transition-all duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
      )}
    >
      <CardHeader className="shrink-0 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <Badge
              variant="outline"
              className={
                unavailable
                  ? "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
                  : "border-sky-400 text-sky-700 dark:border-sky-600 dark:text-sky-300"
              }
            >
              {unavailable ? "Chwilowo niedostępne" : "Notatka"}
            </Badge>
            <CardTitle className="line-clamp-2 min-h-[2.75rem] text-lg font-semibold leading-tight text-slate-900 dark:text-white">
              {item.title}
            </CardTitle>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            <FileText className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="line-clamp-3 min-h-[3.75rem] text-sm font-normal leading-relaxed text-slate-600 dark:text-slate-300">
          {unavailable
            ? "Ta notatka jest na razie wyłączona. Wróć tu wkrótce."
            : item.description || "\u00a0"}
        </p>
        <div className="flex min-h-[1.75rem] flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
            {item.topic}
          </span>
          {item.subtopic ? (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
              {item.subtopic}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 text-xs font-medium">
            <Clock className="h-3.5 w-3.5" />
            {item.readMinutes} min czytania
          </span>
        </div>
        <div className="flex min-h-[1.75rem] flex-wrap gap-2">
          {availableModes.map((mode) => {
            const active = selectedModes.includes(mode);
            return (
              <button
                key={mode}
                type="button"
                disabled={unavailable}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleMode(mode);
                }}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-xs font-semibold leading-none transition",
                  articleContentModeChipClass(mode, active, unavailable),
                )}
              >
                {articleContentModeLabel(mode)}
              </button>
            );
          })}
        </div>
        <Button
          type="button"
          disabled={unavailable}
          className="mt-auto h-10 w-full text-sm font-medium bg-slate-800 hover:bg-slate-900 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
          onClick={(event) => {
            event.stopPropagation();
            openArticle();
          }}
        >
          {unavailable ? "Niedostępne" : "Otwórz notatkę"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function CoursePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userLevel } = useAuth();
  const enforcedLevel = userLevel && userLevel !== "brak" ? levelMap[userLevel] : null;
  const [selectedLevel, setSelectedLevel] = useState(enforcedLevel || "podstawowy");
  const [articleSearch, setArticleSearch] = useState("");
  const [articleTopic, setArticleTopic] = useState("all");
  const [articleSubtopic, setArticleSubtopic] = useState("all");
  const [articleLevel, setArticleLevel] = useState(enforcedLevel || "all");
  const [allArticles, setAllArticles] = useState(sampleArticles);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    if (enforcedLevel) {
      setSelectedLevel(enforcedLevel);
      setArticleLevel(enforcedLevel);
    }
  }, [enforcedLevel]);

  useEffect(() => {
    setArticleSubtopic("all");
  }, [articleTopic]);

  useEffect(() => {
    let cancelled = false;
    const loadNotes = async () => {
      const { data } = await fetchNotes();
      if (cancelled) return;
      setAllArticles(data);
      setArticlesLoading(false);
    };
    loadNotes();
    return () => {
      cancelled = true;
    };
  }, []);

  const courses = useMemo(() => {
    const list = sampleCoursesByLevel[selectedLevel] || allSampleCourses;
    return list.slice(1);
  }, [selectedLevel]);

  const articleTopicOptions = useMemo(() => {
    const topics = [
      ...new Set(allArticles.map((item) => item.topic).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b, "pl"));
    return [
      { value: "all", label: "Wszystkie tematy" },
      ...topics.map((topic) => ({ value: topic, label: topic })),
    ];
  }, [allArticles]);

  const articleSubtopicOptions = useMemo(() => {
    const values = allArticles
      .filter((item) => articleTopic === "all" || item.topic === articleTopic)
      .map((item) => item.subtopic)
      .filter(Boolean);
    const subtopics = [...new Set(values)].sort((a, b) => a.localeCompare(b, "pl"));
    return [
      { value: "all", label: "Wszystkie podtematy" },
      ...subtopics.map((subtopic) => ({ value: subtopic, label: subtopic })),
    ];
  }, [allArticles, articleTopic]);

  const effectiveArticleSubtopic = articleSubtopicOptions.some(
    (option) => option.value === articleSubtopic,
  )
    ? articleSubtopic
    : "all";

  const effectiveArticleLevel = enforcedLevel || articleLevel;

  const articles = useMemo(() => {
    const query = articleSearch.trim().toLowerCase();
    return allArticles.filter((item) => {
      if (effectiveArticleLevel !== "all" && !item.levels.includes(effectiveArticleLevel)) {
        return false;
      }
      if (articleTopic !== "all" && item.topic !== articleTopic) {
        return false;
      }
      if (effectiveArticleSubtopic !== "all" && item.subtopic !== effectiveArticleSubtopic) {
        return false;
      }
      if (!query) return true;
      const haystack = [item.title, item.description, item.topic, item.subtopic]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [
    allArticles,
    articleSearch,
    articleTopic,
    effectiveArticleSubtopic,
    effectiveArticleLevel,
  ]);

  const goToCourse = (courseObj) => {
    navigate(`${createPageUrl("CourseOverview")}?id=${encodeURIComponent(courseObj.id)}`, {
      state: { course: courseObj },
    });
  };

  const goToArticle = (article, contentModes) => {
    if (isArticleUnavailable(article)) return;
    const modes = contentModes?.length ? contentModes : defaultArticleContentModes(article);
    const params = new URLSearchParams({
      id: article.id,
      content: modes.join(","),
    });
    navigate(`${createPageUrl("ArticleView")}?${params.toString()}`, {
      state: { article, contentModes: modes },
    });
  };

  return (
    <div key={location.key} className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white">
            Kursy i dydaktyka
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-300">
            {enforcedLevel ? (
              <>
                Domyślny poziom:{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {goalNames[userLevel]}
                </span>
                {" · "}
              </>
            ) : null}
            {courses.length === 0
              ? "Kursy w przygotowaniu"
              : `${courses.length} kursów na wybranym poziomie`}
          </p>
        </div>

        <Card className="mb-8 border-0 bg-white shadow-lg dark:bg-slate-800">
          <CardContent className="p-6">
            <FilterBar columnsClassName="grid-cols-1">
              <CycleFilter
                label="Poziom"
                value={selectedLevel}
                options={levelFilterOptions}
                onChange={setSelectedLevel}
                disabled={!!enforcedLevel}
              />
            </FilterBar>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ComingSoonCourseCard level={selectedLevel} />
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onOpen={goToCourse} />
          ))}
        </div>

        <section className="mt-14 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Notatki
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
              Krótkie materiały dydaktyczne do szybkiego powtórzenia i utrwalenia
            </p>
          </div>

          <Card className="border-0 bg-white shadow-lg dark:bg-slate-800">
            <CardContent className="p-6">
              <FilterBar
                columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                search={
                  <FilterSearchField
                    placeholder="Szukaj notatek..."
                    value={articleSearch}
                    onChange={(event) => setArticleSearch(event.target.value)}
                  />
                }
              >
                <PrettySelectFilter
                  label="Temat"
                  value={articleTopic}
                  options={articleTopicOptions}
                  onChange={setArticleTopic}
                />
                <PrettySelectFilter
                  label="Podtemat"
                  value={effectiveArticleSubtopic}
                  options={articleSubtopicOptions}
                  onChange={setArticleSubtopic}
                />
                <PrettySelectFilter
                  label="Poziom"
                  value={effectiveArticleLevel}
                  options={
                    enforcedLevel
                      ? [
                          {
                            value: enforcedLevel,
                            label: levelLabelByValue[enforcedLevel] || enforcedLevel,
                          },
                        ]
                      : articleLevelFilterOptions
                  }
                  onChange={setArticleLevel}
                  disabled={!!enforcedLevel}
                />
              </FilterBar>
            </CardContent>
          </Card>

          {articlesLoading ? (
            <Card className="border-0 bg-white shadow-lg dark:bg-slate-800">
              <CardContent className="flex items-center justify-center gap-3 p-8 text-slate-600 dark:text-slate-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Ładowanie notatek...
              </CardContent>
            </Card>
          ) : articles.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((item) => (
                <ArticleCard key={item.id} item={item} onOpen={goToArticle} />
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white shadow-lg dark:bg-slate-800">
              <CardContent className="p-8 text-center text-slate-600 dark:text-slate-300">
                Brak notatek dla wybranych filtrów.
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
