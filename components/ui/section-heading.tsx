import { cn } from "@/lib/utils";

/**
 * Reusable section header: gold eyebrow + Fraunces title + optional subtitle.
 * `tone="light"` for use on dark/navy backgrounds.
 */
export function SectionHeading({
    eyebrow,
    title,
    subtitle,
    align = "left",
    tone = "dark",
    className,
}: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    align?: "left" | "center";
    tone?: "dark" | "light";
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
                <p className="text-gold-600 mb-3 text-sm font-semibold tracking-[0.14em] uppercase">
                    {eyebrow}
                </p>
            )}
            <h2
                className={cn(
                    "text-3xl font-semibold sm:text-4xl",
                    tone === "light" ? "text-white" : "text-navy-800",
                )}
            >
                {title}
            </h2>
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
