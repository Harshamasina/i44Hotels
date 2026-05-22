import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { FlwBand } from "@/components/home/flw-band";

/**
 * Homepage. Hero + trust strip + Fort Leonard Wood band are in place (CLAUDE.md §8).
 * Remaining sections (amenities, property previews, reviews, local area) come next.
 */
export default function HomePage() {
    return (
        <>
            <Hero />
            <TrustStrip />
            <FlwBand />
        </>
    );
}
