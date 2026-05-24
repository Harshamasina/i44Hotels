import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Five stars with the first round(rating) filled gold. Decorative; the numeric
 * rating text alongside carries the actual value for assistive tech. Lives here
 * (not in hotels/reviews.tsx) so client components can use it without pulling in
 * the server-only reviews module.
 */
export function Stars({ rating, className }: { rating: number; className?: string }) {
    const filled = Math.round(rating);
    return (
        <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                        "size-4",
                        i < filled
                            ? "fill-gold-500 text-gold-500"
                            : "fill-sand-200 text-sand-200",
                    )}
                />
            ))}
        </span>
    );
}
