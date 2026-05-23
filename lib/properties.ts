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

/** A labeled list of amenities, as published on the brand's property page. */
export type AmenityGroup = {
    title: string;
    items: string[];
    /** Footnote shown under the group, e.g. asterisk pricing or a caveat. */
    note?: string;
};

/** Full per-property amenity detail (from the brand page) for the Amenities page. */
export type AmenityDetails = {
    /** "What this place offers" style intro paragraph. */
    intro?: string;
    groups: AmenityGroup[];
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
    /** Approx. drive time + distance to the FLW main gate (St. Robert hotels only). */
    distanceToFLWMinutes?: number;
    distanceToFLWMiles?: number;
    /** Per-property deep link to the flag's official booking engine (TBD, Phase 11). */
    bookingUrl?: string;
    address?: Address;
    /** PROVISIONAL until confirmed per property (see note above). */
    amenities: AmenityKey[];
    /** Full amenity lists from the brand page (drives the Amenities page detail). */
    amenityDetails?: AmenityDetails;
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
        distanceToFLWMinutes: 9,
        distanceToFLWMiles: 4,
        // TODO: verify exact coords (geocoder could not resolve 14125 Hwy Z).
        address: {
            street: "14125 State Hwy Z",
            zip: "65584",
            lat: 37.829,
            lng: -92.142,
        },
        // TODO: confirm amenities from the Wyndham property page.
        amenities: ["breakfast", "coffee", "wifi", "parking", "petFriendly"],
        amenityDetails: {
            groups: [
                {
                    title: "Hotel amenities",
                    items: [
                        "24-hour front desk",
                        "Balconies available",
                        "Bus & truck parking",
                        "Business center",
                        "Coffee / tea maker",
                        "Concierge",
                        "Cribs available",
                        "Daily housekeeping",
                        "Early check-in available",
                        "Express check-in",
                        "Express check-out",
                        "Flat-screen televisions",
                        "Free parking",
                        "Hairdryer",
                        "Late check-out available",
                        "On-site guest laundry",
                        "Park before you fly",
                        "Pet friendly",
                        "RV parking",
                        "Trailer parking",
                        "Valet parking",
                        "WiFi available",
                    ],
                },
                {
                    title: "Accessibility",
                    items: [
                        "Accessible car self-park",
                        'Accessible guest room doorways with 32" clear width',
                        "Accessible public entrance",
                        "Accessible route to guestrooms",
                        "Accessible route to parking",
                        "Accessible van self-park",
                        "Accessible van parking",
                        "Accessible route to the business center",
                        "Accessible route to food and drink venues",
                        "Service animals welcome",
                        "TTY devices for guest use",
                        "TVs with closed captioning",
                        "Food and drink venues are wheelchair accessible",
                    ],
                },
            ],
        },
        roomTypes: [], // TODO: add room types
        photos: [
            {
                category: "exterior",
                src: "/brand/flags/days_inn.avif",
                alt: "Days Inn by Wyndham St. Robert exterior at dusk",
            },
        ],
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
        distanceToFLWMinutes: 6,
        distanceToFLWMiles: 2,
        address: {
            street: "103 Comfort Inn Drive",
            zip: "65584",
            lat: 37.823965,
            lng: -92.148186,
        },
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
        amenityDetails: {
            intro: "Our friendly staff and ample amenities make your stay in St. Robert convenient, so you can focus on your trip, whether you are here for work or fun. Start each morning with a free hot breakfast, then unwind in the evening in the indoor heated pool. We also offer an on-site fitness center.",
            groups: [
                {
                    title: "Hotel amenities",
                    items: [
                        "Premium free WiFi",
                        "Indoor heated pool",
                        "Pet friendly*",
                        "Free hot breakfast",
                        "Sustainable practices",
                        "Surveillance security",
                        "Truck parking",
                        "Exercise room",
                        "Fitness center",
                        "Government travelers: FEMA approved",
                        "Copy machine*",
                        "Fax machine*",
                        "Interior corridors",
                        "Outdoor parking",
                        "Elevators",
                        "100% smoke-free hotel",
                        "Bus parking",
                        "Free coffee",
                        "Laundry*",
                        "Business center*",
                        "Sun deck",
                    ],
                    note: "*May require an additional cost.",
                },
                {
                    title: "Accessibility",
                    items: [
                        "Accessible hotel",
                        "Accessible public entrance",
                        "Accessible route from public entrance to registration",
                        "Accessible concierge desk",
                        "Accessible business center and/or meeting rooms",
                        "Braille or raised signage",
                        "Braille elevators",
                    ],
                    note: "Amenities may vary by room type.",
                },
            ],
        },
        roomTypes: [], // TODO
        photos: [
            {
                category: "exterior",
                src: "/brand/flags/comfort_inn_st_robert.webp",
                alt: "Comfort Inn St. Robert / Fort Leonard Wood exterior",
            },
        ],
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
        address: {
            street: "736 South Service Road",
            zip: "63080",
            lat: 38.2096659,
            lng: -91.1725207,
        },
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
        amenityDetails: {
            intro: "Enjoy a long list of amenities at our smoke-free hotel: free WiFi for all your devices, free hot breakfast, free coffee, a free weekday newspaper, elevators, a fitness center, an indoor heated pool, a hotel safe, laundry facilities, and free parking (with room for buses and trucks). Business travelers can use our copy, print, and fax services and our meeting room. And when the temperature drops, we have cold-weather hook-ups.",
            groups: [
                {
                    title: "Hotel amenities",
                    items: [
                        "Premium free WiFi",
                        "Indoor heated pool",
                        "Pet friendly*",
                        "Free hot breakfast",
                        "Vending machines*",
                        "Truck parking",
                        "Exercise room",
                        "Free weekday newspaper",
                        "Government travelers: FEMA approved",
                        "Copy machine*",
                        "Fax machine*",
                        "Hotel safe",
                        "Interior corridors",
                        "Outdoor parking",
                        "Elevators",
                        "100% smoke-free hotel",
                        "Bus parking",
                        "Free coffee",
                        "Laundry*",
                        "Meeting room*",
                        "Cold-weather hook-up",
                    ],
                    note: "*May require an additional cost.",
                },
                {
                    title: "Accessibility",
                    items: ["Accessible hotel", "Accessible ramps", "Braille elevators"],
                    note: "Amenities may vary by room type.",
                },
            ],
        },
        roomTypes: [], // TODO
        photos: [
            {
                category: "exterior",
                src: "/brand/flags/comfort_inn_sulli.jpeg",
                alt: "Comfort Inn Sullivan exterior at sunset",
            },
        ],
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
        distanceToFLWMinutes: 10,
        distanceToFLWMiles: 4,
        // TODO: verify exact Hyatt Select address - 107 McKinnon St currently
        // lists as the Super 8 (St. Robert); may be a rebrand or provisional lot.
        address: {
            street: "107 McKinnon St",
            zip: "65584",
            lat: 37.8258176,
            lng: -92.1672888,
        },
        // TODO: confirm amenities once the property opens.
        amenities: ["breakfast", "pool", "fitness", "coffee", "wifi", "parking"],
        roomTypes: [], // TODO
        photos: [
            {
                category: "exterior",
                src: "/brand/flags/hyatt_select.webp",
                alt: "Hyatt Select St. Robert exterior at dusk",
            },
        ],
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

/** Card/hero cover image: the first exterior shot, else the first photo, else none. */
export function coverPhoto(p: Property): PropertyPhoto | undefined {
    return p.photos.find((photo) => photo.category === "exterior") ?? p.photos[0];
}

/** Digits-only tel: href, e.g. "tel:5733365556". */
export function telHref(phone?: string): string | undefined {
    if (!phone) return undefined;
    return `tel:${phone.replace(/[^0-9]/g, "")}`;
}

/** One-line street address, e.g. "103 Comfort Inn Drive, St. Robert, MO 65584". */
export function formatAddress(p: Property): string | undefined {
    if (!p.address) return undefined;
    return `${p.address.street}, ${p.city}, ${p.state} ${p.address.zip}`;
}

/** Google Maps directions link to the property's precise coordinates. */
export function directionsHref(p: Property): string | undefined {
    if (!p.address) return undefined;
    const { lat, lng } = p.address;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * Fort Leonard Wood Main (North) Gate / Visitor Control Center, the reference
 * point for distances, the area map, and directions. Coords approximate the
 * gate at the south end of Missouri Ave; the VCC is open 24/7.
 */
export const FLW_MAIN_GATE = {
    name: "Fort Leonard Wood Main Gate",
    detail: "Visitor Control Center, Missouri Ave",
    city: "Fort Leonard Wood",
    state: "MO",
    zip: "65473",
    hours: "Open 24/7",
    lat: 37.8011,
    lng: -92.1437,
} as const;

/** Official Fort Leonard Wood resources (outbound; always open in a new tab). */
export const FLW_LINKS = {
    graduationCalendar: "https://home.army.mil/wood/index.php/my-fort/grad/calendar",
    visitorAccess:
        "https://home.army.mil/wood/Garrison/DES/physical-security/access-control",
} as const;

/** Honest, approximate distance label, e.g. "~2 mi / ~6 min to base". Undefined if unknown. */
export function formatFLWDistance(p: Property): string | undefined {
    if (p.distanceToFLWMiles == null || p.distanceToFLWMinutes == null) {
        return undefined;
    }
    return `~${p.distanceToFLWMiles} mi / ~${p.distanceToFLWMinutes} min to base`;
}

/** St. Robert hotels nearest the base, drive-time order (drives the FLW page list + map). */
export function getFLWAreaProperties(): Property[] {
    return getNearestToFLW().filter((p) => p.nearFLW);
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
