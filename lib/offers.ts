/**
 * Offers / promotions data layer. Content is developer-managed (CLAUDE.md §4),
 * so adding a promo is a one-object edit. The Offers page and the Military Travel
 * callout both render from here, so the wording stays in one place.
 *
 * Honesty note: I44 books through each flag's official engine (Wyndham / Choice /
 * Hyatt), so we point guests to the brands' existing loyalty, member, and
 * military/government rates rather than advertising an I44-run discount we cannot
 * apply at booking. We deliberately do NOT quote specific percentages or dollar
 * amounts: the brands set those, and they change. Keep the framing to "look for
 * this rate when you book" and "have your eligible ID ready at check-in".
 *
 * Program logos: the `logo` paths point at on-palette SVG placeholders in
 * /public/brand/programs. Replace each file with an officially-licensed program
 * logo at the SAME path and it drops straight in. Offers without a `logo` fall
 * back to the lucide `Icon`.
 */

import { BadgePercent, ShieldCheck, Star, type LucideIcon } from "lucide-react";

export type Offer = {
    slug: string;
    title: string;
    /** Who it is for, shown as an eyebrow. */
    audience: string;
    /** Which hotel(s) the offer applies to, shown as a small tag. */
    appliesTo: string;
    /** One-line summary for cards and the Military Travel callout. */
    summary: string;
    /** Detail paragraphs for the Offers page. */
    body: string[];
    /** Program logo (officially-licensed asset; placeholder until supplied). */
    logo?: string;
    /** Fallback icon when there is no program logo. */
    Icon: LucideIcon;
    /** Optional offer-specific link (in addition to the standard Book Now). */
    link?: { label: string; href: string };
    /** Surface in featured slots, e.g. the Military Travel callout and the Offers hero. */
    featured?: boolean;
};

export const offers: Offer[] = [
    {
        slug: "military-government-rates",
        title: "Military & government rates",
        audience: "Active-duty, veterans & government travelers",
        appliesTo: "All I44 Hotels",
        summary:
            "Our hotel brands offer special military and government rates. Look for the Military or Government rate when you book, or call the front desk and we will help.",
        body: [
            "Active-duty service members, veterans, and government travelers can take advantage of the military and government rates offered by our hotel brands: Wyndham (Days Inn), Choice (Comfort Inn), and Hyatt (Hyatt Select).",
            "When you book, look for the Military or Government rate on the brand's booking page, and have your eligible ID ready at check-in. Not sure which rate is best for your stay? Call the front desk and we will help you find the best available rate.",
        ],
        // Featured visual is the US flag photo (not a single program logo).
        logo: "/brand/flags/us_flag.jpg",
        Icon: ShieldCheck,
        link: { label: "Fort Leonard Wood travel", href: "/military-travel" },
        featured: true,
    },
    {
        slug: "wyndham-rewards",
        title: "Wyndham Rewards",
        audience: "Days Inn guests",
        appliesTo: "Days Inn St. Robert",
        summary:
            "Join Wyndham Rewards free and earn points on every stay at our Days Inn, plus access member-only rates when you book direct with Wyndham.",
        body: [
            "Days Inn is a Wyndham brand, so stays at our Days Inn St. Robert earn Wyndham Rewards points you can redeem for free nights across thousands of hotels.",
            "Membership is free. Sign up with Wyndham, then select the member rate on the Wyndham booking page when you reserve your room, and add your member number so your stay earns points.",
        ],
        logo: "/brand/flags/wyndham.png",
        Icon: Star,
    },
    {
        slug: "choice-privileges",
        title: "Choice Privileges",
        audience: "Comfort Inn guests",
        appliesTo: "Comfort Inn St. Robert & Sullivan",
        summary:
            "Join Choice Privileges free and earn points at both of our Comfort Inn hotels, with member rates when you book direct with Choice.",
        body: [
            "Both of our Comfort Inn hotels, in St. Robert and Sullivan, are Choice Hotels properties, so your stays earn Choice Privileges points toward free nights and rewards.",
            "Membership is free. Join Choice Privileges, then choose the member rate on the Choice booking page and add your member number when you reserve.",
        ],
        logo: "/brand/flags/choice.png",
        Icon: Star,
    },
    {
        slug: "world-of-hyatt",
        title: "World of Hyatt",
        audience: "Hyatt Select guests",
        appliesTo: "Hyatt Select St. Robert (coming soon)",
        summary:
            "Our coming-soon Hyatt Select will participate in World of Hyatt, so you can earn and redeem points once it opens.",
        body: [
            "Hyatt Select St. Robert is on the way, and as a Hyatt brand it will participate in the World of Hyatt program once it opens.",
            "Membership is free. Join World of Hyatt now so you are ready to earn points on your first stay, and watch this page for the opening date.",
        ],
        logo: "/brand/flags/world-of-hyatt.png",
        Icon: Star,
    },
    {
        slug: "aaa-rate",
        title: "AAA member rate",
        audience: "AAA / CAA members",
        appliesTo: "All I44 Hotels",
        summary:
            "AAA and CAA members can book the AAA rate on our brands' booking pages. Select it when you reserve and show your card at check-in.",
        body: [
            "Our Wyndham, Choice, and Hyatt brands all offer a AAA / CAA member rate on eligible rooms.",
            "Select the AAA rate when you book on the brand's booking page, and have your valid membership card ready at check-in.",
        ],
        Icon: BadgePercent,
        logo: "/brand/flags/aaa.svg",
    },
    {
        slug: "aarp-rate",
        title: "AARP & 50+ rate",
        audience: "AARP members and travelers 50+",
        appliesTo: "All I44 Hotels",
        summary:
            "AARP members and guests 50 and older can look for the AARP or senior rate on our brands' booking pages.",
        body: [
            "Our hotel brands offer an AARP member rate and, on many rooms, a senior rate for travelers 50 and older.",
            "Choose the AARP or senior rate when you book on the brand's booking page, and bring your membership or a valid ID to check-in.",
        ],
        Icon: BadgePercent,
        logo: "/brand/flags/AARP.png",
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
