import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function ShimmerBlock({ className }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-slate-200 dark:bg-slate-700",
        className,
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
    <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-700/80 dark:bg-slate-800">
      <ShimmerBlock className="h-1 w-full rounded-none" />
      <CardContent className="p-0">
        <div className="flex">
          <div className="flex w-14 shrink-0 flex-col items-center gap-2 border-r border-slate-100 px-2 py-5 dark:border-slate-700/80 sm:w-16 sm:px-3">
            <ShimmerBlock className="h-10 w-10 rounded-xl" />
            <ShimmerBlock className="h-4 w-6" />
          </div>
          <div className="min-w-0 flex-1 space-y-3 p-4 sm:p-5">
            <div className="flex gap-2">
              <ShimmerBlock className="h-6 w-28 rounded-full" />
              <ShimmerBlock className="h-6 w-24 rounded-full" />
            </div>
            <ShimmerBlock className="h-6 w-[82%]" />
            <ShimmerBlock className="h-4 w-[46%]" />
            <ShimmerBlock className="h-4 w-full" />
            <ShimmerBlock className="h-4 w-[90%]" />
            <div className="flex gap-2 pt-2">
              <ShimmerBlock className="h-7 w-24 rounded-full" />
              <ShimmerBlock className="h-7 w-28 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
