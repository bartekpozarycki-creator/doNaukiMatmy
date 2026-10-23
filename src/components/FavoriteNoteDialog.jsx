import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";
import RichTextNoteEditor from "@/components/RichTextNoteEditor";
import { isBlankNoteHtml, sanitizeNoteHtml } from "@/utils/rich-note";

const propType = () => null;

export default function FavoriteNoteDialog({ taskId, open, onOpenChange }) {
  const { getNote, setNote, isFavorite, addFavorite } = useFavorites();
  const [draft, setDraft] = useState("");

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
    const cleaned = sanitizeNoteHtml(draft);
    setNote(taskId, isBlankNoteHtml(cleaned) ? "" : cleaned);
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
      <DialogContent className="max-w-lg overflow-hidden border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">
            Notatka do zadania
          </DialogTitle>
        </DialogHeader>
        <div className="min-w-0">
          <RichTextNoteEditor value={draft} onChange={setDraft} />
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

FavoriteNoteDialog.propTypes = {
  taskId: propType,
  open: propType,
  onOpenChange: propType,
};
