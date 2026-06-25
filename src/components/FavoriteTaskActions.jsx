import { useState } from "react";
import { Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/contexts/FavoritesContext";
import FavoriteTaskButton from "@/components/FavoriteTaskButton";
import FavoriteNoteDialog from "@/components/FavoriteNoteDialog";

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

export default function FavoriteTaskActions({
  taskId,
  className = "",
  size = "md",
  stopPropagation = false,
}) {
  const { hasNote } = useFavorites();
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const showPin = hasNote(taskId);

  return (
    <>
      <div
        className={cn("flex shrink-0 items-center gap-1.5", className)}
        onClick={stopPropagation ? (event) => event.stopPropagation() : undefined}
        onKeyDown={stopPropagation ? (event) => event.stopPropagation() : undefined}
        onPointerDown={stopPropagation ? (event) => event.stopPropagation() : undefined}
      >
        <FavoriteTaskButton
          taskId={taskId}
          size={size}
          stopPropagation={stopPropagation}
        />
        <button
          type="button"
          aria-label={showPin ? "Pokaż notatkę" : "Dodaj notatkę"}
          onClick={(event) => {
            if (stopPropagation) {
              event.preventDefault();
              event.stopPropagation();
            }
            setNoteDialogOpen(true);
          }}
          onPointerDown={
            stopPropagation ? (event) => event.stopPropagation() : undefined
          }
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900",
            showPin
              ? "border-amber-200/90 bg-amber-50 text-amber-600 hover:border-amber-300 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-400 dark:hover:border-amber-500/60 dark:hover:bg-amber-950/60"
              : "border-slate-200/90 bg-white text-slate-500 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-amber-500/40 dark:hover:bg-amber-950/40 dark:hover:text-amber-400",
            sizeClass[size],
          )}
        >
          <Pin className={cn(iconClass[size], showPin && "fill-current")} />
        </button>
      </div>

      <FavoriteNoteDialog
        taskId={taskId}
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
      />
    </>
  );
}
