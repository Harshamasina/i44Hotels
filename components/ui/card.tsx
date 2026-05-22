import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Rounded, soft-shadow surface (no hard border) per CLAUDE.md §7. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("shadow-navy-900/5 rounded-2xl bg-white shadow-md", className)}
            {...props}
        />
    );
}
