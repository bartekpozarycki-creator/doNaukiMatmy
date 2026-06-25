import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/contexts/FavoritesContext";

const sizeClass = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-10 w-10",
};

const iconClass = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-5 w-5",
};

export default function FavoriteTaskButton({
  taskId,
  className = "",
  size = "md",
  stopPropagation = false,
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(taskId);

  return (
    <button
      type="button"
      aria-label={active ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      aria-pressed={active}
      onClick={(e) => {
        if (stopPropagation) {
          e.preventDefault();
          e.stopPropagation();
        }
        toggleFavorite(taskId);
      }}
      onPointerDown={
        stopPropagation ? (e) => e.stopPropagation() : undefined
      }
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white text-slate-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-rose-500/40 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 dark:focus-visible:ring-offset-slate-900",
        active &&
          "border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-500/40 dark:bg-rose-950/50 dark:text-rose-400",
        sizeClass[size],
        className,
      )}
    >
      <Heart
        className={cn(
          iconClass[size],
          active && "fill-current",
        )}
      />
    </button>
  );
}
