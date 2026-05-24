import type { Property } from "./properties";

/**
 * Third-party travel sites (OTAs) where a guest can also find each hotel.
 *
 * Important: these are *price-comparison* links, not the primary funnel. Booking
 * direct through the property's own brand engine (see lib/booking.ts) is the best
 * rate with no OTA markup or booking fees, and that stays the headline CTA. These
 * links exist only so guests who want to comparison-shop can do so without leaving
 * confused.
 *
 * We deep-link to each OTA's public *search*, pre-filled with the hotel name and
 * city, rather than a specific property page: exact per-property deep links
 * (and dated/priced ones) require each OTA's internal property/destination IDs or
 * an affiliate/partner account, which we don't have. If the owner later enrolls in
 * an affiliate program, swap a provider's `build` for its partner deep link here
 * and nothing else changes.
 */

export type OtaProvider = {
    id: string;
    name: string;
    /** Builds a search URL on the OTA pre-filled with this property. */
    build: (p: Property) => string;
};

/** The text the OTAs resolve to this exact hotel: name + city + state + zip. */
function searchQuery(p: Property): string {
    const zip = p.address ? ` ${p.address.zip}` : "";
    return `${p.name}, ${p.city}, ${p.state}${zip}`;
}

export const OTA_PROVIDERS: OtaProvider[] = [
    {
        id: "booking",
        name: "Booking.com",
        build: (p) =>
            `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(searchQuery(p))}`,
    },
    {
        id: "expedia",
        name: "Expedia",
        build: (p) =>
            `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(searchQuery(p))}`,
    },
    {
        id: "hotels",
        name: "Hotels.com",
        build: (p) =>
            `https://www.hotels.com/Hotel-Search?destination=${encodeURIComponent(searchQuery(p))}`,
    },
    {
        id: "google",
        name: "Google Hotels",
        build: (p) =>
            `https://www.google.com/travel/search?q=${encodeURIComponent(searchQuery(p))}`,
    },
];

/** OTA options for a single property (only meaningful for operating hotels). */
export function otaLinks(p: Property): { id: string; name: string; url: string }[] {
    return OTA_PROVIDERS.map((o) => ({ id: o.id, name: o.name, url: o.build(p) }));
}
