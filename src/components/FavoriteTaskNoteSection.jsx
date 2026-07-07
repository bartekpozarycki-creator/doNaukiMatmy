import { useState } from "react";
import { Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";
import FavoriteNoteDialog from "@/components/FavoriteNoteDialog";
import MathText from "@/components/MathText";
import { cn } from "@/lib/utils";
import { formatMathNoteLine } from "@/utils/math-note-rendering";

const propType = () => null;

function NotePreview({ text, lineClamp }) {
  const lines = text.split("\n");
  return (
    <div
      className={
        lineClamp
          ? "line-clamp-4 space-y-1 text-sm text-slate-700 dark:text-slate-300"
          : "space-y-1 text-sm text-slate-700 dark:text-slate-300"
      }
    >
      {lines.map((line, index) => (
        <div key={index} className="min-h-[1.25rem]">
          {line.trim() ? <MathText text={formatMathNoteLine(line)} /> : "\u00a0"}
        </div>
      ))}
    </div>
  );
}

NotePreview.propTypes = {
  text: propType,
  lineClamp: propType,
};

export default function FavoriteTaskNoteSection({ taskId, className = "" }) {
  const { getNote, hasNote } = useFavorites();
  const [dialogOpen, setDialogOpen] = useState(false);
  const note = getNote(taskId);

  return (
    <div
      className={cn(
        "mt-4 border-t border-slate-100 pt-4 dark:border-slate-700",
        className,
      )}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {hasNote(taskId) ? (
        <NotePreview text={note} lineClamp />
      ) : (
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          Brak notatki do tego zadania.
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setDialogOpen(true)}
        className="mt-6 dark:border-slate-600"
      >
        <Pin className="mr-2 h-4 w-4" />
        {hasNote(taskId) ? "Edytuj notatkę" : "Dodaj notatkę"}
      </Button>

      <FavoriteNoteDialog
        taskId={taskId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

FavoriteTaskNoteSection.propTypes = {
  taskId: propType,
  className: propType,
};
