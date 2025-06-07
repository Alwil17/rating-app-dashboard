import { cn } from "@/lib/utils"

function LegacySkeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

// Optionally export if still needed elsewhere
// export { LegacySkeleton }

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: Readonly<SkeletonProps>) {
  return (
    <div
      className={cn(
        "h-5 w-full rounded-md bg-primary/10 animate-pulse",
        className
      )}
    />
  )
}

interface CardSkeletonProps {
  className?: string
}

export function CardSkeleton({ className }: Readonly<CardSkeletonProps>) {
  return (
    <div className={cn("rounded-lg border p-4 space-y-4", className)}>
      <Skeleton className="h-8 w-1/2" />
      <div className="space-y-2">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="border rounded-md">
      <div className="border-b p-4 bg-muted/5">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      <div className="p-4 space-y-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
      </div>
    </div>
  )
}
