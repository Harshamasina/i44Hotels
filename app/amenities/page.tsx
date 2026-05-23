import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { AMENITIES, type AmenityKey } from "@/lib/amenities";
import { getOperatingProperties, formatFLWDistance } from "@/lib/properties";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RouteDivider } from "@/components/ui/route-divider";
import { TierBadge, FlagBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Hotel Amenities",
    description:
        "Free hot breakfast, indoor pools, fitness centers, free Wi-Fi and parking, pet-friendly rooms, and more across I44 Hotels along Interstate 44 and near Fort Leonard Wood. See what each hotel offers.",
    alternates: { canonical: "/amenities" },
};

// Short, guest-facing blurbs for the global overview (the registry holds only
// label + icon). Order here is the order shown on the page.
const AMENITY_BLURBS: { key: AmenityKey; blurb: string }[] = [
    {
        key: "breakfast",
        blurb: "Start the day with a free hot breakfast before you hit the road or head to base.",
    },
    {
        key: "wifi",
        blurb: "Free Wi-Fi throughout, for streaming, working, or checking the graduation schedule.",
    },
    {
        key: "parking",
        blurb: "Free on-site parking for every guest, with room for larger vehicles at select hotels.",
    },
    {
        key: "pool",
        blurb: "Unwind in an indoor heated pool, open year-round at select hotels.",
    },
    {
        key: "fitness",
        blurb: "Keep your routine going with an on-site fitness center.",
    },
    {
        key: "coffee",
        blurb: "Fresh coffee in the lobby around the clock.",
    },
    {
        key: "petFriendly",
        blurb: "Traveling with a pet? Pet-friendly rooms are available at several hotels.",
    },
    {
        key: "truckParking",
        blurb: "Room to park trucks, buses, and large vehicles for crews and groups.",
    },
    {
        key: "contactlessCheckin",
        blurb: "Quick, contactless check-in so you can get settled fast.",
    },
    {
        key: "cookies",
        blurb: "Fresh-baked cookies in the afternoon, a small welcome home.",
    },
    {
        key: "boardGames",
        blurb: "Board games and coloring to keep the family happy between events.",
    },
];

export default function AmenitiesPage() {
    const properties = getOperatingProperties();

    return (
        <>
            <section className="bg-sand-100">
                <Container className="py-16 sm:py-20">
                    <SectionHeading
                        eyebrow="Amenities"
                        title="Comfortable by design, at every stop"
                        subtitle="Each I44 hotel flies a different franchise flag, so the exact amenities vary by property. Here is what to expect across our hotels, and what each one offers."
                        align="center"
                    />
                    <RouteDivider className="mt-10" />
                </Container>
            </section>

            <section className="bg-white">
                <Container className="py-16 sm:py-20">
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {AMENITY_BLURBS.map(({ key, blurb }) => {
                            const { label, Icon } = AMENITIES[key];
                            return (
                                <li
                                    key={key}
                                    className="group border-sand-200 hover:border-gold-300 h-full rounded-2xl border bg-white p-6 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
                                >
                                    <span className="bg-gold-100 group-hover:bg-gold-200 inline-flex size-12 items-center justify-center rounded-xl transition-colors duration-200">
                                        <Icon
                                            className="text-gold-700 size-6"
                                            aria-hidden
                                        />
                                    </span>
                                    <h3 className="text-navy-800 mt-4 text-lg font-semibold">
                                        {label}
                                    </h3>
                                    <p className="text-sand-700 mt-2 text-sm">{blurb}</p>
                                </li>
                            );
                        })}
                    </ul>
                </Container>
            </section>

            <section className="bg-sand-50">
                <Container className="py-16 sm:py-20">
                    <SectionHeading
                        eyebrow="By hotel"
                        title="What each hotel offers"
                        subtitle="The full amenity list for each hotel. Some amenities vary by room type, and a few may carry an extra charge, so call the front desk if there is something specific you need."
                    />
                    <div className="mt-10 space-y-8">
                        {properties.map((p) => {
                            const distance = formatFLWDistance(p);
                            return (
                                <div
                                    key={p.slug}
                                    className="border-sand-200 rounded-2xl border bg-white p-6 shadow-sm sm:p-8"
                                >
                                    <div className="flex flex-wrap items-center gap-3">
                                        <FlagBadge brand={p.brand} />
                                        <h3 className="text-navy-800 text-xl font-semibold">
                                            {p.shortName}
                                        </h3>
                                        <TierBadge tier={p.tier} />
                                    </div>
                                    <p className="text-sand-500 mt-1 text-sm">
                                        {p.city}, {p.state}
                                        {distance ? ` · ${distance}` : ""}
                                    </p>

                                    {p.amenityDetails ? (
                                        <>
                                            {p.amenityDetails.intro && (
                                                <p className="text-sand-700 mt-4 max-w-3xl">
                                                    {p.amenityDetails.intro}
                                                </p>
                                            )}
                                            <div className="mt-6 space-y-6">
                                                {p.amenityDetails.groups.map((group) => (
                                                    <div key={group.title}>
                                                        <h4 className="text-gold-700 text-xs font-semibold tracking-[0.14em] uppercase">
                                                            {group.title}
                                                        </h4>
                                                        <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                                                            {group.items.map((item) => (
                                                                <li
                                                                    key={item}
                                                                    className="text-sand-700 flex items-start gap-2 text-sm"
                                                                >
                                                                    <Check
                                                                        className="text-gold-600 mt-0.5 size-4 shrink-0"
                                                                        aria-hidden
                                                                    />
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        {group.note && (
                                                            <p className="text-sand-500 mt-2 text-xs">
                                                                {group.note}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <ul className="mt-4 flex flex-wrap gap-2">
                                            {p.amenities.map((key) => {
                                                const { label, Icon } = AMENITIES[key];
                                                return (
                                                    <li
                                                        key={key}
                                                        className="text-navy-800 bg-sand-100 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                                                    >
                                                        <Icon
                                                            className="text-gold-600 size-3.5"
                                                            aria-hidden
                                                        />
                                                        {label}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Container>
            </section>

            <section className="bg-navy-800">
                <Container className="py-16 text-center sm:py-20">
                    <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                        Find the right hotel for your stay
                    </h2>
                    <p className="text-sand-200 mx-auto mt-4 max-w-xl text-lg">
                        Compare our hotels along I-44, then book direct for the best rate.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link href="/hotels" className={buttonVariants({ size: "lg" })}>
                            Book Now
                        </Link>
                        <Link
                            href="/contact"
                            className={buttonVariants({
                                variant: "outlineGold",
                                size: "lg",
                            })}
                        >
                            Contact us
                        </Link>
                    </div>
                </Container>
            </section>
        </>
    );
}
