import { Link } from "react-router-dom";
import { ChevronRight, ScrollText } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function CkeRequirementsLink() {
  return (
    <Link
      to={createPageUrl("CkeRequirements")}
      className="inline-flex w-full items-center justify-between gap-3 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md dark:border-blue-900/60 dark:bg-slate-800 dark:text-white dark:hover:border-blue-800 dark:hover:bg-blue-950/40 sm:w-auto sm:justify-start"
    >
      <span className="inline-flex items-center gap-2">
        <ScrollText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        Oficjalne wymagania CKE
      </span>
      <ChevronRight className="h-4 w-4 text-blue-600 dark:text-blue-300" />
    </Link>
  );
}
