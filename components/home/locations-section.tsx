import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { HotelsMap } from "./hotels-map";

/** "Find us along I-44" locations map section (fills the deferred local-area slot). */
export function LocationsSection() {
    return (
        <section className="bg-sand-50">
            <Container className="py-16 sm:py-20">
                <SectionHeading
                    eyebrow="Locations"
                    title="Find us along I-44"
                    subtitle="Our hotels sit right off Interstate 44, including three in St. Robert just minutes from the Fort Leonard Wood gates."
                />
                <div className="mt-10">
                    <HotelsMap />
                </div>
            </Container>
        </section>
    );
}
