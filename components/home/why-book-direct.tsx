import { Tag, Heart, MapPin, Users, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const REASONS: { Icon: LucideIcon; title: string; text: string }[] = [
    {
        Icon: Tag,
        title: "Best direct rate",
        text: "Book straight through us for the best available rate, with no extra booking-site fees.",
    },
    {
        Icon: Heart,
        title: "Family-owned care",
        text: "A local, family-owned group that treats every guest like a neighbor.",
    },
    {
        Icon: MapPin,
        title: "Fort Leonard Wood experts",
        text: "We know graduation weekends and what visiting families need.",
    },
    {
        Icon: Users,
        title: "Group blocks made easy",
        text: "One team coordinates rooms across our hotels for groups of any size.",
    },
];

export function WhyBookDirect() {
    return (
        <section className="bg-white">
            <Container className="py-16 sm:py-20">
                <SectionHeading
                    align="center"
                    eyebrow="Why I44 Hotels"
                    title="Why book direct"
                    subtitle="The simplest, friendliest way to stay along I-44."
                />
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {REASONS.map(({ Icon, title, text }) => (
                        <Card key={title} interactive className="p-6 text-center">
                            <Icon className="text-gold-600 mx-auto size-8" aria-hidden />
                            <h3 className="text-navy-800 mt-4 font-serif text-lg">
                                {title}
                            </h3>
                            <p className="text-sand-600 mt-2 text-sm">{text}</p>
                        </Card>
                    ))}
                </div>
            </Container>
        </section>
    );
}
