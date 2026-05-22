import Link from "next/link";
import Image from "next/image";

// Primary nav: information architecture per CLAUDE.md §6.
// NOTE (Phase 0 placeholder): most routes don't exist yet; built out in later phases.
const NAV_LINKS = [
    { href: "/hotels", label: "Hotels" },
    { href: "/amenities", label: "Amenities" },
    { href: "/rooms", label: "Rooms" },
    { href: "/military-travel", label: "Military Travel" },
    { href: "/groups", label: "Groups & Extended Stay" },
    { href: "/local-area", label: "Local Area" },
    { href: "/offers", label: "Offers" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
];

/**
 * Placeholder site header (Phase 0).
 * Light cream/white background so the dark logo reads; header is intentionally
 * NOT slim; it has height to fit the stacked logo (CLAUDE.md §7).
 * Mobile drawer + active states come in Phase 1.
 */
export function SiteHeader() {
    return (
        <header className="border-sand-200 bg-sand-50/95 supports-[backdrop-filter]:bg-sand-50/80 sticky top-0 z-40 border-b backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/" aria-label="I44 Hotels home" className="shrink-0">
                    <Image
                        src="/brand/i44-logo.png"
                        alt="I44 Hotels"
                        width={176}
                        height={127}
                        priority
                        className="h-12 w-auto md:h-14"
                    />
                </Link>

                <nav
                    aria-label="Primary"
                    className="text-navy-800 hidden items-center gap-5 text-sm font-medium xl:flex"
                >
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-gold-600 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Book Now: gold bg + navy text per accessibility rule (CLAUDE.md §7) */}
                <Link
                    href="/hotels"
                    className="bg-gold-500 text-navy-900 hover:bg-gold-400 shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors"
                >
                    Book Now
                </Link>
            </div>
        </header>
    );
}
