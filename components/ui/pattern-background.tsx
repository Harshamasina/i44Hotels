import { cn } from "@/lib/utils";

/**
 * Subtle, on-palette isometric cube lattice matching the supplied reference.
 * Render as the first child of a `relative isolate overflow-hidden` section;
 * decorative only (aria-hidden).
 */

const TILE_WIDTH = 146;
const TILE_HEIGHT = 85;
const HALF_TILE_WIDTH = TILE_WIDTH / 2;
const HALF_TILE_HEIGHT = TILE_HEIGHT / 2;
const DIAGONAL_RUN = 24.5;
const SHORT_HORIZONTAL = DIAGONAL_RUN * 2;

const CUBE_LATTICE_PATH = [
    `M0 0V${TILE_HEIGHT}`,
    `M${HALF_TILE_WIDTH} 0V${TILE_HEIGHT}`,
    `M${TILE_WIDTH} 0V${TILE_HEIGHT}`,
    `M${DIAGONAL_RUN} 0H${TILE_WIDTH - DIAGONAL_RUN}`,
    `M0 ${HALF_TILE_HEIGHT}H${SHORT_HORIZONTAL}`,
    `M${TILE_WIDTH - SHORT_HORIZONTAL} ${HALF_TILE_HEIGHT}H${TILE_WIDTH}`,
    `M${DIAGONAL_RUN} ${TILE_HEIGHT}H${TILE_WIDTH - DIAGONAL_RUN}`,
    `M0 ${HALF_TILE_HEIGHT}L${DIAGONAL_RUN} 0`,
    `M0 ${HALF_TILE_HEIGHT}L${DIAGONAL_RUN} ${TILE_HEIGHT}`,
    `M${SHORT_HORIZONTAL} ${HALF_TILE_HEIGHT}L${HALF_TILE_WIDTH} 0`,
    `M${SHORT_HORIZONTAL} ${HALF_TILE_HEIGHT}L${HALF_TILE_WIDTH} ${TILE_HEIGHT}`,
    `M${TILE_WIDTH - SHORT_HORIZONTAL} ${HALF_TILE_HEIGHT}L${HALF_TILE_WIDTH} 0`,
    `M${TILE_WIDTH - SHORT_HORIZONTAL} ${HALF_TILE_HEIGHT}L${HALF_TILE_WIDTH} ${TILE_HEIGHT}`,
    `M${TILE_WIDTH} ${HALF_TILE_HEIGHT}L${TILE_WIDTH - DIAGONAL_RUN} 0`,
    `M${TILE_WIDTH} ${HALF_TILE_HEIGHT}L${TILE_WIDTH - DIAGONAL_RUN} ${TILE_HEIGHT}`,
].join(" ");

export function PatternBackground({ className }: { className?: string }) {
    return (
        <div
            aria-hidden
            className={cn(
                "bg-sand-50 text-sand-300 pointer-events-none absolute inset-0 -z-10 overflow-hidden",
                className,
            )}
        >
            <svg className="absolute inset-0 size-full opacity-45">
                <defs>
                    <pattern
                        id="i44-lattice"
                        width={TILE_WIDTH}
                        height={TILE_HEIGHT}
                        patternUnits="userSpaceOnUse"
                        patternTransform="translate(-3 3)"
                    >
                        <path
                            d={CUBE_LATTICE_PATH}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            vectorEffect="non-scaling-stroke"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#i44-lattice)" />
            </svg>
            <div className="bg-sand-50 absolute inset-x-0 top-0 h-[25%]" />
            <div className="from-sand-50 absolute inset-x-0 top-[25%] bottom-0 bg-linear-to-b to-transparent" />
        </div>
    );
}
