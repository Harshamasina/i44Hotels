import type { Metadata } from "next";
import Link from "next/link";
import {
    GraduationCap,
    Route,
    TreePine,
    Utensils,
    Mountain,
    Plane,
    Navigation,
    Landmark,
    Ticket,
    ArrowRight,
    type LucideIcon,
} from "lucide-react";
import { getOperatingProperties, formatAddress, directionsHref } from "@/lib/properties";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Local Area: Fort Leonard Wood, St. Robert & the I-44 Corridor",
    description:
        "What to do around our hotels: Fort Leonard Wood and St. Robert / Waynesville, historic Route 66, rivers and state parks, the caves near Sullivan, plus airports and directions along Interstate 44 in Missouri.",
    alternates: { canonical: "/local-area" },
};

type Spot = { Icon: LucideIcon; title: string; blurb: string };

const FLW_AREA: Spot[] = [
    {
        Icon: GraduationCap,
        title: "Fort Leonard Wood visits",
        blurb: "Most of our guests are here for a graduation or to visit a soldier. Our St. Robert hotels sit minutes from the gates, with our full graduation guide a click away.",
    },
    {
        Icon: Route,
        title: "Historic Route 66",
        blurb: "Waynesville and the surrounding towns sit on the Mother Road. Classic roadside stops, murals, and small-town diners are an easy detour between events.",
    },
    {
        Icon: TreePine,
        title: "Rivers & the great outdoors",
        blurb: "The Ozark countryside around Fort Leonard Wood offers float trips, fishing, and trails in the Mark Twain National Forest when you have a free afternoon.",
    },
    {
        Icon: Utensils,
        title: "Local dining",
        blurb: "St. Robert and Waynesville cover the basics: familiar chains along the highway plus local diners, barbecue, and family spots a short drive from your room.",
    },
];

// Specific Pulaski County / Fort Leonard Wood area attractions. Names are
// factual; descriptions are written in our own voice (not copied from any site).
const THINGS_TO_DO: {
    category: string;
    Icon: LucideIcon;
    items: { name: string; blurb: string }[];
}[] = [
    {
        category: "Parks & the outdoors",
        Icon: TreePine,
        items: [
            {
                name: "Bennett Spring State Park",
                blurb: "One of Missouri's largest springs, a favorite for trout fishing, camping, and shaded trails.",
            },
            {
                name: "Roubidoux Spring",
                blurb: "A clear, trout-stocked spring in Waynesville with a path along the creek.",
            },
            {
                name: "Roubidoux Park",
                blurb: "An easy family stop with a splash pad, accessible playground, and walking trail.",
            },
        ],
    },
    {
        category: "Route 66 & history",
        Icon: Landmark,
        items: [
            {
                name: "Fort Leonard Wood museums",
                blurb: "Military history museums on post that trace the units who train at FLW.",
            },
            {
                name: "Route 66 Neon Park",
                blurb: "Restored vintage neon signs lit after dark in St. Robert, a nod to the Mother Road.",
            },
            {
                name: "Old Stagecoach Stop",
                blurb: "A restored 1850s stop on the Waynesville square, one of the area's oldest buildings.",
            },
            {
                name: "Frog Rock",
                blurb: "A beloved Route 66 roadside landmark: a rock outcrop painted as a giant frog.",
            },
        ],
    },
    {
        category: "Family fun",
        Icon: Ticket,
        items: [
            {
                name: "B&B Theatres, Waynesville",
                blurb: "A modern multi-screen cinema for a rainy afternoon or an evening out.",
            },
            {
                name: "Fugitive Beach",
                blurb: "A former quarry turned summer swimming spot with slides and a sandy beach.",
            },
            {
                name: "Seasonal farms & pumpkin patches",
                blurb: "Hayrides, pumpkin patches, and zip lines pop up in the countryside come fall.",
            },
        ],
    },
    {
        category: "Food & drink",
        Icon: Utensils,
        items: [
            {
                name: "Local breweries & taprooms",
                blurb: "Area breweries and pubs pour Ozark-made beer with a relaxed, welcoming feel.",
            },
            {
                name: "Uranus Fudge Factory",
                blurb: "The famously cheeky Route 66 roadside stop for fudge, souvenirs, and a photo.",
            },
            {
                name: "St. Robert & Waynesville dining",
                blurb: "Familiar chains along the highway plus local diners, barbecue, and family spots.",
            },
        ],
    },
];

const SULLIVAN_AREA: Spot[] = [
    {
        Icon: Mountain,
        title: "Caves off I-44",
        blurb: "Comfort Inn Sullivan is in cave country. Meramec Caverns and the nearby state-park caves are a longtime Route 66 stop, easy to reach from the interstate.",
    },
    {
        Icon: TreePine,
        title: "State parks & the Meramec River",
        blurb: "Meramec State Park and Onondaga Cave State Park offer hiking, floating, and camping a short drive from the hotel.",
    },
    {
        Icon: Route,
        title: "A natural I-44 stopover",
        blurb: "Roughly midway between St. Louis and the Fort Leonard Wood area, Sullivan is a comfortable overnight on a longer corridor trip.",
    },
];

export default function LocalAreaPage() {
    const properties = getOperatingProperties();

    return (
        <>
            <section className="bg-sand-100">
                <Container className="py-16 sm:py-20">
                    <SectionHeading
                        eyebrow="Local Area"
                        title="Your guide to the I-44 corridor"
                        subtitle="From the gates of Fort Leonard Wood to the caves and Route 66 towns along Interstate 44, here is what is around our hotels and how to get here."
                        align="center"
                    />
                </Container>
            </section>

            <section className="bg-white">
                <Container className="py-16 sm:py-20">
                    <SectionHeading
                        eyebrow="St. Robert & Waynesville"
                        title="Around Fort Leonard Wood"
                        subtitle="Three of our hotels sit in St. Robert, the gateway to Fort Leonard Wood."
                    />
                    <SpotGrid spots={FLW_AREA} />
                    <Link
                        href="/military-travel"
                        className={cn(buttonVariants({ variant: "outline" }), "mt-8")}
                    >
                        Fort Leonard Wood travel guide
                        <ArrowRight className="size-4" aria-hidden />
                    </Link>
                </Container>
            </section>

            <section className="bg-sand-50">
                <Container className="py-16 sm:py-20">
                    <SectionHeading
                        eyebrow="Things to do"
                        title="Between Family Day and the ceremony"
                        subtitle="When you have a free afternoon, the Fort Leonard Wood area has plenty to fill it, from springs and Route 66 stops to family outings and local tables."
                    />
                    <div className="mt-10 grid gap-6 sm:grid-cols-2">
                        {THINGS_TO_DO.map(({ category, Icon, items }) => (
                            <div
                                key={category}
                                className="group border-sand-200 hover:border-gold-300 rounded-2xl border bg-white p-6 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="bg-gold-100 group-hover:bg-gold-200 inline-flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200">
                                        <Icon
                                            className="text-gold-700 size-5"
                                            aria-hidden
                                        />
                                    </span>
                                    <h3 className="text-navy-800 text-lg font-semibold">
                                        {category}
                                    </h3>
                                </div>
                                <ul className="mt-4 space-y-3">
                                    {items.map((it) => (
                                        <li key={it.name} className="text-sm">
                                            <span className="text-navy-800 font-medium">
                                                {it.name}
                                            </span>
                                            <span className="text-sand-700">
                                                {" "}
                                                {it.blurb}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <p className="text-sand-500 mt-6 text-sm">
                        Hours and seasons change, so check ahead before you go.
                    </p>
                </Container>
            </section>

            <section className="bg-white">
                <Container className="py-16 sm:py-20">
                    <SectionHeading
                        eyebrow="Sullivan"
                        title="Cave country along the corridor"
                        subtitle="Comfort Inn Sullivan puts you near some of Missouri's best-known caves and state parks."
                    />
                    <SpotGrid spots={SULLIVAN_AREA} />
                </Container>
            </section>

            <section className="bg-sand-50">
                <Container className="py-16 sm:py-20">
                    <SectionHeading
                        eyebrow="Getting here"
                        title="Airports & directions"
                        subtitle="All of our hotels sit just off Interstate 44. Drive times vary, so confirm your route before you travel."
                    />

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        <div className="border-sand-200 rounded-2xl border bg-white p-6 shadow-sm">
                            <span className="bg-gold-100 inline-flex size-12 items-center justify-center rounded-xl">
                                <Plane className="text-gold-700 size-6" aria-hidden />
                            </span>
                            <h3 className="text-navy-800 mt-4 text-lg font-semibold">
                                Nearest airports
                            </h3>
                            <ul className="text-sand-700 mt-3 space-y-2 text-sm">
                                <li>
                                    <span className="text-navy-800 font-medium">
                                        St. Louis Lambert International (STL)
                                    </span>{" "}
                                    is east along I-44, the closest major airport to
                                    Sullivan and a straightforward drive to the Fort
                                    Leonard Wood area.
                                </li>
                                <li>
                                    <span className="text-navy-800 font-medium">
                                        Springfield-Branson National (SGF)
                                    </span>{" "}
                                    is the closest major airport to the west.
                                </li>
                                <li>
                                    A small regional airport also serves the Waynesville /
                                    St. Robert area for general aviation.
                                </li>
                            </ul>
                        </div>

                        <div className="border-sand-200 rounded-2xl border bg-white p-6 shadow-sm">
                            <span className="bg-gold-100 inline-flex size-12 items-center justify-center rounded-xl">
                                <Navigation
                                    className="text-gold-700 size-6"
                                    aria-hidden
                                />
                            </span>
                            <h3 className="text-navy-800 mt-4 text-lg font-semibold">
                                Directions to our hotels
                            </h3>
                            <ul className="mt-3 space-y-3 text-sm">
                                {properties.map((p) => {
                                    const directions = directionsHref(p);
                                    const address = formatAddress(p);
                                    return (
                                        <li key={p.slug}>
                                            <p className="text-navy-800 font-medium">
                                                {p.shortName}
                                            </p>
                                            {address && (
                                                <p className="text-sand-600">{address}</p>
                                            )}
                                            {directions && (
                                                <a
                                                    href={directions}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gold-700 hover:text-gold-600 inline-flex items-center gap-1 font-semibold"
                                                >
                                                    Get directions
                                                    <ArrowRight
                                                        className="size-3.5"
                                                        aria-hidden
                                                    />
                                                </a>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="bg-navy-800">
                <Container className="py-16 text-center sm:py-20">
                    <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                        Make the I-44 corridor your base
                    </h2>
                    <p className="text-sand-200 mx-auto mt-4 max-w-xl text-lg">
                        Book a comfortable room near the sights, the base, and the
                        interstate.
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
                            Ask us about the area
                        </Link>
                    </div>
                </Container>
            </section>
        </>
    );
}

function SpotGrid({ spots }: { spots: Spot[] }) {
    return (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {spots.map(({ Icon, title, blurb }) => (
                <div
                    key={title}
                    className="group border-sand-200 hover:border-gold-300 flex gap-4 rounded-2xl border bg-white p-6 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
                >
                    <span className="bg-gold-100 group-hover:bg-gold-200 inline-flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200">
                        <Icon className="text-gold-700 size-6" aria-hidden />
                    </span>
                    <div>
                        <h3 className="text-navy-800 text-lg font-semibold">{title}</h3>
                        <p className="text-sand-700 mt-2 text-sm">{blurb}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
