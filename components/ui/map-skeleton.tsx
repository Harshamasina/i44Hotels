import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Placeholder shown over a map container until MapLibre has loaded and rendered.
 * Warm shimmer + a gently bouncing pin so the wait reads as intentional, on-brand,
 * and friendly. Decorative (the map wrapper carries the real aria-label).
 */
export function MapSkeleton({ className }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={cn(
                "absolute inset-0 flex items-center justify-center overflow-hidden",
                className,
            )}
        >
            <div className="from-sand-100 via-sand-50 to-sand-200 absolute inset-0 animate-pulse bg-gradient-to-br" />
            <div className="text-sand-600 relative flex flex-col items-center gap-2">
                <MapPin className="text-gold-500 size-7 animate-bounce" />
                <span className="text-xs font-medium tracking-wide">Loading map…</span>
            </div>
        </div>
    );
}
