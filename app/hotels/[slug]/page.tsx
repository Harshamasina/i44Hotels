import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Navigation, Phone, ChevronRight } from "lucide-react";
import {
    getAllProperties,
    getPropertyBySlug,
    coverPhoto,
    brandLogo,
    formatAddress,
    directionsHref,
    telHref,
    formatFLWDistance,
    type Property,
} from "@/lib/properties";
import { AMENITIES } from "@/lib/amenities";
import { BEST_FOR } from "@/lib/best-for";
import { Container } from "@/components/ui/container";
import { TierBadge, ComingSoonBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function generateStaticParams() {
    return getAllProperties().map((p) => ({ slug: p.slug }));
}

// TODO: replace with the owner's real per-property descriptions when available.
function metaDescription(p: Property): string {
    const where = p.nearFLW
        ? `in ${p.city}, ${p.state}, minutes from Fort Leonard Wood`
        : `in ${p.city}, ${p.state} just off Interstate 44`;
    return `${p.name}, a ${p.tier} ${p.brand} hotel ${where}. View amenities, location, and how to book direct with I44 Hotels.`;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const p = getPropertyBySlug(slug);
    if (!p) return { title: "Hotel not found" };
    return {
        title: p.shortName,
        description: metaDescription(p),
        alternates: { canonical: `/hotels/${p.slug}` },
    };
}

export default async function HotelDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const p = getPropertyBySlug(slug);
    if (!p) notFound();

    const comingSoon = p.status === "coming-soon";
    const cover = coverPhoto(p);
    const distance = formatFLWDistance(p);
    const address = formatAddress(p);
    const tel = telHref(p.phone);

    return (
        <>
            {/* Hero: cover photo with the flag on a white plate, navy gradient fallback. */}
            <section className="from-navy-700 to-navy-900 relative h-64 overflow-hidden bg-linear-to-br sm:h-80">
                {cover && (
                    <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                )}
                {comingSoon && cover && (
                    <div aria-hidden className="bg-navy-900/60 absolute inset-0" />
                )}
                <span className="absolute top-5 left-5 inline-flex rounded-lg bg-white px-3 py-2 shadow-md">
                    <span className="relative block h-10 w-24">
                        <Image
                            src={brandLogo(p.brand)}
                            alt={p.brand}
                            fill
                            sizes="96px"
                            className="object-contain"
                        />
                    </span>
                </span>
                {comingSoon && (
                    <span className="absolute top-5 right-5">
                        <ComingSoonBadge />
                    </span>
                )}
            </section>

            <section className="bg-white">
                <Container className="py-10 sm:py-14">
                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" className="text-sand-500 text-sm">
                        <ol className="flex flex-wrap items-center gap-1">
                            <li>
                                <Link
                                    href="/hotels"
                                    className="hover:text-gold-700 transition-colors"
                                >
                                    Hotels
                                </Link>
                            </li>
                            <li aria-hidden>
                                <ChevronRight className="size-3.5" />
                            </li>
                            <li className="text-navy-800 font-medium">{p.shortName}</li>
                        </ol>
                    </nav>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <TierBadge tier={p.tier} />
                        {p.nearFLW && (
                            <span className="text-sand-600 inline-flex items-center gap-1 text-sm font-medium">
                                <MapPin className="text-gold-600 size-4" aria-hidden />
                                Near Fort Leonard Wood
                                {distance ? ` · ${distance}` : ""}
                            </span>
                        )}
                    </div>

                    <h1 className="text-navy-900 mt-3 max-w-3xl font-serif text-3xl leading-tight sm:text-4xl">
                        {p.name}
                    </h1>

                    {/* Address + phone */}
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
                        {address && (
                            <div className="flex items-start gap-2">
                                <MapPin
                                    className="text-gold-600 mt-0.5 size-5 shrink-0"
                                    aria-hidden
                                />
                                <span className="text-sand-700">{address}</span>
                                <a
                                    href={directionsHref(p)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gold-700 hover:text-gold-600 inline-flex items-center gap-1 text-sm font-semibold"
                                >
                                    <Navigation className="size-4" aria-hidden />
                                    Directions
                                </a>
                            </div>
                        )}
                        {tel && (
                            <a
                                href={tel}
                                className="text-navy-800 hover:text-gold-700 inline-flex items-center gap-2 font-medium transition-colors"
                            >
                                <Phone className="text-gold-600 size-5" aria-hidden />
                                {p.phone}
                            </a>
                        )}
                    </div>

                    {/* Booking CTA. Online deep-links are pending (Phase 11), so we are
                        honest about it: book by phone until the link is wired. */}
                    <div className="mt-8">
                        {comingSoon ? (
                            <p className="text-sand-600">
                                This hotel is opening soon. Check back for booking and
                                details.
                            </p>
                        ) : p.bookingUrl ? (
                            <a
                                href={p.bookingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={buttonVariants({ size: "lg" })}
                            >
                                Book Now
                            </a>
                        ) : (
                            <div className="flex flex-wrap items-center gap-4">
                                {tel && (
                                    <a
                                        href={tel}
                                        className={buttonVariants({ size: "lg" })}
                                    >
                                        Call to book
                                    </a>
                                )}
                                <p className="text-sand-500 text-sm">
                                    Direct online booking coming soon.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Amenities */}
                    {p.amenities.length > 0 && (
                        <div className="border-sand-200 mt-10 border-t pt-8">
                            <h2 className="text-gold-700 text-xs font-semibold tracking-[0.14em] uppercase">
                                Amenities
                            </h2>
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {p.amenities.map((key) => {
                                    const { label, Icon } = AMENITIES[key];
                                    return (
                                        <li
                                            key={key}
                                            className="text-navy-800 bg-sand-100 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
                                        >
                                            <Icon
                                                className="text-gold-600 size-4"
                                                aria-hidden
                                            />
                                            {label}
                                        </li>
                                    );
                                })}
                            </ul>
                            <p className="text-sand-500 mt-3 text-sm">
                                See the full list on the{" "}
                                <Link
                                    href="/amenities"
                                    className="text-gold-700 hover:text-gold-600 font-semibold"
                                >
                                    amenities page
                                </Link>
                                .
                            </p>
                        </div>
                    )}

                    {/* Best for */}
                    {p.bestFor.length > 0 && (
                        <div className="border-sand-200 mt-8 border-t pt-8">
                            <h2 className="text-gold-700 text-xs font-semibold tracking-[0.14em] uppercase">
                                Best for
                            </h2>
                            <ul className="mt-4 flex flex-wrap gap-2">
                                {p.bestFor.map((key) => {
                                    const { label, Icon } = BEST_FOR[key];
                                    return (
                                        <li
                                            key={key}
                                            className="text-navy-700 border-sand-200 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium"
                                        >
                                            <Icon
                                                className="text-gold-600 size-4"
                                                aria-hidden
                                            />
                                            {label}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {/* Placeholder for the full Phase 5 detail (rooms, gallery, policies, reviews). */}
                    <div className="border-sand-200 bg-sand-50 mt-10 rounded-2xl border border-dashed p-8 text-center">
                        <h2 className="text-navy-800 font-serif text-xl">
                            More details coming soon
                        </h2>
                        <p className="text-sand-600 mx-auto mt-2 max-w-md text-sm">
                            Room types, a full photo gallery, policies, and guest reviews
                            for this hotel are on the way.
                        </p>
                    </div>
                </Container>
            </section>
        </>
    );
}
