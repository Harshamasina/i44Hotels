import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { OurHotels } from "@/components/home/our-hotels";
import { FlwBand } from "@/components/home/flw-band";
import { AmenityHighlights } from "@/components/home/amenity-highlights";
import { GroupsExtendedStay } from "@/components/home/groups-extended-stay";
import { WhyBookDirect } from "@/components/home/why-book-direct";
import { LocationsSection } from "@/components/home/locations-section";
import { ClosingCta } from "@/components/home/closing-cta";

/** Homepage section flow (CLAUDE.md §8): hotels surfaced early, FLW prominent. */
export default function HomePage() {
    return (
        <>
            <Hero />
            <TrustStrip />
            <OurHotels />
            <FlwBand />
            <AmenityHighlights />
            <GroupsExtendedStay />
            <WhyBookDirect />
            <LocationsSection />
            <ClosingCta />
        </>
    );
}
