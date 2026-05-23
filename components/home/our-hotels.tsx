import Link from "next/link";
import Image from "next/image";
import { MapPin, Navigation } from "lucide-react";
import {
    getAllProperties,
    brandLogo,
    coverPhoto,
    formatAddress,
    directionsHref,
    type Property,
} from "@/lib/properties";
import { AMENITIES } from "@/lib/amenities";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { TierBadge, ComingSoonBadge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";

/** "Our Hotels" portfolio previews. Cards use a navy cover with the flag on a
 *  white plate (the brand logos contain navy, so they need a light backing). */
export function OurHotels() {
    const all = getAllProperties();
    return (
        <section className="bg-sand-50">
            <Container className="py-16 sm:py-20">
                <SectionHeading
                    eyebrow="Our Hotels"
                    title="Stays along Interstate 44"
                    subtitle="From budget-friendly to upscale, find the right welcome for your trip."
                />
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {all.map((p) => (
                        <PropertyCard key={p.slug} property={p} />
                    ))}
                </div>
            </Container>
        </section>
    );
}

function PropertyCard({ property: p }: { property: Property }) {
    const comingSoon = p.status === "coming-soon";
    const cover = coverPhoto(p);
    return (
        <Card interactive className="flex flex-col overflow-hidden">
            {/* Photo cover with the franchise flag on a small white plate (top-left).
                Falls back to a navy gradient when no photography exists yet. */}
            <div className="from-navy-700 to-navy-900 relative h-44 overflow-hidden bg-linear-to-br">
                {cover && (
                    <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                    />
                )}
                {/* Coming-soon photos are dimmed under a navy wash to read as a placeholder. */}
                {comingSoon && cover && (
                    <div aria-hidden className="bg-navy-900/65 absolute inset-0" />
                )}
                <span className="absolute top-3 left-3 inline-flex rounded-lg bg-white px-3 py-2 shadow-md">
                    <span className="relative block h-9 w-20">
                        <Image
                            src={brandLogo(p.brand)}
                            alt={p.brand}
                            fill
                            sizes="80px"
                            className="object-contain"
                        />
                    </span>
                </span>
                {comingSoon && (
                    <span className="absolute top-3 right-3">
                        <ComingSoonBadge />
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                    <TierBadge tier={p.tier} />
                    {p.nearFLW && (
                        <span className="text-sand-600 inline-flex items-center gap-1 text-xs font-medium">
                            <MapPin className="text-gold-600 size-3.5" aria-hidden />
                            Near Fort Leonard Wood
                        </span>
                    )}
                </div>
                <h3 className="text-navy-800 font-serif text-lg leading-snug">
                    {p.name}
                </h3>
                {p.address && (
                    <div className="mt-1.5 flex items-start gap-2">
                        <MapPin
                            className="text-gold-600 mt-0.5 size-4 shrink-0"
                            aria-hidden
                        />
                        <p className="text-sand-600 flex-1 text-sm">
                            {formatAddress(p)}
                        </p>
                        <a
                            href={directionsHref(p)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Get directions to ${p.shortName}`}
                            title="Get directions"
                            className="text-gold-600 hover:bg-gold-100 hover:text-gold-700 -mt-0.5 inline-flex shrink-0 rounded-full p-1.5 transition-colors"
                        >
                            <Navigation className="size-4" aria-hidden />
                        </a>
                    </div>
                )}

                {p.amenities.length > 0 && (
                    <div className="text-sand-500 mt-3 flex flex-wrap gap-2.5">
                        {p.amenities.slice(0, 5).map((key) => {
                            const { label, Icon } = AMENITIES[key];
                            return (
                                <Icon key={key} className="size-4" aria-label={label} />
                            );
                        })}
                    </div>
                )}

                <div className="mt-auto pt-5">
                    {comingSoon ? (
                        <p className="text-sand-500 text-sm">
                            Opening soon. Details to follow.
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={`/hotels/${p.slug}`}
                                className={buttonVariants({
                                    variant: "outline",
                                    size: "sm",
                                })}
                            >
                                View hotel
                            </Link>
                            <Link
                                href={p.bookingUrl ?? `/hotels/${p.slug}`}
                                className={buttonVariants({ size: "sm" })}
                            >
                                Book
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
