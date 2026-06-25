import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowLeft, Play } from "lucide-react";
import { createPageUrl } from "@/utils";
import { getSampleCourseById } from "@/utils/sample-courses";
import { useAuth } from "@/contexts/AuthContext";
import { recordContinueLearning } from "@/utils/continue-learning";

const levelTheme = {
  "podstawówka": {
    gradient: "from-green-400 to-green-600",
    badge: "border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
  },
  "podstawowy": {
    gradient: "from-blue-400 to-blue-600",
    badge: "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
  },
  "rozszerzony": {
    gradient: "from-purple-400 to-purple-600",
    badge: "border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
  },
};

export default function CourseOverview() {
  const { state, search } = useLocation();
  const { user } = useAuth();
  const params = new URLSearchParams(search);
  const idParam = params.get("id");
  const course = state?.course ?? getSampleCourseById(idParam);
  useEffect(() => {
    if (!course?.id) return;
    recordContinueLearning(user?.id, {
      type: "course",
      id: course.id,
      title: course.title,
      subtitle: course.description,
      href: `${createPageUrl("CourseOverview")}?id=${encodeURIComponent(course.id)}`,
      actionLabel: "Kontynuuj kurs",
    });
  }, [course, user?.id]);

  if (!course) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-slate-500 dark:text-slate-400">Nie znaleziono kursu.</p>
      </div>
    );
  }
  const lessons = course.lessons || [];
  const theme = levelTheme[course.level] || levelTheme["podstawowy"];
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto space-y-10"
      >
        <Link to={createPageUrl("Course")}>
          <span className="inline-flex items-center text-sm text-gray-600 dark:text-slate-400 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Powrót
          </span>
        </Link>
        <header className="text-center space-y-4">
          <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}>
            <span className="text-4xl text-white font-bold">{course.title.charAt(0)}</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{course.title}</h1>
          <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">{course.description}</p>
          <div className="flex justify-center gap-6 text-sm text-gray-600 dark:text-slate-400">
            <span>{course.lessons_count} lekcje</span>
            <span>{course.duration_minutes} min</span>
          </div>
        </header>
        <section className="space-y-8">
          {lessons.map((lesson) => (
            <motion.article
              key={lesson.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.3, delay: lesson.order * 0.05 }}
              className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700"
            >
              <header className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {lesson.order}. {lesson.title}
                </h2>
                <span className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {lesson.duration_minutes} min
                </span>
              </header>
              {lesson.description && (
                <p className="text-gray-600 dark:text-slate-300 mb-3">{lesson.description}</p>
              )}
              <Link
                to={`${createPageUrl("LessonView")}?id=${encodeURIComponent(lesson.id)}`}
                state={{ lesson, course }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-md px-4 py-2"
              >
                <Play className="w-4 h-4" /> Otwórz
              </Link>
            </motion.article>
          ))}
        </section>
      </motion.div>
    </div>
  );
}

