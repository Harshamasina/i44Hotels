import Link from "next/link";
import Image from "next/image";

/**
 * Placeholder site footer (Phase 0).
 * Navy background; the cream-filled primary logo reads well on dark (CLAUDE.md §7).
 * Real addresses, phones, and link columns are wired from property data in later phases.
 */
export function SiteFooter() {
    return (
        <footer className="bg-navy-800 text-sand-100">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-sm">
                        <Image
                            src="/brand/i44-logo.png"
                            alt="I44 Hotels"
                            width={176}
                            height={127}
                            className="h-16 w-auto"
                        />
                        <p className="text-sand-300 mt-4 text-sm">
                            Comfortable, convenient stays along Interstate&nbsp;44 for
                            families, business travelers, and Fort Leonard Wood guests.
                        </p>
                    </div>

                    <nav aria-label="Footer" className="text-sm">
                        <ul className="grid grid-cols-2 gap-x-10 gap-y-2">
                            <li>
                                <Link href="/hotels" className="hover:text-gold-400">
                                    Hotels
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/military-travel"
                                    className="hover:text-gold-400"
                                >
                                    Military Travel
                                </Link>
                            </li>
                            <li>
                                <Link href="/groups" className="hover:text-gold-400">
                                    Groups &amp; Extended Stay
                                </Link>
                            </li>
                            <li>
                                <Link href="/local-area" className="hover:text-gold-400">
                                    Local Area
                                </Link>
                            </li>
                            <li>
                                <Link href="/gallery" className="hover:text-gold-400">
                                    Gallery
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-gold-400">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <div className="border-navy-600 text-sand-400 mt-10 border-t pt-6 text-xs">
                    © {new Date().getFullYear()} I44 Hotels. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
