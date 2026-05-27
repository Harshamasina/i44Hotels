import Link from "next/link";
import { X } from "lucide-react";
import {
    hasActiveFilters,
    getFilterCities,
    type PropertyFilters,
    type Tier,
    type BestForKey,
} from "@/lib/properties";
import { BEST_FOR } from "@/lib/best-for";
import { cn } from "@/lib/utils";

const TIER_CHIPS: { value: Tier; label: string }[] = [
    { value: "economy", label: "Economy" },
    { value: "upper-midscale", label: "Upper-Midscale" },
];

const BEST_FOR_CHIPS: BestForKey[] = [
    "military",
    "leisure",
    "business",
    "groups",
    "pets",
    "largeVehicle",
];

/** Build a canonical /hotels URL from a filter state (omits empty groups). */
function buildHref(f: PropertyFilters): string {
    const params = new URLSearchParams();
    if (f.near) params.set("near", "flw");
    if (f.tiers?.length) params.set("tier", f.tiers.join(","));
    if (f.bestFor?.length) params.set("for", f.bestFor.join(","));
    if (f.cities?.length) params.set("city", f.cities.join(","));
    const qs = params.toString();
    return qs ? `/hotels?${qs}` : "/hotels";
}

function toggle<T>(list: T[] | undefined, value: T): T[] {
    const set = new Set(list ?? []);
    if (set.has(value)) {
        set.delete(value);
    } else {
        set.add(value);
    }
    return [...set];
}

/** A single toggle chip rendered as a navigation link (no client JS). */
function Chip({
    href,
    active,
    label,
}: {
    href: string;
    active: boolean;
    label: string;
}) {
    return (
        <Link
            href={href}
            scroll={false}
            aria-label={active ? `Remove filter: ${label}` : `Filter by ${label}`}
            aria-current={active ? "true" : undefined}
            className={cn(
                "focus-visible:ring-gold-500 inline-flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
                active
                    ? "border-navy-800 bg-navy-800 text-white"
                    : "border-sand-300 hover:border-gold-300 text-navy-700 bg-white",
            )}
        >
            {label}
            {active && <X className="size-3.5" aria-hidden />}
        </Link>
    );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sand-500 mr-1 text-xs font-semibold tracking-[0.12em] uppercase">
                {label}
            </span>
            {children}
        </div>
    );
}

/**
 * URL-driven filter bar for /hotels. Every chip is a Link that toggles its value
 * in the query string, so the state is shareable, SEO-clean, and needs no client
 * JavaScript. Within a group values OR; across groups they AND.
 */
export function FilterBar({
    filters,
    shown,
    total,
}: {
    filters: PropertyFilters;
    shown: number;
    total: number;
}) {
    const active = hasActiveFilters(filters);
    const cities = getFilterCities();

    return (
        <div role="group" aria-label="Filter hotels" className="space-y-4">
            <div className="flex flex-col gap-3">
                <Group label="Near base">
                    <Chip
                        href={buildHref({ ...filters, near: !filters.near })}
                        active={Boolean(filters.near)}
                        label="Near Fort Leonard Wood"
                    />
                </Group>

                <Group label="Town">
                    {cities.map(({ slug, label }) => (
                        <Chip
                            key={slug}
                            href={buildHref({
                                ...filters,
                                cities: toggle(filters.cities, slug),
                            })}
                            active={Boolean(filters.cities?.includes(slug))}
                            label={label}
                        />
                    ))}
                </Group>

                <Group label="Tier">
                    {TIER_CHIPS.map(({ value, label }) => (
                        <Chip
                            key={value}
                            href={buildHref({
                                ...filters,
                                tiers: toggle(filters.tiers, value),
                            })}
                            active={Boolean(filters.tiers?.includes(value))}
                            label={label}
                        />
                    ))}
                </Group>

                <Group label="Best for">
                    {BEST_FOR_CHIPS.map((key) => (
                        <Chip
                            key={key}
                            href={buildHref({
                                ...filters,
                                bestFor: toggle(filters.bestFor, key),
                            })}
                            active={Boolean(filters.bestFor?.includes(key))}
                            label={BEST_FOR[key].label}
                        />
                    ))}
                </Group>
            </div>

            <div className="border-sand-200 flex flex-wrap items-center gap-3 border-t pt-4">
                <p className="text-sand-600 text-sm" aria-live="polite">
                    Showing <span className="text-navy-800 font-semibold">{shown}</span>{" "}
                    of {total} hotels
                </p>
                {active && (
                    <Link
                        href="/hotels"
                        scroll={false}
                        className="text-gold-700 hover:text-gold-600 inline-flex items-center gap-1 text-sm font-semibold"
                    >
                        <X className="size-3.5" aria-hidden />
                        Clear all
                    </Link>
                )}
            </div>
        </div>
    );
}
