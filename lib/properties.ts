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

/** Badges shown on a room card. */
export type RoomTag = "pet-friendly" | "accessible" | "suite";

export type RoomType = {
    name: string;
    sleeps?: number;
    description?: string;
    features?: string[];
    tags?: RoomTag[];
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
    smokeFree?: boolean;
    /** e.g. "Children 18 and under stay free." */
    children?: string;
    /** Extra good-to-know notes (deposits, pet-floor rules, etc.). */
    notes?: string[];
};

export type NearbyCategory = "dining" | "attraction" | "business";

/** A point of interest near a property, for the "What's nearby" section. */
export type NearbyPlace = {
    name: string;
    category: NearbyCategory;
    /** Human label as published by the brand, e.g. "2 mi" or "Adjacent". */
    distance?: string;
    /**
     * Official site for places where one is genuinely useful (chains, the base,
     * a university, a named attraction). Omit for local/geographic spots: those
     * fall back to a Google Maps location search via nearbyHref().
     */
    url?: string;
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
    /** Local front-desk line (primary tap-to-call). */
    phone?: string;
    /** Brand reservations line, shown as a secondary contact. */
    reservationsPhone?: string;
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
    nearbyAttractions?: NearbyPlace[];
};

const propertyData: Property[] = [
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
        // TODO (Phase 11): swap for the flag's deep booking link; brand page for now.
        bookingUrl:
            "https://www.wyndhamhotels.com/days-inn/st-robert-missouri/days-inn-st-robert-waynesville-ft-leonard-wood/overview",
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
            intro: "Recognized with the President's Award three years in a row, our Days Inn welcomes Fort Leonard Wood families and I-44 travelers with friendly service just minutes from the gates. Wake up to a free hot breakfast and 24-hour coffee in the lobby, with free WiFi, free parking, and room for larger vehicles.",
            groups: [
                {
                    title: "Hotel amenities",
                    items: [
                        "24-hour front desk",
                        "24-hour coffee in lobby",
                        "Balconies available",
                        "Bus parking",
                        "Business center",
                        "Copy / Fax service*",
                        "Cribs available",
                        "Early check-in available*",
                        "Express check-in",
                        "Express check-out",
                        "Flat-screen televisions",
                        "Free parking",
                        "Government travelers: FEMA approved",
                        "Guest laundry*",
                        "Hairdryer",
                        "Late check-out available*",
                        "Pet friendly",
                        "RV parking",
                        "Surveillance security cameras",
                        "Sustainable practices",
                    ],
                    note: "*May require an additional cost.",
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
        roomTypes: [
            {
                name: "Two Queen Room",
                sleeps: 4,
                description:
                    "Two queen beds with a private balcony, room for the whole family in town for a Fort Leonard Wood graduation. Smoking and non-smoking rooms available.",
                features: [
                    "Free WiFi for members",
                    "Private balcony",
                    "Mini-refrigerator & microwave",
                    "In-room climate control",
                    "HDTV",
                    "Desk",
                    "Hair dryer",
                    "Iron & ironing board",
                ],
            },
            {
                name: "Accessible King Room",
                sleeps: 2,
                description:
                    "A king room built for mobility access, with a roll-in shower and grab bars throughout.",
                features: [
                    "Walk-in shower with grab bars",
                    "Hand-held shower wand & portable seat",
                    "Wheelchair-accessible bath & bedroom",
                    "Raised toilet seat with grab bars",
                    "TDD telephone",
                    "Mini-refrigerator & microwave",
                    "HDTV",
                ],
                tags: ["accessible"],
            },
        ],
        // Official Wyndham property photos (property 04346), organized by category.
        photos: [
            {
                category: "exterior",
                src: "/properties/days-inn-st-robert/exterior/day-1.webp",
                alt: "Days Inn by Wyndham St. Robert exterior in daylight",
            },
            {
                category: "exterior",
                src: "/properties/days-inn-st-robert/exterior/dusk-1.webp",
                alt: "Days Inn by Wyndham St. Robert exterior at dusk",
            },
            {
                category: "exterior",
                src: "/properties/days-inn-st-robert/exterior/day-3.webp",
                alt: "Days Inn by Wyndham St. Robert building exterior",
            },
            {
                category: "lobby",
                src: "/properties/days-inn-st-robert/lobby/view-1.webp",
                alt: "Front desk and lobby at Days Inn by Wyndham St. Robert",
            },
            {
                category: "lobby",
                src: "/properties/days-inn-st-robert/lobby/view-2.webp",
                alt: "Lobby seating at Days Inn by Wyndham St. Robert",
            },
            {
                category: "lobby",
                src: "/properties/days-inn-st-robert/lobby/view-3.webp",
                alt: "Lobby at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-01.webp",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-02.webp",
                alt: "King guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-03.webp",
                alt: "King guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-04.webp",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-05.webp",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-06.webp",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-07.webp",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-08.webp",
                alt: "Two queen guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-09.webp",
                alt: "Two queen guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-10.webp",
                alt: "Two queen guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-11.webp",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-12.webp",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-13.webp",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-14.webp",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/guest-room-15.webp",
                alt: "Guest room at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/bath-1.webp",
                alt: "Guest bathroom at Days Inn by Wyndham St. Robert",
            },
            {
                category: "room",
                src: "/properties/days-inn-st-robert/room/accessible-bath-1.webp",
                alt: "Accessible guest bathroom at Days Inn by Wyndham St. Robert",
            },
            {
                category: "breakfast",
                src: "/properties/days-inn-st-robert/breakfast/breakfast-1.webp",
                alt: "Complimentary breakfast area at Days Inn by Wyndham St. Robert",
            },
            {
                category: "amenity",
                src: "/properties/days-inn-st-robert/amenity/business-center-1.webp",
                alt: "Business center at Days Inn by Wyndham St. Robert",
            },
            {
                category: "amenity",
                src: "/properties/days-inn-st-robert/amenity/laundry-1.webp",
                alt: "Guest laundry facilities at Days Inn by Wyndham St. Robert",
            },
        ],
        // Same St. Robert / Fort Leonard Wood area as Comfort Inn St. Robert.
        // Official sites where useful (chains, the base, the attraction, the
        // university); local spots fall back to a Maps search via nearbyHref().
        nearbyAttractions: [
            {
                name: "Cracker Barrel",
                category: "dining",
                distance: "Adjacent",
                url: "https://www.crackerbarrel.com/",
            },
            {
                name: "Ruby Tuesday",
                category: "dining",
                distance: "Adjacent",
                url: "https://www.rubytuesday.com/",
            },
            { name: "Mama Mia's Authentic Greek", category: "dining", distance: "Adjacent" },
            { name: "El Jimador", category: "dining", distance: "0 mi" },
            {
                name: "Culver's",
                category: "dining",
                distance: "0 mi",
                url: "https://www.culvers.com/",
            },
            {
                name: "Fort Leonard Wood",
                category: "attraction",
                distance: "2 mi",
                url: "https://home.army.mil/wood/",
            },
            {
                name: "Uranus Fudge Factory & Store",
                category: "attraction",
                distance: "2 mi",
                url: "https://www.uranusgeneralstore.com/",
            },
            { name: "Waynesville", category: "attraction", distance: "4.4 mi" },
            { name: "Roubidoux Springs", category: "attraction", distance: "5 mi" },
            { name: "John B. Mahaffey Museum", category: "attraction", distance: "5 mi" },
            { name: "Walmart", category: "business", distance: "1 mi" },
            { name: "Lowe's", category: "business", distance: "1 mi" },
            {
                name: "Drury University",
                category: "business",
                distance: "1.5 mi",
                url: "https://www.drury.edu/",
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
        reservationsPhone: "573-629-1400",
        nearFLW: true,
        distanceToFLWMinutes: 6,
        distanceToFLWMiles: 2,
        bestFor: ["military", "business", "leisure", "groups", "pets"],
        googlePlaceId: "ChIJ-9CGWnzd2ocRG1gF3cGW4EI",
        // TODO (Phase 11): swap for the flag's deep booking link; brand page for now.
        bookingUrl: "https://www.choicehotels.com/missouri/saint-robert/comfort-inn-hotels/mo107",
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
                        "24-hour front desk",
                        "Free hot breakfast",
                        "Indoor heated pool",
                        "Fitness center",
                        "Exercise room",
                        "Coffee / tea maker",
                        "Cribs available",
                        "Pet friendly*",
                        "Early check-in available*",
                        "Express check-in",
                        "Express check-out",
                        "Late check-out available*",
                        "Flat-screen televisions",
                        "Hairdryer",
                        "Hotel safe",
                        "Free parking",
                        "RV parking",
                        "Bus parking",
                        "Copy / Fax service*",
                        "Business center*",
                        "Guest laundry*",
                        "Marketplace",
                        "Government travelers: FEMA approved",
                        "Surveillance security cameras",
                        "Sustainable practices",
                        "Interior corridors",
                        "Elevators",
                        "100% smoke-free hotel",
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
        roomTypes: [
            {
                name: "King Room",
                sleeps: 2,
                description:
                    "A comfortable king room, with pet-friendly rooms available.",
                features: [
                    "Free WiFi",
                    "Walk-in shower",
                    "Flat-screen TV",
                    "Desk",
                    "Refrigerator",
                ],
                tags: ["pet-friendly"],
            },
            {
                name: "Two Queen Room",
                sleeps: 4,
                description:
                    "Two queen beds with room for the family, with pet-friendly rooms available.",
                features: [
                    "Free WiFi",
                    "Flat-screen TV",
                    "Refrigerator",
                    "Hair dryer",
                    "Iron & ironing board",
                ],
                tags: ["pet-friendly"],
            },
            {
                name: "King Suite",
                sleeps: 4,
                description:
                    "A one-room king suite with a sofa bed for extra guests.",
                features: [
                    "1-room suite",
                    "King bed + sofa bed",
                    "Free WiFi",
                    "Walk-in shower",
                    "Flat-screen TV",
                ],
                tags: ["suite"],
            },
            {
                name: "Queen Suite",
                sleeps: 6,
                description:
                    "A spacious one-room suite with two queen beds plus a sofa bed, our largest layout.",
                features: [
                    "1-room suite",
                    "Two queen beds + sofa bed",
                    "Free WiFi",
                    "Flat-screen TV",
                    "Refrigerator",
                ],
                tags: ["suite"],
            },
            {
                name: "Accessible King Room",
                sleeps: 2,
                description:
                    "A ground-floor king room with hearing-accessible and vision-impaired features.",
                features: [
                    "Ground floor",
                    "Hearing accessible",
                    "Vision-impaired features",
                    "Walk-in shower",
                    "Free WiFi",
                ],
                tags: ["accessible"],
            },
        ],
        policies: {
            checkIn: "3:00 PM",
            checkOut: "11:00 AM",
            smokeFree: true,
            children: "Anyone 18 and under at time of booking stays free.",
            pets: "Dogs only. $30 per pet, per night. No deposit and no limit on number or size. Service animals are welcome at no charge.",
            parking: "Free on-site parking.",
        },
        // Same St. Robert / Fort Leonard Wood area; official sites where useful,
        // local spots fall back to a Maps search via nearbyHref().
        nearbyAttractions: [
            {
                name: "Cracker Barrel",
                category: "dining",
                distance: "Adjacent",
                url: "https://www.crackerbarrel.com/",
            },
            {
                name: "Ruby Tuesday",
                category: "dining",
                distance: "Adjacent",
                url: "https://www.rubytuesday.com/",
            },
            { name: "Mama Mia's Authentic Greek", category: "dining", distance: "Adjacent" },
            { name: "El Jimador", category: "dining", distance: "0 mi" },
            {
                name: "Culver's",
                category: "dining",
                distance: "0 mi",
                url: "https://www.culvers.com/",
            },
            {
                name: "Uranus Fudge Factory & Store",
                category: "attraction",
                distance: "2 mi",
                url: "https://www.uranusgeneralstore.com/",
            },
            {
                name: "Fort Leonard Wood",
                category: "attraction",
                distance: "2 mi",
                url: "https://home.army.mil/wood/",
            },
            { name: "Waynesville", category: "attraction", distance: "4.4 mi" },
            { name: "Roubidoux Springs", category: "attraction", distance: "5 mi" },
            { name: "John B. Mahaffey Museum", category: "attraction", distance: "5 mi" },
            {
                name: "Waynesville-St. Robert Chamber",
                category: "business",
                distance: "0 mi",
                url: "https://www.waynesville-strobertchamber.com/",
            },
            { name: "Walmart", category: "business", distance: "1 mi" },
            { name: "Lowe's", category: "business", distance: "1 mi" },
            {
                name: "Drury University",
                category: "business",
                distance: "1.5 mi",
                url: "https://www.drury.edu/",
            },
        ],
        // Official Choice property photos (property MO107), organized by category.
        photos: [
            {
                category: "exterior",
                src: "/properties/comfort-inn-st-robert/exterior/MO107exterior2_1.webp",
                alt: "Comfort Inn St. Robert / Fort Leonard Wood exterior",
            },
            {
                category: "exterior",
                src: "/properties/comfort-inn-st-robert/exterior/MO107exterior1_1.webp",
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
        reservationsPhone: "573-203-0702",
        nearFLW: false,
        bestFor: ["leisure", "business", "groups", "pets", "largeVehicle"],
        googlePlaceId: "ChIJ0UrBfMxj2YcRJRTbIWvINhw",
        // TODO (Phase 11): swap for the flag's deep booking link; brand page for now.
        bookingUrl: "https://www.choicehotels.com/missouri/sullivan/comfort-inn-hotels/mo210",
        address: {
            street: "736 South Service Road West",
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
            intro: "Enjoy a long list of amenities at our smoke-free hotel: free hot breakfast, 24-hour coffee in the lobby, an indoor heated pool, a fitness center, guest laundry, an on-site marketplace, and free parking (with room for buses). Business travelers can use our copy and fax service and our meeting room.",
            groups: [
                {
                    title: "Hotel amenities",
                    items: [
                        "24-hour front desk",
                        "Free hot breakfast",
                        "Indoor heated pool",
                        "Exercise room",
                        "Coffee / tea maker",
                        "Cribs available",
                        "Pet friendly*",
                        "Early check-in available*",
                        "Express check-in",
                        "Express check-out",
                        "Late check-out available*",
                        "Flat-screen televisions",
                        "Hairdryer",
                        "Free parking",
                        "RV parking",
                        "Bus parking",
                        "Copy / Fax service*",
                        "Meeting room*",
                        "Guest laundry*",
                        "Marketplace",
                        "Government travelers: FEMA approved",
                        "Surveillance security cameras",
                        "Sustainable practices",
                        "Interior corridors",
                        "Elevators",
                        "100% smoke-free hotel",
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
        roomTypes: [
            {
                name: "King Room",
                sleeps: 2,
                description:
                    "A comfortable king room, with pet-friendly rooms available on the first floor.",
                features: [
                    "Free WiFi",
                    "Microwave & mini-refrigerator",
                    "Desk",
                    "Hair dryer",
                    "Iron & ironing board",
                ],
                tags: ["pet-friendly"],
            },
            {
                name: "Two Queen Room",
                sleeps: 4,
                description:
                    "Two queen beds with room for the family, with pet-friendly rooms available on the first floor.",
                features: [
                    "Free WiFi",
                    "Microwave & mini-refrigerator",
                    "Desk",
                    "Hair dryer",
                    "Iron & ironing board",
                ],
                tags: ["pet-friendly"],
            },
            {
                name: "Accessible King Room",
                sleeps: 2,
                description:
                    "A king room with mobility and hearing accessibility, and connecting rooms available.",
                features: [
                    "Mobility & hearing accessible",
                    "Roll-in shower",
                    "Visual alarm, doorbell & telephone alerts",
                    "Connecting rooms available",
                ],
                tags: ["accessible"],
            },
        ],
        policies: {
            checkIn: "3:00 PM",
            checkOut: "11:00 AM",
            smokeFree: true,
            children: "Anyone 18 and under at time of booking stays free.",
            pets: "$30 per pet, per night, up to 2 pets per room. No deposit and no size limit. Pet-friendly rooms are on the first floor only and are limited. Service animals are welcome at no charge.",
            parking: "Free on-site parking, with room for buses and trucks.",
            notes: [
                "Guests living within 30 miles of Sullivan provide a $250 cash deposit at check-in.",
                "Housekeeping is provided every other day.",
            ],
        },
        // Sullivan, MO area; official sites where useful, local spots and B2B
        // employers fall back to a Maps search via nearbyHref().
        nearbyAttractions: [
            {
                name: "Taco Bell",
                category: "dining",
                distance: "0 mi",
                url: "https://www.tacobell.com/",
            },
            {
                name: "Subway",
                category: "dining",
                distance: "0 mi",
                url: "https://www.subway.com/",
            },
            {
                name: "Steak 'n Shake",
                category: "dining",
                distance: "0 mi",
                url: "https://www.steaknshake.com/",
            },
            {
                name: "McDonald's",
                category: "dining",
                distance: "0 mi",
                url: "https://www.mcdonalds.com/",
            },
            {
                name: "Jack in the Box",
                category: "dining",
                distance: "0 mi",
                url: "https://www.jackinthebox.com/",
            },
            {
                name: "Meramec State Park",
                category: "attraction",
                distance: "5 mi",
                url: "https://mostateparks.com/park/meramec-state-park",
            },
            { name: "Meramec River", category: "attraction", distance: "5 mi" },
            {
                name: "Jesse James Wax Museum",
                category: "attraction",
                distance: "5 mi",
                url: "https://www.americascave.com/jessejames/",
            },
            { name: "Onyx Mountain Caverns", category: "attraction", distance: "6 mi" },
            {
                name: "Meramec Caverns",
                category: "attraction",
                distance: "10 mi",
                url: "https://www.americascave.com/",
            },
            { name: "The Meramec Group", category: "business", distance: "1 mi" },
            { name: "Sullivan Precision Metal", category: "business", distance: "1 mi" },
            {
                name: "Missouri Baptist Hospital",
                category: "business",
                distance: "1 mi",
                url: "https://www.bjc.org/locations/missouri-baptist-sullivan-hospital",
            },
            { name: "Scotch Dye Casting", category: "business", distance: "2 mi" },
        ],
        // Official Choice property photos (property MO210), organized by category.
        photos: [
            {
                category: "exterior",
                src: "/properties/comfort-inn-sullivan/exterior/MO210twilight1.avif",
                alt: "Comfort Inn Sullivan exterior at twilight",
            },
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

/** Premium-to-budget tier order for site-wide display (upscale shown first). */
const TIER_DISPLAY_RANK: Record<Tier, number> = {
    upscale: 0,
    midscale: 1,
    economy: 2,
};

/**
 * Site-wide display order: open hotels before coming-soon, then premium to
 * budget by tier (the midscale Comfort Inns ahead of the economy Days Inn),
 * keeping source-array order within a tier as a stable tiebreaker (so Comfort
 * Inn St. Robert stays ahead of Comfort Inn Sullivan). The Fort Leonard Wood
 * views sort by drive-time to base instead (see getNearestToFLW).
 */
function byDisplayOrder(a: Property, b: Property): number {
    if (a.status !== b.status) return a.status === "operating" ? -1 : 1;
    return TIER_DISPLAY_RANK[a.tier] - TIER_DISPLAY_RANK[b.tier];
}

/** Properties in site-wide display order. Source of truth is propertyData above. */
export const properties: Property[] = [...propertyData].sort(byDisplayOrder);

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
 * Link for a "What's nearby" place: its official site when set, otherwise a
 * Google Maps location search built from the place name + the hotel's city/state.
 */
export function nearbyHref(place: NearbyPlace, p: Property): string {
    if (place.url) return place.url;
    const query = `${place.name}, ${p.city}, ${p.state}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
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
