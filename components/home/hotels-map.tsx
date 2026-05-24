"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { getAllProperties } from "@/lib/properties";
import { useInView } from "@/components/hooks/use-in-view";
import { MapSkeleton } from "@/components/ui/map-skeleton";
import { cn } from "@/lib/utils";

const GOLD = "#bf8f56"; // gold-500 (passed to the MapLibre JS API, not a CSS class)
const NAVY = "#0b1e3a"; // navy-800, used as a casing under the gold I-44 line
// OpenFreeMap: free vector tiles, no key/account/card. "positron" = light/elegant.
// TODO: swap for a custom navy/gold MapLibre style JSON to fully match the theme.
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
// Mid-Missouri, between St. Robert and Sullivan, as the initial regional view.
const INITIAL_CENTER: [number, number] = [-91.7, 38.0];

/**
 * Interactive locations map (MapLibre GL + OpenFreeMap). Lazy-loads the library
 * on the client only, drops a gold pin per property with a navy popup, and fits
 * the I-44 corridor once the map has loaded. No token required.
 */
export function HotelsMap() {
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

            const points = getAllProperties().filter((p) => p.address);
            const m = new maplibregl.Map({
                container: containerRef.current,
                style: STYLE_URL,
                center: INITIAL_CENTER,
                zoom: 7,
                cooperativeGestures: true,
                attributionControl: false,
            });
            map = m;

            m.addControl(
                new maplibregl.NavigationControl({ showCompass: false }),
                "top-right",
            );
            m.addControl(
                new maplibregl.AttributionControl({ compact: true }),
                "bottom-right",
            );

            const bounds = new maplibregl.LngLatBounds();
            for (const p of points) {
                const { lng, lat } = p.address!;
                const popup = new maplibregl.Popup({
                    offset: 24,
                    closeButton: false,
                }).setHTML(
                    `<div style="min-width:160px">
                        <div style="font-weight:600;color:#0b1e3a">${p.shortName}</div>
                        <div style="font-size:12px;color:#5d5446">${p.brand} · ${p.city}, ${p.state}</div>
                        <a href="/hotels/${p.slug}" style="display:inline-block;margin-top:6px;font-size:13px;font-weight:600;color:#8a6232;text-decoration:underline">View hotel →</a>
                    </div>`,
                );
                new maplibregl.Marker({ color: GOLD })
                    .setLngLat([lng, lat])
                    .setPopup(popup)
                    .addTo(m);
                bounds.extend([lng, lat]);
            }

            // Highlight the real I-44 route (OpenStreetMap geometry) + fit the pins.
            m.on("load", () => {
                if (!cancelled) setReady(true);
                m.addSource("i44", { type: "geojson", data: "/i44-route.geojson" });
                m.addLayer({
                    id: "i44-casing",
                    type: "line",
                    source: "i44",
                    layout: { "line-cap": "round", "line-join": "round" },
                    paint: { "line-color": NAVY, "line-width": 7, "line-opacity": 0.3 },
                });
                m.addLayer({
                    id: "i44-line",
                    type: "line",
                    source: "i44",
                    layout: { "line-cap": "round", "line-join": "round" },
                    paint: { "line-color": GOLD, "line-width": 3.5 },
                });

                if (!bounds.isEmpty()) {
                    m.fitBounds(bounds, { padding: 80, maxZoom: 12, duration: 0 });
                }
            });
        })();

        return () => {
            cancelled = true;
            map?.remove();
        };
    }, [inView]);

    return (
        <div
            ref={wrapRef}
            className="shadow-navy-900/5 relative h-[420px] w-full overflow-hidden rounded-2xl shadow-md"
            aria-label="Map of I44 Hotels locations along Interstate 44"
        >
            <div ref={containerRef} className="absolute inset-0" />
            <MapSkeleton
                className={cn(
                    "transition-opacity duration-500",
                    ready && "pointer-events-none opacity-0",
                )}
            />
        </div>
    );
}
