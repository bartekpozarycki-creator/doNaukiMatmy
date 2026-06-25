import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { GripHorizontal, Minus, Plus, X } from "lucide-react";

const DEFAULT_PANEL_SIZE = { width: 720, height: 480 };

export default function PdfFloatingPanel({
  open,
  onClose,
  title,
  titleSuffix = "",
  iframeSrc,
  iframeKey,
  iframeTitle,
  loading = false,
  loadingLabel = "Ładowanie…",
  emptyMessage,
  emptyHint,
  headerClassName = "bg-gradient-to-r from-blue-500 to-blue-600",
  initialWidth = DEFAULT_PANEL_SIZE.width,
  initialHeight = DEFAULT_PANEL_SIZE.height,
}) {
  const dragControls = useDragControls();
  const resizeRef = useRef(null);
  const [panelSize, setPanelSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });

  useEffect(() => {
    if (open) {
      setPanelSize({ width: initialWidth, height: initialHeight });
    }
  }, [open, initialWidth, initialHeight]);

  useEffect(() => {
    const onMove = (e) => {
      if (!resizeRef.current) return;
      const { startX, startY, startW, startH } = resizeRef.current;
      setPanelSize({
        width: Math.min(
          Math.max(280, startW + e.clientX - startX),
          window.innerWidth - 16,
        ),
        height: Math.min(
          Math.max(180, startH + e.clientY - startY),
          window.innerHeight - 48,
        ),
      });
    };
    const onUp = () => {
      resizeRef.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const startPanelResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: panelSize.width,
      startH: panelSize.height,
    };
  };

  const adjustPanelSize = (deltaW, deltaH) => {
    setPanelSize((prev) => ({
      width: Math.min(
        Math.max(280, prev.width + deltaW),
        window.innerWidth - 16,
      ),
      height: Math.min(
        Math.max(180, prev.height + deltaH),
        window.innerHeight - 48,
      ),
    }));
  };

  const displayTitle = titleSuffix ? `${title}${titleSuffix}` : title;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="pdf-floating-panel"
          role="dialog"
          aria-label={displayTitle}
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          style={{
            width: panelSize.width,
            height: panelSize.height,
          }}
          className="fixed left-4 top-20 z-50 flex max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-600 dark:bg-slate-900 sm:left-[max(1rem,calc(50%-22rem))] sm:top-24"
        >
          <div
            onPointerDown={(e) => dragControls.start(e)}
            className={`flex cursor-grab items-center gap-1 border-b border-slate-200 px-2 py-2 active:cursor-grabbing dark:border-slate-700 sm:gap-2 sm:px-3 sm:py-2.5 ${headerClassName}`}
          >
            <GripHorizontal className="h-4 w-4 shrink-0 text-white/90" />
            <p className="min-w-0 flex-1 text-xs font-semibold text-white sm:text-sm">
              {displayTitle}
            </p>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => adjustPanelSize(-64, -48)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/90 hover:bg-white/20"
              aria-label="Pomniejsz okno"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => adjustPanelSize(64, 48)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/90 hover:bg-white/20"
              aria-label="Powiększ okno"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={onClose}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/90 hover:bg-white/20 sm:h-8 sm:w-8"
              aria-label="Zamknij"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950">
            {loading ? (
              <div className="flex h-full min-h-[180px] items-center justify-center p-8 text-sm text-slate-500 dark:text-slate-400">
                {loadingLabel}
              </div>
            ) : iframeSrc ? (
              <iframe
                key={iframeKey}
                src={iframeSrc}
                title={iframeTitle || title}
                className="h-full w-full min-h-[180px]"
              />
            ) : (
              <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-3 p-8 text-center text-sm text-slate-600 dark:text-slate-300">
                <p>{emptyMessage}</p>
                {emptyHint ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {emptyHint}
                  </p>
                ) : null}
              </div>
            )}
            <button
              type="button"
              aria-label="Zmień rozmiar okna"
              onPointerDown={startPanelResize}
              className="absolute bottom-0 right-0 z-10 flex h-6 w-6 cursor-se-resize items-center justify-center rounded-tl-md border border-slate-200 bg-white/90 text-slate-500 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-300"
            >
              <GripHorizontal className="h-3 w-3 -rotate-45" />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
