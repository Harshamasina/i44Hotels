"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Rotate3d } from "lucide-react";
import { useInView } from "@/components/hooks/use-in-view";
import { MapSkeleton } from "@/components/ui/map-skeleton";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type VirtualTour } from "@/lib/properties";

export function RoomTourButton({
    tourId,
    roomName,
}: {
    tourId: string;
    roomName: string;
}) {
    const showTour = () => {
        const hash = `#tour-${tourId}`;
        if (window.location.hash === hash) {
            window.dispatchEvent(new HashChangeEvent("hashchange"));
        } else {
            window.location.hash = hash;
        }
    };

    return (
        <button
            type="button"
            onClick={showTour}
            aria-label={`See a 360 view of the ${roomName}`}
            className="border-gold-300 text-gold-700 hover:border-gold-500 focus-visible:ring-gold-500 inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
            <Rotate3d className="size-3.5" aria-hidden />
            360
        </button>
    );
}

/**
 * 360 Street View / photosphere walkthrough(s) for a property, rendered as a
 * Google Maps embed iframe. The iframe is heavy, so it is deferred until the
 * section scrolls near the viewport (same pattern as PropertyMap). Multiple
 * views get prev/next arrows plus a jump-to-view dropdown, which scales to any
 * number of views; switching remounts the iframe. Room cards deep-link to a
 * specific view via a #tour-<id> hash matching `VirtualTour.id`.
 */
export function VirtualTourViewer({
    tours,
    hotelName,
}: {
    tours: VirtualTour[];
    hotelName: string;
}) {
    const [wrapRef, inView] = useInView<HTMLDivElement>();
    const [active, setActive] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [requested, setRequested] = useState(false);
    const tour = tours[active];
    const labelOf = (t: VirtualTour, i: number) => t.label ?? `View ${i + 1}`;
    const label = `${labelOf(tour, active)} (${active + 1} of ${tours.length})`;

    const show = (index: number) => {
        if (index === active) return;
        setActive(index);
        setLoaded(false);
    };
    const go = (dir: -1 | 1) => show((active + dir + tours.length) % tours.length);

    useEffect(() => {
        const showTour = (tourId: string) => {
            const index = tours.findIndex((t) => t.id === tourId);
            if (index < 0) return;
            setRequested(true);
            if (index !== active) {
                setActive(index);
                setLoaded(false);
            }
            wrapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        };

        const applyHash = () => {
            const match = /^#tour-(.+)$/.exec(window.location.hash);
            if (match) showTour(match[1]);
        };

        // Timeout covers arriving on the page with a #tour- hash already set.
        const initial = window.setTimeout(applyHash, 0);
        window.addEventListener("hashchange", applyHash);
        return () => {
            window.clearTimeout(initial);
            window.removeEventListener("hashchange", applyHash);
        };
    }, [active, tours, wrapRef]);

    return (
        <div ref={wrapRef}>
            <div
                className="shadow-navy-900/5 relative h-90 w-full overflow-hidden rounded-2xl shadow-md sm:h-110"
                aria-label={`Interactive 360 view of ${hotelName}: ${label}`}
            >
                {(inView || requested) && (
                    <iframe
                        key={tour.embedUrl}
                        src={tour.embedUrl}
                        title={`360 view of ${hotelName}: ${label}`}
                        className="h-full w-full border-0"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        onLoad={() => setLoaded(true)}
                    />
                )}
                <MapSkeleton
                    label="Loading 360 view…"
                    className={cn(
                        "transition-opacity duration-500",
                        loaded && "pointer-events-none opacity-0",
                    )}
                />
            </div>
            {tours.length > 1 && (
                <div className="mx-auto mt-4 grid w-full grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-2 sm:max-w-lg sm:gap-3">
                    <TourArrow
                        direction="previous"
                        onClick={() => go(-1)}
                        Icon={ChevronLeft}
                    />
                    <Select
                        name="virtual-tour-view"
                        value={String(active)}
                        onValueChange={(value) => show(Number(value))}
                        options={tours.map((t, i) => ({
                            value: String(i),
                            label: `${i + 1}. ${labelOf(t, i)}`,
                        }))}
                        className="min-w-0"
                        triggerClassName="h-11 min-w-0 rounded-full px-3 text-sm font-medium sm:px-4"
                        menuClassName="left-1/2 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2"
                    />
                    <TourArrow
                        direction="next"
                        onClick={() => go(1)}
                        Icon={ChevronRight}
                    />
                </div>
            )}
            <p className="text-sand-500 mx-auto mt-3 max-w-xs px-2 text-center text-sm leading-relaxed">
                {tours.length > 1
                    ? "Drag to look around, and use the arrows to switch views."
                    : "Drag to look around."}
            </p>
        </div>
    );
}

function TourArrow({
    direction,
    onClick,
    Icon,
}: {
    direction: "previous" | "next";
    onClick: () => void;
    Icon: typeof ChevronLeft;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={`${direction === "previous" ? "Previous" : "Next"} 360 view`}
            className="border-sand-300 hover:border-gold-300 text-navy-700 focus-visible:ring-gold-500 inline-flex size-11 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
        >
            <Icon className="size-5" aria-hidden />
        </button>
    );
}
