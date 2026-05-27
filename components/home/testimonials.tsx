import { getPooledReviews } from "@/lib/reviews";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialsCarousel } from "./testimonials-carousel";

/**
 * Homepage social proof: a carousel of real 4-5 star Google reviews pooled across
 * our operating hotels, rotating through each property in turn. Server component
 * so the (cached, shared with the hotel pages) API fetch stays server-side; hides
 * itself gracefully if Google returns nothing.
 */
export async function Testimonials() {
    const { reviews, averageRating, totalCount } = await getPooledReviews();
    if (reviews.length === 0) return null;

    return (
        <section className="bg-sand-100">
            <Container className="py-16 sm:py-20">
                <SectionHeading
                    align="center"
                    eyebrow="Guest reviews"
                    title="What our guests say"
                    subtitle="Real reviews from travelers and Fort Leonard Wood families staying with us along Interstate 44."
                />
                <TestimonialsCarousel
                    reviews={reviews.slice(0, 10)}
                    averageRating={averageRating}
                    totalCount={totalCount}
                />
            </Container>
        </section>
    );
}
