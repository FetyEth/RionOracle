import { Skeleton } from "@/components/ui/skeleton"
import { Navigation } from "@/components/navigation"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-24">
        <div className="space-y-8">
          {/* Header skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-96" />
          </div>

          {/* Filters skeleton */}
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Feed cards skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-6 space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
