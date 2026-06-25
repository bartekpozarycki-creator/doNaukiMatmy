import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import "katex/dist/katex.min.css";
import { useAuth } from "@/contexts/AuthContext";
import { allSampleCourses } from "@/utils/sample-courses";
import { recordContinueLearning } from "@/utils/continue-learning";

const propType = () => null;

function ChoiceTask({ task }) {
  const [selected, setSelected] = useState(null);
  const handleSelect = (idx) => {
    if (selected !== null) return; // lock after first choice
    setSelected(idx);
  };
  return (
    <ul className="space-y-2">
      {task.options.map((opt, i) => {
        const isSelected = selected === i;
        const isCorrect = selected !== null && i === task.answerIndex;
        const isWrongSelected = isSelected && i !== task.answerIndex;
        return (
          <li key={i}>
            <button
              onClick={() => handleSelect(i)}
              className={
                `w-full text-left px-3 py-2 rounded-md border transition-colors ` +
                (isCorrect ? 'bg-blue-100 border-blue-300 dark:bg-blue-800/30' : '') +
                (isWrongSelected ? 'bg-rose-100 border-rose-300 dark:bg-rose-950/40 dark:border-rose-700' : '') +
                (!isSelected ? 'hover:bg-gray-100 dark:hover:bg-white/10' : '')
              }
              disabled={selected !== null}
            >
              {String.fromCharCode(97 + i)}) {opt}
            </button>
          </li>
        );
      })}
      {selected !== null && (
        <p className={`mt-2 font-medium ${selected === task.answerIndex ? 'text-blue-600' : 'text-rose-600'}`}>
          {selected === task.answerIndex ? 'Brawo! Dobra odpowiedź.' : 'Niestety, to błędna odpowiedź.'}
        </p>
      )}
    </ul>
  );
}

ChoiceTask.propTypes = {
  task: propType,
};

export default function LessonView() {
  const { state, search } = useLocation();
  const { user } = useAuth();
  const lessonId = new URLSearchParams(search).get("id");
  const fallbackCourse = allSampleCourses.find((candidate) =>
    candidate.lessons?.some((entry) => entry.id === lessonId),
  );
  const course = state?.course ?? fallbackCourse;
  const lesson =
    state?.lesson ?? course?.lessons?.find((entry) => entry.id === lessonId);

  // Determine previous and next lessons for navigation
  const lessonsArr = course?.lessons || [];
  const currentIdx = lessonsArr.findIndex((l) => l.id === lesson?.id);
  const prevLesson = currentIdx > 0 ? lessonsArr[currentIdx - 1] : null;
  const nextLesson = currentIdx >= 0 && currentIdx < lessonsArr.length - 1 ? lessonsArr[currentIdx + 1] : null;

  useEffect(() => {
    if (!course?.id || !lesson?.id) return;
    recordContinueLearning(user?.id, {
      type: "course",
      id: course.id,
      title: course.title,
      subtitle: `Ostatnia lekcja: ${lesson.title || lesson.content?.tileSection1?.title || "Lekcja"}`,
      href: `/LessonView?id=${encodeURIComponent(lesson.id)}`,
      actionLabel: "Kontynuuj kurs",
    });
  }, [course, lesson, user?.id]);

  useEffect(() => {
    const el = document.getElementById("lesson-container");
    if (!el) return;
    import("katex/contrib/auto-render").then(({ default: renderMathInElement }) => {
      renderMathInElement(el, {
        delimiters: [
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
        throwOnError: false,
      });
    });
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-gray-500 dark:text-slate-400">Nie znaleziono lekcji.</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        id="lesson-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <Link
          to={`/course-overview?id=${course?.id}`}
          state={{ course }}
          className="inline-flex items-center text-sm text-gray-600 dark:text-slate-400 hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Powrót
        </Link>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow border dark:border-slate-700 overflow-hidden"
        >
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {lesson.title || lesson.content?.tileSection1?.title}
            </h2>
            <p className="text-gray-700 dark:text-slate-300 whitespace-pre-line">
              {lesson.description || lesson.content?.tileSection1?.content}
            </p>
          </div>
        </motion.div>

        {lesson.video_url && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow border dark:border-slate-700 overflow-hidden"
          >
            <div className="p-6">
              <div className="rounded-lg overflow-hidden">
                <AspectRatio ratio={16 / 9} className="w-full">
                  <iframe
                    src={lesson.video_url}
                    title="Video lesson"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  ></iframe>
                </AspectRatio>
              </div>
            </div>
          </motion.div>
        )}

        {/* Additional content tiles */}
        {/* Content tiles */}
        {['tileSection1','tileSection2','tileSection3']
          .filter((key)=>lesson.content?.[key])
          .map((key,idx)=>(
            <motion.div
              key={key}
              initial={{ opacity: 0, x: idx%2===0?-20:20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.3, delay: 0.2+idx*0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow border dark:border-slate-700 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {lesson.content[key].title}
                </h3>
                <p className="text-gray-700 dark:text-slate-300 whitespace-pre-line">
                  {lesson.content[key].content}
                </p>
              </div>
            </motion.div>
          ))}

        {/* Tasks section */}
        {lesson.content?.Zadania && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow border dark:border-slate-700 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{lesson.content.Zadania.title}</h3>
              <div>
                <Accordion type="single" collapsible className="w-full">
                  {lesson.content.Zadania.tasks?.map((task, idx) => (
                    <AccordionItem key={idx} value={`task-${idx}`}>
                      <AccordionTrigger>
                        <span className="font-medium">{idx + 1}. {task.question}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        {task.type === 'choice' ? (
                          <ChoiceTask task={task} />
                        ) : (
                          <p className="italic text-sm text-gray-600 dark:text-slate-400">(odpowiedź otwarta)</p>
                        )}
                        {/* Hidden answer */}
                        {task.answer && (
                          <details className="mt-2" onToggle={(e) => { if (!e.currentTarget.open) return; setTimeout(() => {
                              import("katex/contrib/auto-render").then(({ default: renderMathInElement }) => {
                                renderMathInElement(e.currentTarget, {
                                  delimiters: [
                                    { left: "\\(", right: "\\)", display: false },
                                    { left: "\\[", right: "\\]", display: true },
                                  ],
                                  throwOnError: false,
                                });
                              });
                            }, 0); }}>
                            <summary className="cursor-pointer select-none text-blue-600 dark:text-blue-400 hover:underline">Pokaż odpowiedź</summary>
                            <p className="mt-1 whitespace-pre-line">{task.answer}</p>
                          </details>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation arrows */}
        <div className="flex justify-between items-center pt-10">
          {prevLesson ? (
            <Link
              to={`/LessonView?id=${prevLesson.id}`}
              state={{ lesson: prevLesson, course }}
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ChevronLeft className="w-5 h-5" /> Poprzednia lekcja
            </Link>
          ) : (
            <span />
          )}

          {nextLesson && (
            <Link
              to={`/LessonView?id=${nextLesson.id}`}
              state={{ lesson: nextLesson, course }}
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              Następna lekcja <ChevronRight className="w-5 h-5" />
            </Link>
          )}
        </div>

        {console.log(lesson.content)}
      </motion.div>
    </div>
  );
}

