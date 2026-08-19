import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FilterSearchField({
  label = "Szukaj",
  placeholder,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="h-11 rounded-xl bg-white pl-10 shadow-sm transition focus-visible:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
        />
      </div>
    </div>
  );
}

export function CycleFilter({ label, value, options, onChange, disabled = false }) {
  const currentIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const current = options[currentIndex] ?? options[0];

  const cycle = () => {
    if (disabled || options.length <= 1) return;
    const next = options[(currentIndex + 1) % options.length];
    onChange(next.value);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <button
        type="button"
        onClick={cycle}
        disabled={disabled || options.length <= 1}
        className="group flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/70 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
        aria-label={`${label}: ${current?.label ?? ""}. Kliknij, aby zmienić filtr.`}
      >
        <motion.span
          key={current?.value}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.14 }}
          className="min-w-0 flex-1 truncate text-sm font-semibold leading-none text-slate-800 dark:text-slate-100"
        >
          {current?.label}
        </motion.span>
        <span className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
          klik
        </span>
      </button>
    </div>
  );
}

export function PrettySelectFilter({
  label,
  value,
  options,
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white px-3 text-left text-sm font-semibold text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50/70 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-blue-800 dark:hover:bg-blue-950/30 [&>span]:truncate">
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          side="bottom"
          align="start"
          className="rounded-xl border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer rounded-lg text-sm font-medium"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function FilterBar({ search, children, columnsClassName = "grid-cols-2 sm:grid-cols-3 xl:grid-cols-5" }) {
  return (
    <div className="space-y-3">
      {search}
      <div className={`grid items-start gap-3 ${columnsClassName}`}>{children}</div>
    </div>
  );
}