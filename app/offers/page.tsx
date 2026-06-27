import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getOffers, getFeaturedOffer, type Offer } from "@/lib/offers";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RouteDivider } from "@/components/ui/route-divider";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
    title: "Offers & Rates",
    description:
        "Ways to save across I44 Hotels: military and government rates, AAA and AARP rates, and Wyndham Rewards, Choice Privileges, and World of Hyatt loyalty programs. Book direct for the best rate near Fort Leonard Wood and along Interstate 44.",
    path: "/offers",
});

export default function OffersPage() {
    const featured = getFeaturedOffer();
    const rest = getOffers().filter((o) => o.slug !== featured?.slug);

    return (
        <>
            <section className="bg-sand-100">
                <Container className="py-16 sm:py-20">
                    <SectionHeading
                        as="h1"
                        eyebrow="Offers & Rates"
                        title="Ways to save with I44 Hotels"
                        subtitle="We book through each hotel's brand, so the best rates live on the brands' booking pages. Here is how to find the rate you qualify for, then book direct with no middleman markup."
                        align="center"
                    />
                    <RouteDivider className="mt-10" />
                </Container>
            </section>

            {featured && (
                <section className="bg-white">
                    <Container className="pt-12 sm:pt-16">
                        <FeaturedOffer offer={featured} />
                    </Container>
                </section>
            )}

            <section className="bg-white">
                <Container className="py-12 sm:py-16">
                    {rest.length === 0 ? (
                        <p className="text-sand-600 mx-auto max-w-md text-center">
                            No other active offers right now. Please check back soon, or
                            contact us about rates for your stay.
                        </p>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2">
                            {rest.map((o) => (
                                <OfferCard key={o.slug} offer={o} />
                            ))}
                        </div>
                    )}
                </Container>
            </section>

            <section className="bg-sand-50">
                <Container className="py-12 text-center sm:py-16">
                    <h2 className="text-navy-800 text-2xl font-semibold sm:text-3xl">
                        Not sure which rate is best?
                    </h2>
                    <p className="text-sand-700 mx-auto mt-3 max-w-xl">
                        Call the front desk or send us a note. We will help you find the
                        best available rate for your stay.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Link href="/hotels" className={buttonVariants()}>
                            Book Now
                        </Link>
                        <Link
                            href="/contact"
                            className={buttonVariants({ variant: "outline" })}
                        >
                            Contact us
                        </Link>
                    </div>
                </Container>
            </section>
        </>
    );
}

/** Large lead card for the featured offer (currently military & government rates). */
function FeaturedOffer({ offer }: { offer: Offer }) {
    const { Icon } = offer;
    return (
        <Card className="group border-gold-200 overflow-hidden border transition-shadow duration-200 hover:shadow-lg">
            <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
                <div className="p-6 sm:p-8 lg:p-10">
                    <p className="text-gold-700 text-xs font-semibold tracking-[0.14em] uppercase">
                        Featured &middot; {offer.audience}
                    </p>
                    <h2 className="text-navy-800 mt-2 text-2xl font-semibold sm:text-3xl">
                        {offer.title}
                    </h2>
                    <p className="text-sand-500 mt-2 text-sm font-medium">
                        {offer.appliesTo}
                    </p>
                    <div className="text-sand-700 mt-4 space-y-3">
                        {offer.body.map((para) => (
                            <p key={para}>{para}</p>
                        ))}
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href="/hotels" className={buttonVariants()}>
                            Book Now
                        </Link>
                        {offer.link && (
                            <Link
                                href={offer.link.href}
                                className={buttonVariants({ variant: "outline" })}
                            >
                                {offer.link.label}
                                <ArrowRight className="size-4" aria-hidden />
                            </Link>
                        )}
                    </div>
                </div>
                <div className="bg-gold-50 relative min-h-56 md:min-h-full">
                    {offer.logo ? (
                        <Image
                            src={offer.logo}
                            alt="A waving United States flag"
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                    ) : (
                        <span className="bg-gold-100 absolute top-1/2 left-1/2 inline-flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl">
                            <Icon className="text-gold-700 size-9" aria-hidden />
                        </span>
                    )}
                </div>
            </div>
        </Card>
    );
}

/** Standard offer card used in the grid below the featured offer. */
function OfferCard({ offer }: { offer: Offer }) {
    const { Icon } = offer;
    return (
        <div className="group border-sand-200 hover:border-gold-300 flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-md sm:p-8">
            {offer.logo ? (
                <ProgramLogo logo={offer.logo} title={offer.title} />
            ) : (
                <span className="bg-gold-100 group-hover:bg-gold-200 inline-flex size-14 items-center justify-center rounded-xl transition-colors duration-200">
                    <Icon className="text-gold-700 size-7" aria-hidden />
                </span>
            )}
            <p className="text-gold-700 mt-6 text-xs font-semibold tracking-[0.14em] uppercase">
                {offer.audience}
            </p>
            <h3 className="text-navy-800 mt-1 text-xl font-semibold">{offer.title}</h3>
            <p className="text-sand-700 mt-3 flex-1">{offer.summary}</p>
            <p className="text-sand-500 mt-4 text-sm font-medium">{offer.appliesTo}</p>
            <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/hotels" className={buttonVariants({ size: "sm" })}>
                    Book Now
                </Link>
                {offer.link && (
                    <Link
                        href={offer.link.href}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                        {offer.link.label}
                    </Link>
                )}
            </div>
        </div>
    );
}

/**
 * Program logo: centered in a uniform box (~60% of card width, fixed height) so
 * logos of different shapes read at a similar size. object-contain keeps them
 * undistorted; unoptimized skips the image optimizer (also serves SVG directly,
 * since dangerouslyAllowSVG is not enabled) and works for PNG alike.
 */
function ProgramLogo({ logo, title }: { logo: string; title: string }) {
    return (
        <div className="relative mx-auto h-20 w-3/5">
            <Image
                src={logo}
                alt={`${title} logo`}
                fill
                sizes="(max-width: 640px) 60vw, 30vw"
                unoptimized
                className="object-contain object-center"
            />
        </div>
    );
}
