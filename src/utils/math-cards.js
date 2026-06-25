import { publicSupabase } from "@/supabase-config.js";

export const MATH_CARDS_BUCKET = "karty";
export const MATH_REFERENCE_SHEET_PATH = "tablice_matematyczne.pdf";

export function getMathReferenceSheetUrl() {
  return publicSupabase.storage
    .from(MATH_CARDS_BUCKET)
    .getPublicUrl(MATH_REFERENCE_SHEET_PATH).data.publicUrl;
}
