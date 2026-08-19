import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CycleFilter, FilterBar } from "@/components/ListFilters";
import { createPageUrl } from "@/utils";
import { sampleCoursesByLevel, allSampleCourses } from "@/utils/sample-courses";
import { useAuth } from "@/contexts/AuthContext";

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

export default function CoursePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userLevel } = useAuth();
  const enforcedLevel = userLevel && userLevel !== "brak" ? levelMap[userLevel] : null;
  const [selectedLevel, setSelectedLevel] = useState(enforcedLevel || "podstawowy");

  useEffect(() => {
    if (enforcedLevel) {
      setSelectedLevel(enforcedLevel);
    }
  }, [enforcedLevel]);

  const courses = useMemo(
    () => sampleCoursesByLevel[selectedLevel] || allSampleCourses,
    [selectedLevel],
  );

  const goToCourse = (courseObj) => {
    navigate(`${createPageUrl("CourseOverview")}?id=${encodeURIComponent(courseObj.id)}`, {
      state: { course: courseObj },
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
            {courses.length} kursów na wybranym poziomie
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
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} onOpen={goToCourse} />
          ))}
        </div>

        {courses.length === 0 ? (
          <Card className="border-0 bg-white shadow-lg dark:bg-slate-800">
            <CardContent className="p-8 text-center text-slate-600 dark:text-slate-300">
              Brak kursów dla wybranego poziomu.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
