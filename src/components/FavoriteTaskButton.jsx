import { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
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

function stopTileNavigation(event) {
  event.preventDefault();
  event.stopPropagation();
}

export default function FavoriteTaskButton({
  taskId,
  className = "",
  size = "md",
  stopPropagation = false,
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(taskId);
  const [pulseKey, setPulseKey] = useState(0);

  const tileIgnoreProps = stopPropagation
    ? { "data-task-tile-ignore": true }
    : {};

  const blockNavHandlers = stopPropagation
    ? {
        onPointerDown: stopTileNavigation,
        onMouseDown: stopTileNavigation,
        onTouchStart: stopTileNavigation,
        onPointerDownCapture: stopTileNavigation,
      }
    : {};

  const handleClick = (event) => {
    if (stopPropagation) {
      stopTileNavigation(event);
    }
    setPulseKey((value) => value + 1);
    toggleFavorite(taskId);
  };

  return (
    <motion.button
      type="button"
      aria-label={active ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      aria-pressed={active}
      {...tileIgnoreProps}
      {...blockNavHandlers}
      onClick={handleClick}
      whileTap={{ scale: 0.86 }}
      transition={{ type: "spring", stiffness: 520, damping: 22 }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-visible rounded-full border border-slate-200/90 bg-white text-slate-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-rose-500/40 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 dark:focus-visible:ring-offset-slate-900",
        active &&
          "border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-500/40 dark:bg-rose-950/50 dark:text-rose-400",
        sizeClass[size],
        className,
      )}
    >
      <motion.span
        key={pulseKey}
        className="inline-flex items-center justify-center"
        initial={{ scale: 1, rotate: 0 }}
        animate={{
          scale: active ? [1, 1.42, 1] : [1, 1.28, 1],
          rotate: active ? [0, -16, 0] : [0, 14, 0],
        }}
        transition={{ duration: 0.42, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <Heart
          className={cn(
            iconClass[size],
            active && "fill-current",
          )}
        />
      </motion.span>
    </motion.button>
  );
}
