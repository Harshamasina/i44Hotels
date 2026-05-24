import "server-only";

import { getOperatingProperties, type Brand } from "./properties";

/**
 * Live Google reviews via the Places API (New). We request only the rating,
 * total count, and the (max 5) "most relevant" reviews Google returns. Results
 * are cached for a day (revalidate) to stay well within the free tier and to
 * avoid storing review content long-term (per Google's terms).
 */

export type GoogleReview = {
    author: string;
    authorUri?: string;
    rating: number;
    text: string;
    relativeTime: string;
};

export type GoogleReviewsData = {
    rating: number;
    count: number;
    reviews: GoogleReview[];
};

type RawReview = {
    authorAttribution?: { displayName?: string; uri?: string };
    rating?: number;
    text?: { text?: string };
    originalText?: { text?: string };
    relativePublishTimeDescription?: string;
};

type RawResponse = {
    rating?: number;
    userRatingCount?: number;
    reviews?: RawReview[];
};

const FIELD_MASK = "rating,userRatingCount,reviews";

export async function getGoogleReviews(
    placeId: string | undefined,
): Promise<GoogleReviewsData | null> {
    const key = process.env.GOOGLE_API_KEY;
    if (!placeId || !key) return null;

    try {
        const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
            headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": FIELD_MASK },
            next: { revalidate: 86400 },
        });
        if (!res.ok) return null;

        const data = (await res.json()) as RawResponse;
        if (typeof data.rating !== "number") return null;

        const reviews: GoogleReview[] = (data.reviews ?? []).slice(0, 5).map((r) => ({
            author: r.authorAttribution?.displayName ?? "Google guest",
            authorUri: r.authorAttribution?.uri,
            rating: typeof r.rating === "number" ? r.rating : 0,
            text: r.text?.text ?? r.originalText?.text ?? "",
            relativeTime: r.relativePublishTimeDescription ?? "",
        }));

        return { rating: data.rating, count: data.userRatingCount ?? 0, reviews };
    } catch {
        return null;
    }
}

/** Public Google Maps link to a place's listing (for the "see all reviews" attribution). */
export function googlePlaceUrl(placeId: string): string {
    return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
}

/** A pooled homepage review, tagged with the hotel it came from. */
export type PooledReview = GoogleReview & {
    hotelName: string;
    hotelSlug: string;
    hotelBrand: Brand;
    /** That hotel's overall Google rating + total count (so each card can show it). */
    hotelRating: number;
    hotelReviewCount: number;
};

export type PooledReviews = {
    reviews: PooledReview[];
    /** Portfolio average across operating hotels, weighted by each hotel's count. */
    averageRating: number;
    totalCount: number;
};

/**
 * Reviews across all operating hotels for the homepage carousel. Keeps only
 * reviews at or above `minRating` (with text), then *round-robins across hotels*
 * so the carousel rotates through every property in turn (review 1 = hotel A,
 * 2 = hotel B, 3 = hotel C, then back to A...) rather than grouping by hotel.
 * Reuses getGoogleReviews, so its 24h cache is shared with the hotel pages: no
 * extra API cost.
 */
export async function getPooledReviews(minRating = 4): Promise<PooledReviews> {
    const properties = getOperatingProperties().filter((p) => p.googlePlaceId);
    const results = await Promise.all(
        properties.map(async (p) => ({ p, data: await getGoogleReviews(p.googlePlaceId) })),
    );

    // One filtered, hotel-tagged list per hotel (keeps Google's relevance order).
    const perHotel: PooledReview[][] = [];
    let weightedSum = 0;
    let totalCount = 0;

    for (const { p, data } of results) {
        if (!data) continue;
        weightedSum += data.rating * data.count;
        totalCount += data.count;
        const list = data.reviews
            .filter((r) => r.rating >= minRating && r.text.trim().length > 0)
            .map((r) => ({
                ...r,
                hotelName: p.shortName,
                hotelSlug: p.slug,
                hotelBrand: p.brand,
                hotelRating: data.rating,
                hotelReviewCount: data.count,
            }));
        if (list.length > 0) perHotel.push(list);
    }

    const reviews: PooledReview[] = [];
    for (let i = 0; perHotel.some((list) => i < list.length); i++) {
        for (const list of perHotel) {
            if (i < list.length) reviews.push(list[i]);
        }
    }

    const averageRating = totalCount > 0 ? weightedSum / totalCount : 0;
    return { reviews, averageRating, totalCount };
}
