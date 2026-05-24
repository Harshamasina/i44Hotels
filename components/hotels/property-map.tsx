"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useInView } from "@/components/hooks/use-in-view";
import { MapSkeleton } from "@/components/ui/map-skeleton";
import { cn } from "@/lib/utils";

const GOLD = "#bf8f56"; // gold-500, passed to the MapLibre JS API (not a CSS class)
// OpenFreeMap: free vector tiles, no key/account. "positron" = light/elegant.
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

/**
 * Single-property locator map (MapLibre GL + OpenFreeMap). Drops one gold pin on
 * the hotel and centers there. Lazy-loads the library on the client; no token.
 */
export function PropertyMap({
    lat,
    lng,
    name,
}: {
    lat: number;
    lng: number;
    name: string;
}) {
    const [wrapRef, inView] = useInView<HTMLDivElement>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!inView || !containerRef.current) return;
        let cancelled = false;
        let map: import("maplibre-gl").Map | undefined;

        (async () => {
            const maplibregl = (await import("maplibre-gl")).default;
            if (cancelled || !containerRef.current) return;

            const m = new maplibregl.Map({
                container: containerRef.current,
                style: STYLE_URL,
                center: [lng, lat],
                zoom: 14,
                cooperativeGestures: true,
                attributionControl: false,
            });
            map = m;
            m.on("load", () => {
                if (cancelled) return;
                m.resize(); // container was deferred; ensure correct canvas size
                setReady(true);
            });

            m.addControl(
                new maplibregl.NavigationControl({ showCompass: false }),
                "top-right",
            );
            m.addControl(
                new maplibregl.AttributionControl({ compact: true }),
                "bottom-right",
            );

            new maplibregl.Marker({ color: GOLD }).setLngLat([lng, lat]).addTo(m);

            // Persistent name label sitting just below the pin (anchor "top" puts
            // the top of the label at the coordinate, so it reads below the marker).
            const label = document.createElement("div");
            label.textContent = name; // textContent avoids any HTML injection
            label.style.cssText =
                "margin-top:8px;padding:3px 10px;background:#ffffff;color:#0b1e3a;" +
                "font:600 12px/1.2 system-ui,sans-serif;border-radius:9999px;" +
                "box-shadow:0 1px 4px rgba(8,24,56,.25);white-space:nowrap;";
            new maplibregl.Marker({ element: label, anchor: "top" })
                .setLngLat([lng, lat])
                .addTo(m);
        })();

        return () => {
            cancelled = true;
            map?.remove();
        };
    }, [inView, lat, lng, name]);

    return (
        <div
            ref={wrapRef}
            className="shadow-navy-900/5 relative h-[360px] w-full overflow-hidden rounded-2xl shadow-md"
            aria-label={`Map showing the location of ${name}`}
        >
            <div ref={containerRef} className="h-full w-full" />
            <MapSkeleton
                className={cn(
                    "transition-opacity duration-500",
                    ready && "pointer-events-none opacity-0",
                )}
            />
        </div>
    );
}
