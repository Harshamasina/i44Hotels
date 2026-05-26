import type { Metadata } from "next";
import Link from "next/link";
import { getOperatingProperties, type Property } from "@/lib/properties";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RouteDivider } from "@/components/ui/route-divider";
import { FaqAccordion, type Faq } from "@/components/ui/faq-accordion";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Fort Leonard Wood Hotels FAQ",
    description:
        "Answers about hotels near Fort Leonard Wood: where to stay for basic training graduation and Family Day, distance to the main gate, base access passes, military and government rates, pet-friendly and extended-stay options, airports, and booking tips for St. Robert, Waynesville, and the I-44 corridor.",
    alternates: { canonical: "/faq" },
};

// Authoritative outbound resources (open in a new tab, marked external).
const FLW_VISITOR_ACCESS = "https://home.army.mil/wood/my-fort/visitors-access";
const IHG_ARMY_HOTELS = "https://www.ihg.com/armyhotels/hotels/us/en/reservation";

const FAQ_SECTIONS: { heading: string; items: Faq[] }[] = [
    {
        heading: "Planning a graduation or Family Day visit",
        items: [
            {
                q: "Where should families stay for a Fort Leonard Wood basic training graduation?",
                a: "Our hotels in St. Robert are minutes from the gates and host graduation families every week. Comfort Inn St. Robert is closest to the main gate, with Days Inn nearby and Hyatt Select coming soon. Because rooms fill quickly around Family Day and the ceremony, we recommend booking early.",
                links: [
                    { label: "Fort Leonard Wood travel guide", href: "/military-travel" },
                ],
            },
            {
                q: "When should I book a hotel for graduation or Family Day weekend?",
                a: "Graduations run on a near-weekly cycle, and rooms around Family Day and ceremony nights fill fast. Book several weeks ahead, and earlier during the busy spring and summer cycles. If your dates are flexible, midweek nights are usually easier to find.",
                links: [
                    { label: "Plan your stay", href: "/military-travel" },
                    { label: "Current offers", href: "/offers" },
                ],
            },
            {
                q: "Do you help families visiting for AIT, OSUT, or a PCS move?",
                a: "Yes. Whether you are here for an AIT or OSUT graduation, on temporary duty (TDY), or relocating with a permanent change of station (PCS), we can help you find a comfortable room and arrange a longer stay if you need one.",
                links: [
                    { label: "Extended stays", href: "/groups" },
                    { label: "Military travel", href: "/military-travel" },
                ],
            },
            {
                q: "Can you arrange a block of rooms for extended family?",
                a: "Yes. We can coordinate a group room block across our St. Robert hotels so your whole family can stay close together. Send us your dates and headcount and one team will handle it.",
                links: [{ label: "Request a group block", href: "/groups" }],
            },
        ],
    },
    {
        heading: "Distance, directions, and getting to base",
        items: [
            {
                q: "How far are your hotels from Fort Leonard Wood?",
                a: "Our St. Robert hotels sit about 2 to 4 miles from the main gate, roughly a 6 to 10 minute drive. Comfort Inn St. Robert is the closest at about 2 miles.",
                links: [{ label: "Directions to each hotel", href: "/local-area" }],
            },
            {
                q: "Which hotel is closest to the Fort Leonard Wood main gate?",
                a: "Comfort Inn St. Robert is closest, about 2 miles from the main gate. Days Inn and the coming-soon Hyatt Select are about 4 miles out.",
                links: [{ label: "See hotels near base", href: "/military-travel" }],
            },
            {
                q: "What is the nearest airport to Fort Leonard Wood?",
                a: "Springfield-Branson National (SGF) is the closer major airport, about 100 miles west, roughly a 1.5 to 2 hour drive. St. Louis Lambert International (STL) is about 140 miles east, roughly a 2 to 2.5 hour drive, with more flight options. A small regional airport also serves the Waynesville and St. Robert area for general aviation. All of our hotels are right along I-44 between them.",
                links: [{ label: "Airports & directions", href: "/local-area" }],
            },
            {
                q: "Do your hotels offer a shuttle to the base?",
                a: "A regular base shuttle is not guaranteed and varies, so most guests drive or use a rideshare or taxi for the short trip to the gates. Call the front desk before you travel to ask about current options.",
                links: [{ label: "Contact a hotel", href: "/contact" }],
            },
        ],
    },
    {
        heading: "Base access and on-base lodging",
        items: [
            {
                q: "What do hotel guests need to get onto Fort Leonard Wood?",
                a: "Visitors without a military or DoD ID need an installation pass from the Visitor Control Center (2624 Missouri Ave). You will need a REAL ID-compliant driver's license, or another accepted ID if yours is not REAL ID-compliant, and you must pass a background check, which can take up to about 24 hours. You can pre-register online to speed things up. Requirements change, so check the official visitor access page and allow extra time on graduation days.",
                links: [
                    {
                        label: "Official FLW visitor access",
                        href: FLW_VISITOR_ACCESS,
                        external: true,
                    },
                ],
            },
            {
                q: "Can I book lodging on Fort Leonard Wood directly, like the TLF?",
                a: "On-base lodging, including the Temporary Lodging Facility, is run by IHG Army Hotels (such as Candlewood Suites and the Holiday Inn Express lodges) and is generally reserved for eligible military and DoD-affiliated guests, with limited availability. If you are not eligible or it is full, our off-base hotels in St. Robert are a convenient alternative, especially during busy graduation weeks.",
                links: [
                    {
                        label: "IHG Army Hotels (on-base)",
                        href: IHG_ARMY_HOTELS,
                        external: true,
                    },
                ],
            },
            {
                q: "Is St. Robert a safe, convenient area to stay?",
                a: "St. Robert and neighboring Waynesville are the established gateway towns for Fort Leonard Wood, used to welcoming military families every week. Our hotels sit in the main commercial area right off Interstate 44, close to restaurants, shopping, and the base gates, so you are never far from what you need.",
                links: [{ label: "Explore the local area", href: "/local-area" }],
            },
        ],
    },
    {
        heading: "Rates, discounts, and value",
        items: [
            {
                q: "Do you offer military or government rates near Fort Leonard Wood?",
                a: "Our hotel brands (Wyndham for Days Inn, Choice for the Comfort Inns, and Hyatt for the coming-soon Hyatt Select) offer military and government rates. Look for that rate on the brand's booking page and have your eligible ID ready at check-in, or call the front desk and we will help.",
                links: [{ label: "See all offers", href: "/offers" }],
            },
            {
                q: "Are AAA, AARP, or senior discounts available?",
                a: "Yes. Our brands offer AAA and AARP or senior rates on eligible rooms. Select the rate when you book and bring your membership card to check-in.",
                links: [{ label: "Ways to save", href: "/offers" }],
            },
            {
                q: "What are the most affordable, best-value hotels near the base?",
                a: "Days Inn is our economy option in St. Robert, while the Comfort Inns offer midscale comfort with pools and fitness centers. Booking direct on the brand site is the true best-rate channel, with no third-party markup.",
                links: [{ label: "Compare amenities", href: "/amenities" }],
            },
        ],
    },
    {
        heading: "Amenities and your stay",
        items: [
            {
                q: "Do your hotels include free breakfast and Wi-Fi?",
                a: "Yes. Every operating hotel offers a free hot breakfast, free Wi-Fi, and free parking. The Comfort Inns also have an indoor heated pool and a fitness center.",
                links: [{ label: "All amenities", href: "/amenities" }],
            },
            {
                q: "Are your hotels pet-friendly?",
                a: "Several of our hotels offer pet-friendly rooms, though policies and any fees vary by property. Check the hotel's amenities or call ahead before traveling with a pet.",
                links: [{ label: "Amenities by hotel", href: "/amenities" }],
            },
            {
                q: "Do you allow extended or long-term stays?",
                a: "Yes. For work crews, soldiers in transition, and families relocating, we can arrange extended stays. Tell us your dates and we will help you set it up.",
                links: [{ label: "Extended stays", href: "/groups" }],
            },
            {
                q: "Do rooms have a kitchen, microwave, or refrigerator?",
                a: "Full kitchens are limited at our hotels. For a microwave or mini-fridge, ask the front desk about the room types available at each hotel before you book. If you need a full kitchen for a longer stay, mention it and we will point you in the right direction.",
                links: [{ label: "Ask about a stay", href: "/contact" }],
            },
            {
                q: "Can I get early check-in or late checkout?",
                a: "Often, yes, which helps around early graduation ceremonies. Our hotels list early check-in and late checkout, which may carry a small fee, and you can always ask the front desk and we will do our best to accommodate your schedule.",
            },
            {
                q: "Are your hotels good for business travelers?",
                a: "Yes. You get free Wi-Fi and work-friendly rooms, and the Comfort Inns add business services such as copy, print, and fax along with a meeting or business center.",
                links: [{ label: "Amenities", href: "/amenities" }],
            },
            {
                q: "Are your hotels family-friendly?",
                a: "Yes. Free breakfast, indoor pools at select hotels, and room for the whole family make our hotels comfortable for kids and grandparents alike. There is also plenty to do nearby between events.",
                links: [{ label: "Things to do nearby", href: "/local-area" }],
            },
        ],
    },
    {
        heading: "Booking and availability",
        items: [
            {
                q: "How do I book, and is booking direct cheaper?",
                a: "Use the Book Now buttons, which link to each hotel's official brand booking page. Booking direct is the true best-rate channel, with no online-travel-agency markup, and it is the easiest way to apply a military, AAA, or AARP rate.",
                links: [{ label: "Current offers", href: "/offers" }],
            },
            {
                q: "What if there is no last-minute availability for my dates?",
                a: "Availability changes daily and graduation weeks are the busiest. If your preferred hotel is sold out, call us and we will help you find a room at another of our hotels along I-44 or suggest the best nearby option.",
                links: [{ label: "Contact us", href: "/contact" }],
            },
        ],
    },
];

/** Per-hotel FAQs generated from the property data so they stay accurate. */
function propertyFaqs(p: Property): Faq[] {
    const faqs: Faq[] = [];

    if (p.nearFLW && p.distanceToFLWMiles != null && p.distanceToFLWMinutes != null) {
        faqs.push({
            q: `How far is ${p.shortName} from Fort Leonard Wood?`,
            a: `${p.shortName} is about ${p.distanceToFLWMiles} miles from the Fort Leonard Wood main gate, roughly a ${p.distanceToFLWMinutes} minute drive.`,
            links: [{ label: "Directions", href: "/local-area" }],
        });
    } else {
        faqs.push({
            q: `Where is ${p.shortName} located?`,
            a: `${p.shortName} sits just off Interstate 44 in ${p.city}, ${p.state}. It is a comfortable corridor stop rather than a Fort Leonard Wood gateway hotel.`,
            links: [{ label: "Local area", href: "/local-area" }],
        });
    }

    faqs.push({
        q: `Is ${p.shortName} pet-friendly?`,
        a: p.amenities.includes("petFriendly")
            ? `Yes, ${p.shortName} offers pet-friendly rooms. Pet policies and any fees can vary, so please call ahead before traveling with a pet.`
            : `Pet policies vary, so please call ${p.shortName} to confirm before traveling with a pet.`,
        links: [{ label: "Amenities by hotel", href: "/amenities" }],
    });

    faqs.push({
        q: `Does ${p.shortName} include free breakfast and Wi-Fi?`,
        a: `Yes. ${p.shortName} offers a free hot breakfast and free Wi-Fi for guests, along with free parking.`,
        links: [{ label: "All amenities", href: "/amenities" }],
    });

    return faqs;
}

export default function FaqPage() {
    const properties = getOperatingProperties();
    const propertyGroups = properties.map((p) => ({ p, items: propertyFaqs(p) }));

    // Aggregate every Q&A into FAQPage structured data for SEO rich results.
    // Only the plain-text answer goes into JSON-LD (related links are display-only).
    const allFaqs: Faq[] = [
        ...FAQ_SECTIONS.flatMap((s) => s.items),
        ...propertyGroups.flatMap((g) => g.items),
    ];
    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: allFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <section className="bg-sand-100">
                <Container className="py-16 sm:py-20">
                    <SectionHeading
                        eyebrow="FAQ"
                        title="Fort Leonard Wood hotel questions, answered"
                        subtitle="Everything families, military travelers, and road-trippers ask about staying near Fort Leonard Wood and along Interstate 44. Still not sure? Reach out and we will help."
                        align="center"
                    />
                    <RouteDivider className="mt-10" />
                </Container>
            </section>

            <section className="bg-sand-50">
                <Container className="py-16 sm:py-20">
                    <div className="space-y-14">
                        {FAQ_SECTIONS.map((section) => (
                            <div key={section.heading}>
                                <h2 className="text-navy-800 mb-5 text-center text-2xl font-semibold">
                                    {section.heading}
                                </h2>
                                <FaqAccordion items={section.items} />
                            </div>
                        ))}

                        <div>
                            <h2 className="text-navy-800 text-center text-2xl font-semibold">
                                Questions about each hotel
                            </h2>
                            <div className="mx-auto mt-5 max-w-3xl space-y-8">
                                {propertyGroups.map(({ p, items }) => (
                                    <div key={p.slug}>
                                        <h3 className="text-navy-800 mb-3 text-center text-lg font-semibold">
                                            {p.shortName}
                                        </h3>
                                        <FaqAccordion items={items} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            <section className="bg-navy-800">
                <Container className="py-16 text-center sm:py-20">
                    <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                        Still have a question?
                    </h2>
                    <p className="text-sand-200 mx-auto mt-4 max-w-xl text-lg">
                        Our team is glad to help with rooms near base, group blocks, or
                        anything about your trip.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link href="/contact" className={buttonVariants({ size: "lg" })}>
                            Contact us
                        </Link>
                        <Link
                            href="/military-travel"
                            className={buttonVariants({
                                variant: "outlineGold",
                                size: "lg",
                            })}
                        >
                            Fort Leonard Wood travel guide
                        </Link>
                    </div>
                </Container>
            </section>
        </>
    );
}
