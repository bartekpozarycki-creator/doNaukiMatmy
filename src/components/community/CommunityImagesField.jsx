import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Loader2, X } from "lucide-react";
import {
  communityImageLimits,
  validateCommunityImageFile,
} from "@/utils/community-images";
import { toast } from "sonner";

const VARIANT_STYLES = {
  question: {
    shell:
      "border-blue-200/90 bg-gradient-to-br from-blue-50/95 via-white to-slate-50/80 dark:border-blue-900/45 dark:from-blue-950/30 dark:via-slate-900/50 dark:to-slate-900/30",
    icon: "bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    drop: "border-blue-200/80 text-blue-700 hover:border-blue-400 hover:bg-blue-50/90 dark:border-blue-800/60 dark:text-blue-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  },
  answer: {
    shell:
      "border-emerald-200/90 bg-gradient-to-br from-emerald-50/95 via-white to-slate-50/80 dark:border-emerald-900/45 dark:from-emerald-950/25 dark:via-slate-900/50 dark:to-slate-900/30",
    icon: "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    drop: "border-emerald-200/80 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50/90 dark:border-emerald-800/60 dark:text-emerald-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/40",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  comment: {
    shell:
      "border-purple-200/90 bg-gradient-to-br from-purple-50/95 via-white to-slate-50/80 dark:border-purple-900/45 dark:from-purple-950/25 dark:via-slate-900/50 dark:to-slate-900/30",
    icon: "bg-purple-500/15 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    drop: "border-purple-200/80 text-purple-700 hover:border-purple-400 hover:bg-purple-50/90 dark:border-purple-800/60 dark:text-purple-300 dark:hover:border-purple-500 dark:hover:bg-purple-950/40",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
  },
};

export default function CommunityImagesField({
  items,
  onChange,
  disabled = false,
  uploading = false,
  variant = "question",
  compact = false,
  label = "Zdjęcia",
  hint = "Przeciągnij pliki lub kliknij, aby dodać",
}) {
  const inputRef = useRef(null);
  const { maxImages, maxBytes } = communityImageLimits();
  const styles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.question;
  const maxMb = Math.round(maxBytes / (1024 * 1024));

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const remaining = maxImages - items.length;
    if (remaining <= 0) {
      toast.error(`Możesz dodać maksymalnie ${maxImages} zdjęć`);
      return;
    }

    const nextItems = [...items];
    for (const file of files.slice(0, remaining)) {
      const error = validateCommunityImageFile(file);
      if (error) {
        toast.error(error);
        continue;
      }
      nextItems.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    if (nextItems.length > items.length) {
      onChange(nextItems);
    }
  };

  const removeItem = (id) => {
    const target = items.find((item) => item.id === id);
    if (target?.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(target.previewUrl);
    }
    onChange(items.filter((item) => item.id !== id));
  };

  const handleInputChange = (event) => {
    addFiles(event.target.files);
    event.target.value = "";
  };

  const canAddMore = items.length < maxImages;

  return (
    <div
      className={`rounded-xl border p-3 shadow-sm sm:p-4 ${styles.shell} ${
        compact ? "p-3" : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
          >
            <ImagePlus className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {label}
              <span className="ml-1.5 font-normal text-slate-500 dark:text-slate-400">
                · opcjonalnie
              </span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              JPG, PNG, WEBP, GIF · do {maxMb} MB
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${styles.badge}`}
        >
          {items.length}/{maxImages}
        </span>
      </div>

      {items.length > 0 && (
        <div
          className={`mb-3 grid gap-2.5 ${
            compact
              ? "grid-cols-3 sm:grid-cols-4"
              : "grid-cols-2 sm:grid-cols-4"
          }`}
        >
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.18 }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/80 bg-slate-100 shadow-sm ring-1 ring-slate-200/80 dark:border-slate-700 dark:bg-slate-800 dark:ring-slate-700"
              >
                <img
                  src={item.previewUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={disabled || uploading}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur-sm transition hover:bg-black/75 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Usuń zdjęcie"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {canAddMore && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            disabled={disabled || uploading}
            onChange={handleInputChange}
          />
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${styles.drop} ${
              compact ? "py-4" : "py-6"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin opacity-80" />
                <span className="text-sm font-medium">Przesyłanie zdjęć…</span>
              </>
            ) : (
              <>
                <ImagePlus className="h-6 w-6 opacity-70" />
                <span className="text-sm font-medium">{hint}</span>
                <span className="text-xs opacity-75">
                  Pozostało miejsc: {maxImages - items.length}
                </span>
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

export function clearCommunityImageItems(items) {
  items.forEach((item) => {
    if (item.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(item.previewUrl);
    }
  });
}
