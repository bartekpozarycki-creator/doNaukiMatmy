import { supabase } from "@/supabase-config.js";

export const COMMUNITY_IMAGES_BUCKET = "community_images";

const MAX_IMAGES = 4;
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extensionForFile(file) {
  const fromName = file.name?.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }
  const map = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return map[file.type] || "jpg";
}

export function validateCommunityImageFile(file) {
  if (!file) return "Nie wybrano pliku";
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Dozwolone formaty: JPG, PNG, WEBP, GIF";
  }
  if (file.size > MAX_BYTES) {
    return "Maksymalny rozmiar zdjęcia to 5 MB";
  }
  return null;
}

export function communityImageLimits() {
  return { maxImages: MAX_IMAGES, maxBytes: MAX_BYTES };
}

export async function uploadCommunityQuestionImages(userId, files) {
  return uploadCommunityImages(userId, files);
}

export async function uploadCommunityImages(userId, files) {
  if (!userId) {
    throw new Error("Zaloguj się, aby dodać zdjęcia");
  }
  if (!files?.length) return [];

  const urls = [];

  for (const file of files) {
    const validationError = validateCommunityImageFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    const ext = extensionForFile(file);
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

    const { error } = await supabase.storage
      .from(COMMUNITY_IMAGES_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      throw new Error(error.message || "Nie udało się przesłać zdjęcia");
    }

    const { data } = supabase.storage
      .from(COMMUNITY_IMAGES_BUCKET)
      .getPublicUrl(path);

    if (data?.publicUrl) {
      urls.push(data.publicUrl);
    }
  }

  return urls;
}

export function contentImageUrls(record) {
  if (Array.isArray(record?.image_urls) && record.image_urls.length) {
    return record.image_urls.filter(Boolean);
  }
  if (record?.image_url) {
    return [record.image_url];
  }
  return [];
}

export function questionImageUrls(question) {
  return contentImageUrls(question);
}

export function contentImageCount(record) {
  return contentImageUrls(record).length;
}

export function formatImagesCountLabel(count) {
  if (!count || count < 1) return null;
  if (count === 1) return "+1 zdjęcie";
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `+${count} zdjęcia`;
  }
  return `+${count} zdjęć`;
}
