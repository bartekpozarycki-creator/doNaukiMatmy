import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase-config.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const inputClassName =
  "h-11 rounded-lg border-slate-200 bg-white pl-3 pr-3 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-blue-500";

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login: setAuthUser } = useAuth();

  const isRegister = tab === "register";

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");
    const fullName = form.get("full_name");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Niepoprawny email");
      toast.error("Wprowadź poprawny adres email");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Hasło musi mieć min. 6 znaków");
      toast.error("Hasło musi mieć min. 6 znaków");
      setLoading(false);
      return;
    }
    if (isRegister && (!fullName || fullName.trim().length < 3)) {
      setError("Podaj pełne imię i nazwisko");
      toast.error("Podaj pełne imię i nazwisko");
      setLoading(false);
      return;
    }

    if (!isRegister) {
      const { error: signInError, data: signInData } =
        await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        toast.error(signInError.message);
      } else {
        toast.success("Pomyślnie zalogowano");
        if (signInData.session) {
          await supabase.auth.setSession({
            access_token: signInData.session.access_token,
            refresh_token: signInData.session.refresh_token,
          });
          setAuthUser(signInData.session.user);
        }
        navigate("/");
        setLoading(false);
        return;
      }
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (signUpError) {
        setError(signUpError.message);
        toast.error(signUpError.message);
      } else {
        toast.success("Rejestracja zakończona. Sprawdź email aby potwierdzić konto");
        const { data } = await supabase.auth.getSession();
        if (data.session) setAuthUser(data.session.user);
        navigate("/");
        setLoading(false);
        return;
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <img src="/app-icon.png" alt="" className="h-10 w-10 rounded-xl object-contain" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isRegister ? "Załóż konto" : "Zaloguj się"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isRegister ? "Zapisuj swój postęp nauki" : "Wróć do nauki matematyki"}
            </p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {[
            { value: "login", label: "Zaloguj" },
            { value: "register", label: "Załóż konto" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setTab(item.value);
                setError(null);
              }}
              className={cn(
                "rounded-md py-2 text-sm font-semibold transition-colors",
                tab === item.value
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={handleAuth}>
          {isRegister ? (
            <div className="space-y-1.5">
              <Label htmlFor="full_name" className="text-sm text-slate-700 dark:text-slate-300">
                Imię i nazwisko
              </Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Jan Kowalski"
                required
                className={inputClassName}
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm text-slate-700 dark:text-slate-300">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="twoj@email.pl"
              required
              className={inputClassName}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm text-slate-700 dark:text-slate-300">
              Hasło
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Minimum 6 znaków"
                required
                className={cn(inputClassName, "pr-11")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                aria-label={showPass ? "Ukryj hasło" : "Pokaż hasło"}
              >
                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Przetwarzanie...
              </span>
            ) : isRegister ? (
              "Załóż konto"
            ) : (
              "Zaloguj się"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
