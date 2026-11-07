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
  "h-11 rounded-xl border-slate-200/80 bg-white/90 pl-3.5 pr-3.5 text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500/25 dark:border-slate-600 dark:bg-slate-950/70 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-blue-500";

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
    <div className="relative flex min-h-[calc(100vh-4.5rem)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 -z-20 bg-slate-950" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_#1e3a8a_0%,_transparent_55%),radial-gradient(ellipse_at_bottom_right,_#0f172a_0%,_#020617_70%)]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />
      <div className="w-full max-w-sm">
        <div className="overflow-hidden rounded-2xl border border-white/15 bg-white/95 shadow-2xl shadow-slate-950/40 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90">
          <div className="border-b border-slate-200/70 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 dark:border-slate-700/60 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/15 ring-1 ring-white/25">
                <img src="/app-icon.png" alt="" className="h-9 w-9 object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-100/90">
                  Matematyka
                </p>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  <span className="relative inline-grid">
                    <span className="invisible col-start-1 row-start-1 whitespace-nowrap">
                      Załóż konto
                    </span>
                    <span className="col-start-1 row-start-1 whitespace-nowrap">
                      {isRegister ? "Załóż konto" : "Zaloguj się"}
                    </span>
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="mb-5 min-h-5 text-sm text-slate-500 dark:text-slate-400">
              {isRegister ? "Zapisuj swój postęp nauki." : "Wróć do nauki matematyki."}
            </p>

            <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
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
                    "rounded-lg py-2 text-sm font-semibold transition-colors",
                    tab === item.value
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <form className="flex flex-col" onSubmit={handleAuth}>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  isRegister ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="mb-4 space-y-1.5">
                    <Label
                      htmlFor="full_name"
                      className="text-sm text-slate-700 dark:text-slate-300"
                    >
                      Imię i nazwisko
                    </Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      placeholder="Jan Kowalski"
                      required={isRegister}
                      disabled={!isRegister}
                      tabIndex={isRegister ? 0 : -1}
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4 space-y-1.5">
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

              <div className="mb-4 space-y-1.5">
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

              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  error ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  {error ? (
                    <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                      {error}
                    </p>
                  ) : null}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-xl bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
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
      </div>
    </div>
  );
}
