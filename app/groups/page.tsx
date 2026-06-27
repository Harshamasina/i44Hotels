import Link from "next/link";
import Image from "next/image";
import {
    GraduationCap,
    Trophy,
    Briefcase,
    PartyPopper,
    BedDouble,
    Bus,
    Users,
    Layers,
    CalendarClock,
    Heart,
    ArrowRight,
    type LucideIcon,
} from "lucide-react";
import { getOperatingProperties } from "@/lib/properties";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
    title: "Group Room Blocks & Extended Stays",
    description:
        "One team to coordinate room blocks across I44 Hotels along Interstate 44. Fort Leonard Wood graduation families, sports teams, work crews, family gatherings, and extended stays. Request a group block today.",
    path: "/groups",
});

const AUDIENCES: { Icon: LucideIcon; title: string; blurb: string }[] = [
    {
        Icon: GraduationCap,
        title: "Graduation families",
        blurb: "Extended family in town for a Fort Leonard Wood graduation, staying close to base.",
    },
    {
        Icon: Trophy,
        title: "Sports teams & tournaments",
        blurb: "Players, coaches, and parents who need rooms together at one rate.",
    },
    {
        Icon: Briefcase,
        title: "Work crews & corporate",
        blurb: "Crews on a project or teams traveling for business along the corridor.",
    },
    {
        Icon: PartyPopper,
        title: "Family gatherings",
        blurb: "Reunions, weddings, and celebrations that bring everyone to one place.",
    },
    {
        Icon: BedDouble,
        title: "Extended & long-term stays",
        blurb: "Settling in for a few weeks or longer? Ask about extended-stay arrangements.",
    },
    {
        Icon: Bus,
        title: "Bus & truck travelers",
        blurb: "Tour groups and large vehicles, with parking to match at select hotels.",
    },
];

const WHY: { Icon: LucideIcon; title: string; blurb: string }[] = [
    {
        Icon: Users,
        title: "One team, not three call centers",
        blurb: "We coordinate your whole block across our hotels, so you have a single point of contact instead of juggling separate brands.",
    },
    {
        Icon: Layers,
        title: "Mix budgets in one block",
        blurb: "Put budget-minded guests and those who want a little more in nearby hotels along I-44, all under one plan.",
    },
    {
        Icon: GraduationCap,
        title: "Fort Leonard Wood expertise",
        blurb: "We host graduation families in St. Robert every week and know how to keep extended family together near the gates.",
    },
    {
        Icon: CalendarClock,
        title: "Flexible holds & easy booking",
        blurb: "Tell us your dates and headcount and we will help set up the block, then point each guest to the best direct rate.",
    },
];

const STEPS: { title: string; blurb: string }[] = [
    {
        title: "Tell us about your group",
        blurb: "Share your dates, rough headcount, and what you are in town for. A few details are enough to start.",
    },
    {
        title: "We coordinate rooms & rates",
        blurb: "Our team lines up availability across our hotels and finds the best fit for your group's size and budget.",
    },
    {
        title: "You get one simple plan",
        blurb: "We confirm the arrangement and make it easy for everyone to book their room. One contact for the whole stay.",
    },
];

export default function GroupsPage() {
    return (
        <>
            <Hero />
            <WhoWeHost />
            <WhyBlock />
            <HowItWorks />
            <ExtendedStay />
            <ClosingCta />
        </>
    );
}

/* Hero ----------------------------------------------------------------------
 * Reception photo bleeds in from the right, its scrims fading to the section's
 * solid navy-900 (same color) so the photo melts in with no seam, mirroring
 * the homepage FLW band. Hidden on small screens where it would crowd the copy. */
function Hero() {
    return (
        <section className="bg-navy-900 text-sand-100 relative isolate overflow-hidden">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block xl:w-[55%]">
                <Image
                    src="/brand/flags/reception.jpg"
                    alt="Hotel front-desk staff welcoming guests at the reception counter"
                    fill
                    priority
                    sizes="55vw"
                    className="object-cover object-center"
                />
                <div
                    aria-hidden
                    className="from-navy-900 via-navy-900/40 absolute inset-0 bg-linear-to-r to-transparent"
                />
                <div
                    aria-hidden
                    className="from-navy-900/50 absolute inset-0 bg-linear-to-t to-transparent"
                />
            </div>

            <Container className="relative py-24 sm:py-28 lg:py-32">
                <div className="max-w-2xl lg:max-w-xl">
                    <p className="text-gold-300 mb-3 text-sm font-semibold tracking-[0.14em] uppercase">
                        Groups & Extended Stay
                    </p>
                    <h1 className="text-4xl font-semibold text-white sm:text-5xl">
                        Room blocks made easy along I-44
                    </h1>
                    <p className="text-sand-200 mt-5 text-lg sm:text-xl">
                        Booking for a crowd? We coordinate group blocks across our hotels,
                        so you talk to one team instead of three call centers, whether you
                        are here for a graduation, a tournament, or a family gathering.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/contact?reason=group"
                            className={buttonVariants({ size: "lg" })}
                        >
                            Request a group block
                            <ArrowRight className="size-4" aria-hidden />
                        </Link>
                        <Link
                            href="/hotels"
                            className={buttonVariants({
                                variant: "outlineGold",
                                size: "lg",
                            })}
                        >
                            See our hotels
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}

/* Who we host ---------------------------------------------------------------- */
function WhoWeHost() {
    return (
        <section className="bg-white">
            <Container className="py-16 sm:py-20">
                <SectionHeading
                    eyebrow="Who we host"
                    title="Groups of every kind, all along the corridor"
                    subtitle="If you are traveling together, we can help you stay together."
                    align="center"
                />
                <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {AUDIENCES.map(({ Icon, title, blurb }) => (
                        <li
                            key={title}
                            className="group border-sand-200 hover:border-gold-300 h-full rounded-2xl border bg-white p-6 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
                        >
                            <span className="bg-gold-100 group-hover:bg-gold-200 inline-flex size-12 items-center justify-center rounded-xl transition-colors duration-200">
                                <Icon className="text-gold-700 size-6" aria-hidden />
                            </span>
                            <h3 className="text-navy-800 mt-4 text-lg font-semibold">
                                {title}
                            </h3>
                            <p className="text-sand-700 mt-2 text-sm">{blurb}</p>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}

/* Why book a block with us --------------------------------------------------- */
function WhyBlock() {
    return (
        <section className="bg-sand-100">
            <Container className="py-16 sm:py-20">
                <SectionHeading
                    eyebrow="Why I44 Hotels"
                    title="The block the brand sites cannot coordinate"
                    subtitle="We own a portfolio of hotels along I-44, so we can do something a single franchise site cannot: line up rooms across hotels and brands as one plan."
                />
                <div className="mt-12 grid gap-6 sm:grid-cols-2">
                    {WHY.map(({ Icon, title, blurb }) => (
                        <div
                            key={title}
                            className="group border-sand-200 hover:border-gold-300 flex gap-4 rounded-2xl border bg-white p-6 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
                        >
                            <span className="bg-gold-100 group-hover:bg-gold-200 inline-flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200">
                                <Icon className="text-gold-700 size-6" aria-hidden />
                            </span>
                            <div>
                                <h3 className="text-navy-800 text-lg font-semibold">
                                    {title}
                                </h3>
                                <p className="text-sand-700 mt-2 text-sm">{blurb}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}

/* How it works --------------------------------------------------------------- */
function HowItWorks() {
    return (
        <section className="bg-white">
            <Container className="py-16 sm:py-20">
                <SectionHeading
                    eyebrow="How it works"
                    title="Three steps, one team"
                    align="center"
                />
                <ol className="mt-12 grid gap-8 sm:grid-cols-3">
                    {STEPS.map((step, i) => (
                        <li key={step.title} className="relative">
                            <span className="bg-navy-800 text-gold-300 flex size-11 items-center justify-center rounded-full text-lg font-semibold">
                                {i + 1}
                            </span>
                            <h3 className="text-navy-800 mt-4 text-lg font-semibold">
                                {step.title}
                            </h3>
                            <p className="text-sand-700 mt-2">{step.blurb}</p>
                        </li>
                    ))}
                </ol>
            </Container>
        </section>
    );
}

/* Extended-stay note --------------------------------------------------------- */
function ExtendedStay() {
    const count = getOperatingProperties().length;
    return (
        <section className="bg-sand-50">
            <Container className="py-14 sm:py-16">
                <div className="group border-sand-200 hover:border-gold-300 flex flex-col items-start gap-5 rounded-2xl border bg-white p-6 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-md sm:flex-row sm:items-center sm:gap-6 sm:p-8">
                    <span className="bg-gold-100 group-hover:bg-gold-200 inline-flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200">
                        <Heart className="text-gold-700 size-6" aria-hidden />
                    </span>
                    <div className="flex-1">
                        <h2 className="text-navy-800 text-xl font-semibold">
                            Staying a while?
                        </h2>
                        <p className="text-sand-700 mt-2">
                            Work crews and long-term guests can settle in across our{" "}
                            {count} hotels along I-44. Tell us your dates and we will help
                            arrange an extended stay that fits.
                        </p>
                    </div>
                    <Link
                        href="/contact?reason=extended"
                        className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
                    >
                        Ask about extended stays
                    </Link>
                </div>
            </Container>
        </section>
    );
}

/* Closing CTA ---------------------------------------------------------------- */
function ClosingCta() {
    return (
        <section className="bg-navy-800">
            <Container className="py-16 text-center sm:py-20">
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    Let us handle the rooms
                </h2>
                <p className="text-sand-200 mx-auto mt-4 max-w-xl text-lg">
                    Send your dates and headcount and our team will put together a plan
                    for your whole group.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link
                        href="/contact?reason=group"
                        className={buttonVariants({ size: "lg" })}
                    >
                        Request a group block
                        <ArrowRight className="size-4" aria-hidden />
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
    );
}
