import { useState } from "react";
import { Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";
import FavoriteNoteDialog from "@/components/FavoriteNoteDialog";
import { cn } from "@/lib/utils";
import {
  looksLikeRichNoteHtml,
  sanitizeNoteHtml,
} from "@/utils/rich-note";

const propType = () => null;

function NotePreview({ text, lineClamp }) {
  if (looksLikeRichNoteHtml(text)) {
    return (
      <div
        className={cn(
          "rich-note-preview text-sm leading-relaxed text-slate-700 dark:text-slate-300 [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_u]:underline [&_s]:line-through [&_strike]:line-through",
          lineClamp && "line-clamp-4",
        )}
        dangerouslySetInnerHTML={{ __html: sanitizeNoteHtml(text) }}
      />
    );
  }

  return (
    <div
      className={cn(
        "whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300",
        lineClamp && "line-clamp-4",
      )}
    >
      {text}
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
