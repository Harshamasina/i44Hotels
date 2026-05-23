import type { Metadata } from "next";
import Link from "next/link";
import { BadgePercent } from "lucide-react";
import { getOffers } from "@/lib/offers";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Offers & Rates",
    description:
        "Current offers and special rates from I44 Hotels, including military and government rates for travelers visiting Fort Leonard Wood and along Interstate 44.",
    alternates: { canonical: "/offers" },
};

export default function OffersPage() {
    const offers = getOffers();

    return (
        <>
            <section className="bg-sand-100">
                <Container className="py-16 sm:py-20">
                    <SectionHeading
                        eyebrow="Offers"
                        title="Offers and rates"
                        subtitle="Ways to save across our hotels along Interstate 44. More offers are on the way."
                        align="center"
                    />
                </Container>
            </section>

            <section className="bg-white">
                <Container className="py-16 sm:py-20">
                    {offers.length === 0 ? (
                        <p className="text-sand-600 mx-auto max-w-md text-center">
                            No active offers right now. Please check back soon, or
                            contact us about rates for your stay.
                        </p>
                    ) : (
                        <div className="mx-auto grid max-w-4xl gap-6">
                            {offers.map((o) => (
                                <Card key={o.slug} className="p-6 sm:p-8">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                        <span className="bg-gold-100 inline-flex size-12 shrink-0 items-center justify-center rounded-xl">
                                            <BadgePercent
                                                className="text-gold-700 size-6"
                                                aria-hidden
                                            />
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-gold-700 text-xs font-semibold tracking-[0.14em] uppercase">
                                                {o.audience}
                                            </p>
                                            <h2 className="text-navy-800 mt-1 text-2xl font-semibold">
                                                {o.title}
                                            </h2>
                                            <div className="text-sand-700 mt-3 space-y-3">
                                                {o.body.map((para) => (
                                                    <p key={para}>{para}</p>
                                                ))}
                                            </div>
                                            <div className="mt-6 flex flex-wrap gap-3">
                                                <Link
                                                    href="/hotels"
                                                    className={buttonVariants()}
                                                >
                                                    Book Now
                                                </Link>
                                                {o.link && (
                                                    <Link
                                                        href={o.link.href}
                                                        className={cn(
                                                            buttonVariants({
                                                                variant: "outline",
                                                            }),
                                                        )}
                                                    >
                                                        {o.link.label}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </Container>
            </section>
        </>
    );
}
