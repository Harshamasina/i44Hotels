import { googlePlaceUrl, type GoogleReviewsData } from "@/lib/reviews";
import { Stars } from "@/components/ui/stars";

export { Stars };

/** Compact "4.4 (1,002 reviews)" line for the title block. */
export function RatingInline({ data }: { data: GoogleReviewsData }) {
    return (
        <span className="inline-flex items-center gap-2 text-sm">
            <Stars rating={data.rating} />
            <span className="text-navy-800 font-semibold">{data.rating.toFixed(1)}</span>
            <span className="text-sand-600">
                ({data.count.toLocaleString()} Google reviews)
            </span>
        </span>
    );
}

/** Full reviews section: rating summary + up to five review cards, with Google attribution. */
export function ReviewsSection({
    data,
    placeId,
}: {
    data: GoogleReviewsData | null;
    placeId?: string;
}) {
    if (!data || data.count === 0) return null;

    return (
        <section aria-labelledby="reviews-heading">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h2
                        id="reviews-heading"
                        className="text-navy-800 font-serif text-2xl sm:text-3xl"
                    >
                        Guest reviews
                    </h2>
                    <div className="mt-2 flex items-center gap-3">
                        <span className="text-navy-900 text-3xl font-semibold">
                            {data.rating.toFixed(1)}
                        </span>
                        <span>
                            <Stars rating={data.rating} />
                            <span className="text-sand-600 mt-0.5 block text-sm">
                                {data.count.toLocaleString()} reviews on Google
                            </span>
                        </span>
                    </div>
                </div>
                {placeId && (
                    <a
                        href={googlePlaceUrl(placeId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-700 hover:text-gold-600 text-sm font-semibold underline underline-offset-2"
                    >
                        See all reviews on Google
                    </a>
                )}
            </div>

            {data.reviews.length > 0 && (
                <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                    {data.reviews.map((r, i) => (
                        <li
                            key={i}
                            className="border-sand-200 flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
                        >
                            <Stars rating={r.rating} />
                            {r.text && (
                                <p className="text-sand-700 mt-3 line-clamp-5 text-sm leading-relaxed">
                                    {r.text}
                                </p>
                            )}
                            <div className="mt-4 flex items-center gap-3 pt-1">
                                <span className="bg-gold-100 text-gold-700 inline-flex size-9 items-center justify-center rounded-full font-serif text-sm font-semibold">
                                    {r.author.charAt(0).toUpperCase()}
                                </span>
                                <span className="min-w-0">
                                    <span className="text-navy-800 block truncate text-sm font-semibold">
                                        {r.author}
                                    </span>
                                    <span className="text-sand-500 block text-xs">
                                        {r.relativeTime}
                                    </span>
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <p className="text-sand-500 mt-4 text-xs">Reviews provided by Google.</p>
        </section>
    );
}
