import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function buildPaginationItems(currentPage, totalPages) {
  if (totalPages <= 1) return [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({
      type: "page",
      value: i + 1,
    }));
  }

  const items = [];
  const seen = new Set();

  const addPage = (page) => {
    if (page < 1 || page > totalPages || seen.has(page)) return;
    seen.add(page);
    items.push({ type: "page", value: page });
  };

  addPage(1);

  if (currentPage > 3) {
    items.push({ type: "ellipsis", key: "start" });
  }

  for (
    let page = Math.max(2, currentPage - 1);
    page <= Math.min(totalPages - 1, currentPage + 1);
    page += 1
  ) {
    addPage(page);
  }

  if (currentPage < totalPages - 2) {
    items.push({ type: "ellipsis", key: "end" });
  }

  addPage(totalPages);
  return items;
}

export default function TaskListPagination({
  currentPage,
  totalPages,
  onPageChange,
  ariaLabel = "Paginacja listy",
}) {
  if (totalPages <= 1) return null;

  const items = buildPaginationItems(currentPage, totalPages);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1.5 pt-2"
      aria-label={ariaLabel}
    >
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 dark:border-slate-600 dark:bg-slate-800"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Poprzednia sekcja"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {items.map((item) =>
        item.type === "ellipsis" ? (
          <span
            key={item.key}
            className="px-1 text-sm text-slate-400 dark:text-slate-500"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Button
            key={item.value}
            type="button"
            variant={item.value === currentPage ? "default" : "outline"}
            size="sm"
            className={`min-w-9 h-9 px-2 ${
              item.value === currentPage
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            }`}
            onClick={() => onPageChange(item.value)}
            aria-label={`Sekcja ${item.value}`}
            aria-current={item.value === currentPage ? "page" : undefined}
          >
            {item.value}
          </Button>
        ),
      )}

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 dark:border-slate-600 dark:bg-slate-800"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Następna sekcja"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
