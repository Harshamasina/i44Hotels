import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Rounded, soft-shadow surface (no hard border) per CLAUDE.md §7.
 *  `interactive` adds a subtle lift + deeper shadow on hover. */
export function Card({
    className,
    interactive = false,
    ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
    return (
        <div
            className={cn(
                "shadow-navy-900/5 rounded-2xl bg-white shadow-md",
                interactive &&
                    "hover:shadow-navy-900/10 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg",
                className,
            )}
            {...props}
        />
    );
}
