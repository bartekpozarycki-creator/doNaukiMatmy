import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft, ArrowRight, CheckCircle, XCircle, Award, Clock, Trophy, Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuizViewPage() {
  const [user, setUser] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [startTime] = useState(Date.now());
  const queryClient = useQueryClient();
  
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get('id');

  useEffect(() => {
    setUser(null);
  }, []);

  const sampleQuizzes = [
    {
      id: "quiz-sample-1",
      title: "Potęgi i pierwiastki",
      passing_score: 60,
      lesson_id: "sample-liczby-2",
    }
  ];

  const sampleQuestions = [
    {
      id: "qq1",
      quiz_id: "quiz-sample-1",
      question_type: "single_choice",
      question_text: "Ile wynosi \\(2^3 \\cdot 2^2\\)?",
      options: ["4", "8", "16", "32"],
      correct_answer: "32",
      points: 2
    },
    {
      id: "qq2",
      quiz_id: "quiz-sample-1",
      question_type: "multiple_choice",
      question_text: "Zaznacz poprawne równości dla \\(\\sqrt{9}\\).",
      options: ["3", "-3", "9", "1/3"],
      correct_answers: ["3", "-3"],
      points: 2
    }
  ];

  const sampleLessons = [
    { id: "sample-liczby-2", title: "Pierwiastki i potęgi", course_id: "sample-liczby" }
  ];

  const sampleCourses = [
    { id: "sample-liczby", title: "Liczby rzeczywiste" }
  ];

  const { data: quizzes = [] } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => sampleQuizzes,
  });

  const { data: questions = [] } = useQuery({
    queryKey: ['quizQuestions', quizId],
    queryFn: async () => sampleQuestions.filter(q => q.quiz_id === quizId),
    enabled: !!quizId,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => sampleLessons,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => sampleCourses,
  });

  const submitQuizMutation = useMutation({
    mutationFn: async () => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      queryClient.invalidateQueries({ queryKey: ['quizAttempts'] });
    },
  });

  const quiz = quizzes.find(q => q.id === quizId);
  const lesson = quiz ? lessons.find(l => l.id === quiz.lesson_id) : null;
  const course = lesson ? courses.find(c => c.id === lesson.course_id) : null;
  const isDark = user?.theme === "dark";

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (answer) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: answer
    });
  };

  const handleMultipleChoiceChange = (option, checked) => {
    const currentAnswers = userAnswers[currentQuestion.id] || [];
    const newAnswers = checked
      ? [...currentAnswers, option]
      : currentAnswers.filter(a => a !== option);
    
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: newAnswers
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = () => {
    let score = 0;
    let maxScore = 0;
    const detailedAnswers = [];

    questions.forEach((question) => {
      const userAnswer = userAnswers[question.id];
      let isCorrect = false;

      if (question.question_type === "multiple_choice") {
        const correctAnswers = question.correct_answers || [];
        const userAnswerArray = userAnswer || [];
        isCorrect = correctAnswers.length === userAnswerArray.length &&
                    correctAnswers.every(a => userAnswerArray.includes(a));
      } else {
        const correct = question.correct_answer?.toLowerCase().trim();
        const answer = (typeof userAnswer === 'string' ? userAnswer : String(userAnswer || '')).toLowerCase().trim();
        isCorrect = answer === correct;
      }

      if (isCorrect) {
        score += question.points || 1;
      }
      maxScore += question.points || 1;

      detailedAnswers.push({
        question_id: question.id,
        user_answer: userAnswer,
        correct_answer: question.question_type === "multiple_choice" ? question.correct_answers : question.correct_answer,
        is_correct: isCorrect,
        points_earned: isCorrect ? (question.points || 1) : 0
      });
    });

    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= (quiz.passing_score || 70);
    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);

    return {
      score,
      maxScore,
      percentage,
      passed,
      detailedAnswers,
      timeSpentSeconds
    };
  };

  const handleSubmit = async () => {
    const results = calculateResults();
    setQuizResults(results);
    setShowResults(true);

    if (user) {
      const quizAttemptData = {
        quiz_id: quizId,
        user_email: user.email,
        lesson_id: quiz.lesson_id,
        score: results.score,
        max_score: results.maxScore,
        percentage: results.percentage,
        passed: results.passed,
        answers: results.detailedAnswers,
        time_spent_seconds: results.timeSpentSeconds,
        completed_date: new Date().toISOString()
      };

      const progressData = {
        user_email: user.email,
        quiz_id: quizId,
        lesson_id: quiz.lesson_id,
        completed: results.passed,
        score: results.score,
        time_spent_minutes: Math.floor(results.timeSpentSeconds / 60)
      };

      submitQuizMutation.mutate({ quizAttemptData, progressData });
    }
  };

  if (!quiz || !lesson || !course) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="dark:bg-slate-800 bg-white border-0">
            <CardContent className="p-12 text-center">
              <p className="text-gray-600 dark:text-slate-400">Ładowanie...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults && quizResults) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="dark:bg-slate-800 bg-white border-0 shadow-xl mb-8">
            <CardContent className="p-12 text-center">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                quizResults.passed 
                  ? "bg-gradient-to-br from-blue-400 to-blue-600" 
                  : "bg-gradient-to-br from-indigo-400 to-violet-600"
              }`}>
                {quizResults.passed ? (
                  <Trophy className="w-12 h-12 text-white" />
                ) : (
                  <Target className="w-12 h-12 text-white" />
                )}
              </div>

              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                {quizResults.passed ? "Gratulacje!" : "Spróbuj ponownie"}
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-slate-300 mb-8">
                {quizResults.passed 
                  ? "Zaliczyłeś quiz i odblokowano następną lekcję!"
                  : `Potrzebujesz ${quiz.passing_score}% aby zaliczyć quiz`
                }
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {quizResults.percentage}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Wynik</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    {quizResults.score}/{quizResults.maxScore}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Punkty</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.floor(quizResults.timeSpentSeconds / 60)}m
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">Czas</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link to={`${createPageUrl("LessonView")}?id=${lesson.id}`}>
                  <Button variant="outline" className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Powrót do lekcji
                  </Button>
                </Link>
                <Link to={`${createPageUrl("CourseDetails")}?id=${course.id}`}>
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                    Przejdź do kursu
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Szczegółowe wyniki
            </h2>
            {questions.map((question, index) => {
              const result = quizResults.detailedAnswers[index];
              return (
                <Card key={question.id} className="dark:bg-slate-800 bg-white border-0">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        Pytanie {index + 1}
                      </CardTitle>
                      {result.is_correct ? (
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Poprawne
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                          <XCircle className="w-3 h-3 mr-1" />
                          Błędne
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-900 dark:text-white mb-4">{question.question_text}</p>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-slate-400">Twoja odpowiedź: </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {Array.isArray(result.user_answer) ? result.user_answer.join(", ") : result.user_answer || "Brak"}
                        </span>
                      </div>
                      {!result.is_correct && (
                        <div>
                          <span className="text-sm text-gray-600 dark:text-slate-400">Poprawna odpowiedź: </span>
                          <span className="font-medium text-blue-700 dark:text-blue-400">
                            {Array.isArray(result.correct_answer) ? result.correct_answer.join(", ") : result.correct_answer}
                          </span>
                        </div>
                      )}
                      {question.explanation && (
                        <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-900 dark:text-blue-300">
                            <strong>Wyjaśnienie:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Card className="mb-8 dark:bg-slate-800 bg-white border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 mb-2">
                  Quiz
                </Badge>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {quiz.title}
                </h1>
                <p className="text-gray-600 dark:text-slate-300 mt-2">
                  {quiz.description}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                  <Award className="w-5 h-5" />
                  <span>Minimum {quiz.passing_score}% do zaliczenia</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-slate-400">
                Pytanie {currentQuestionIndex + 1} z {questions.length}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span>{Math.floor((Date.now() - startTime) / 1000 / 60)}m</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mt-4">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-700 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        {currentQuestion && (
          <Card className="mb-8 dark:bg-slate-800 bg-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQuestion.question_text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentQuestion.question_type === "single_choice" && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full justify-start text-left h-auto py-4 px-6 ${
                        userAnswers[currentQuestion.id] === option
                          ? "bg-blue-100 border-blue-500 text-blue-900 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300"
                          : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200"
                      }`}
                      onClick={() => handleAnswerChange(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {currentQuestion.question_type === "multiple_choice" && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => {
                    const isChecked = (userAnswers[currentQuestion.id] || []).includes(option);
                    return (
                      <div 
                        key={index}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer ${
                          isChecked
                            ? "bg-blue-100 border-blue-500 dark:bg-blue-900/30 dark:border-blue-500"
                            : "bg-white border-gray-300 dark:bg-slate-700 dark:border-slate-600"
                        }`}
                        onClick={() => handleMultipleChoiceChange(option, !isChecked)}
                      >
                        <Checkbox 
                          checked={isChecked}
                          onCheckedChange={(checked) => handleMultipleChoiceChange(option, checked)}
                        />
                        <label className="flex-1 cursor-pointer text-gray-700 dark:text-slate-200">
                          {option}
                        </label>
                      </div>
                    );
                  })}
                  <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">
                    Zaznacz wszystkie poprawne odpowiedzi
                  </p>
                </div>
              )}

              {currentQuestion.question_type === "true_false" && (
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className={`flex-1 py-6 ${
                      userAnswers[currentQuestion.id] === "true" || userAnswers[currentQuestion.id] === "prawda"
                        ? "bg-blue-100 border-blue-500 text-blue-900 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300"
                        : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200"
                    }`}
                    onClick={() => handleAnswerChange("prawda")}
                  >
                    Prawda
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex-1 py-6 ${
                      userAnswers[currentQuestion.id] === "false" || userAnswers[currentQuestion.id] === "fałsz"
                        ? "bg-blue-100 border-blue-500 text-blue-900 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300"
                        : "bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200"
                    }`}
                    onClick={() => handleAnswerChange("fałsz")}
                  >
                    Fałsz
                  </Button>
                </div>
              )}

              {currentQuestion.question_type === "open" && (
                <Input
                  value={userAnswers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Wpisz swoją odpowiedź..."
                  className="text-lg py-6 dark:bg-slate-700 dark:border-slate-600 dark:text-white bg-white"
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Poprzednie
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(userAnswers).length < questions.length}
              className="bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Zakończ quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
            >
              Następne
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}