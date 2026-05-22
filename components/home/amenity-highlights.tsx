import { AMENITIES, type AmenityKey } from "@/lib/amenities";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const HIGHLIGHTS: { key: AmenityKey; blurb: string }[] = [
    { key: "breakfast", blurb: "Start the day with a free hot breakfast." },
    { key: "pool", blurb: "Unwind in a heated indoor pool." },
    { key: "fitness", blurb: "Keep your routine in the fitness center." },
    { key: "coffee", blurb: "Fresh coffee and water around the clock." },
    { key: "petFriendly", blurb: "Pet-friendly rooms so no one stays behind." },
    { key: "truckParking", blurb: "Room to park trucks, buses, and trailers." },
    { key: "wifi", blurb: "Free Wi-Fi for work and streaming." },
    { key: "cookies", blurb: "Warm cookies in the afternoon." },
];

export function AmenityHighlights() {
    return (
        <section className="bg-white">
            <Container className="py-16 sm:py-20">
                <SectionHeading
                    eyebrow="Amenities"
                    title="Everything you need on the road"
                    subtitle="Comfortable, practical touches across our hotels. Amenities vary by location."
                />
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {HIGHLIGHTS.map(({ key, blurb }) => {
                        const { label, Icon } = AMENITIES[key];
                        return (
                            <Card key={key} interactive className="p-5">
                                <Icon className="text-gold-600 size-7" aria-hidden />
                                <h3 className="text-navy-800 mt-3 font-serif text-lg">
                                    {label}
                                </h3>
                                <p className="text-sand-600 mt-1 text-sm">{blurb}</p>
                            </Card>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
