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

/** Audience tags (CLAUDE.md section 3). Drive the card "Best for" line + /hotels filter. */
export type BestForKey =
    | "military"
    | "leisure"
    | "business"
    | "groups"
    | "pets"
    | "largeVehicle";

export type PhotoCategory =
    | "exterior"
    | "lobby"
    | "room"
    | "breakfast"
    | "pool"
    | "fitness"
    | "amenity"
    | "meeting"
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
    /** Audience tags this hotel suits (see BestForKey). Used by the /hotels filter + card. */
    bestFor: BestForKey[];
    /** Per-property deep link to the flag's official booking engine (TBD, Phase 11). */
    bookingUrl?: string;
    /** Google Place ID, used to fetch the live rating + top reviews (Places API New). */
    googlePlaceId?: string;
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
        bestFor: ["military", "leisure", "pets", "largeVehicle"],
        googlePlaceId: "ChIJsdVcjvjm2ocRAm6EGIwc7t0",
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
        // Official Wyndham property photos (property 04346), organized by category.
        photos: [
            {
                category: "exterior",
                src: "/properties/days-inn-st-robert/exterior/day-1.jpg",
                alt: "Days Inn by Wyndham St. Robert exterior in daylight",
            },
            {
                category: "exterior",
                src: "/properties/days-inn-st-robert/exterior/dusk-1.jpg",
                alt: "Days Inn by Wyndham St. Robert exterior at dusk",
            },
            {
                category: "exterior",
                src: "/properties/days-inn-st-robert/exterior/day-3.jpg",
                alt: "Days Inn by Wyndham St. Robert building exterior",
            },
            {
                category: "lobby",
                src: "/properties/days-inn-st-robert/lobby/view-1.jpg",
                alt: "Front desk and lobby at Days Inn by Wyndham St. Robert",
            },
            {
                category: "lobby",
                src: "/properties/days-inn-st-robert/lobby/view-2.jpg",
                alt: "Lobby seating at Days Inn by Wyndham St. Robert",
            },
            {
                category: "lobby",
                src: "/properties/days-inn-st-robert/lobby/view-3.jpg",
                alt: "Lobby at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-01.jpg",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-02.jpg",
                alt: "Guest room with two beds at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-03.jpg",
                alt: "King guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-04.jpg",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-05.jpg",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-06.jpg",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-07.jpg",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-08.jpg",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-09.jpg",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-10.jpg",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-11.jpg",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-12.jpg",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-13.jpg",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-14.jpg",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-15.jpg",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/bath-1.jpg",
                alt: "Guest bathroom at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/accessible-bath-1.jpg",
                alt: "Accessible guest bathroom at Days Inn by Wyndham St. Robert",
            },
            {
                category: "breakfast",
                src: "/properties/days-inn-st-robert/breakfast/breakfast-1.jpg",
                alt: "Complimentary breakfast area at Days Inn by Wyndham St. Robert",
            },
            {
                category: "amenity",
                src: "/properties/days-inn-st-robert/amenity/business-center-1.jpg",
                alt: "Business center at Days Inn by Wyndham St. Robert",
            },
            {
                category: "amenity",
                src: "/properties/days-inn-st-robert/amenity/laundry-1.jpg",
                alt: "Guest laundry facilities at Days Inn by Wyndham St. Robert",
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
        bestFor: ["military", "business", "leisure", "groups", "pets"],
        googlePlaceId: "ChIJ-9CGWnzd2ocRG1gF3cGW4EI",
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
        // Official Choice property photos (property MO107), organized by category.
        photos: [
            {
                category: "exterior",
                src: "/properties/comfort-inn-st-robert/exterior/MO107exterior1_1.webp",
                alt: "Comfort Inn St. Robert / Fort Leonard Wood exterior",
            },
            {
                category: "exterior",
                src: "/properties/comfort-inn-st-robert/exterior/MO107exterior2_1.webp",
                alt: "Comfort Inn St. Robert / Fort Leonard Wood exterior",
            },
            {
                category: "lobby",
                src: "/properties/comfort-inn-st-robert/lobby/MO107lobby1_1.avif",
                alt: "Lobby at Comfort Inn St. Robert",
            },
            {
                category: "lobby",
                src: "/properties/comfort-inn-st-robert/lobby/MO107lobby2_1.webp",
                alt: "Front desk and lobby at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107hnk1_1.webp",
                alt: "Accessible guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107hnk2_1.webp",
                alt: "Accessible guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107hnk3_1.webp",
                alt: "Accessible guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107hnk4_1.avif",
                alt: "Accessible guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107hnkone1_1.webp",
                alt: "Accessible guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107hnkone2_1.webp",
                alt: "Accessible guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107hnkone3_1.webp",
                alt: "Accessible guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107hnkone4_1.webp",
                alt: "Accessible guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107nk1_1.webp",
                alt: "King guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107nk2_1.webp",
                alt: "King guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107nk3_1.webp",
                alt: "King guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107nk4_1.webp",
                alt: "King guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107nqq1_1.webp",
                alt: "Two-queen guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107nqq2_1.webp",
                alt: "Two-queen guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107nqq3_1.webp",
                alt: "Two-queen guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107nqq4_1.webp",
                alt: "Two-queen guest room at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107snk1_1.webp",
                alt: "King suite at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107snk2_1.webp",
                alt: "King suite at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107snk3_1.webp",
                alt: "King suite at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107snk4_1.webp",
                alt: "King suite at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107snqq1_1.webp",
                alt: "Two-queen suite at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107snqq2_1.webp",
                alt: "Two-queen suite at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107snqq3_1.webp",
                alt: "Two-queen suite at Comfort Inn St. Robert",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-st-robert/room/MO107snqq4_1.avif",
                alt: "Two-queen suite at Comfort Inn St. Robert",
            },
            {
                category: "breakfast",
                src: "/properties/comfort-inn-st-robert/breakfast/MO107bkfast1_1.webp",
                alt: "Free hot breakfast area at Comfort Inn St. Robert",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-st-robert/amenity/MO107pool2_1.avif",
                alt: "Indoor heated pool at Comfort Inn St. Robert",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-st-robert/amenity/MO107gym1_1.webp",
                alt: "Fitness center at Comfort Inn St. Robert",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-st-robert/amenity/MO107market1_1.avif",
                alt: "On-site marketplace at Comfort Inn St. Robert",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-st-robert/amenity/MO107laundry1_1.webp",
                alt: "Guest laundry at Comfort Inn St. Robert",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-st-robert/amenity/MO107comp1_1.webp",
                alt: "Guest amenities at Comfort Inn St. Robert",
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
        bestFor: ["leisure", "business", "groups", "pets", "largeVehicle"],
        googlePlaceId: "ChIJ0UrBfMxj2YcRJRTbIWvINhw",
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
        // Official Choice property photos (property MO210), organized by category.
        photos: [
            {
                category: "exterior",
                src: "/properties/comfort-inn-sullivan/exterior/MO210exterior1.avif",
                alt: "Comfort Inn Sullivan exterior",
            },
            {
                category: "exterior",
                src: "/properties/comfort-inn-sullivan/exterior/MO210exterior2.webp",
                alt: "Comfort Inn Sullivan exterior",
            },
            {
                category: "exterior",
                src: "/properties/comfort-inn-sullivan/exterior/MO210twilight1.avif",
                alt: "Comfort Inn Sullivan exterior at twilight",
            },
            {
                category: "exterior",
                src: "/properties/comfort-inn-sullivan/exterior/MO210twilight2.avif",
                alt: "Comfort Inn Sullivan exterior at twilight",
            },
            {
                category: "lobby",
                src: "/properties/comfort-inn-sullivan/lobby/MO210lobby1.webp",
                alt: "Lobby at Comfort Inn Sullivan",
            },
            {
                category: "lobby",
                src: "/properties/comfort-inn-sullivan/lobby/MO210lobby2.avif",
                alt: "Lobby seating at Comfort Inn Sullivan",
            },
            {
                category: "lobby",
                src: "/properties/comfort-inn-sullivan/lobby/MO210lobby3.avif",
                alt: "Front desk at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210HNKP-1.avif",
                alt: "Accessible guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210HNKP-2.avif",
                alt: "Accessible guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210HNKP-3.avif",
                alt: "Accessible guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210HNKP-4.avif",
                alt: "Accessible guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210HNKW-1.avif",
                alt: "Accessible guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210HNKW-2.avif",
                alt: "Accessible guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210HNKW-3.avif",
                alt: "Accessible guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210HNKW-4.webp",
                alt: "Accessible guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210HNKWP-1.avif",
                alt: "Accessible guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210HNKWP-2.avif",
                alt: "Accessible guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210HNKWP-3.avif",
                alt: "Accessible guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210HNKWP-4.webp",
                alt: "Accessible guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NK-1.avif",
                alt: "King guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NK-2.webp",
                alt: "King guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NK-3.avif",
                alt: "King guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NK-4.webp",
                alt: "King guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NKP-1.avif",
                alt: "King guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NKP-2.avif",
                alt: "King guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NKP-3.avif",
                alt: "King guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NKP-4.webp",
                alt: "King guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NQQ-1.avif",
                alt: "Two-queen guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NQQ-2.avif",
                alt: "Two-queen guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NQQ-3.avif",
                alt: "Two-queen guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NQQ-4.avif",
                alt: "Two-queen guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NQQP-1.avif",
                alt: "Two-queen guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NQQP-2.avif",
                alt: "Two-queen guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NQQP-3.avif",
                alt: "Two-queen guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210NQQP-4.webp",
                alt: "Two-queen guest room at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210SNK-1.avif",
                alt: "King suite at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210SNK-2.webp",
                alt: "King suite at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210SNK-3.avif",
                alt: "King suite at Comfort Inn Sullivan",
            },
            {
                category: "room",
                src: "/properties/comfort-inn-sullivan/room/MO210SNK-4.avif",
                alt: "King suite at Comfort Inn Sullivan",
            },
            {
                category: "breakfast",
                src: "/properties/comfort-inn-sullivan/breakfast/MO210bkfast1.avif",
                alt: "Free hot breakfast area at Comfort Inn Sullivan",
            },
            {
                category: "breakfast",
                src: "/properties/comfort-inn-sullivan/breakfast/MO210bkfast2.webp",
                alt: "Breakfast seating at Comfort Inn Sullivan",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-sullivan/amenity/MO210pool1.webp",
                alt: "Indoor heated pool at Comfort Inn Sullivan",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-sullivan/amenity/MO210pool2.webp",
                alt: "Indoor heated pool at Comfort Inn Sullivan",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-sullivan/amenity/MO210fitness1.webp",
                alt: "Fitness center at Comfort Inn Sullivan",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-sullivan/amenity/MO210fitness2.avif",
                alt: "Fitness center at Comfort Inn Sullivan",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-sullivan/amenity/MO210marketplace1.webp",
                alt: "On-site marketplace at Comfort Inn Sullivan",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-sullivan/amenity/MO210drone1.avif",
                alt: "Aerial view of Comfort Inn Sullivan",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-sullivan/amenity/MO210drone2.webp",
                alt: "Aerial view of Comfort Inn Sullivan",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-sullivan/amenity/MO210drone3.webp",
                alt: "Aerial view of Comfort Inn Sullivan",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-sullivan/amenity/MO210drone4.webp",
                alt: "Aerial view of Comfort Inn Sullivan",
            },
            {
                category: "amenity",
                src: "/properties/comfort-inn-sullivan/amenity/MO210drone5.avif",
                alt: "Aerial view of Comfort Inn Sullivan",
            },
            {
                category: "meeting",
                src: "/properties/comfort-inn-sullivan/meeting/MO210meeting1.avif",
                alt: "Meeting room at Comfort Inn Sullivan",
            },
            {
                category: "meeting",
                src: "/properties/comfort-inn-sullivan/meeting/MO210meeting2.avif",
                alt: "Meeting room at Comfort Inn Sullivan",
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
        bestFor: ["military", "business"],
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

const TIERS: Tier[] = ["economy", "midscale", "upscale"];
const BEST_FOR_KEYS: BestForKey[] = [
    "military",
    "leisure",
    "business",
    "groups",
    "pets",
    "largeVehicle",
];

/** The /hotels filter state, mirrored to the URL query string. */
export type PropertyFilters = {
    /** Limit to Fort Leonard Wood gateway hotels (?near=flw). */
    near?: boolean;
    /** ?tier=economy,midscale */
    tiers?: Tier[];
    /** ?for=military,business */
    bestFor?: BestForKey[];
    /** Slugified city names, ?city=st-robert,sullivan */
    cities?: string[];
};

/**
 * Distinct operating-hotel towns for the /hotels town filter, in portfolio order.
 * Derived from the data so adding a hotel in a new town updates the filter.
 */
export function getFilterCities(): { slug: string; label: string }[] {
    const seen = new Set<string>();
    const out: { slug: string; label: string }[] = [];
    for (const p of getOperatingProperties()) {
        const slug = slugifyCity(p.city);
        if (!seen.has(slug)) {
            seen.add(slug);
            out.push({ slug, label: p.city });
        }
    }
    return out;
}

/**
 * Filter the portfolio. Within a group the values OR together (any tier matches);
 * across groups they AND (near AND tier AND bestFor AND city). Empty groups are
 * ignored, so no filters returns everything.
 */
export function filterProperties(f: PropertyFilters): Property[] {
    return properties.filter((p) => {
        if (f.near && !p.nearFLW) return false;
        if (f.tiers?.length && !f.tiers.includes(p.tier)) return false;
        if (f.bestFor?.length && !f.bestFor.some((k) => p.bestFor.includes(k))) {
            return false;
        }
        if (f.cities?.length && !f.cities.includes(slugifyCity(p.city))) {
            return false;
        }
        return true;
    });
}

/** Split a comma-separated query value into a clean string array. */
function splitParam(value: string | string[] | undefined): string[] {
    if (value == null) return [];
    const raw = Array.isArray(value) ? value.join(",") : value;
    return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}

/**
 * Parse the /hotels search params into typed filters, dropping any unknown
 * values so a hand-edited URL can never break the page.
 */
export function parsePropertyFilters(
    sp: Record<string, string | string[] | undefined>,
): PropertyFilters {
    const near = splitParam(sp.near).includes("flw");
    const tiers = splitParam(sp.tier).filter((t): t is Tier => TIERS.includes(t as Tier));
    const bestFor = splitParam(sp.for).filter((k): k is BestForKey =>
        BEST_FOR_KEYS.includes(k as BestForKey),
    );
    const cityOptions = getFilterCities().map((c) => c.slug);
    const cities = splitParam(sp.city).filter((c) => cityOptions.includes(c));

    const filters: PropertyFilters = {};
    if (near) filters.near = true;
    if (tiers.length) filters.tiers = tiers;
    if (bestFor.length) filters.bestFor = bestFor;
    if (cities.length) filters.cities = cities;
    return filters;
}

/** True when any filter is active (drives the "Clear all" affordance). */
export function hasActiveFilters(f: PropertyFilters): boolean {
    return Boolean(f.near || f.tiers?.length || f.bestFor?.length || f.cities?.length);
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

export function slugifyCity(city: string): string {
    return city
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export type HeroDestination = { label: string; href: string };

/**
 * Destinations for the homepage hero finder, derived from the live properties:
 * the Fort Leonard Wood / St. Robert area, plus each remaining operating city.
 * Links carry query params the Phase 4 /hotels page will read.
 */
export function getHeroDestinations(): HeroDestination[] {
    const cities = Array.from(new Set(getOperatingProperties().map((p) => p.city))).map(
        (city) => ({ label: city, href: `/hotels?city=${slugifyCity(city)}` }),
    );
    const nonFlwCities = cities.filter((city) => city.href !== "/hotels?city=st-robert");

    return [
        { label: "Ft Leonard Wood / St. Robert", href: "/hotels?near=flw" },
        ...nonFlwCities,
    ];
}
