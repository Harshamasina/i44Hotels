import { MapPin, Phone, Clock } from "lucide-react";
import {
    getAllProperties,
    formatAddress,
    directionsHref,
    telHref,
} from "@/lib/properties";
import { isInquiryReason, type InquiryReason } from "@/lib/inquiry";
import { createFormToken } from "@/lib/inquiry-security";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RouteDivider } from "@/components/ui/route-divider";
import { ComingSoonBadge } from "@/components/ui/badge";
import { InquiryForm } from "@/components/site/inquiry-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
    title: "Contact Us",
    description:
        "Get in touch with I44 Hotels. Send a general question, request a group room block, ask about extended stays, or plan a Fort Leonard Wood graduation trip. Hotel addresses and phone numbers along Interstate 44.",
    path: "/contact",
});

export default async function ContactPage({
    searchParams,
}: {
    searchParams: Promise<{ reason?: string }>;
}) {
    const { reason } = await searchParams;
    const defaultReason: InquiryReason = isInquiryReason(reason) ? reason : "general";

    const hotels = getAllProperties().map((p) => ({
        value: p.slug,
        label: p.shortName,
    }));
    const properties = getAllProperties();
    const formToken = await createFormToken();

    return (
        <>
            <section className="bg-sand-100">
                <Container className="py-16 sm:py-20">
                    <SectionHeading
                        as="h1"
                        eyebrow="Contact"
                        title="We are glad to help"
                        subtitle="One message reaches our team. Ask a question, request a group room block, plan an extended stay, or tell us about your Fort Leonard Wood trip, and we will get back to you."
                        align="center"
                    />
                    <RouteDivider className="mt-10" />
                </Container>
            </section>

            <section className="bg-white">
                <Container className="py-12 sm:py-16">
                    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
                        <div>
                            <h2 className="text-navy-800 text-2xl font-semibold">
                                Send us a message
                            </h2>
                            <p className="text-sand-700 mt-2 mb-7">
                                Fields marked with <span className="text-error">*</span>{" "}
                                are required.
                            </p>
                            <InquiryForm
                                hotels={hotels}
                                defaultReason={defaultReason}
                                formToken={formToken}
                            />
                        </div>

                        <aside className="space-y-5">
                            <h2 className="text-navy-800 text-2xl font-semibold">
                                Reach a hotel directly
                            </h2>
                            <p className="text-sand-700">
                                Prefer to call? Here is every hotel along I-44. The front
                                desk can help with rates, directions, and availability.
                            </p>
                            {properties.map((p) => {
                                const address = formatAddress(p);
                                const directions = directionsHref(p);
                                const tel = telHref(p.phone);
                                return (
                                    <div
                                        key={p.slug}
                                        className="group border-sand-200 hover:border-gold-300 rounded-2xl border bg-white p-5 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="text-navy-800 font-semibold">
                                                {p.shortName}
                                            </h3>
                                            {p.status === "coming-soon" && (
                                                <ComingSoonBadge />
                                            )}
                                        </div>
                                        <ul className="text-sand-700 mt-3 space-y-2 text-sm">
                                            {address && (
                                                <li className="flex items-start gap-2">
                                                    <MapPin
                                                        className="text-gold-600 mt-0.5 size-4 shrink-0"
                                                        aria-hidden
                                                    />
                                                    {directions ? (
                                                        <a
                                                            href={directions}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:text-navy-800 underline-offset-2 hover:underline"
                                                        >
                                                            {address}
                                                        </a>
                                                    ) : (
                                                        <span>{address}</span>
                                                    )}
                                                </li>
                                            )}
                                            {tel ? (
                                                <li className="flex items-center gap-2">
                                                    <Phone
                                                        className="text-gold-600 size-4 shrink-0"
                                                        aria-hidden
                                                    />
                                                    <a
                                                        href={tel}
                                                        className="hover:text-navy-800 font-medium underline-offset-2 hover:underline"
                                                    >
                                                        {p.phone}
                                                    </a>
                                                </li>
                                            ) : (
                                                <li className="text-sand-500 flex items-center gap-2">
                                                    <Clock
                                                        className="size-4 shrink-0"
                                                        aria-hidden
                                                    />
                                                    Phone available at opening
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                );
                            })}
                        </aside>
                    </div>
                </Container>
            </section>
        </>
    );
}
