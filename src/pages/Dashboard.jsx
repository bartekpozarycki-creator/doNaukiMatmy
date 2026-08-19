import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Trophy, CheckCircle, TrendingUp, Flame, 
  Award, BookOpen, ArrowRight, AlertCircle, Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const demo = {
      full_name: "Mauka User",
      learning_goal: "",
      theme: "light",
      streak_days: 0,
      total_points: 0,
    };
    setUser(demo);
  }, []);

  const { data: progress = [] } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: () => {
      return [];
    },
    enabled: !!user,
  });

  const { data: worksheets = [] } = useQuery({
    queryKey: ['worksheets'],
    queryFn: async () => [],
  });

  const { data: dailyChallenges = [] } = useQuery({
    queryKey: ['dailyChallenges'],
    queryFn: async () => [],
  });

  if (!user) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="dark:bg-slate-800 bg-white">
            <CardContent className="p-12 text-center">
              <p className="text-gray-600 dark:text-slate-400">Ładowanie...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Filter worksheets by user goal
  const getFilteredWorksheets = () => {
    if (!user.learning_goal || user.learning_goal === "") return worksheets;
    const levelMap = {
      "osma_klasa": "ósmoklasisty",
      "matura_podstawowa": "podstawowy",
      "matura_rozszerzona": "rozszerzony"
    };
    return worksheets.filter(w => w.level === levelMap[user.learning_goal]);
  };

  const userWorksheets = getFilteredWorksheets();
  const completedWorksheets = progress.filter(p => p.worksheet_id && p.completed).length;
  
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayChallenge = dailyChallenges.find(c => c.date === today);
  const completedToday = progress.some(p => p.challenge_id === todayChallenge?.id && p.completed);

  // Get recent worksheets user should work on
  const recentWorksheets = userWorksheets
    .filter(w => !progress.find(p => p.worksheet_id === w.id && p.completed))
    .slice(0, 3);

  // Overall progress
  const totalWorksheets = userWorksheets.length;
  const overallProgress = totalWorksheets > 0 ? (completedWorksheets / totalWorksheets) * 100 : 0;

  const isDark = user?.theme === "dark";
  const showReviewShortcuts = false;
  const worksheetTheme = {
    podstawowy: {
      label: "Matura podstawowa",
      badge: "border-blue-500 text-blue-700 dark:text-blue-400",
      btn: "bg-blue-600 hover:bg-blue-700",
    },
    rozszerzony: {
      label: "Matura rozszerzona",
      badge: "border-purple-500 text-purple-700 dark:text-purple-400",
      btn: "bg-purple-600 hover:bg-purple-700",
    },
    ósmoklasisty: {
      label: "Egzamin ósmoklasisty",
      badge: "border-green-500 text-green-700 dark:text-green-400",
      btn: "bg-green-600 hover:bg-green-700",
    },
  };

  const goalNames = {
    "": "Nie ustawiono celu",
    "osma_klasa": "Ósma klasa",
    "matura_podstawowa": "Matura podstawowa",
    "matura_rozszerzona": "Matura rozszerzona"
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Witaj, {user.full_name || user.email}! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-300">
            Twój cel: <span className="font-semibold text-blue-600 dark:text-blue-400">{goalNames[user.learning_goal || ""]}</span>
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="dark:bg-slate-800 bg-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {user.streak_days || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">
                    Dni z rzędu
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 bg-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {user.total_points || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">
                    Punkty
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 bg-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {completedWorksheets}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">
                    Arkusze
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 bg-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {progress.filter(p => p.challenge_id && p.completed).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400">
                    Wyzwania
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 dark:bg-slate-800 bg-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Ogólny postęp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                  Ukończone arkusze
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {completedWorksheets} / {totalWorksheets}
                </span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              {overallProgress.toFixed(0)}% ukończone
            </p>
          </CardContent>
        </Card>

        {/* Alerts */}
        <div className="space-y-4 mb-8">
          {!completedToday && todayChallenge && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      Dzisiejsze wyzwanie czeka!
                    </h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-3">
                      Rozwiąż dzisiejsze zadanie i zdobądź {todayChallenge.points} punktów!
                    </p>
                    <Link to={createPageUrl("DailyChallenge")}>
                      <Button className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">
                        Rozwiąż teraz
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!user.learning_goal && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                      Ustaw swój cel nauki
                    </h3>
                    <p className="text-gray-700 dark:text-slate-300 mb-3">
                      Wybierz poziom matury, aby zobaczyć spersonalizowane rekomendacje arkuszy
                    </p>
                    <Link to={createPageUrl("Profile")}>
                      <Button variant="outline" className="dark:border-slate-600">
                        Ustaw cel
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommended Worksheets */}
        {recentWorksheets.length > 0 && (
          <Card className="mb-8 dark:bg-slate-800 bg-white border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Polecane arkusze
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {recentWorksheets.map((worksheet) => {
                  const theme = worksheetTheme[worksheet.level] || worksheetTheme.podstawowy;
                  return (
                    <Card key={worksheet.id} className="bg-gray-50 dark:bg-slate-700 border-0">
                      <CardContent className="p-4">
                        <Badge variant="outline" className={`mb-2 ${theme.badge}`}>
                          {theme.label}
                        </Badge>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {worksheet.displayTitle || worksheet.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                          {worksheet.month} {worksheet.year}
                        </p>
                        <Link to={`${createPageUrl("WorksheetDetails")}?id=${worksheet.id}`}>
                          <Button size="sm" className={`w-full ${theme.btn}`}>
                            Rozpocznij
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="dark:bg-slate-800 bg-white border-0">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">
              Następne kroki
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link to={createPageUrl("Worksheets")}>
                <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Przeglądaj arkusze
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Rozwiąż więcej arkuszy maturalnych
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>

              {showReviewShortcuts && (
                <Link to={createPageUrl("Review")}>
                  <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        Powtórz z fiszek
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        Utrwal wiedzę za pomocą fiszek
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              )}

              <Link to={createPageUrl("Community")}>
                <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Zadaj pytanie
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      Poproś społeczność o pomoc
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}