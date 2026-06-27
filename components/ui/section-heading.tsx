import { cn } from "@/lib/utils";

/**
 * Reusable section header: gold eyebrow + Hanken Grotesk title + optional subtitle.
 * `tone="light"` for use on dark/navy backgrounds. Defaults to an <h2>; pass
 * `as="h1"` for a page's single lead heading (every indexable page needs one h1).
 */
export function SectionHeading({
    eyebrow,
    title,
    subtitle,
    align = "left",
    tone = "dark",
    as: Heading = "h2",
    className,
}: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    align?: "left" | "center";
    tone?: "dark" | "light";
    as?: "h1" | "h2";
    className?: string;
}) {
    return (
        <div
            className={cn(
                align === "center" && "mx-auto text-center",
                align === "center" ? "max-w-2xl" : "max-w-3xl",
                className,
            )}
        >
            {eyebrow && (
                <p
                    className={cn(
                        "mb-3 text-sm font-semibold tracking-[0.14em] uppercase",
                        // gold-600 fails AA as small text on light; use darker gold on
                        // light backgrounds and lighter gold on dark (tone="light").
                        tone === "light" ? "text-gold-400" : "text-gold-700",
                    )}
                >
                    {eyebrow}
                </p>
            )}
            <Heading
                className={cn(
                    "text-3xl font-semibold sm:text-4xl",
                    tone === "light" ? "text-white" : "text-navy-800",
                )}
            >
                {title}
            </Heading>
            {subtitle && (
                <p
                    className={cn(
                        "mt-4 text-lg",
                        tone === "light" ? "text-sand-200" : "text-sand-700",
                    )}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
}
