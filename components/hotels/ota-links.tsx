import { ExternalLink, BadgeCheck } from "lucide-react";
import { otaLinks } from "@/lib/ota";
import type { Property } from "@/lib/properties";

/**
 * "Prefer to compare?" row of third-party travel-site links, shown near the foot
 * of a property page. Deliberately understated and below the direct-booking funnel
 * (the brand engine is the best rate, no booking fees), this is reassurance for
 * comparison-shoppers, not the primary CTA. Each link opens an OTA search
 * pre-filled with the hotel name. See lib/ota.ts.
 */
export function OtaLinks({ property }: { property: Property }) {
    const links = otaLinks(property);
    if (links.length === 0) return null;

    return (
        <section aria-labelledby="ota-heading" className="border-sand-200 border-t pt-10">
            <h2 id="ota-heading" className="text-navy-800 font-serif text-2xl">
                Prefer to compare prices?
            </h2>
            <p className="text-sand-700 mt-2 max-w-2xl text-sm">
                You can also find {property.shortName} on these travel sites. Booking
                direct above remains the best available rate, with no booking fees.
            </p>

            <ul className="mt-5 flex flex-wrap gap-3">
                {links.map((o) => (
                    <li key={o.id}>
                        <a
                            href={o.url}
                            target="_blank"
                            rel="noopener noreferrer nofollow sponsored"
                            className="border-sand-300 text-navy-800 hover:border-gold-400 hover:bg-gold-50 hover:text-gold-700 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium transition-colors"
                        >
                            {o.name}
                            <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                        </a>
                    </li>
                ))}
            </ul>

            <p className="text-sand-500 mt-4 inline-flex items-center gap-1.5 text-xs">
                <BadgeCheck className="text-gold-600 size-4 shrink-0" aria-hidden />
                Prices on third-party sites are set by those sites and may include
                added fees.
            </p>
        </section>
    );
}
