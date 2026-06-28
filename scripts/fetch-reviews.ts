/**
 * Build-time Google reviews snapshot generator.
 *
 * Runs at build/deploy (see package.json "reviews:fetch"), NOT at request time. It
 * calls the Places API once per operating hotel and writes lib/reviews-snapshot.json,
 * which the app imports and serves with ZERO runtime API calls. This is the whole
 * reason the site can show live Google ratings without billing a paid "Place Details
 * (Atmosphere)" call on every page view: the only Places calls are the handful made
 * here per deploy, which stay inside Google's free monthly tier. Ratings refresh
 * whenever this runs (each build/deploy, or a scheduled rebuild).
 *
 * Resilience: if Google is unreachable or the key is missing, an existing snapshot is
 * left untouched (stale-but-present reviews) and the build still succeeds. Run by
 * hand any time with `npm run reviews:fetch`.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { getOperatingProperties } from "../lib/properties";

// Keep these in sync with lib/reviews.ts. Requesting `reviews` puts the call in the
// most expensive Place Details tier; that is fine here because we make so few of them.
const NEW_FIELD_MASK = "rating,userRatingCount,reviews";
const MIN_RATING = 3; // surface only 4 and 5 star reviews (with text)
const MAX_REVIEWS = 10;

const SNAPSHOT_PATH = join(process.cwd(), "lib", "reviews-snapshot.json");

type GoogleReview = {
    author: string;
    authorUri?: string;
    rating: number;
    text: string;
    relativeTime: string;
    publishedMs?: number;
};

type GoogleReviewsData = {
    rating: number;
    count: number;
    reviews: GoogleReview[];
};

type ReviewsSnapshot = {
    generatedAt: string;
    places: Record<string, GoogleReviewsData>;
};

// Places API (New) response shapes (camelCase).
type NewReview = {
    authorAttribution?: { displayName?: string; uri?: string };
    rating?: number;
    text?: { text?: string };
    originalText?: { text?: string };
    relativePublishTimeDescription?: string;
    publishTime?: string;
};
type NewResponse = { rating?: number; userRatingCount?: number; reviews?: NewReview[] };

// Legacy Place Details shapes (snake_case). Supports reviews_sort=newest.
type LegacyReview = {
    author_name?: string;
    author_url?: string;
    rating?: number;
    text?: string;
    relative_time_description?: string;
    time?: number;
};
type LegacyResponse = {
    status?: string;
    result?: { rating?: number; user_ratings_total?: number; reviews?: LegacyReview[] };
};

/**
 * Minimal .env loader so the script works regardless of Node version (tsx does not
 * auto-load .env). Real process env wins; then .env.local, then .env.
 */
function loadEnv(): void {
    for (const file of [".env.local", ".env"]) {
        const path = join(process.cwd(), file);
        if (!existsSync(path)) continue;
        for (const line of readFileSync(path, "utf8").split("\n")) {
            const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
            if (!match) continue;
            const [, key, rawValue] = match;
            if (key in process.env) continue;
            let value = rawValue;
            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1);
            }
            process.env[key] = value;
        }
    }
}

/** Legacy Place Details with reviews_sort=newest. Null if the legacy API is off. */
async function fetchLegacyNewest(
    placeId: string,
    key: string,
): Promise<GoogleReviewsData | null> {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "rating,user_ratings_total,reviews");
    url.searchParams.set("reviews_sort", "newest");
    url.searchParams.set("key", key);

    const res = await fetch(url.toString());
    if (!res.ok) return null;

    const data = (await res.json()) as LegacyResponse;
    // A non-OK status (e.g. REQUEST_DENIED) still returns HTTP 200, so check status.
    if (data.status !== "OK" || typeof data.result?.rating !== "number") return null;

    const reviews: GoogleReview[] = (data.result.reviews ?? []).map((r) => ({
        author: r.author_name ?? "Google guest",
        authorUri: r.author_url,
        rating: typeof r.rating === "number" ? r.rating : 0,
        text: r.text ?? "",
        relativeTime: r.relative_time_description ?? "",
        publishedMs: typeof r.time === "number" ? r.time * 1000 : 0,
    }));

    return {
        rating: data.result.rating,
        count: data.result.user_ratings_total ?? 0,
        reviews,
    };
}

/** Places API (New): rating, count, and its "most relevant" reviews (max 5). */
async function fetchNewReviews(
    placeId: string,
    key: string,
): Promise<GoogleReviewsData | null> {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
        headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": NEW_FIELD_MASK },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as NewResponse;
    if (typeof data.rating !== "number") return null;

    const reviews: GoogleReview[] = (data.reviews ?? []).map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google guest",
        authorUri: r.authorAttribution?.uri,
        rating: typeof r.rating === "number" ? r.rating : 0,
        text: r.text?.text ?? r.originalText?.text ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "",
        publishedMs: r.publishTime ? Date.parse(r.publishTime) : 0,
    }));

    return { rating: data.rating, count: data.userRatingCount ?? 0, reviews };
}

/** Dedupe (same review can come from both endpoints), then sort newest-first. */
function mergeNewest(...lists: GoogleReview[][]): GoogleReview[] {
    const seen = new Set<string>();
    const out: GoogleReview[] = [];
    for (const r of lists.flat()) {
        const dedupeKey = `${r.author} ${r.text}`.toLowerCase();
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);
        out.push(r);
    }
    return out.sort((a, b) => (b.publishedMs ?? 0) - (a.publishedMs ?? 0));
}

/** Combine both endpoints for one place, filtered to 4+ stars with text, newest-first. */
async function fetchPlace(placeId: string, key: string): Promise<GoogleReviewsData | null> {
    const [legacy, fresh] = await Promise.all([
        fetchLegacyNewest(placeId, key).catch(() => null),
        fetchNewReviews(placeId, key).catch(() => null),
    ]);
    const base = legacy ?? fresh;
    if (!base) return null;

    const reviews = mergeNewest(legacy?.reviews ?? [], fresh?.reviews ?? [])
        .filter((r) => r.rating > MIN_RATING && r.text.trim().length > 0)
        .slice(0, MAX_REVIEWS);

    return { rating: base.rating, count: base.count, reviews };
}

async function main(): Promise<void> {
    loadEnv();
    const key = process.env.GOOGLE_API_KEY;
    const places = getOperatingProperties()
        .map((p) => ({ slug: p.slug, placeId: p.googlePlaceId }))
        .filter((p): p is { slug: string; placeId: string } => Boolean(p.placeId));

    if (!key) {
        console.warn(
            "[reviews] GOOGLE_API_KEY not set; keeping existing snapshot (no fetch).",
        );
        return;
    }

    const snapshot: ReviewsSnapshot = { generatedAt: new Date().toISOString(), places: {} };
    let ok = 0;
    for (const { slug, placeId } of places) {
        try {
            const data = await fetchPlace(placeId, key);
            if (data) {
                snapshot.places[placeId] = data;
                ok++;
                console.log(
                    `[reviews] ${slug}: ${data.rating} (${data.count}), ${data.reviews.length} reviews`,
                );
            } else {
                console.warn(`[reviews] ${slug}: no data returned`);
            }
        } catch (err) {
            console.warn(`[reviews] ${slug}: fetch failed -`, (err as Error).message);
        }
    }

    // Never clobber a good snapshot with nothing (e.g. transient outage / bad key).
    if (ok === 0 && existsSync(SNAPSHOT_PATH)) {
        console.warn("[reviews] 0 places fetched; keeping existing snapshot.");
        return;
    }

    writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 4) + "\n", "utf8");
    console.log(`[reviews] wrote ${ok} place(s) to lib/reviews-snapshot.json`);
}

main().catch((err) => {
    // Do not fail the build on a reviews hiccup; the committed snapshot still serves.
    console.warn("[reviews] snapshot generation skipped:", (err as Error).message);
});
