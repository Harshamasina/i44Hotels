import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
    getAllProperties,
    getOperatingProperties,
    parsePropertyFilters,
    filterProperties,
} from "@/lib/properties";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PatternBackground } from "@/components/ui/pattern-background";
import { buttonVariants } from "@/components/ui/button";
import { PropertyCard } from "@/components/hotels/property-card";
import { FilterBar } from "@/components/hotels/filter-bar";
import { AmenityMatrix } from "@/components/hotels/amenity-matrix";
import { HotelsMap } from "@/components/home/hotels-map";

export const metadata: Metadata = {
    title: "Our Hotels Along I-44",
    description:
        "Browse I44 Hotels along Interstate 44 in Missouri, including three in St. Robert minutes from the Fort Leonard Wood gates. Filter by tier, location, and who each hotel is best for, then book direct.",
    alternates: { canonical: "/hotels" },
};

export default async function HotelsPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const sp = await searchParams;
    const filters = parsePropertyFilters(sp);
    const all = getAllProperties();
    const operating = getOperatingProperties();
    const results = filterProperties(filters);

    return (
        <div className="overflow-x-clip">
            <section className="bg-navy-900 relative isolate overflow-hidden">
                <Image
                    src="/brand/flags/hyatt_select.webp"
                    alt="An I44 Hotels property at dusk along Interstate 44"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center"
                />
                <div
                    aria-hidden
                    className="from-navy-900/95 via-navy-900/75 to-navy-900/35 absolute inset-0 bg-linear-to-r"
                />
                <Container className="relative py-24 sm:py-32 lg:py-40">
                    <div className="max-w-2xl">
                        <p className="text-gold-300 mb-3 text-sm font-semibold tracking-[0.14em] uppercase">
                            Our Hotels &middot; Interstate 44, Missouri
                        </p>
                        <h1 className="text-4xl font-semibold text-white sm:text-5xl">
                            Stays Along Interstate 44
                        </h1>
                        <p className="text-sand-200 mt-5 text-lg sm:text-xl">
                            From budget-friendly to upscale, find the right welcome for
                            your trip, including three hotels in St. Robert just minutes
                            from the Fort Leonard Wood gates.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/hotels?near=flw"
                                className={buttonVariants({ size: "lg" })}
                            >
                                Near Fort Leonard Wood
                            </Link>
                            <Link
                                href="/groups"
                                className={buttonVariants({
                                    variant: "outlineGold",
                                    size: "lg",
                                })}
                            >
                                Group room blocks
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="relative isolate overflow-hidden bg-white">
                <PatternBackground />
                <Container className="py-16 sm:py-20">
                    <FilterBar
                        filters={filters}
                        shown={results.length}
                        total={all.length}
                    />

                    {results.length > 0 ? (
                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {results.map((p) => (
                                <PropertyCard key={p.slug} property={p} />
                            ))}
                        </div>
                    ) : (
                        <div className="border-sand-200 mt-10 rounded-2xl border border-dashed bg-white p-10 text-center">
                            <h3 className="text-navy-800 font-serif text-xl">
                                No hotels match those filters
                            </h3>
                            <p className="text-sand-600 mx-auto mt-2 max-w-md text-sm">
                                Try removing a filter to see more of our hotels along
                                Interstate 44.
                            </p>
                            <Link
                                href="/hotels"
                                className={`${buttonVariants({ variant: "outline", size: "md" })} mt-6`}
                            >
                                Clear all filters
                            </Link>
                        </div>
                    )}
                </Container>
            </section>

            <section className="bg-sand-50">
                <Container className="py-16 sm:py-20">
                    <SectionHeading
                        eyebrow="Compare"
                        title="Amenities at a glance"
                        subtitle="A quick side-by-side of what our open hotels offer. The Hyatt Select is still on the way."
                    />
                    <div className="mt-10">
                        <AmenityMatrix properties={operating} />
                    </div>
                </Container>
            </section>

            <section className="bg-white">
                <Container className="py-16 sm:py-20">
                    <SectionHeading
                        eyebrow="Locations"
                        title="Find us along I-44"
                        subtitle="Our hotels sit right off Interstate 44 across two Missouri towns."
                    />
                    <div className="mt-10">
                        <HotelsMap />
                    </div>
                </Container>
            </section>

            <section className="bg-navy-800">
                <Container className="py-16 text-center sm:py-20">
                    <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
                        Planning a graduation trip or group stay?
                    </h2>
                    <p className="text-sand-200 mx-auto mt-4 max-w-xl text-lg">
                        We help families and groups book across our hotels along I-44.
                        Tell us what you need and we will help you find the right fit.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link
                            href="/military-travel"
                            className={buttonVariants({ size: "lg" })}
                        >
                            Military Travel
                        </Link>
                        <Link
                            href="/groups"
                            className={buttonVariants({
                                variant: "outlineGold",
                                size: "lg",
                            })}
                        >
                            Group stays
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
        </div>
    );
}
