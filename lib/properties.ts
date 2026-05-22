import type { AmenityKey } from "./amenities";

/**
 * Property data layer (Phase 2). Source of truth: PROPERTIES.md. Every component
 * that shows hotel info reads from here, so adding a property is a one-object edit.
 *
 * Honesty note: amenities are PROVISIONAL (based on brand norms) and marked TODO;
 * addresses, room types, and photos are intentionally empty until the owner
 * provides them. Booking URLs are TBD (Phase 11).
 */

export type Brand = "Days Inn" | "Comfort Inn" | "Hyatt Select";
export type BrandParent = "Wyndham" | "Choice" | "Hyatt";
export type Tier = "economy" | "midscale" | "upscale";
export type PropertyStatus = "operating" | "coming-soon";

export type PhotoCategory =
    | "exterior"
    | "lobby"
    | "room"
    | "breakfast"
    | "pool"
    | "fitness"
    | "amenity"
    | "nearby";

export type PropertyPhoto = {
    category: PhotoCategory;
    src: string;
    alt: string;
};

export type RoomType = {
    name: string;
    sleeps?: number;
    description?: string;
    features?: string[];
};

export type Address = {
    street: string;
    zip: string;
    lat: number;
    lng: number;
};

export type Policies = {
    pets?: string;
    parking?: string;
    checkIn?: string;
    checkOut?: string;
};

export type Property = {
    slug: string;
    name: string;
    /** Short label for nav, cards, breadcrumbs. */
    shortName: string;
    brand: Brand;
    brandParent: BrandParent;
    tier: Tier;
    status: PropertyStatus;
    city: string;
    state: string;
    phone?: string;
    /** Sits in the Fort Leonard Wood gateway area (St. Robert / Waynesville). */
    nearFLW: boolean;
    /** Drive time to the FLW gates, when known (TODO: confirm). */
    distanceToFLWMinutes?: number;
    /** Per-property deep link to the flag's official booking engine (TBD, Phase 11). */
    bookingUrl?: string;
    address?: Address;
    /** PROVISIONAL until confirmed per property (see note above). */
    amenities: AmenityKey[];
    roomTypes: RoomType[];
    photos: PropertyPhoto[];
    policies?: Policies;
    nearbyAttractions?: string[];
};

export const properties: Property[] = [
    {
        slug: "days-inn-st-robert",
        name: "Days Inn by Wyndham St. Robert / Ft. Leonard Wood",
        shortName: "Days Inn, St. Robert",
        brand: "Days Inn",
        brandParent: "Wyndham",
        tier: "economy",
        status: "operating",
        city: "St. Robert",
        state: "MO",
        phone: "573-336-5556",
        nearFLW: true,
        // TODO: confirm amenities from the Wyndham property page.
        amenities: ["breakfast", "coffee", "wifi", "parking", "petFriendly"],
        roomTypes: [], // TODO: add room types
        photos: [], // TODO: add photography
    },
    {
        slug: "comfort-inn-st-robert",
        name: "Comfort Inn St. Robert / Fort Leonard Wood",
        shortName: "Comfort Inn, St. Robert",
        brand: "Comfort Inn",
        brandParent: "Choice",
        tier: "midscale",
        status: "operating",
        city: "St. Robert",
        state: "MO",
        phone: "573-336-3553",
        nearFLW: true,
        // TODO: confirm amenities from the Choice property page.
        amenities: [
            "breakfast",
            "pool",
            "fitness",
            "coffee",
            "wifi",
            "parking",
            "petFriendly",
        ],
        roomTypes: [], // TODO
        photos: [], // TODO
    },
    {
        slug: "comfort-inn-sullivan",
        name: "Comfort Inn Sullivan",
        shortName: "Comfort Inn, Sullivan",
        brand: "Comfort Inn",
        brandParent: "Choice",
        tier: "midscale",
        status: "operating",
        city: "Sullivan",
        state: "MO",
        phone: "573-468-7800",
        nearFLW: false,
        // TODO: confirm amenities from the Choice property page.
        amenities: [
            "breakfast",
            "pool",
            "fitness",
            "coffee",
            "wifi",
            "parking",
            "petFriendly",
        ],
        roomTypes: [], // TODO
        photos: [], // TODO
    },
    {
        slug: "hyatt-select-st-robert",
        name: "Hyatt Select St. Robert",
        shortName: "Hyatt Select, St. Robert",
        brand: "Hyatt Select",
        brandParent: "Hyatt",
        tier: "upscale",
        status: "coming-soon",
        city: "St. Robert",
        state: "MO",
        nearFLW: true,
        // TODO: confirm amenities once the property opens.
        amenities: ["breakfast", "pool", "fitness", "coffee", "wifi", "parking"],
        roomTypes: [], // TODO
        photos: [], // TODO
    },
];

export function getAllProperties(): Property[] {
    return properties;
}

export function getOperatingProperties(): Property[] {
    return properties.filter((p) => p.status === "operating");
}

export function getPropertyBySlug(slug: string): Property | undefined {
    return properties.find((p) => p.slug === slug);
}

/** Properties sorted for the Fort Leonard Wood page: near-base first, then by drive time. */
export function getNearestToFLW(): Property[] {
    return [...properties].sort((a, b) => {
        if (a.nearFLW !== b.nearFLW) return a.nearFLW ? -1 : 1;
        return (
            (a.distanceToFLWMinutes ?? Infinity) - (b.distanceToFLWMinutes ?? Infinity)
        );
    });
}

export function filterByTier(tier: Tier): Property[] {
    return properties.filter((p) => p.tier === tier);
}

export function filterByBrand(brand: Brand): Property[] {
    return properties.filter((p) => p.brand === brand);
}

/** Franchise flag logo per brand (transparent assets in /public/brand/flags). */
const BRAND_LOGOS: Record<Brand, string> = {
    "Days Inn": "/brand/flags/days-inn.png",
    "Comfort Inn": "/brand/flags/comfort-inn.png",
    "Hyatt Select": "/brand/flags/hyatt-select.svg",
};

export function brandLogo(brand: Brand): string {
    return BRAND_LOGOS[brand];
}

/** Digits-only tel: href, e.g. "tel:5733365556". */
export function telHref(phone?: string): string | undefined {
    if (!phone) return undefined;
    return `tel:${phone.replace(/[^0-9]/g, "")}`;
}

function slugifyCity(city: string): string {
    return city
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export type HeroDestination = { label: string; href: string };

/**
 * Destinations for the homepage hero finder, derived from the live properties:
 * each distinct operating city, plus a "Near Fort Leonard Wood" shortcut.
 * Links carry query params the Phase 4 /hotels page will read.
 */
export function getHeroDestinations(): HeroDestination[] {
    const cities = Array.from(new Set(getOperatingProperties().map((p) => p.city))).map(
        (city) => ({ label: city, href: `/hotels?city=${slugifyCity(city)}` }),
    );
    return [...cities, { label: "Near Fort Leonard Wood", href: "/hotels?near=flw" }];
}
