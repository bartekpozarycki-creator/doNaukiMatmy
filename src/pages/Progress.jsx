import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Award, Target, Clock,
  BookOpen, Trophy, Flame, CheckCircle, Calendar, Filter
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import {
  CycleFilter,
  FilterBar,
} from "@/components/ListFilters";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { pl } from "date-fns/locale";

const COLORS = ['#3B82F6', '#6366F1', '#06B6D4', '#8B5CF6', '#0EA5E9', '#A855F7', '#7C3AED', '#2563EB'];

const topicNames = {
  algebra: "Algebra",
  geometria: "Geometria",
  analiza: "Analiza",
  funkcje: "Funkcje",
  trygonometria: "Trygonometria",
  statystyka: "Statystyka",
  kombinatoryka: "Kombinatoryka",
  rachunek_prawdopodobienstwa: "Rachunek prawdopodobieństwa"
};

export default function ProgressPage() {
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState("all"); // all, week, month, 3months
  const [goalFilter, setGoalFilter] = useState("all"); // all, matura_podstawowa, matura_rozszerzona

  useEffect(() => {
    const demoUser = { full_name: "Mauka User", learning_goal: "", theme: "light" };
    setUser(demoUser);
  }, []);

  const { data: progress = [] } = useQuery({
    queryKey: ['userProgress', user?.email],
    queryFn: () => {
      return [];
    },
    enabled: !!user,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => [],
  });

  const { data: worksheets = [] } = useQuery({
    queryKey: ['worksheets'],
    queryFn: async () => [],
  });

  const { data: allQuestions = [] } = useQuery({
    queryKey: ['allQuestions'],
    queryFn: async () => [],
  });

  // Filter progress by date range
  const getFilteredProgress = () => {
    let filtered = [...progress];
    const now = new Date();

    if (dateRange === "week") {
      const weekStart = startOfWeek(now, { locale: pl });
      filtered = filtered.filter(p => new Date(p.created_date) >= weekStart);
    } else if (dateRange === "month") {
      const monthStart = startOfMonth(now);
      filtered = filtered.filter(p => new Date(p.created_date) >= monthStart);
    } else if (dateRange === "3months") {
      const threeMonthsAgo = subDays(now, 90);
      filtered = filtered.filter(p => new Date(p.created_date) >= threeMonthsAgo);
    }

    // Filter by goal
    if (goalFilter !== "all") {
      const levelMap = {
        "matura_podstawowa": "podstawowy",
        "matura_rozszerzona": "rozszerzony"
      };
      const targetLevel = levelMap[goalFilter];
      
      filtered = filtered.filter(p => {
        if (p.worksheet_id) {
          const worksheet = worksheets.find(w => w.id === p.worksheet_id);
          return worksheet?.level === targetLevel;
        }
        return true; // Keep lessons and challenges
      });
    }

    return filtered;
  };

  const filteredProgress = getFilteredProgress();

  // Calculate statistics
  const completedLessons = filteredProgress.filter(p => p.lesson_id && p.completed).length;
  const completedWorksheets = filteredProgress.filter(p => p.worksheet_id && p.completed).length;
  const completedChallenges = filteredProgress.filter(p => p.challenge_id && p.completed).length;
  const totalTime = filteredProgress.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0);

  // Performance over time
  const getPerformanceOverTime = () => {
    const dailyData = {};
    
    filteredProgress.forEach(p => {
      if (p.completed && p.score) {
        const date = format(new Date(p.created_date), 'yyyy-MM-dd');
        if (!dailyData[date]) {
          dailyData[date] = { date, totalScore: 0, count: 0, points: 0 };
        }
        dailyData[date].totalScore += p.score;
        dailyData[date].count += 1;
        dailyData[date].points += p.score;
      }
    });

    return Object.values(dailyData)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(d => ({
        date: format(new Date(d.date), 'd MMM', { locale: pl }),
        avgScore: Math.round(d.totalScore / d.count),
        points: d.points,
        activities: d.count
      }));
  };

  // Topic distribution with performance
  const getTopicPerformance = () => {
    const topicData = {};
    
    filteredProgress.forEach(p => {
      if (p.lesson_id) {
        const lesson = lessons.find(l => l.id === p.lesson_id);
        if (lesson?.topic) {
          if (!topicData[lesson.topic]) {
            topicData[lesson.topic] = { total: 0, completed: 0, scores: [] };
          }
          topicData[lesson.topic].total += 1;
          if (p.completed) {
            topicData[lesson.topic].completed += 1;
            topicData[lesson.topic].scores.push(100);
          }
        }
      }
      
      if (p.worksheet_id && p.completed) {
        const worksheet = worksheets.find(w => w.id === p.worksheet_id);
        const questions = allQuestions.filter(q => q.worksheet_id === p.worksheet_id);
        const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
        const percentage = totalPoints > 0 ? (p.score / totalPoints) * 100 : 0;
        
        // For worksheets, we'll distribute across multiple topics based on questions
        // For now, use a simplified approach
        const topics = ['algebra', 'geometria', 'funkcje']; // Placeholder
        topics.forEach(topic => {
          if (!topicData[topic]) {
            topicData[topic] = { total: 0, completed: 0, scores: [] };
          }
          topicData[topic].scores.push(percentage);
        });
      }
    });

    return Object.entries(topicData)
      .map(([topic, data]) => ({
        topic: topicNames[topic] || topic,
        avgScore: data.scores.length > 0 
          ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
          : 0,
        completed: data.completed,
        total: data.total,
        completionRate: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
      }))
      .filter(d => d.avgScore > 0);
  };

  // Activity by day of week
  const getActivityByDayOfWeek = () => {
    const days = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];
    const dayData = days.map(day => ({ day, activities: 0, minutes: 0 }));
    
    filteredProgress.forEach(p => {
      const dayIndex = (new Date(p.created_date).getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      dayData[dayIndex].activities += 1;
      dayData[dayIndex].minutes += p.time_spent_minutes || 0;
    });
    
    return dayData;
  };

  // Score distribution
  const getScoreDistribution = () => {
    const ranges = [
      { range: '0-20%', min: 0, max: 20, count: 0 },
      { range: '21-40%', min: 21, max: 40, count: 0 },
      { range: '41-60%', min: 41, max: 60, count: 0 },
      { range: '61-80%', min: 61, max: 80, count: 0 },
      { range: '81-100%', min: 81, max: 100, count: 0 }
    ];
    
    filteredProgress.forEach(p => {
      if (p.worksheet_id && p.completed && p.score) {
        const questions = allQuestions.filter(q => q.worksheet_id === p.worksheet_id);
        const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
        const percentage = totalPoints > 0 ? (p.score / totalPoints) * 100 : 0;
        
        const range = ranges.find(r => percentage >= r.min && percentage <= r.max);
        if (range) range.count += 1;
      }
    });
    
    return ranges;
  };

  // Completion rate by goal
  const getCompletionByGoal = () => {
    const goals = {
      podstawowy: { level: 'Podstawowy', completed: 0, total: 0 },
      rozszerzony: { level: 'Rozszerzony', completed: 0, total: 0 }
    };
    
    worksheets.forEach(w => {
      if (goals[w.level]) {
        goals[w.level].total += 1;
        const completed = filteredProgress.some(p => p.worksheet_id === w.id && p.completed);
        if (completed) goals[w.level].completed += 1;
      }
    });
    
    return Object.values(goals).map(g => ({
      level: g.level,
      completionRate: g.total > 0 ? Math.round((g.completed / g.total) * 100) : 0,
      completed: g.completed,
      total: g.total
    }));
  };

  const isDark = user?.theme === "dark";
  const performanceOverTime = getPerformanceOverTime();
  const topicPerformance = getTopicPerformance();
  const activityByDay = getActivityByDayOfWeek();
  const scoreDistribution = getScoreDistribution();
  const completionByGoal = getCompletionByGoal();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Analiza postępów
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-300">
            Śledź swoją naukę i osiągnięcia z zaawansowaną wizualizacją
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 dark:bg-slate-800 bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Filtry
              </span>
            </div>
            <FilterBar columnsClassName="grid-cols-1 sm:grid-cols-2">
              <CycleFilter
                label="Zakres czasowy"
                value={dateRange}
                options={[
                  { value: "all", label: "Cały czas" },
                  { value: "week", label: "Ostatni tydzień" },
                  { value: "month", label: "Ostatni miesiąc" },
                  { value: "3months", label: "Ostatnie 3 miesiące" },
                ]}
                onChange={setDateRange}
              />
              <CycleFilter
                label="Cel nauki"
                value={goalFilter}
                options={[
                  { value: "all", label: "Wszystkie cele" },
                  { value: "matura_podstawowa", label: "Matura podstawowa" },
                  { value: "matura_rozszerzona", label: "Matura rozszerzona" },
                ]}
                onChange={setGoalFilter}
              />
            </FilterBar>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dark:bg-slate-800 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                    Dni z rzędu
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {user?.streak_days || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Flame className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                    Ukończone lekcje
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {completedLessons}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                    Suma punktów
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {user?.total_points || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Award className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">
                    Czas nauki
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {totalTime}m
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Performance Over Time */}
          <Card className="dark:bg-slate-800 bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Wyniki w czasie
              </CardTitle>
            </CardHeader>
            <CardContent>
              {performanceOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceOverTime}>
                    <defs>
                      <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E5E7EB"} />
                    <XAxis dataKey="date" stroke={isDark ? "#94A3B8" : "#6B7280"} />
                    <YAxis stroke={isDark ? "#94A3B8" : "#6B7280"} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="points" stroke="#3B82F6" fillOpacity={1} fill="url(#colorPoints)" name="Punkty" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400 dark:text-slate-500">
                  Brak danych do wyświetlenia
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity by Day */}
          <Card className="dark:bg-slate-800 bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Aktywność w tygodniu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E5E7EB"} />
                  <XAxis dataKey="day" stroke={isDark ? "#94A3B8" : "#6B7280"} />
                  <YAxis stroke={isDark ? "#94A3B8" : "#6B7280"} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="activities" fill="#6366F1" radius={[8, 8, 0, 0]} name="Aktywności" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Topic Performance */}
          <Card className="dark:bg-slate-800 bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Wyniki według tematu
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topicPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topicPerformance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E5E7EB"} />
                    <XAxis type="number" stroke={isDark ? "#94A3B8" : "#6B7280"} />
                    <YAxis dataKey="topic" type="category" stroke={isDark ? "#94A3B8" : "#6B7280"} width={120} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="avgScore" fill="#8B5CF6" radius={[0, 8, 8, 0]} name="Średni wynik %" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400 dark:text-slate-500">
                  Brak danych do wyświetlenia
                </div>
              )}
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card className="dark:bg-slate-800 bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Rozkład wyników
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, count }) => count > 0 ? `${range}: ${count}` : ''}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Completion by Goal */}
        <Card className="mb-8 dark:bg-slate-800 bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Ukończenie według poziomu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={completionByGoal}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E5E7EB"} />
                <XAxis dataKey="level" stroke={isDark ? "#94A3B8" : "#6B7280"} />
                <YAxis stroke={isDark ? "#94A3B8" : "#6B7280"} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completionRate" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Wskaźnik ukończenia %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="dark:bg-slate-800 bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Osiągnięcia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`p-6 rounded-xl text-center transition-all ${completedLessons >= 10 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-slate-700 opacity-50'}`}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${completedLessons >= 10 ? 'bg-blue-500' : 'bg-gray-400'}`}>
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Początkujący
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  Ukończ 10 lekcji
                </p>
                {completedLessons >= 10 && (
                  <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mt-2" />
                )}
              </div>

              <div className={`p-6 rounded-xl text-center transition-all ${(user?.streak_days || 0) >= 7 ? 'bg-violet-50 dark:bg-violet-950/40' : 'bg-gray-100 dark:bg-slate-700 opacity-50'}`}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${(user?.streak_days || 0) >= 7 ? 'bg-violet-500' : 'bg-gray-400'}`}>
                  <Flame className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Konsekwentny
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  7 dni z rzędu
                </p>
                {(user?.streak_days || 0) >= 7 && (
                  <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mt-2" />
                )}
              </div>

              <div className={`p-6 rounded-xl text-center transition-all ${completedChallenges >= 30 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-100 dark:bg-slate-700 opacity-50'}`}>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${completedChallenges >= 30 ? 'bg-purple-500' : 'bg-gray-400'}`}>
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Mistrz wyzwań
                </h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  30 zadań dnia
                </p>
                {completedChallenges >= 30 && (
                  <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mt-2" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}