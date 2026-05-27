import Image from "next/image";
import { cn } from "@/lib/utils";
import { brandLogo, type Brand, type Tier } from "@/lib/properties";

/** Generic pill badge. */
export function Badge({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                className,
            )}
        >
            {children}
        </span>
    );
}

const TIER_STYLES: Record<Tier, string> = {
    economy: "bg-sand-200 text-navy-800",
    "upper-midscale": "bg-navy-100 text-navy-800",
};

const TIER_LABELS: Record<Tier, string> = {
    economy: "Economy",
    "upper-midscale": "Upper-Midscale",
};

/** Price-tier tag (economy / upper-midscale). */
export function TierBadge({ tier }: { tier: Tier }) {
    return <Badge className={TIER_STYLES[tier]}>{TIER_LABELS[tier]}</Badge>;
}

/** "Coming soon" pill for not-yet-open properties. */
export function ComingSoonBadge({ className }: { className?: string }) {
    return (
        <Badge
            className={cn("bg-gold-100 text-gold-700 tracking-wide uppercase", className)}
        >
            Coming soon
        </Badge>
    );
}

/**
 * Franchise flag logo in a fixed box, so the differently-shaped brand logos
 * (Days Inn square, Hyatt wide, etc.) line up consistently.
 */
export function FlagBadge({ brand, className }: { brand: Brand; className?: string }) {
    return (
        <span className={cn("relative h-7 w-11 shrink-0", className)}>
            <Image
                src={brandLogo(brand)}
                alt=""
                fill
                sizes="44px"
                className="object-contain"
            />
        </span>
    );
}
