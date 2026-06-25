import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFavorites } from "@/contexts/FavoritesContext";
import MathInsertToolbar from "@/components/MathInsertToolbar";
import MathText from "@/components/MathText";

function NotePreview({ text }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
      {lines.map((line, index) => (
        <div key={index} className="min-h-[1.25rem]">
          {line.trim() ? <MathText text={line} /> : "\u00a0"}
        </div>
      ))}
    </div>
  );
}

export default function FavoriteNoteDialog({ taskId, open, onOpenChange }) {
  const { getNote, setNote, isFavorite, addFavorite } = useFavorites();
  const [draft, setDraft] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (open && taskId) {
      setDraft(getNote(taskId));
    }
  }, [open, taskId, getNote]);

  const handleSave = () => {
    if (!taskId) return;
    if (!isFavorite(taskId)) {
      addFavorite(taskId);
    }
    setNote(taskId, draft);
    onOpenChange(false);
  };

  const handleClear = () => {
    if (!taskId) return;
    setNote(taskId, "");
    onOpenChange(false);
  };

  if (!taskId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">
            Notatka do zadania
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Zapisz własną notatkę — np. wskazówkę lub skrót rozwiązania. Użyj
            paska symboli, aby wstawiać formuły matematyczne.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <MathInsertToolbar
            targetRef={textareaRef}
            value={draft}
            onChange={setDraft}
          />
          <Textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Twoja notatka…"
            rows={5}
            className="resize-y border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
          />
          {draft.trim() ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Podgląd
              </p>
              <NotePreview text={draft} />
            </div>
          ) : null}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          {getNote(taskId) ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="border-slate-200 text-slate-700 dark:border-slate-600 dark:text-slate-300"
            >
              Usuń notatkę
            </Button>
          ) : null}
          <Button
            type="button"
            onClick={handleSave}
            className="bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500"
          >
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
