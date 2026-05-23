import { getAllProperties } from "@/lib/properties";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { PatternBackground } from "@/components/ui/pattern-background";
import { PropertyCard } from "@/components/hotels/property-card";

/** "Our Hotels" portfolio previews on the homepage, rendered with the shared card. */
export function OurHotels() {
    const all = getAllProperties();
    return (
        <section className="bg-sand-50 relative isolate overflow-hidden">
            <PatternBackground />
            <Container className="py-16 sm:py-20">
                <SectionHeading
                    eyebrow="Our Hotels"
                    title="Stays along Interstate 44"
                    subtitle="From budget-friendly to upscale, find the right welcome for your trip."
                />
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {all.map((p) => (
                        <PropertyCard key={p.slug} property={p} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
