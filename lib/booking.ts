import type { Property } from "./properties";

/**
 * Builds a deep link into each flag's official booking engine with the guest's
 * search pre-filled, so "Book Now" lands on Wyndham / Choice already populated
 * (true direct booking, no OTA markup). Params are reverse-engineered from the
 * live booking flows (CLAUDE.md booking strategy); the base URL lives in the
 * Property data so a brand change is a one-line edit.
 */

export type BookingSearch = {
    /** YYYY-MM-DD (the DatePicker's value format). */
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    rooms: number;
    /** Selected rate-plan id (see RATE_PLANS). Empty = best available rate. */
    ratePlanId?: string;
};

/** Rate options offered in the booking widget's "Rate" dropdown. */
export type RatePlan = { id: string; label: string };
export const RATE_PLANS: RatePlan[] = [
    { id: "", label: "Standard rate" },
    { id: "aaa", label: "AAA" },
    { id: "aarp", label: "AARP" },
    { id: "military", label: "Veteran / Military" },
    { id: "rewards", label: "Reward points" },
];

/**
 * Verified Choice `ratePlanCode` per rate id. EMPTY for now -> those selections
 * fall back to the best available rate (no code appended) until confirmed.
 * TODO: fill each by selecting the rate in Choice's "Special Rates & Codes"
 * dropdown on choicehotels.com and copying `ratePlanCode` from the result URL.
 */
const CHOICE_RATE_CODES: Record<string, string> = {
    aaa: "S3A",
    aarp: "SAARP",
    military: "SGML",
    rewards: "SRD",
};

// Wyndham brand ids seen in their booking URLs.
const WYNDHAM_BRAND_ID: Partial<Record<string, string>> = {
    "Days Inn": "DI",
};

/** YYYY-MM-DD -> M/D/YYYY (no leading zeros), the format Wyndham expects. */
function toWyndhamDate(iso: string): string {
    const [y, m, d] = iso.split("-").map(Number);
    return `${m}/${d}/${y}`;
}

export function buildBookingUrl(p: Property, s: BookingSearch): string {
    if (!p.bookingUrl) return "#";

    if (p.brandParent === "Choice") {
        // Choice accepts availability params directly on the property URL.
        const url = new URL(p.bookingUrl);
        url.searchParams.set("checkInDate", s.checkIn); // YYYY-MM-DD
        url.searchParams.set("checkOutDate", s.checkOut);
        url.searchParams.set("adults", String(s.adults));
        url.searchParams.set("minors", String(s.children));
        url.searchParams.set("rooms", String(s.rooms));
        const code = s.ratePlanId ? CHOICE_RATE_CODES[s.ratePlanId] : "";
        if (code) url.searchParams.set("ratePlanCode", code);
        return url.toString();
    }

    if (p.brandParent === "Wyndham") {
        // Wyndham searches on the /rooms-rates path; build the query manually so the
        // date slashes stay literal (matching their working URL format).
        const base = p.bookingUrl.replace(/\/overview\/?$/, "/rooms-rates");
        const brandId = WYNDHAM_BRAND_ID[p.brand];
        const params = [
            brandId ? `brand_id=${brandId}` : null,
            `checkInDate=${toWyndhamDate(s.checkIn)}`,
            `checkOutDate=${toWyndhamDate(s.checkOut)}`,
            `adults=${s.adults}`,
            `children=${s.children}`,
            `rooms=${s.rooms}`,
            "useWRPoints=false",
        ]
            .filter(Boolean)
            .join("&");
        return `${base}?${params}`;
    }

    // Hyatt / other: no deep-link scheme wired yet; return the base URL as-is.
    return p.bookingUrl;
}
