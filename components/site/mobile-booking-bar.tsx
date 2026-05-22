import Link from "next/link";

/**
 * Persistent mobile action bar (CLAUDE.md §7). Phones only (hidden at md+).
 * Global version surfaces Book / Hotels / Contact; property detail pages will
 * render a property-specific Book / Call / Directions version in Phase 5.
 */
export function MobileBookingBar() {
    return (
        <div className="border-sand-200 bg-sand-50/95 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur md:hidden">
            <div className="divide-sand-200 grid grid-cols-3 divide-x">
                <Link
                    href="/hotels"
                    className="text-navy-800 flex items-center justify-center gap-2 py-3 text-sm font-medium"
                >
                    <HotelIcon />
                    Hotels
                </Link>
                <Link
                    href="/contact"
                    className="text-navy-800 flex items-center justify-center gap-2 py-3 text-sm font-medium"
                >
                    <PhoneIcon />
                    Contact
                </Link>
                <Link
                    href="/hotels"
                    className="bg-gold-500 text-navy-900 flex items-center justify-center gap-2 py-3 text-sm font-semibold"
                >
                    Book Now
                </Link>
            </div>
        </div>
    );
}

function HotelIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M4 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16M16 9h3a1 1 0 0 1 1 1v11M3 21h18M8 8h0M8 12h0M12 8h0M12 12h0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M6.5 3h3l1.5 5-2 1.5a12 12 0 0 0 5 5l1.5-2 5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
