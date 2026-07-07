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
import { useFavorites } from "@/contexts/FavoritesContext";
import MathNoteEditor from "@/components/MathNoteEditor";

const propType = () => null;

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
    handleOpenChange(false);
  };

  const handleClear = () => {
    if (!taskId) return;
    setNote(taskId, "");
    handleOpenChange(false);
  };

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen) {
      globalThis.mathVirtualKeyboard?.hide?.();
    }
    onOpenChange(nextOpen);
  };

  const handleInteractOutside = (event) => {
    const target = event.detail?.originalEvent?.target ?? event.target;
    if (!(target instanceof Element)) return;
    if (
      target.closest(
        ".ML__keyboard, .MLK__plate, .MLK__backdrop, .MLK__keycap, .ML__popover, .ML__menu, [class*='MLK__'], [class*='ML__keyboard'], math-field",
      )
    ) {
      event.preventDefault();
    }
  };

  if (!taskId) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onInteractOutside={handleInteractOutside}
        onPointerDownOutside={handleInteractOutside}
        onFocusOutside={handleInteractOutside}
        className="max-w-lg border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
      >
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">
            Notatka do zadania
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Zapisz własną notatkę — np. wskazówkę lub skrót rozwiązania. Użyj
            paska symboli, aby wstawiać formuły matematyczne.
          </DialogDescription>
        </DialogHeader>
        <div>
          <MathNoteEditor
            value={draft}
            onChange={setDraft}
            textareaRef={textareaRef}
          />
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
