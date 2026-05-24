import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { OurHotels } from "@/components/home/our-hotels";
import { FlwBand } from "@/components/home/flw-band";
import { AmenityHighlights } from "@/components/home/amenity-highlights";
import { GroupsExtendedStay } from "@/components/home/groups-extended-stay";
import { WhyBookDirect } from "@/components/home/why-book-direct";
import { Testimonials } from "@/components/home/testimonials";
import { LocationsSection } from "@/components/home/locations-section";
import { ClosingCta } from "@/components/home/closing-cta";

export const metadata: Metadata = {
    alternates: { canonical: "/" },
};

/** Homepage section flow (CLAUDE.md §8): hotels surfaced early, FLW prominent. */
export default function HomePage() {
    return (
        <>
            <JsonLd data={organizationJsonLd()} />
            <JsonLd data={webSiteJsonLd()} />
            <Hero />
            <TrustStrip />
            <OurHotels />
            <FlwBand />
            <AmenityHighlights />
            <GroupsExtendedStay />
            <WhyBookDirect />
            <Testimonials />
            <LocationsSection />
            <ClosingCta />
        </>
    );
}
