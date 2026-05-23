import Link from "next/link";
import Image from "next/image";
import { getAllProperties, telHref } from "@/lib/properties";
import { EXPLORE_LINKS } from "@/lib/nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLAN_LINKS = [
    { href: "/military-travel", label: "Military Travel" },
    { href: "/groups", label: "Groups & Extended Stay" },
    { href: "/offers", label: "Offers" },
    { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
    const properties = getAllProperties();

    return (
        <footer className="bg-navy-800 text-sand-100">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
                    {/* Brand block */}
                    <div className="col-span-2 md:col-span-1">
                        <Image
                            src="/brand/i44-logo.png"
                            alt="I44 Hotels"
                            width={264}
                            height={190}
                            className="h-24 w-auto md:h-28"
                        />
                        <p className="text-sand-300 mt-4 max-w-xs text-sm">
                            Comfortable, convenient stays along Interstate&nbsp;44 for
                            families, business travelers, and Fort Leonard Wood guests.
                        </p>
                        <Link href="/hotels" className={cn(buttonVariants(), "mt-5")}>
                            Book Now
                        </Link>
                    </div>

                    {/* Hotels */}
                    <FooterColumn title="Hotels">
                        {properties.map((p) =>
                            p.status === "operating" ? (
                                <li key={p.slug}>
                                    <Link
                                        href={`/hotels/${p.slug}`}
                                        className="hover:text-gold-400"
                                    >
                                        {p.shortName}
                                    </Link>
                                </li>
                            ) : (
                                <li key={p.slug} className="text-sand-400">
                                    {p.shortName}{" "}
                                    <span className="text-gold-400 text-xs">
                                        (Coming soon)
                                    </span>
                                </li>
                            ),
                        )}
                        <li>
                            <Link
                                href="/hotels"
                                className="text-gold-400 hover:text-gold-300 font-medium"
                            >
                                View all hotels
                            </Link>
                        </li>
                    </FooterColumn>

                    {/* Explore */}
                    <FooterColumn title="Explore">
                        {EXPLORE_LINKS.map((l) => (
                            <li key={l.href}>
                                <Link href={l.href} className="hover:text-gold-400">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </FooterColumn>

                    {/* Plan your stay */}
                    <FooterColumn title="Plan Your Stay">
                        {PLAN_LINKS.map((l) => (
                            <li key={l.href}>
                                <Link href={l.href} className="hover:text-gold-400">
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </FooterColumn>
                </div>

                {/* Property phone numbers */}
                <div className="border-navy-600 mt-12 grid grid-cols-1 gap-4 border-t pt-8 text-sm sm:grid-cols-3">
                    {properties
                        .filter((p) => p.phone)
                        .map((p) => (
                            <div key={p.slug}>
                                <p className="text-sand-100 font-medium">{p.shortName}</p>
                                <a
                                    href={telHref(p.phone)}
                                    className="text-sand-300 hover:text-gold-400"
                                >
                                    {p.phone}
                                </a>
                            </div>
                        ))}
                </div>

                <div className="border-navy-600 text-sand-400 mt-10 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
                    <p>© {new Date().getFullYear()} I44 Hotels. All rights reserved.</p>
                    <p>Comfortable Stays Along I-44</p>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-sand-400 text-xs font-semibold tracking-wide uppercase">
                {title}
            </h2>
            <ul className="text-sand-200 mt-3 space-y-2 text-sm">{children}</ul>
        </div>
    );
}
