import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LogOut, Moon, Sun, User } from "lucide-react";

export default function ProfilePage() {
  const { user, logout, userLevel, updateUserLevel } = useAuth();
  const { isDark, setTheme } = useTheme();

  const levelLabels = {
    brak: "Brak",
    osma_klasa: "Ósma klasa",
    matura_podstawowa: "Matura podstawowa",
    matura_rozszerzona: "Matura rozszerzona",
  };

  return (
    <div className={`min-h-screen ${isDark ? "dark bg-slate-900" : "bg-gray-50"} py-8`}>
      <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-2">
          <h1 className="mb-2 text-4xl font-bold text-slate-900 dark:text-white">
            Mój profil
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-300">
            Ustaw poziom nauki i zarządzaj kontem
          </p>
        </div>

        <Card className="border-0 bg-white shadow-lg dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">
              Wygląd
            </CardTitle>
          </CardHeader>
          <CardContent>
            <label className="flex cursor-pointer items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon className="h-5 w-5 text-slate-400" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Tryb ciemny
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">
                    {isDark ? "Włączony" : "Wyłączony"}
                  </p>
                </div>
              </div>
              <Switch
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                className="data-[state=checked]:bg-blue-600"
              />
            </label>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-lg dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">
              Poziom nauki
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-slate-300">
              Wybrany poziom filtruje arkusze i zbiory zadań.
            </p>
            <div className="space-y-2">
              <Select value={userLevel} onValueChange={updateUserLevel}>
                <SelectTrigger className="bg-white dark:border-slate-600 dark:bg-slate-700">
                  <SelectValue placeholder="Wybierz poziom" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(levelLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!user ? (
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Jako gość ustawienie zapisuje się na tym urządzeniu. Zaloguj się, aby
                  synchronizować je między urządzeniami.
                </p>
              ) : null}
            </div>
            {!user && (
              <div className="pt-2">
                <Link to={createPageUrl("Login")}>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    Zaloguj się
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {user && (
          <Card className="border-0 bg-white dark:bg-slate-800">
            <CardContent className="flex items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                <User className="h-5 w-5" />
                <span className="text-sm">{user.email}</span>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Wyloguj się
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
