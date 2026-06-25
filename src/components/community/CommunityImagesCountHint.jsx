import { Images } from "lucide-react";
import {
  contentImageCount,
  formatImagesCountLabel,
} from "@/utils/community-images";

export default function CommunityImagesCountHint({
  record,
  className = "",
}) {
  const count = contentImageCount(record);
  const label = formatImagesCountLabel(count);
  if (!label) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/90 px-2.5 py-1 text-xs font-medium text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 ${className}`.trim()}
    >
      <Images className="h-3.5 w-3.5 shrink-0 opacity-80" />
      {label}
    </span>
  );
}
