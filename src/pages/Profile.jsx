import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { AlertTriangle, Eye, EyeOff, Loader2, LogOut, Moon, Sun, User } from "lucide-react";
import { toast } from "react-toastify";
import {
  resetAccountProgress,
  verifyAccountPassword,
} from "@/utils/reset-account-progress";

const levelLabels = {
  brak: "Brak",
  osma_klasa: "Ósma klasa",
  matura_podstawowa: "Matura podstawowa",
  matura_rozszerzona: "Matura rozszerzona",
};

export default function ProfilePage() {
  const { user, logout, userLevel, updateUserLevel } = useAuth();
  const { isDark, setTheme } = useTheme();
  const [resetOpen, setResetOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState(null);

  const closeResetDialog = () => {
    if (resetting) return;
    setResetOpen(false);
    setPassword("");
    setShowPassword(false);
    setResetError(null);
  };

  const handleResetProgress = async (event) => {
    event.preventDefault();
    if (!user?.id || !user?.email) return;

    setResetError(null);
    setResetting(true);
    try {
      await verifyAccountPassword(user.email, password);
      await resetAccountProgress(user.id);
      toast.success("Progres konta został zresetowany");
      setResetOpen(false);
      setPassword("");
      window.location.reload();
    } catch (error) {
      setResetError(error?.message || "Nie udało się zresetować progresu");
      toast.error(error?.message || "Nie udało się zresetować progresu");
      setResetting(false);
    }
  };

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
            <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
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

          {user ? (
            <div className="space-y-3 px-5 py-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                <div className="min-w-0">
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    Reset progresu
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    Usuwa postęp w zadaniach, arkuszach, kontynuację nauki oraz wykreślenia
                    wymagań CKE. Tej operacji nie można cofnąć.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setResetOpen(true)}
                className="border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40"
              >
                Zresetuj cały progres
              </Button>
            </div>
          ) : null}
        </section>
      </div>

      <Dialog open={resetOpen} onOpenChange={(open) => (open ? setResetOpen(true) : closeResetDialog())}>
        <DialogContent className="border-slate-200 dark:border-slate-700 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Potwierdź reset progresu</DialogTitle>
            <DialogDescription>
              Aby usunąć cały progres konta, wpisz hasło do {user?.email}.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleResetProgress}>
            <div className="space-y-1.5">
              <Label htmlFor="reset-password">Hasło</Label>
              <div className="relative">
                <Input
                  id="reset-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={resetting}
                  className="pr-11"
                  placeholder="Hasło konta"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                  aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {resetError ? (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                {resetError}
              </p>
            ) : null}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={closeResetDialog}
                disabled={resetting}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                disabled={resetting || !password}
                className="bg-rose-600 text-white hover:bg-rose-700"
              >
                {resetting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Resetowanie...
                  </span>
                ) : (
                  "Usuń progres"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
