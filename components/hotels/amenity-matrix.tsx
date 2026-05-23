import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { AMENITIES, type AmenityKey } from "@/lib/amenities";
import { type Property } from "@/lib/properties";
import { FlagBadge } from "@/components/ui/badge";

// Stable row order: the registry's own order, limited to amenities at least one
// of the shown hotels offers (so the matrix has no all-empty rows).
const ROW_ORDER = Object.keys(AMENITIES) as AmenityKey[];

/**
 * Side-by-side amenity comparison across hotels (the umbrella-brand "compare the
 * flags in one place" value, CLAUDE.md section 2). Reads each Property's
 * `amenities` keys; the deeper, brand-sourced lists live on /amenities.
 *
 * Note: the `amenities` data is still PROVISIONAL (see lib/properties.ts), hence
 * the "varies by hotel and room type" caveat and the link to the full details.
 */
export function AmenityMatrix({ properties }: { properties: Property[] }) {
    const rows = ROW_ORDER.filter((key) =>
        properties.some((p) => p.amenities.includes(key)),
    );
    if (properties.length === 0 || rows.length === 0) return null;

    return (
        <div className="border-sand-200 overflow-hidden rounded-2xl border bg-white">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left">
                    <caption className="sr-only">
                        Amenities available at each I44 hotel
                    </caption>
                    <thead>
                        <tr className="border-sand-200 border-b">
                            <th
                                scope="col"
                                className="text-sand-500 sticky left-0 z-10 bg-white px-5 py-4 text-xs font-semibold tracking-[0.12em] uppercase"
                            >
                                Amenity
                            </th>
                            {properties.map((p) => (
                                <th
                                    key={p.slug}
                                    scope="col"
                                    className="px-4 py-4 text-center align-bottom"
                                >
                                    <Link
                                        href={`/hotels/${p.slug}`}
                                        className="group inline-flex flex-col items-center gap-2"
                                    >
                                        <FlagBadge brand={p.brand} className="mx-auto" />
                                        <span className="text-navy-800 group-hover:text-gold-700 text-sm font-semibold transition-colors">
                                            {p.shortName}
                                        </span>
                                    </Link>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-sand-200 divide-y">
                        {rows.map((key) => {
                            const { label, Icon } = AMENITIES[key];
                            return (
                                <tr key={key}>
                                    <th
                                        scope="row"
                                        className="sticky left-0 z-10 bg-white px-5 py-3"
                                    >
                                        <span className="text-navy-800 inline-flex items-center gap-2 text-sm font-medium">
                                            <Icon
                                                className="text-gold-600 size-4 shrink-0"
                                                aria-hidden
                                            />
                                            {label}
                                        </span>
                                    </th>
                                    {properties.map((p) => {
                                        const has = p.amenities.includes(key);
                                        return (
                                            <td
                                                key={p.slug}
                                                className="px-4 py-3 text-center"
                                            >
                                                {has ? (
                                                    <Check
                                                        className="text-gold-600 mx-auto size-5"
                                                        aria-hidden
                                                    />
                                                ) : (
                                                    <Minus
                                                        className="text-sand-300 mx-auto size-4"
                                                        aria-hidden
                                                    />
                                                )}
                                                <span className="sr-only">
                                                    {has ? "Yes" : "No"}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="text-sand-500 border-sand-200 border-t px-5 py-4 text-sm">
                Amenities vary by hotel and room type.{" "}
                <Link
                    href="/amenities"
                    className="text-gold-700 hover:text-gold-600 font-semibold"
                >
                    See full amenity details
                </Link>
                .
            </p>
        </div>
    );
}
