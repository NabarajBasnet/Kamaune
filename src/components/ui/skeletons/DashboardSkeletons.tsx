import { CardSkeleton, Skeleton, StatCardSkeleton, TableSkeleton, ImageSkeleton } from './index'

// Dashboard stats grid skeleton
export function DashboardStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
            ))}
        </div>
    )
}

// Chart skeleton
export function ChartSkeleton({ height = "h-80" }: { height?: string }) {
    return (
        <CardSkeleton className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-28" />
            </div>

            <div className={`w-full ${height} relative`}>
                {/* Chart bars/lines placeholder */}
                <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className="w-8"
                            style={{ height: `${Math.random() * 60 + 20}%` }}
                        />
                    ))}
                </div>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} className="h-3 w-8" />
                    ))}
                </div>
            </div>
        </CardSkeleton>
    )
}

// Recent activity skeleton
export function RecentActivitySkeleton() {
    return (
        <CardSkeleton className="p-6">
            <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-9 w-20" />
            </div>

            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <Skeleton className="w-10 h-10 rounded-full" />
                        </div>
                        <div className="flex-1">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-1/2 mb-1" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="w-6 h-6 rounded" />
                    </div>
                ))}
            </div>
        </CardSkeleton>
    )
}

// Top products skeleton
export function TopProductsSkeleton() {
    return (
        <CardSkeleton className="p-6">
            <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-9 w-24" />
            </div>

            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <Skeleton className="w-12 h-12 rounded-lg" />
                        </div>
                        <div className="flex-1">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                        <div className="text-right">
                            <Skeleton className="h-5 w-16 mb-1" />
                            <Skeleton className="h-3 w-12" />
                        </div>
                    </div>
                ))}
            </div>
        </CardSkeleton>
    )
}

// Performance metrics skeleton
export function PerformanceMetricsSkeleton() {
    return (
        <CardSkeleton className="p-6">
            <Skeleton className="h-6 w-36 mb-6" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center">
                        <Skeleton className="h-8 w-16 mx-auto mb-2" />
                        <Skeleton className="h-4 w-20 mx-auto mb-1" />
                        <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                ))}
            </div>
        </CardSkeleton>
    )
}

// Campaign overview skeleton
export function CampaignOverviewSkeleton() {
    return (
        <CardSkeleton className="p-6">
            <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-9 w-32" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="text-center p-4 border rounded-lg">
                        <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
                        <Skeleton className="h-5 w-24 mx-auto mb-2" />
                        <Skeleton className="h-7 w-16 mx-auto mb-1" />
                        <Skeleton className="h-3 w-20 mx-auto" />
                    </div>
                ))}
            </div>
        </CardSkeleton>
    )
}

// Full dashboard skeleton
export function DashboardPageSkeleton() {
    return (
        <div className="space-y-8">
            {/* Welcome header */}
            <div className="mb-8">
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Stats cards */}
            <DashboardStatsSkeleton />

            {/* Charts and activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartSkeleton />
                <RecentActivitySkeleton />
            </div>

            {/* Bottom section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TopProductsSkeleton />
                <PerformanceMetricsSkeleton />
            </div>
        </div>
    )
}

// Quick stats skeleton
export function QuickStatsSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} className="p-4 text-center">
                    <Skeleton className="w-8 h-8 rounded mx-auto mb-2" />
                    <Skeleton className="h-6 w-12 mx-auto mb-1" />
                    <Skeleton className="h-3 w-16 mx-auto" />
                </CardSkeleton>
            ))}
        </div>
    )
}