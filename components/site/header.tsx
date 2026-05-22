"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllProperties, brandLogo } from "@/lib/properties";

// Lean primary nav (CLAUDE.md §6). Hotels is a dropdown handled separately;
// everything else (Amenities, Rooms, Gallery, Local Area) lives in the footer.
const PRIMARY_LINKS = [
    { href: "/military-travel", label: "Military Travel" },
    { href: "/groups", label: "Groups" },
    { href: "/offers", label: "Offers" },
    { href: "/contact", label: "Contact" },
];

const allHotels = getAllProperties();

export function SiteHeader() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [hotelsOpen, setHotelsOpen] = useState(false);
    const hotelsRef = useRef<HTMLDivElement>(null);

    // Close the desktop Hotels dropdown on outside click or Escape.
    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (hotelsRef.current && !hotelsRef.current.contains(e.target as Node)) {
                setHotelsOpen(false);
            }
        }
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setHotelsOpen(false);
                setMobileOpen(false);
            }
        }
        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

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

                {/* Desktop nav */}
                <nav
                    aria-label="Primary"
                    className="text-navy-800 hidden items-center gap-6 text-sm font-medium lg:flex"
                >
                    <div className="relative" ref={hotelsRef}>
                        <button
                            type="button"
                            aria-haspopup="true"
                            aria-expanded={hotelsOpen}
                            onClick={() => setHotelsOpen((v) => !v)}
                            className="hover:text-gold-600 flex items-center gap-1 transition-colors"
                        >
                            Hotels
                            <Chevron open={hotelsOpen} />
                        </button>
                        {hotelsOpen && (
                            <div
                                role="menu"
                                className="border-sand-200 animate-dropdown absolute top-full left-0 mt-2 w-72 origin-top overflow-hidden rounded-xl border bg-white py-2 shadow-lg"
                            >
                                {allHotels.map((p) =>
                                    p.status === "operating" ? (
                                        <Link
                                            key={p.slug}
                                            role="menuitem"
                                            href={`/hotels/${p.slug}`}
                                            onClick={() => setHotelsOpen(false)}
                                            className="hover:bg-sand-50 flex items-center gap-3 px-4 py-2"
                                        >
                                            <BrandLogo src={brandLogo(p.brand)} />
                                            <span>
                                                <span className="text-navy-800 block font-medium">
                                                    {p.shortName}
                                                </span>
                                            </span>
                                        </Link>
                                    ) : (
                                        <div
                                            key={p.slug}
                                            className="flex items-center gap-3 px-4 py-2"
                                        >
                                            <BrandLogo src={brandLogo(p.brand)} />
                                            <span className="flex-1">
                                                <span className="text-sand-600 block font-medium">
                                                    {p.shortName}
                                                </span>
                                            </span>
                                            <ComingSoonPill />
                                        </div>
                                    ),
                                )}
                                <Link
                                    role="menuitem"
                                    href="/hotels"
                                    onClick={() => setHotelsOpen(false)}
                                    className="border-sand-200 text-gold-700 hover:text-gold-600 mt-1 block border-t px-4 pt-3 pb-1 text-sm font-semibold"
                                >
                                    View all hotels
                                </Link>
                            </div>
                        )}
                    </div>

                    {PRIMARY_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-gold-600 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    {/* Book Now: gold bg + navy text per accessibility rule (CLAUDE.md §7) */}
                    <Link
                        href="/hotels"
                        className="bg-gold-500 text-navy-900 hover:bg-gold-400 hidden shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors sm:inline-block"
                    >
                        Book Now
                    </Link>

                    {/* Mobile menu toggle */}
                    <button
                        type="button"
                        aria-label="Toggle menu"
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen((v) => !v)}
                        className="text-navy-800 inline-flex items-center justify-center rounded-md p-2 lg:hidden"
                    >
                        <AnimatedMenuIcon open={mobileOpen} />
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            {mobileOpen && (
                <nav
                    aria-label="Mobile"
                    className="border-sand-200 bg-sand-50 animate-drawer border-t px-4 py-4 lg:hidden"
                >
                    <p className="text-sand-600 px-1 pb-1 text-xs font-semibold tracking-wide uppercase">
                        Our Hotels
                    </p>
                    {allHotels.map((p) =>
                        p.status === "operating" ? (
                            <Link
                                key={p.slug}
                                href={`/hotels/${p.slug}`}
                                onClick={() => setMobileOpen(false)}
                                className="text-navy-800 hover:bg-sand-100 flex items-center gap-3 rounded-md px-3 py-2"
                            >
                                <BrandLogo src={brandLogo(p.brand)} />
                                {p.shortName}
                            </Link>
                        ) : (
                            <div
                                key={p.slug}
                                className="text-sand-600 flex items-center gap-3 rounded-md px-3 py-2"
                            >
                                <BrandLogo src={brandLogo(p.brand)} />
                                <span className="flex-1">{p.shortName}</span>
                                <ComingSoonPill />
                            </div>
                        ),
                    )}
                    <Link
                        href="/hotels"
                        onClick={() => setMobileOpen(false)}
                        className="text-gold-700 block rounded-md px-3 py-2 text-sm font-semibold"
                    >
                        View all hotels
                    </Link>

                    <div className="border-sand-200 my-3 border-t" />

                    {PRIMARY_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-navy-800 hover:bg-sand-100 block rounded-md px-3 py-2 font-medium"
                        >
                            {link.label}
                        </Link>
                    ))}

                    <Link
                        href="/hotels"
                        onClick={() => setMobileOpen(false)}
                        className="bg-gold-500 text-navy-900 mt-3 block rounded-full px-5 py-3 text-center font-semibold"
                    >
                        Book Now
                    </Link>
                </nav>
            )}
        </header>
    );
}

function BrandLogo({ src }: { src: string }) {
    // Fixed box + object-contain normalizes the differently-shaped franchise flags.
    return (
        <span className="relative h-7 w-11 shrink-0">
            <Image src={src} alt="" fill sizes="44px" className="object-contain" />
        </span>
    );
}

function ComingSoonPill() {
    return (
        <span className="bg-gold-100 text-gold-700 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide whitespace-nowrap uppercase">
            Coming soon
        </span>
    );
}

function Chevron({ open }: { open: boolean }) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
            <path
                d="M5 7.5 10 12.5 15 7.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

// Three bars that morph into an X when open (modern hamburger animation).
function AnimatedMenuIcon({ open }: { open: boolean }) {
    const bar =
        "absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-out";
    return (
        <span aria-hidden="true" className="relative block h-4 w-6">
            <span
                className={`${bar} top-0 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : ""}`}
            />
            <span
                className={`${bar} top-1/2 -translate-y-1/2 ${open ? "opacity-0" : ""}`}
            />
            <span
                className={`${bar} bottom-0 ${open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""}`}
            />
        </span>
    );
}
