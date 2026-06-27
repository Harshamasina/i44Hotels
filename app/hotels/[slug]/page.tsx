import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
    MapPin,
    Navigation,
    Phone,
    ChevronRight,
    BedDouble,
    Users,
    Check,
    Utensils,
    Landmark,
    Building2,
    PawPrint,
    Accessibility,
    Sparkles,
    type LucideIcon,
} from "lucide-react";
import {
    getAllProperties,
    getPropertyBySlug,
    formatAddress,
    directionsHref,
    nearbyHref,
    telHref,
    formatFLWDistance,
    coverPhoto,
    type Property,
    type RoomType,
    type RoomTag,
    type NearbyCategory,
    type PropertyPhoto,
} from "@/lib/properties";
import { AMENITIES } from "@/lib/amenities";
import { getGoogleReviews } from "@/lib/reviews";
import { ReviewsSection, RatingInline } from "@/components/hotels/reviews";
import { PhotoGallery } from "@/components/hotels/photo-gallery";
import { PropertyMap } from "@/components/hotels/property-map";
import { BookingWidget } from "@/components/hotels/booking-widget";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { TierBadge, ComingSoonBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function generateStaticParams() {
    return getAllProperties().map((p) => ({ slug: p.slug }));
}

/**
 * schema.org Hotel structured data for the detail page (CLAUDE.md SEO bar). Hotel
 * is a LodgingBusiness subtype, so this covers the per-property Hotel/LocalBusiness
 * requirement. URLs are absolute (required by Google). We intentionally omit
 * aggregateRating: the ratings are Google's, and re-emitting third-party ratings
 * as our own structured data is against Google's rich-results guidelines.
 */
function hotelJsonLd(p: Property): Record<string, unknown> {
    const priceRange = p.tier === "economy" ? "$" : "$$";

    const data: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Hotel",
        name: p.name,
        description: metaDescription(p),
        url: `${SITE_URL}/hotels/${p.slug}`,
        brand: { "@type": "Brand", name: p.brand },
        priceRange,
    };

    if (p.photos.length > 0) {
        data.image = p.photos.slice(0, 6).map((ph) => `${SITE_URL}${ph.src}`);
    }
    if (p.address) {
        data.address = {
            "@type": "PostalAddress",
            streetAddress: p.address.street,
            addressLocality: p.city,
            addressRegion: p.state,
            postalCode: p.address.zip,
            addressCountry: "US",
        };
        data.geo = {
            "@type": "GeoCoordinates",
            latitude: p.address.lat,
            longitude: p.address.lng,
        };
    }
    if (p.phone) data.telephone = p.phone;
    if (p.policies?.pets) data.petsAllowed = true;
    if (p.amenities.length > 0) {
        data.amenityFeature = p.amenities.map((key) => ({
            "@type": "LocationFeatureSpecification",
            name: AMENITIES[key].label,
            value: true,
        }));
    }
    return data;
}

// TODO: replace with the owner's real per-property descriptions when available.
function metaDescription(p: Property): string {
    const where = p.nearFLW
        ? `in ${p.city}, ${p.state}, minutes from Fort Leonard Wood`
        : `in ${p.city}, ${p.state} just off Interstate 44`;
    return `${p.name}, a ${p.tier} ${p.brand} hotel ${where}. Photos, rooms, amenities, reviews, and how to book direct with I44 Hotels.`;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const p = getPropertyBySlug(slug);
    if (!p) return { title: "Hotel not found" };
    return pageMetadata({
        title: p.shortName,
        description: metaDescription(p),
        path: `/hotels/${p.slug}`,
    });
}

/**
 * Pick the room photo that best matches a room type, by scoring each room shot's
 * alt text against the type (king / queen / suite / accessible), preferring a
 * room over a bathroom. Falls back to the first room photo (e.g. Days Inn, whose
 * room photos are not bed-typed).
 */
function roomImage(p: Property, room: RoomType): PropertyPhoto | undefined {
    const rooms = p.photos.filter((ph) => ph.category === "room");
    if (rooms.length === 0) return undefined;
    if (room.imageSrc) {
        const explicit = rooms.find((ph) => ph.src === room.imageSrc);
        if (explicit) return explicit;
    }
    const name = room.name.toLowerCase();
    const wantSuite = name.includes("suite");
    const wantQueen = name.includes("queen");
    const wantKing = name.includes("king");
    const wantAccessible =
        name.includes("accessible") || (room.tags?.includes("accessible") ?? false);

    const score = (alt: string) => {
        const a = alt.toLowerCase();
        let s = 0;
        if (a.includes("bath")) s -= 2;
        if (wantAccessible) {
            if (a.includes("accessible")) s += 4;
        } else if (!a.includes("accessible")) {
            s += 1;
        }
        if (wantSuite) {
            if (a.includes("suite")) s += 3;
        } else if (!a.includes("suite")) {
            s += 1;
        }
        if (wantQueen && a.includes("queen")) s += 2;
        if (wantKing && a.includes("king")) s += 2;
        return s;
    };

    return [...rooms].sort((x, y) => score(y.alt) - score(x.alt))[0];
}

const ROOM_TAG: Record<RoomTag, { label: string; Icon: LucideIcon }> = {
    "pet-friendly": { label: "Pet-friendly", Icon: PawPrint },
    accessible: { label: "Accessible", Icon: Accessibility },
    suite: { label: "Suite", Icon: Sparkles },
};

const NEARBY_CAT: { key: NearbyCategory; label: string; Icon: LucideIcon }[] = [
    { key: "dining", label: "Dining", Icon: Utensils },
    { key: "attraction", label: "Attractions", Icon: Landmark },
    { key: "business", label: "Business & shopping", Icon: Building2 },
];

export default async function HotelDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const p = getPropertyBySlug(slug);
    if (!p) notFound();

    if (p.status === "coming-soon") return <ComingSoon property={p} />;

    const reviews = await getGoogleReviews(p.googlePlaceId);
    const address = formatAddress(p);
    const distance = formatFLWDistance(p);
    const directions = directionsHref(p);
    const overview = p.amenityDetails?.intro;

    return (
        <>
            <JsonLd data={hotelJsonLd(p)} />
            <JsonLd
                data={breadcrumbJsonLd([
                    { name: "Home", path: "/" },
                    { name: "Hotels", path: "/hotels" },
                    { name: p.shortName, path: `/hotels/${p.slug}` },
                ])}
            />
            <Container className="pt-6">
                <Breadcrumb name={p.shortName} />
            </Container>

            <Container className="pt-4">
                <PhotoGallery photos={p.photos} hotelName={p.shortName} />
            </Container>

            {/* Title block */}
            <Container className="pt-8">
                <div className="flex flex-wrap items-center gap-3">
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
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                    {address && (
                        <span className="text-sand-700 inline-flex items-center gap-2">
                            <MapPin className="text-gold-600 size-4" aria-hidden />
                            {address}
                        </span>
                    )}
                    {reviews && <RatingInline data={reviews} />}
                </div>
            </Container>

            {/* Two-column body. Aside is ordered first on mobile (booking on top),
                placed in the right column on desktop. */}
            <Container className="grid gap-10 py-12 lg:grid-cols-3">
                <div className="order-2 space-y-12 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-1">
                    {(overview || p.award) && (
                        <section>
                            {overview && (
                                <div className="max-w-2xl space-y-4">
                                    {overview.split("\n\n").map((para, i) => (
                                        <p
                                            key={i}
                                            className="text-sand-700 text-lg leading-relaxed"
                                        >
                                            {para}
                                        </p>
                                    ))}
                                </div>
                            )}
                            {p.award && (
                                <Image
                                    src={p.award.src}
                                    alt={p.award.alt}
                                    width={120}
                                    height={120}
                                    className="mt-5"
                                />
                            )}
                        </section>
                    )}

                    {p.amenities.length > 0 && (
                        <section aria-labelledby="amenities-heading">
                            <h2
                                id="amenities-heading"
                                className="text-navy-800 font-serif text-2xl"
                            >
                                Amenities
                            </h2>
                            <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                {p.amenities.map((key) => {
                                    const { label, Icon } = AMENITIES[key];
                                    return (
                                        <li
                                            key={key}
                                            className="text-navy-800 flex items-center gap-2.5 text-sm"
                                        >
                                            <Icon
                                                className="text-gold-600 size-5 shrink-0"
                                                aria-hidden
                                            />
                                            {label}
                                        </li>
                                    );
                                })}
                            </ul>
                            <Link
                                href="/amenities"
                                className="text-gold-700 hover:text-gold-600 mt-4 inline-block text-sm font-semibold underline underline-offset-2"
                            >
                                See full amenity details
                            </Link>
                        </section>
                    )}

                    {p.roomTypes.length > 0 && (
                        <section aria-labelledby="rooms-heading">
                            <h2
                                id="rooms-heading"
                                className="text-navy-800 font-serif text-2xl"
                            >
                                Rooms &amp; suites
                            </h2>
                            <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                {p.roomTypes.map((room) => {
                                    const img = roomImage(p, room);
                                    return (
                                    <div
                                        key={room.name}
                                        className="group border-sand-200 shadow-navy-900/5 flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        {img && (
                                            <div className="relative aspect-3/2 overflow-hidden">
                                                <Image
                                                    src={img.src}
                                                    alt={img.alt}
                                                    fill
                                                    sizes="(min-width:640px) 50vw, 100vw"
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-1 flex-col p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-navy-800 inline-flex items-center gap-2 font-serif text-lg">
                                                <BedDouble
                                                    className="text-gold-600 size-5"
                                                    aria-hidden
                                                />
                                                {room.name}
                                            </h3>
                                        </div>
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            {room.sleeps && (
                                                <span className="text-sand-600 inline-flex items-center gap-1 text-sm">
                                                    <Users
                                                        className="size-4"
                                                        aria-hidden
                                                    />
                                                    Sleeps {room.sleeps}
                                                </span>
                                            )}
                                            {room.tags?.map((tag) => {
                                                const { label, Icon } = ROOM_TAG[tag];
                                                return (
                                                    <span
                                                        key={tag}
                                                        className="bg-sand-100 text-navy-700 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                                                    >
                                                        <Icon
                                                            className="text-gold-600 size-3.5"
                                                            aria-hidden
                                                        />
                                                        {label}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                        {room.description && (
                                            <p className="text-sand-700 mt-3 text-sm">
                                                {room.description}
                                            </p>
                                        )}
                                        {room.features && room.features.length > 0 && (
                                            <ul className="mt-3 grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
                                                {room.features.map((f) => (
                                                    <li
                                                        key={f}
                                                        className="text-sand-700 flex items-start gap-1.5 text-sm"
                                                    >
                                                        <Check
                                                            className="text-gold-600 mt-0.5 size-3.5 shrink-0"
                                                            aria-hidden
                                                        />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                            <p className="text-sand-500 mt-4 text-sm">
                                Room types and rates are confirmed when you book direct.
                            </p>
                        </section>
                    )}

                    {reviews && (
                        <ReviewsSection data={reviews} placeId={p.googlePlaceId} />
                    )}

                    {p.address && (
                        <section aria-labelledby="location-heading">
                            <h2
                                id="location-heading"
                                className="text-navy-800 font-serif text-2xl"
                            >
                                Location
                            </h2>
                            <div className="mt-5">
                                <PropertyMap
                                    lat={p.address.lat}
                                    lng={p.address.lng}
                                    name={p.shortName}
                                />
                            </div>
                            {p.nearbyAttractions && p.nearbyAttractions.length > 0 && (
                                <div className="mt-8">
                                    <h3 className="text-navy-800 font-semibold">
                                        What&apos;s nearby
                                    </h3>
                                    <div className="mt-4 grid gap-6 sm:grid-cols-3">
                                        {NEARBY_CAT.map(({ key, label, Icon }) => {
                                            const items = p.nearbyAttractions!.filter(
                                                (n) => n.category === key,
                                            );
                                            if (items.length === 0) return null;
                                            return (
                                                <div key={key}>
                                                    <h4 className="text-gold-700 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] uppercase">
                                                        <Icon
                                                            className="size-4"
                                                            aria-hidden
                                                        />
                                                        {label}
                                                    </h4>
                                                    <ul className="mt-3 space-y-1.5">
                                                        {items.map((n) => (
                                                            <li
                                                                key={n.name}
                                                                className="flex justify-between gap-3 text-sm"
                                                            >
                                                                <a
                                                                    href={nearbyHref(n, p)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sand-700 hover:text-gold-700 decoration-sand-300 underline underline-offset-2 transition-colors"
                                                                >
                                                                    {n.name}
                                                                </a>
                                                                {n.distance && (
                                                                    <span className="text-sand-500 shrink-0">
                                                                        {n.distance}
                                                                    </span>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {p.policies && <Policies policies={p.policies} />}
                </div>

                {/* Sticky booking / facts sidebar */}
                <aside
                    id="book"
                    className="order-1 scroll-mt-24 lg:order-none lg:col-start-3 lg:row-start-1"
                >
                    <div className="border-sand-200 lg:top-24 rounded-2xl border bg-white p-6 shadow-sm lg:sticky">
                        <p className="text-navy-800 font-serif text-lg">
                            Book direct, best rate
                        </p>
                        <p className="text-sand-600 mt-1 mb-4 text-sm">
                            No middleman. Search the {p.brand} site directly for the best
                            available rate.
                        </p>

                        <BookingWidget property={p} />

                        <dl className="border-sand-200 mt-6 space-y-4 border-t pt-6 text-sm">
                            {p.phone && (
                                <ContactRow
                                    label="Front desk"
                                    phone={p.phone}
                                    primary
                                />
                            )}
                            {p.reservationsPhone && (
                                <ContactRow
                                    label="Reservations"
                                    phone={p.reservationsPhone}
                                />
                            )}
                            {directions && (
                                <div className="flex items-center gap-3">
                                    <Navigation
                                        className="text-gold-600 size-5 shrink-0"
                                        aria-hidden
                                    />
                                    <a
                                        href={directions}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-navy-800 hover:text-gold-700 font-medium"
                                    >
                                        Get directions
                                    </a>
                                </div>
                            )}
                        </dl>

                        {p.policies && (
                            <div className="border-sand-200 text-sand-700 mt-6 space-y-1 border-t pt-5 text-sm">
                                {p.policies.checkIn && (
                                    <p className="flex justify-between">
                                        <span className="text-sand-500">Check-in</span>
                                        <span className="font-medium">
                                            {p.policies.checkIn}
                                        </span>
                                    </p>
                                )}
                                {p.policies.checkOut && (
                                    <p className="flex justify-between">
                                        <span className="text-sand-500">Check-out</span>
                                        <span className="font-medium">
                                            {p.policies.checkOut}
                                        </span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </aside>
            </Container>

            {/* Closing CTA */}
            <section className="bg-navy-800">
                <Container className="py-14 text-center sm:py-16">
                    <h2 className="font-serif text-2xl font-semibold text-white sm:text-3xl">
                        Ready to stay with us?
                    </h2>
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                        {p.bookingUrl && (
                            <a
                                href={p.bookingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={buttonVariants({ size: "lg" })}
                            >
                                Book Now
                            </a>
                        )}
                        <Link
                            href="/groups"
                            className={buttonVariants({
                                variant: "outlineGold",
                                size: "lg",
                            })}
                        >
                            Group stays
                        </Link>
                    </div>
                </Container>
            </section>
        </>
    );
}

function Breadcrumb({ name }: { name: string }) {
    return (
        <nav aria-label="Breadcrumb" className="text-sand-500 text-sm">
            <ol className="flex flex-wrap items-center gap-1">
                <li>
                    <Link
                        href="/hotels"
                        className="hover:text-gold-700 underline underline-offset-2 transition-colors"
                    >
                        Hotels
                    </Link>
                </li>
                <li aria-hidden>
                    <ChevronRight className="size-3.5" />
                </li>
                <li className="text-navy-800 font-medium">{name}</li>
            </ol>
        </nav>
    );
}

function ContactRow({
    label,
    phone,
    primary,
}: {
    label: string;
    phone: string;
    primary?: boolean;
}) {
    return (
        <div className="flex items-center gap-3">
            <Phone className="text-gold-600 size-5 shrink-0" aria-hidden />
            <span>
                <span className="text-sand-500 block text-xs">{label}</span>
                <a
                    href={telHref(phone)}
                    className={
                        primary
                            ? "text-navy-800 hover:text-gold-700 font-semibold"
                            : "text-navy-700 hover:text-gold-700"
                    }
                >
                    {phone}
                </a>
            </span>
        </div>
    );
}

function Policies({
    policies,
}: {
    policies: NonNullable<Property["policies"]>;
}) {
    return (
        <section aria-labelledby="policies-heading">
            <h2 id="policies-heading" className="text-navy-800 font-serif text-2xl">
                Good to know
            </h2>
            <dl className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {policies.checkIn && (
                    <Row label="Check-in" value={policies.checkIn} />
                )}
                {policies.checkOut && (
                    <Row label="Check-out" value={policies.checkOut} />
                )}
                {policies.smokeFree && (
                    <Row label="Smoking" value="100% smoke-free hotel" />
                )}
                {policies.parking && <Row label="Parking" value={policies.parking} />}
                {policies.children && (
                    <Row label="Children" value={policies.children} />
                )}
                {policies.pets && <Row label="Pets" value={policies.pets} />}
            </dl>
            {policies.notes && policies.notes.length > 0 && (
                <ul className="text-sand-700 mt-5 space-y-2 text-sm">
                    {policies.notes.map((note) => (
                        <li key={note} className="flex items-start gap-2">
                            <Check
                                className="text-gold-600 mt-0.5 size-4 shrink-0"
                                aria-hidden
                            />
                            {note}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-sand-500 text-xs font-semibold tracking-[0.1em] uppercase">
                {label}
            </dt>
            <dd className="text-sand-700 mt-0.5 text-sm">{value}</dd>
        </div>
    );
}

/* Coming-soon properties (e.g. Hyatt Select): teaser only, no booking/rooms/reviews. */
function ComingSoon({ property: p }: { property: Property }) {
    const cover = coverPhoto(p);
    return (
        <>
            <section className="bg-navy-900 relative isolate overflow-hidden">
                {cover && (
                    <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                )}
                <div
                    aria-hidden
                    className="from-navy-900/95 via-navy-900/80 to-navy-900/50 absolute inset-0 bg-linear-to-r"
                />
                <Container className="relative py-24 sm:py-32">
                    <div className="max-w-2xl">
                        <ComingSoonBadge />
                        <h1 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
                            {p.name}
                        </h1>
                        <p className="text-sand-200 mt-4 text-lg">
                            A new {p.tier} stay coming to {p.city}, {p.state}
                            {p.nearFLW
                                ? ", minutes from the Fort Leonard Wood gates."
                                : "."}{" "}
                            Details and booking to follow.
                        </p>
                        <div className="mt-8">
                            <Link
                                href="/contact"
                                className={buttonVariants({ size: "lg" })}
                            >
                                Contact us
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
}
