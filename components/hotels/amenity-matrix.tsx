import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { AMENITIES } from "@/lib/amenities";
import { type Property } from "@/lib/properties";
import { FlagBadge } from "@/components/ui/badge";

// The "Accessibility" lists are a separate concern shown in full on /amenities,
// so the comparison grid covers the guest "Hotel amenities" only.
const EXCLUDED_GROUPS = new Set(["Accessibility"]);

/** Trim a brand-page amenity string and drop the trailing "*" charge marker. */
function normalizeLabel(raw: string): string {
    return raw
        .replace(/\*+$/, "")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Every amenity a hotel lists, drawn from its full brand-page `amenityDetails`
 * (falling back to the short registry keys if a hotel has none). No semantic
 * merging, so the rows stay faithful to what each brand publishes.
 */
function amenityLabels(p: Property): string[] {
    if (p.amenityDetails) {
        return p.amenityDetails.groups
            .filter((g) => !EXCLUDED_GROUPS.has(g.title))
            .flatMap((g) => g.items)
            .map(normalizeLabel);
    }
    return p.amenities.map((k) => AMENITIES[k].label);
}

/**
 * Side-by-side amenity comparison across hotels (the umbrella-brand "compare the
 * flags in one place" value, CLAUDE.md section 2). Lists every published amenity,
 * so the table is tall: it lives in a fixed-height pane with a sticky header row
 * and a sticky amenity column, and scrolls internally.
 *
 * Note: the underlying amenity data is still PROVISIONAL (see lib/properties.ts),
 * hence the caveat and the link to the full per-hotel details on /amenities.
 */
export function AmenityMatrix({ properties }: { properties: Property[] }) {
    const byProperty = properties.map((p) => ({
        property: p,
        keys: new Set(amenityLabels(p).map((l) => l.toLowerCase())),
    }));

    // Union of every amenity across the shown hotels, de-duped case-insensitively
    // and sorted alphabetically so a long list stays scannable.
    const rowMap = new Map<string, string>();
    for (const p of properties) {
        for (const label of amenityLabels(p)) {
            const key = label.toLowerCase();
            if (label && !rowMap.has(key)) rowMap.set(key, label);
        }
    }
    const rows = [...rowMap.entries()]
        .map(([key, label]) => ({ key, label }))
        .sort((a, b) => a.label.localeCompare(b.label));

    if (properties.length === 0 || rows.length === 0) return null;

    return (
        <div className="border-sand-200 w-full max-w-full overflow-hidden rounded-2xl border bg-white">
            <div className="max-h-[30rem] w-full overflow-x-auto overflow-y-auto">
                <table className="w-full border-collapse text-left sm:min-w-150">
                    <caption className="sr-only">
                        Amenities available at each I44 hotel
                    </caption>
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                className="border-sand-200 text-sand-500 sticky top-0 left-0 z-30 border-b bg-white px-5 py-4 text-xs font-semibold tracking-[0.12em] uppercase"
                            >
                                Amenity
                            </th>
                            {byProperty.map(({ property: p }) => (
                                <th
                                    key={p.slug}
                                    scope="col"
                                    className="border-sand-200 sticky top-0 z-20 border-b bg-white px-4 py-4 text-center align-bottom"
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
                        {rows.map((row) => (
                            <tr key={row.key}>
                                <th
                                    scope="row"
                                    className="text-navy-800 sticky left-0 z-10 bg-white px-5 py-3 text-sm font-medium"
                                >
                                    {row.label}
                                </th>
                                {byProperty.map(({ property: p, keys }) => {
                                    const has = keys.has(row.key);
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
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-sand-500 border-sand-200 border-t px-5 py-4 text-sm">
                Some amenities may carry an extra charge or vary by room type.{" "}
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
