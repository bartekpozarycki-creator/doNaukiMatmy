import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePageActionsContext } from "@/contexts/PageActionsContext";

export default function PageActionsFab() {
  const { actions } = usePageActionsContext();
  const [open, setOpen] = useState(false);

  const visibleActions = actions.filter((item) => !item.hidden);

  if (visibleActions.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-4 z-[60] sm:right-6">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <motion.button
            type="button"
            aria-label="Dodatkowe opcje"
            aria-expanded={open}
            whileTap={{ scale: 0.94 }}
            className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-lg transition-shadow hover:shadow-xl dark:border-slate-600 dark:bg-slate-800 dark:text-white"
          >
            <MoreHorizontal className="h-5 w-5" />
          </motion.button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          sideOffset={12}
          className="pointer-events-auto w-64 p-2 dark:border-slate-700 dark:bg-slate-900"
        >
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Opcje
          </p>
          <ul className="space-y-1">
            {visibleActions.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled={item.disabled}
                    onClick={() => {
                      item.onClick?.();
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-100 dark:hover:bg-slate-800"
                  >
                    {Icon ? (
                      <Icon className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    ) : null}
                    <span className="min-w-0 flex-1">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
