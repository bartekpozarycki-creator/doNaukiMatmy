import { publicSupabase } from "@/supabase-config.js";

export const ABOUT_IMAGES_BUCKET = "onas";

export function resolveAboutImageUrl(path) {
  const value = typeof path === "string" ? path.trim() : "";
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return publicSupabase.storage
    .from(ABOUT_IMAGES_BUCKET)
    .getPublicUrl(value.replace(/^\//, "")).data.publicUrl;
}
