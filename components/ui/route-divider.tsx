import { cn } from "@/lib/utils";

/**
 * The recurring road-line motif as a section divider (CLAUDE.md §7): a gold
 * dashed "centerline" with a small diamond marker, used sparingly between bands.
 */
export function RouteDivider({ className }: { className?: string }) {
    return (
        <div
            className={cn("flex items-center justify-center py-2", className)}
            aria-hidden="true"
        >
            <span className="bg-sand-300 h-px w-16 sm:w-24" />
            <svg
                width="44"
                height="12"
                viewBox="0 0 44 12"
                fill="none"
                className="text-gold-500 mx-2"
            >
                <path
                    d="M2 6h40"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="2 7"
                    strokeLinecap="round"
                />
                <path d="M22 1.5 26.5 6 22 10.5 17.5 6z" fill="currentColor" />
            </svg>
            <span className="bg-sand-300 h-px w-16 sm:w-24" />
        </div>
    );
}
