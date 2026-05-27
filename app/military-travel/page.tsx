import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
    MapPin,
    Navigation,
    CalendarCheck,
    Users,
    Clock,
    PawPrint,
    Car,
    Coffee,
    ArrowRight,
    ExternalLink,
    GraduationCap,
    Compass,
    Utensils,
    BadgePercent,
    type LucideIcon,
} from "lucide-react";
import {
    getFLWAreaProperties,
    getOperatingProperties,
    formatFLWDistance,
    formatAddress,
    coverPhoto,
    brandLogo,
    telHref,
    directionsHref,
    FLW_MAIN_GATE,
    FLW_LINKS,
    type Property,
} from "@/lib/properties";
import { AMENITIES } from "@/lib/amenities";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { CardRating } from "@/components/hotels/card-rating";
import { SectionHeading } from "@/components/ui/section-heading";
import { TierBadge, ComingSoonBadge } from "@/components/ui/badge";
import { PatternBackground } from "@/components/ui/pattern-background";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FlwAreaMap } from "@/components/military/flw-area-map";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { getFeaturedOffer } from "@/lib/offers";

export const metadata: Metadata = {
    title: "Hotels Near Fort Leonard Wood (St. Robert & Waynesville, MO)",
    description:
        "Comfortable hotels minutes from the Fort Leonard Wood gates in St. Robert, MO. Built for graduation families: distance to base, group room blocks, and easy direct booking. Stay close, feel welcome.",
    alternates: { canonical: "/military-travel" },
};

// Outbound official-resource link styling (always opens in a new tab).
const officialLink =
    "inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700 hover:text-gold-600";

const FAQS: { q: string; a: string }[] = [
    {
        q: "How far are your hotels from Fort Leonard Wood?",
        a: "Our St. Robert hotels sit about 2 to 4 miles from the main gate, roughly a 6 to 10 minute drive. Comfort Inn St. Robert is the closest at about 2 miles.",
    },
    {
        q: "When should I book for a graduation?",
        a: "Graduations run on a near-weekly cycle and rooms fill quickly around Family Day and ceremony nights. We recommend booking several weeks ahead, and earlier in the busy spring and summer months.",
    },
    {
        q: "Do you offer group rates or room blocks for graduation?",
        a: "Yes. We can coordinate room blocks across our St. Robert hotels so extended family can stay together. Send your dates through our group inquiry and one team handles it for you.",
    },
    {
        q: "Can I check in late or leave early for an early ceremony?",
        a: "Most ceremonies are early in the day. Let the front desk know your schedule when you book and we will do our best to arrange early departures and late arrivals.",
    },
    {
        q: "Are pets allowed?",
        a: "Several of our hotels are pet-friendly, though policies vary by property. Check the individual hotel page or call ahead before you travel.",
    },
    {
        q: "Which hotel is closest to the base?",
        a: "Comfort Inn St. Robert is closest to the main gate at about 2 miles. Days Inn and the coming-soon Hyatt Select are about 4 miles out.",
    },
];

export default function MilitaryTravelPage() {
    const areaHotels = getFLWAreaProperties();
    const sullivan = getOperatingProperties().find((p) => !p.nearFLW);

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    };

    const gateDirections = `https://www.google.com/maps/dir/?api=1&destination=${FLW_MAIN_GATE.lat},${FLW_MAIN_GATE.lng}`;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <Hero />
            <EmpathyIntro />
            <ClosestHotels hotels={areaHotels} sullivan={sullivan} />
            <WhatToExpect />
            <PlanYourStay />
            <MilitaryRates />
            <GroupRooms />
            <BetweenEvents />
            <Directions gateDirections={gateDirections} />
            <Faqs />
            <ClosingCta />
        </>
    );
}

/* Military & government rates callout (single source: lib/offers) ------------ */
function MilitaryRates() {
    const offer = getFeaturedOffer();
    if (!offer) return null;
    return (
        <section className="bg-gold-50">
            <Container className="py-12 sm:py-14">
                <div className="border-gold-200 flex flex-col items-start gap-5 rounded-2xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:p-8">
                    <span className="bg-gold-100 inline-flex size-12 shrink-0 items-center justify-center rounded-xl">
                        <BadgePercent className="text-gold-700 size-6" aria-hidden />
                    </span>
                    <div className="flex-1">
                        <p className="text-gold-700 text-xs font-semibold tracking-[0.14em] uppercase">
                            {offer.audience}
                        </p>
                        <h2 className="text-navy-800 mt-1 text-xl font-semibold sm:text-2xl">
                            {offer.title}
                        </h2>
                        <p className="text-sand-700 mt-2 max-w-2xl text-sm sm:text-base">
                            {offer.summary}
                        </p>
                    </div>
                    <Link href="/offers" className={cn(buttonVariants(), "shrink-0")}>
                        See all offers
                        <ArrowRight className="size-4" aria-hidden />
                    </Link>
                </div>
            </Container>
        </section>
    );
}

/* 1. Hero -------------------------------------------------------------------- */
function Hero() {
    return (
        <section className="bg-navy-900 relative isolate overflow-hidden">
            <Image
                src="/brand/flags/military_family_1.jpg"
                alt="A military family smiling together while visiting Fort Leonard Wood"
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
                        Fort Leonard Wood &middot; St. Robert, MO
                    </p>
                    <h1 className="text-4xl font-semibold text-white sm:text-5xl">
                        Stay Close. Feel Welcome.
                    </h1>
                    <p className="text-sand-200 mt-5 text-lg sm:text-xl">
                        Comfortable hotels minutes from the Fort Leonard Wood gates, for
                        the families here to celebrate their soldier. Book early, bring
                        the whole family, and let us handle the rooms.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="#hotels-near-base"
                            className={buttonVariants({ size: "lg" })}
                        >
                            See hotels near base
                        </Link>
                        <Link
                            href="/groups"
                            className={buttonVariants({
                                variant: "outlineGold",
                                size: "lg",
                            })}
                        >
                            Plan group rooms
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}

/* 2. Empathy intro ----------------------------------------------------------- */
function EmpathyIntro() {
    return (
        <section className="bg-sand-100">
            <Container className="py-16 sm:py-20">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-navy-800 text-2xl font-semibold sm:text-3xl">
                        We know why you are here
                    </h2>
                    <p className="text-sand-700 mt-4 text-lg">
                        Your soldier finished training, and that is worth celebrating.
                        Between Family Day and the graduation ceremony, you want a clean,
                        comfortable room close to the gates, the family nearby, and no
                        fuss. We host graduation families in St. Robert and Waynesville
                        every week, and we are glad to host yours.
                    </p>
                </div>
            </Container>
        </section>
    );
}

/* 3. Closest hotels to base -------------------------------------------------- */
function ClosestHotels({
    hotels,
    sullivan,
}: {
    hotels: Property[];
    sullivan?: Property;
}) {
    return (
        <section
            id="hotels-near-base"
            className="relative isolate scroll-mt-20 overflow-hidden bg-white"
        >
            <PatternBackground />
            <Container className="py-16 sm:py-20">
                <SectionHeading
                    eyebrow="Hotels near base"
                    title="Closest hotels to Fort Leonard Wood"
                    subtitle="Three of our hotels sit in St. Robert, just minutes from the main gate. Distances are approximate drive times to the gate."
                />

                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {hotels.map((p) => (
                        <AreaHotelCard key={p.slug} property={p} />
                    ))}
                </div>

                {sullivan && (
                    <Card className="mt-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sand-700 text-sm">
                            <span className="text-navy-800 font-semibold">
                                Coming from the east on I-44?
                            </span>{" "}
                            {sullivan.shortName} is a quieter stop about an hour from
                            base.
                        </p>
                        <Link
                            href={`/hotels/${sullivan.slug}`}
                            className={cn(
                                buttonVariants({ variant: "outline", size: "sm" }),
                                "shrink-0",
                            )}
                        >
                            View hotel
                        </Link>
                    </Card>
                )}

                <div className="mt-10">
                    <FlwAreaMap />
                    <p className="text-sand-500 mt-3 text-center text-xs">
                        Navy marker: the Fort Leonard Wood main gate. Gold markers: our
                        St. Robert hotels.
                    </p>
                </div>
            </Container>
        </section>
    );
}

function AreaHotelCard({ property: p }: { property: Property }) {
    const comingSoon = p.status === "coming-soon";
    const cover = coverPhoto(p);
    const distance = formatFLWDistance(p);
    return (
        <Card interactive className="group flex flex-col overflow-hidden">
            <div className="from-navy-700 to-navy-900 relative h-40 overflow-hidden bg-linear-to-br">
                {cover && (
                    <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                )}
                {comingSoon && cover && (
                    <div aria-hidden className="bg-navy-900/65 absolute inset-0" />
                )}
                <span className="absolute top-3 left-3 inline-flex rounded-lg bg-white px-3 py-2 shadow-md">
                    <span className="relative block h-8 w-18">
                        <Image
                            src={brandLogo(p.brand)}
                            alt={p.brand}
                            fill
                            sizes="72px"
                            className="object-contain"
                        />
                    </span>
                </span>
                {comingSoon && (
                    <span className="absolute top-3 right-3">
                        <ComingSoonBadge />
                    </span>
                )}
                {distance && (
                    <span className="bg-navy-900/85 absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        <MapPin className="text-gold-400 size-3.5" aria-hidden />
                        {distance}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div>
                    <TierBadge tier={p.tier} />
                </div>
                <h3 className="text-navy-800 mt-2 font-serif text-lg leading-snug">
                    {p.name}
                </h3>
                <CardRating placeId={p.googlePlaceId} className="mt-2" />
                {p.address && (
                    <p className="text-sand-600 mt-1.5 text-sm">{formatAddress(p)}</p>
                )}

                {p.amenities.length > 0 && (
                    <div className="text-sand-500 mt-3 flex flex-wrap gap-2.5">
                        {p.amenities.slice(0, 6).map((key) => {
                            const { label, Icon } = AMENITIES[key];
                            return (
                                <Icon key={key} className="size-4" aria-label={label} />
                            );
                        })}
                    </div>
                )}

                <div className="mt-auto pt-5">
                    <Link
                        href="/groups"
                        className="text-navy-700 bg-sand-100 hover:bg-sand-200 mb-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"
                    >
                        Groups &amp; extended stay
                    </Link>
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
                                href={`/hotels/${p.slug}#book`}
                                className={buttonVariants({ size: "sm" })}
                            >
                                Book
                            </Link>
                            {p.phone && (
                                <a
                                    href={telHref(p.phone)}
                                    className={buttonVariants({
                                        variant: "ghost",
                                        size: "sm",
                                    })}
                                >
                                    Call
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

/* 4. What to expect at graduation -------------------------------------------- */
function WhatToExpect() {
    const steps: { Icon: LucideIcon; title: string; body: string }[] = [
        {
            Icon: Users,
            title: "Family Day",
            body: "The day before graduation, families reunite with their soldier for the first time. Plan to arrive the night before so you are rested and close to the gate.",
        },
        {
            Icon: GraduationCap,
            title: "Graduation ceremony",
            body: "The ceremony is usually the next morning. Mornings can be busy at the gates, so leave early and follow the post directions for parking.",
        },
        {
            Icon: Navigation,
            title: "Head home",
            body: "Many families add a night to enjoy the area together before the drive home. Late checkout and an easy I-44 on-ramp make departure simple.",
        },
    ];
    return (
        <section className="bg-sand-100">
            <Container className="py-16 sm:py-20">
                <div className="grid items-start gap-10 lg:grid-cols-2">
                    <div>
                        <SectionHeading
                            eyebrow="The big weekend"
                            title="What to expect at an FLW graduation"
                            subtitle="Fort Leonard Wood graduates new soldiers on a near-weekly cycle, typically a Family Day followed by a graduation ceremony. Rooms fill fast around those dates, so book early."
                        />
                        <a
                            href={FLW_LINKS.graduationCalendar}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(officialLink, "mt-6")}
                        >
                            Official Fort Leonard Wood graduation calendar
                            <ExternalLink className="size-4" aria-hidden />
                        </a>

                        <ol className="mt-8 space-y-5">
                            {steps.map(({ Icon, title, body }, i) => (
                                <li key={title} className="flex gap-4">
                                    <span className="bg-navy-800 text-gold-300 flex size-10 shrink-0 items-center justify-center rounded-full font-serif text-lg">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h3 className="text-navy-800 flex items-center gap-2 text-lg font-semibold">
                                            <Icon
                                                className="text-gold-600 size-5"
                                                aria-hidden
                                            />
                                            {title}
                                        </h3>
                                        <p className="text-sand-700 mt-1">{body}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="group relative h-72 overflow-hidden rounded-2xl shadow-md lg:h-full lg:min-h-[28rem]">
                        <Image
                            src="/brand/flags/graduation.jpg"
                            alt="Soldiers standing in formation and saluting at a Fort Leonard Wood ceremony"
                            fill
                            sizes="(min-width: 1024px) 50vw, 100vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}

/* 5. Plan your stay ---------------------------------------------------------- */
function PlanYourStay() {
    const tips: { Icon: LucideIcon; title: string; body: string }[] = [
        {
            Icon: CalendarCheck,
            title: "Book early",
            body: "Graduation weeks sell out. Reserve as soon as you know the date.",
        },
        {
            Icon: Coffee,
            title: "Free breakfast",
            body: "Start ceremony morning with a hot breakfast before you head to base.",
        },
        {
            Icon: Users,
            title: "Rooms for the family",
            body: "Block rooms together so grandparents and siblings stay close.",
        },
        {
            Icon: Clock,
            title: "Easy check-in",
            body: "Tell us your schedule for early ceremonies or late arrivals.",
        },
        {
            Icon: PawPrint,
            title: "Pet-friendly",
            body: "Bringing a pet? Several of our hotels welcome them.",
        },
        {
            Icon: Car,
            title: "Free parking",
            body: "Room for cars, trucks, and larger vehicles right at the hotel.",
        },
    ];
    return (
        <section className="bg-white">
            <Container className="py-16 sm:py-20">
                <SectionHeading
                    eyebrow="Plan your stay"
                    title="Everything a graduation family needs"
                    align="center"
                    className="mb-10"
                />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {tips.map(({ Icon, title, body }) => (
                        <div
                            key={title}
                            className="group border-sand-200 hover:border-gold-300 rounded-2xl border bg-white p-6 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
                        >
                            <span className="bg-gold-100 group-hover:bg-gold-200 inline-flex size-11 items-center justify-center rounded-xl transition-colors duration-200">
                                <Icon className="text-gold-700 size-5" aria-hidden />
                            </span>
                            <h3 className="text-navy-800 mt-4 text-lg font-semibold">
                                {title}
                            </h3>
                            <p className="text-sand-700 mt-1.5 text-sm">{body}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}

/* 6. Group rooms ------------------------------------------------------------- */
function GroupRooms() {
    return (
        <section className="bg-navy-900 text-sand-100">
            <Container className="py-16 sm:py-20">
                <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
                    <div className="max-w-2xl">
                        <p className="text-gold-300 mb-3 text-sm font-semibold tracking-[0.14em] uppercase">
                            Bringing the whole family
                        </p>
                        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                            Room blocks for extended family
                        </h2>
                        <p className="text-sand-200 mt-4 text-lg">
                            When grandparents, siblings, and cousins all come to
                            celebrate, we coordinate rooms across our St. Robert hotels so
                            everyone stays close. One team, one set of dates, no juggling
                            three call centers.
                        </p>
                    </div>
                    <Link
                        href="/groups"
                        className={cn(
                            buttonVariants({ variant: "outlineGold", size: "lg" }),
                            "shrink-0",
                        )}
                    >
                        Request a group block
                        <ArrowRight className="size-4" aria-hidden />
                    </Link>
                </div>
            </Container>
        </section>
    );
}

/* 7. Between events ---------------------------------------------------------- */
function BetweenEvents() {
    const things: { Icon: LucideIcon; title: string; body: string }[] = [
        {
            Icon: Utensils,
            title: "Local dining",
            body: "Family-friendly restaurants and quick bites are minutes from your hotel in St. Robert and Waynesville.",
        },
        {
            Icon: Compass,
            title: "Things to do",
            body: "Fill the time between Family Day and graduation with local parks, shops, and the area's museums.",
        },
    ];
    return (
        <section className="bg-sand-100">
            <Container className="py-16 sm:py-20">
                <SectionHeading
                    eyebrow="Between Family Day and graduation"
                    title="Make a weekend of it"
                    subtitle="A little downtime before the ceremony is a great chance to relax together nearby."
                />
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    {things.map(({ Icon, title, body }) => (
                        <div
                            key={title}
                            className="group flex gap-4 rounded-2xl bg-white p-6 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
                        >
                            <span className="bg-gold-100 group-hover:bg-gold-200 inline-flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-200">
                                <Icon className="text-gold-700 size-5" aria-hidden />
                            </span>
                            <div>
                                <h3 className="text-navy-800 text-lg font-semibold">
                                    {title}
                                </h3>
                                <p className="text-sand-700 mt-1.5 text-sm">{body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}

/* 8. Directions to the gates ------------------------------------------------- */
function Directions({ gateDirections }: { gateDirections: string }) {
    return (
        <section className="bg-white">
            <Container className="py-16 sm:py-20">
                <div className="grid gap-10 lg:grid-cols-2">
                    <div>
                        <SectionHeading
                            eyebrow="Getting to base"
                            title="Directions to the gates"
                        />
                        <ol className="text-sand-700 mt-6 space-y-3">
                            <li className="flex gap-3">
                                <span className="text-gold-600 font-semibold">1.</span>
                                Take I-44 to Exit 161 at St. Robert.
                            </li>
                            <li className="flex gap-3">
                                <span className="text-gold-600 font-semibold">2.</span>
                                Turn south onto Missouri Avenue at the light.
                            </li>
                            <li className="flex gap-3">
                                <span className="text-gold-600 font-semibold">3.</span>
                                Continue about 3 miles to the main gate and Visitor
                                Control Center.
                            </li>
                        </ol>
                        <p className="text-sand-600 mt-5 text-sm">
                            Visitors without a Department of Defense ID should plan extra
                            time at the Visitor Control Center for a background check
                            before entering post.
                        </p>
                        <a
                            href={FLW_LINKS.visitorAccess}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(officialLink, "mt-4")}
                        >
                            Official Fort Leonard Wood visitor access and gate hours
                            <ExternalLink className="size-4" aria-hidden />
                        </a>
                    </div>

                    <Card interactive className="flex flex-col justify-center p-6">
                        <p className="text-gold-700 text-sm font-semibold tracking-wide uppercase">
                            {FLW_MAIN_GATE.name}
                        </p>
                        <p className="text-navy-800 mt-2 font-serif text-xl">
                            {FLW_MAIN_GATE.detail}
                        </p>
                        <p className="text-sand-700 mt-1">
                            {FLW_MAIN_GATE.city}, {FLW_MAIN_GATE.state}{" "}
                            {FLW_MAIN_GATE.zip}
                        </p>
                        <p className="text-sand-600 mt-1 inline-flex items-center gap-1.5 text-sm">
                            <Clock className="text-gold-600 size-4" aria-hidden />
                            {FLW_MAIN_GATE.hours}
                        </p>
                        <a
                            href={gateDirections}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                buttonVariants({ variant: "outline", size: "sm" }),
                                "mt-5 self-start",
                            )}
                        >
                            <Navigation className="size-4" aria-hidden />
                            Directions to the gate
                        </a>
                    </Card>
                </div>
            </Container>
        </section>
    );
}

/* 9. FAQ --------------------------------------------------------------------- */
function Faqs() {
    return (
        <section className="bg-sand-100">
            <Container className="py-16 sm:py-20">
                <SectionHeading
                    eyebrow="Good to know"
                    title="Graduation travel questions"
                    align="center"
                    className="mb-10"
                />
                <div className="mx-auto max-w-3xl">
                    <FaqAccordion items={FAQS} />
                </div>
            </Container>
        </section>
    );
}

/* 10. Closing CTA ------------------------------------------------------------ */
function ClosingCta() {
    return (
        <section className="bg-navy-800">
            <Container className="py-16 text-center sm:py-20">
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    Ready when you are
                </h2>
                <p className="text-sand-200 mx-auto mt-4 max-w-2xl text-lg">
                    Book a room near base, ask about group blocks, or reach out with any
                    question about your graduation trip.
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
                    <Link
                        href="/groups"
                        className={buttonVariants({
                            variant: "outlineGold",
                            size: "lg",
                        })}
                    >
                        Group inquiry
                    </Link>
                </div>
            </Container>
        </section>
    );
}
