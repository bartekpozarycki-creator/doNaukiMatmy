import { createClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(raw) {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("{")) {
    console.error(
      "[supabase] VITE_SUPABASE_URL wygląda jak odpowiedź błędu — ustaw sam adres projektu, np. https://twoj-ref.supabase.co",
    );
    return "";
  }
  return trimmed
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/storage\/v1\/?$/i, "")
    .replace(/\/auth\/v1\/?$/i, "");
}

function getJwtRole(key) {
  try {
    const payload = key.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(base64));
    return json.role ?? null;
  } catch {
    return null;
  }
}

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnon = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

if (import.meta.env.DEV) {
  if (!supabaseUrl) {
    console.error(
      "[supabase] Brak VITE_SUPABASE_URL. Dodaj do .env: https://TWÓJ_REF.supabase.co i zrestartuj npm run dev",
    );
  } else if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(supabaseUrl)) {
    console.warn(
      "[supabase] VITE_SUPABASE_URL powinien wyglądać jak https://xxxx.supabase.co (bez ścieżek /rest/v1)",
    );
  }
  const role = getJwtRole(supabaseAnon);
  if (role === "service_role") {
    console.warn(
      "[supabase] W .env jest klucz service_role — w przeglądarce użyj klucza anon (public) z Supabase → Settings → API",
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const publicSupabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    storageKey: "sb-public-read",
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
