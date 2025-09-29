import { cn } from '@/lib/utils'

// Base skeleton component
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
                className
            )}
            {...props}
        />
    )
}

// Card skeleton
export function CardSkeleton({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("rounded-lg border bg-white dark:bg-gray-800 shadow-sm", className)} {...props}>
            {children}
        </div>
    )
}

// Text skeletons
export function TextSkeleton({ lines = 1, className }: { lines?: number; className?: string }) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        "h-4",
                        i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
                    )}
                />
            ))}
        </div>
    )
}

// Avatar skeleton
export function AvatarSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-16 h-16"
    }

    return <Skeleton className={cn("rounded-full", sizeClasses[size])} />
}

// Button skeleton
export function ButtonSkeleton({ size = "md", variant = "default" }: {
    size?: "sm" | "md" | "lg"
    variant?: "default" | "outline" | "ghost"
}) {
    const sizeClasses = {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6"
    }

    return <Skeleton className={cn("rounded-md", sizeClasses[size])} />
}

// Input skeleton
export function InputSkeleton({ className }: { className?: string }) {
    return <Skeleton className={cn("h-10 w-full rounded-md", className)} />
}

// Image skeleton
export function ImageSkeleton({
    aspectRatio = "video",
    className
}: {
    aspectRatio?: "square" | "video" | "portrait"
    className?: string
}) {
    const aspectClasses = {
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-[3/4]"
    }

    return (
        <Skeleton
            className={cn(
                "w-full rounded-md",
                aspectClasses[aspectRatio],
                className
            )}
        />
    )
}

// Stats card skeleton
export function StatCardSkeleton() {
    return (
        <CardSkeleton className="p-6">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="w-8 h-8 rounded" />
            </div>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-20" />
        </CardSkeleton>
    )
}

// Table skeleton
export function TableSkeleton({
    rows = 5,
    columns = 4,
    showHeader = true
}: {
    rows?: number
    columns?: number
    showHeader?: boolean
}) {
    return (
        <div className="w-full">
            {showHeader && (
                <div className="flex gap-4 p-4 border-b">
                    {Array.from({ length: columns }).map((_, i) => (
                        <Skeleton key={i} className="h-4 flex-1" />
                    ))}
                </div>
            )}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-700">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton
                            key={colIndex}
                            className={cn(
                                "h-4",
                                colIndex === 0 ? "w-1/4" : "flex-1"
                            )}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

// List item skeleton
export function ListItemSkeleton({ showAvatar = false }: { showAvatar?: boolean }) {
    return (
        <div className="flex items-center gap-4 p-4">
            {showAvatar && <AvatarSkeleton />}
            <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            <div className="flex gap-2">
                <ButtonSkeleton size="sm" />
                <ButtonSkeleton size="sm" />
            </div>
        </div>
    )
}

// Dashboard stat grid skeleton
export function DashboardStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
            ))}
        </div>
    )
}

// Navigation skeleton
export function NavigationSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-4 flex-1" />
                </div>
            ))}
        </div>
    )
}