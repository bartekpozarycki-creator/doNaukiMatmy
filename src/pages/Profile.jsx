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

const levelLabels = {
  brak: "Brak",
  osma_klasa: "Ósma klasa",
  matura_podstawowa: "Matura podstawowa",
  matura_rozszerzona: "Matura rozszerzona",
};

export default function ProfilePage() {
  const { user, logout, userLevel, updateUserLevel } = useAuth();
  const { isDark, setTheme } = useTheme();

  return (
    <div className="min-h-full py-8 sm:py-10">
      <div className="mx-auto max-w-xl space-y-6 px-4 sm:px-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Profil
          </h1>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-300">
            Poziom nauki i ustawienia konta
          </p>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-5 dark:border-slate-700">
            <div className="flex min-w-0 items-center gap-3">
              {isDark ? (
                <Moon className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-300" />
              ) : (
                <Sun className="h-5 w-5 shrink-0 text-amber-500" />
              )}
              <div className="min-w-0">
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  Tryb ciemny
                </p>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">
                  {isDark ? "Włączony" : "Wyłączony"}
                </p>
              </div>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              className="data-[state=checked]:bg-blue-600"
              aria-label="Tryb ciemny"
            />
          </div>

          <div className="space-y-3 border-b border-slate-200 px-5 py-5 dark:border-slate-700">
            <div>
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                Poziom nauki
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Filtruje arkusze i zbiory zadań
              </p>
            </div>
            <Select value={userLevel} onValueChange={updateUserLevel}>
              <SelectTrigger className="h-11 border-slate-300 bg-white text-base text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white">
                <SelectValue placeholder="Wybierz poziom" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(levelLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value} className="text-base">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!user ? (
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Jako gość zapisujemy to na tym urządzeniu.
              </p>
            ) : null}
          </div>

          {user ? (
            <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <User className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Konto
                  </p>
                  <p className="truncate text-base font-medium text-slate-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="shrink-0 border-slate-300 text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Wyloguj
              </Button>
            </div>
          ) : (
            <div className="px-5 py-5">
              <Link to={createPageUrl("Login")}>
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 sm:w-auto">
                  Zaloguj się
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
