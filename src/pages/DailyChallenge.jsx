
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, Flame, Award, CheckCircle, XCircle, 
  Lightbulb, Calendar, TrendingUp, Star
} from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export default function DailyChallengePage() {
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    setUser(null);
  }, []);

  const today = format(new Date(), 'yyyy-MM-dd');
  const sampleChallenge = {
    id: "dc-1",
    title: "Potęgi i pierwiastki",
    question: "Oblicz \\(\\sqrt{81}\\).",
    answer: "9",
    points: 50,
    date: today,
    time_limit_minutes: 10,
  };

  const { data: challenges = [] } = useQuery({
    queryKey: ['dailyChallenges'],
    queryFn: async () => [sampleChallenge],
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: () => {
      return [];
    },
    enabled: !!user,
  });

  const todayChallenge = challenges.find(c => c.date === today);
  const completedToday = progress.some(
    p => p.challenge_id === todayChallenge?.id && p.completed
  );

  const updateProgressMutation = useMutation({
    mutationFn: async () => Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
    },
  });

  const handleSubmit = () => {
    if (!todayChallenge || !userAnswer.trim()) return;

    const correct = userAnswer.trim().toLowerCase() === todayChallenge.answer.trim().toLowerCase();
    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct && user && !completedToday) {
      updateProgressMutation.mutate({
        challengeId: todayChallenge.id,
        score: todayChallenge.points || 50
      });
    }
  };

  const completedChallenges = progress.filter(p => p.challenge_id && p.completed).length;
  const isDark = user?.theme === "dark";

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Stats */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-medium mb-4 animate-pulse">
            <Trophy className="w-4 h-4" />
            Zadanie dnia
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Codzienne wyzwanie
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-300">
            {format(new Date(), "d MMMM yyyy", { locale: pl })}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="dark:bg-slate-800 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-indigo-700 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {user?.streak_days || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400">
                Dni z rzędu
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {user?.total_points || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400">
                Punkty
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {completedChallenges}
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-400">
                Ukończone
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Challenge */}
        {todayChallenge ? (
          <Card className="dark:bg-slate-800 border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-slate-900 dark:text-white">
                  Dzisiejsze zadanie
                </CardTitle>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {todayChallenge.points || 50} pkt
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question */}
              <div className="p-6 bg-blue-50 dark:bg-slate-700 rounded-xl">
                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Pytanie:
                    </h3>
                    <p className="text-lg text-gray-700 dark:text-slate-300 leading-relaxed">
                      {todayChallenge.question}
                    </p>
                  </div>
                </div>
              </div>

              {/* Answer Input */}
              {!showAnswer && !completedToday && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Twoja odpowiedź:
                    </label>
                    <Input
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Wpisz odpowiedź..."
                      className="text-lg dark:bg-slate-700 dark:border-slate-600"
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                  </div>
                  <Button 
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                    disabled={!userAnswer.trim()}
                  >
                    Sprawdź odpowiedź
                  </Button>
                </div>
              )}

              {/* Result */}
              {(showAnswer || completedToday) && (
                <div className="space-y-4">
                  {isCorrect !== null && (
                    <div className={`p-6 rounded-xl ${isCorrect ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-rose-50 dark:bg-rose-950/30'}`}>
                      <div className="flex items-center gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-8 h-8 text-blue-600" />
                        ) : (
                          <XCircle className="w-8 h-8 text-rose-600" />
                        )}
                        <div>
                          <h3 className={`text-xl font-bold ${isCorrect ? 'text-blue-700 dark:text-blue-400' : 'text-rose-700 dark:text-rose-300'}`}>
                            {isCorrect ? 'Brawo! Odpowiedź poprawna!' : 'Niestety, to nie jest poprawna odpowiedź'}
                          </h3>
                          {isCorrect && (
                            <p className="text-blue-600 dark:text-blue-400 mt-1">
                              +{todayChallenge.points || 50} punktów
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {completedToday && !showAnswer && (
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Star className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400">
                            Ukończone!
                          </h3>
                          <p className="text-blue-600 dark:text-blue-500 mt-1">
                            Już rozwiązałeś dzisiejsze zadanie
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1" />
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                          Wyjaśnienie:
                        </h3>
                        <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
                          {todayChallenge.explanation}
                        </p>
                        <div className="pt-3 border-t border-purple-200 dark:border-purple-800">
                          <span className="text-sm text-gray-600 dark:text-slate-400">Poprawna odpowiedź: </span>
                          <span className="font-bold text-purple-700 dark:text-purple-400">
                            {todayChallenge.answer}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="dark:bg-slate-800">
            <CardContent className="p-12 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Brak zadania na dziś
              </h3>
              <p className="text-gray-600 dark:text-slate-400">
                Wróć jutro po nowe wyzwanie!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
