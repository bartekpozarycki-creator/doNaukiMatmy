import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function ShimmerBlock({ className }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-slate-200 dark:bg-slate-700",
        className
      )}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/20"
        aria-hidden
      />
    </div>
  );
}

export default function QuestionCardSkeleton() {
  return (
    <Card className="border-0 bg-white dark:bg-slate-800">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <ShimmerBlock className="h-6 w-[78%]" />
            <ShimmerBlock className="h-4 w-[38%]" />
          </div>
          <ShimmerBlock className="h-10 w-10 shrink-0 rounded-lg" />
        </div>
        <ShimmerBlock className="mb-4 h-4 w-full" />
        <ShimmerBlock className="mb-4 h-4 w-[88%]" />
        <div className="flex flex-wrap gap-2">
          <ShimmerBlock className="h-6 w-28 rounded-full" />
          <ShimmerBlock className="h-6 w-24 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
