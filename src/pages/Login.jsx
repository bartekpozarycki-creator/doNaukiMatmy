import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabase-config.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, GraduationCap, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const inputClassName =
  "h-11 rounded-xl border-slate-200/80 bg-white/90 pl-4 pr-4 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500/25 dark:border-slate-600 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:border-indigo-500";

const tabMeta = {
  login: {
    title: "Witaj ponownie",
    subtitle: "Zaloguj się i wróć do nauki matematyki",
    submit: "Zaloguj się",
  },
  register: {
    title: "Dołącz do MathMaster",
    subtitle: "Załóż konto i zapisuj swój postęp",
    submit: "Załóż konto",
  },
};

function FloatingOrb({ className, delay = 0 }) {
  return (
    <motion.div
      className={cn("absolute rounded-full blur-3xl", className)}
      animate={{
        x: [0, 28, -18, 0],
        y: [0, -22, 14, 0],
        scale: [1, 1.08, 0.94, 1],
      }}
      transition={{
        duration: 14,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

function AuthField({ id, label, children }) {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </Label>
      {children}
    </motion.div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login: setAuthUser } = useAuth();

  const meta = tabMeta[tab];

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
    if (tab === "register" && (!fullName || fullName.trim().length < 3)) {
      setError("Podaj pełne imię i nazwisko");
      toast.error("Podaj pełne imię i nazwisko");
      setLoading(false);
      return;
    }

    if (tab === "login") {
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

  const handleGoogle = async () => {
    toast.info("Trwa przekierowanie do Google");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/Dashboard" },
    });
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-14">
      <div className="absolute inset-0 -z-20 bg-slate-950" />
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-700 via-indigo-800 to-violet-900"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />
      <FloatingOrb className="left-[8%] top-[12%] h-56 w-56 bg-sky-400/30" delay={0} />
      <FloatingOrb className="right-[10%] top-[18%] h-72 w-72 bg-violet-400/25" delay={2} />
      <FloatingOrb className="bottom-[8%] left-[30%] h-64 w-64 bg-indigo-300/20" delay={4} />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/95 shadow-2xl shadow-indigo-950/30 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-7 text-white">
            <motion.div
              className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10"
              animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative flex items-start gap-4">
              <motion.div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25"
                whileHover={{ rotate: 6, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              >
                <GraduationCap className="h-6 w-6" />
              </motion.div>
              <div className="min-w-0 space-y-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {meta.title}
                    </h1>
                    <p className="text-sm text-white/80">{meta.subtitle}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-8 sm:p-9">
            <div className="relative grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
              <motion.div
                className="absolute inset-y-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-md dark:bg-slate-700"
                layout
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                style={{ left: tab === "login" ? "4px" : "calc(50% + 0px)" }}
              />
              {["login", "register"].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setTab(value);
                    setError(null);
                  }}
                  className={cn(
                    "relative z-10 rounded-lg py-2.5 text-sm font-semibold transition-colors",
                    tab === value
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                  )}
                >
                  {value === "login" ? "Zaloguj" : "Załóż konto"}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={tab}
                className="space-y-5"
                onSubmit={handleAuth}
                initial={{ opacity: 0, x: tab === "login" ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === "login" ? 16 : -16 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {tab === "register" ? (
                  <AuthField id="full_name" label="Imię i nazwisko">
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      placeholder="Jan Kowalski"
                      required
                      className={inputClassName}
                    />
                  </AuthField>
                ) : null}

                <AuthField id="email" label="Email">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="twoj@email.pl"
                    required
                    className={inputClassName}
                  />
                </AuthField>

                <AuthField id="password" label="Hasło">
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPass ? "text" : "password"}
                      placeholder="Minimum 6 znaków"
                      required
                      className={cn(inputClassName, "pr-11")}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                      whileTap={{ scale: 0.92 }}
                      aria-label={showPass ? "Ukryj hasło" : "Pokaż hasło"}
                    >
                      {showPass ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </motion.button>
                  </div>
                </AuthField>

                <AnimatePresence>
                  {error ? (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                    >
                      {error}
                    </motion.p>
                  ) : null}
                </AnimatePresence>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.985 }}>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-base font-semibold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 disabled:hover:brightness-100"
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Przetwarzanie...
                      </span>
                    ) : (
                      meta.submit
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </AnimatePresence>

            <div className="flex items-center gap-3">
              <Separator className="flex-1 bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                lub
              </span>
              <Separator className="flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.985 }}>
              <Button
                type="button"
                onClick={handleGoogle}
                variant="outline"
                className="h-11 w-full rounded-xl border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt=""
                  className="mr-2 h-5 w-5"
                />
                Kontynuuj z Google
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
