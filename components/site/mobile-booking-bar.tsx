import Link from "next/link";
import { Hotel, Phone } from "lucide-react";

/**
 * Persistent mobile action bar (CLAUDE.md §7). Phones only (hidden at md+).
 * Global version surfaces Hotels / Contact / Book; property detail pages will
 * render a property-specific Book / Call / Directions version in Phase 5.
 */
export function MobileBookingBar() {
    return (
        <div className="border-sand-200 bg-sand-50/95 fixed inset-x-0 bottom-0 z-50 max-w-[100vw] border-t backdrop-blur md:hidden">
            <div className="divide-sand-200 grid grid-cols-3 divide-x">
                <Link
                    href="/hotels"
                    className="text-navy-800 flex items-center justify-center gap-2 py-3 text-sm font-medium"
                >
                    <Hotel className="size-4" aria-hidden />
                    Hotels
                </Link>
                <Link
                    href="/contact"
                    className="text-navy-800 flex items-center justify-center gap-2 py-3 text-sm font-medium"
                >
                    <Phone className="size-4" aria-hidden />
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
