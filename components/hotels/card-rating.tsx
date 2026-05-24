import { Star } from "lucide-react";
import { getGoogleReviews } from "@/lib/reviews";
import { cn } from "@/lib/utils";

/**
 * Compact "[star] 4.3 (512)" Google rating for hotel cards. Async server component
 * that fetches its own rating, so any card can drop it in without threading props.
 * The fetch is the same 24h-cached call the detail pages and homepage carousel use,
 * so this adds no API cost. Renders nothing when there's no rating yet (coming-soon
 * hotels, or if Google returns nothing) so cards stay clean.
 */
export async function CardRating({
    placeId,
    className,
}: {
    placeId?: string;
    className?: string;
}) {
    const data = await getGoogleReviews(placeId);
    if (!data || data.count === 0) return null;

    return (
        <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
            <Star className="fill-gold-500 text-gold-500 size-4 shrink-0" aria-hidden />
            <span className="text-navy-800 font-semibold">{data.rating.toFixed(1)}</span>
            <span className="text-sand-500">({data.count.toLocaleString()})</span>
            <span className="sr-only">
                out of 5, from {data.count.toLocaleString()} Google reviews
            </span>
        </span>
    );
}
