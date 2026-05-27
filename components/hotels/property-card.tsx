import Link from "next/link";
import Image from "next/image";
import { MapPin, Navigation } from "lucide-react";
import {
    brandLogo,
    coverPhoto,
    formatAddress,
    directionsHref,
    type Property,
} from "@/lib/properties";
import { AMENITIES } from "@/lib/amenities";
import { BEST_FOR } from "@/lib/best-for";
import { Card } from "@/components/ui/card";
import { TierBadge, ComingSoonBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CardRating } from "@/components/hotels/card-rating";

/**
 * Shared portfolio card, used by the homepage "Our Hotels" previews and the
 * /hotels listing. The flag sits on a white plate (the brand logos contain navy,
 * so they need a light backing); the cover falls back to a navy gradient until
 * real photography exists.
 */
export function PropertyCard({ property: p }: { property: Property }) {
    const comingSoon = p.status === "coming-soon";
    const cover = coverPhoto(p);
    return (
        <Card interactive className="relative flex flex-col overflow-hidden">
            {/* Stretched link: the whole card navigates to the hotel; the inner
                links/buttons sit above it (relative z-20) and keep their own actions. */}
            <Link
                href={`/hotels/${p.slug}`}
                aria-label={`View ${p.name}`}
                className="absolute inset-0 z-10 cursor-pointer rounded-2xl"
            />
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
                <CardRating placeId={p.googlePlaceId} className="mt-2" />
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
                            className="text-gold-600 hover:bg-gold-100 hover:text-gold-700 relative z-20 -mt-0.5 inline-flex shrink-0 cursor-pointer rounded-full p-1.5 transition-colors"
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

                <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.bestFor
                        .filter((key) => key !== "groups")
                        .slice(0, 3)
                        .map((key) => (
                            <span
                                key={key}
                                className="text-navy-700 bg-sand-100 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                            >
                                {BEST_FOR[key].label}
                            </span>
                        ))}
                    <Link
                        href="/groups"
                        className="text-navy-700 bg-sand-100 hover:bg-sand-200 relative z-20 inline-flex cursor-pointer items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
                    >
                        Groups &amp; extended stay
                    </Link>
                </div>

                <div className="mt-auto pt-5">
                    {comingSoon ? (
                        <p className="text-sand-500 text-sm">
                            Opening soon. Details to follow.
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            <Link
                                href={`/hotels/${p.slug}`}
                                className={`${buttonVariants({
                                    variant: "outline",
                                    size: "sm",
                                })} relative z-20`}
                            >
                                View hotel
                            </Link>
                            <Link
                                href={`/hotels/${p.slug}#book`}
                                className={`${buttonVariants({ size: "sm" })} relative z-20`}
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
