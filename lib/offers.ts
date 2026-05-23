/**
 * Offers / promotions data layer. Content is developer-managed (CLAUDE.md §4),
 * so adding a promo is a one-object edit. The Offers page and the Military Travel
 * callout both render from here, so the wording stays in one place.
 *
 * Honesty note: I44 books through each flag's official engine (Wyndham / Choice /
 * Hyatt), so we point guests to the brands' existing military and government
 * rates rather than advertising an I44-run discount we cannot apply at booking.
 */

export type Offer = {
    slug: string;
    title: string;
    /** Who it is for, shown as an eyebrow. */
    audience: string;
    /** One-line summary for cards and the Military Travel callout. */
    summary: string;
    /** Detail paragraphs for the Offers page. */
    body: string[];
    /** Optional offer-specific link (in addition to the standard Book Now). */
    link?: { label: string; href: string };
    /** Surface in featured slots, e.g. the Military Travel callout. */
    featured?: boolean;
};

export const offers: Offer[] = [
    {
        slug: "military-government-rates",
        title: "Military & government rates",
        audience: "Active-duty, veterans & government travelers",
        summary: "Our hotel brands offer special military and government rates. Look for the Military or Government rate when you book, or call the front desk and we will help.",
        body: [
            "Active-duty service members, veterans, and government travelers can take advantage of the military and government rates offered by our hotel brands: Wyndham (Days Inn), Choice (Comfort Inn), and Hyatt (Hyatt Select).",
            "When you book, look for the Military or Government rate on the brand's booking page, and have your eligible ID ready at check-in. Not sure which rate is best for your stay? Call the front desk and we will help you find the best available rate.",
        ],
        link: { label: "Fort Leonard Wood travel", href: "/military-travel" },
        featured: true,
    },
];

export function getOffers(): Offer[] {
    return offers;
}

export function getFeaturedOffer(): Offer | undefined {
    return offers.find((o) => o.featured) ?? offers[0];
}

export function getOfferBySlug(slug: string): Offer | undefined {
    return offers.find((o) => o.slug === slug);
}
