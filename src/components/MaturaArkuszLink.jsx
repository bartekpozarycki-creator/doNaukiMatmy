import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";
import {
  isMaturalneTask,
  formatArkuszDisplayLabel,
  formatArkuszMonthYear,
  arkuszLinkedBadgeClassName,
} from "@/utils/map-db-task";

const badgeBaseClass =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium leading-tight transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

const plainBaseClass =
  "inline-flex items-center gap-1.5 text-sm font-medium leading-tight text-slate-500 transition-colors hover:text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-slate-400 dark:hover:text-blue-400 dark:focus-visible:ring-offset-slate-900";

export default function MaturaArkuszLink({
  task,
  className = "",
  onClick,
  openInNewTab = true,
  linkTarget = "worksheet",
  plain = false,
  monthYearOnly = false,
}) {
  if (!isMaturalneTask(task) || !task.arkusz) return null;

  const label = monthYearOnly
    ? formatArkuszMonthYear(task.arkusz)
    : formatArkuszDisplayLabel(task.arkusz);
  const to =
    linkTarget === "worksheets-list"
      ? `${createPageUrl("Worksheets")}?arkusz=${encodeURIComponent(task.arkusz)}`
      : `${createPageUrl("WorksheetDetails")}?id=${encodeURIComponent(task.arkusz)}`;

  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <Link
      to={to}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      title={
        linkTarget === "worksheets-list"
          ? `Otwórz listę arkuszy z filtrem w nowej karcie: ${label}`
          : `Otwórz arkusz w nowej karcie: ${label}`
      }
      className={cn(
        plain ? plainBaseClass : badgeBaseClass,
        plain ? undefined : arkuszLinkedBadgeClassName(task.level),
        className,
      )}
    >
      {label}
    </Link>
  );
}
