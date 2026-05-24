"use client";

import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import {
    getFLWAreaProperties,
    formatFLWDistance,
    FLW_MAIN_GATE,
} from "@/lib/properties";
import { useInView } from "@/components/hooks/use-in-view";
import { MapSkeleton } from "@/components/ui/map-skeleton";
import { cn } from "@/lib/utils";

const GOLD = "#bf8f56"; // gold-500 (passed to the MapLibre JS API, not a CSS class)
const NAVY = "#0b1e3a"; // navy-800, used for the base marker + area halo
// OpenFreeMap: free vector tiles, no key/account/card. "positron" = light/elegant.
const STYLE_URL = "https://tiles.openfreemap.org/styles/positron";
// St. Robert, between the hotels and the FLW gate, as the initial close-in view.
const INITIAL_CENTER: [number, number] = [-92.15, 37.813];

/**
 * St. Robert-focused locations map (MapLibre GL + OpenFreeMap, no token). Marks
 * the Fort Leonard Wood main gate in navy with a soft area halo, drops a gold pin
 * per St. Robert hotel with a distance-to-base popup, and fits them all on load.
 */
export function FlwAreaMap() {
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

            const hotels = getFLWAreaProperties().filter((p) => p.address);
            const m = new maplibregl.Map({
                container: containerRef.current,
                style: STYLE_URL,
                center: INITIAL_CENTER,
                zoom: 12,
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

            // The base gate: navy marker + a default-open navy popup.
            const gatePopup = new maplibregl.Popup({
                offset: 26,
                closeButton: false,
            }).setHTML(
                `<div style="min-width:170px">
                    <div style="font-weight:600;color:${NAVY}">${FLW_MAIN_GATE.name}</div>
                    <div style="font-size:12px;color:#807766">${FLW_MAIN_GATE.detail}</div>
                    <div style="font-size:12px;color:#807766">${FLW_MAIN_GATE.hours}</div>
                </div>`,
            );
            new maplibregl.Marker({ color: NAVY })
                .setLngLat([FLW_MAIN_GATE.lng, FLW_MAIN_GATE.lat])
                .setPopup(gatePopup)
                .addTo(m);
            bounds.extend([FLW_MAIN_GATE.lng, FLW_MAIN_GATE.lat]);

            // Hotels: gold markers + navy popups with the distance-to-base label.
            for (const p of hotels) {
                const { lng, lat } = p.address!;
                const distance = formatFLWDistance(p);
                const popup = new maplibregl.Popup({
                    offset: 24,
                    closeButton: false,
                }).setHTML(
                    `<div style="min-width:170px">
                        <div style="font-weight:600;color:${NAVY}">${p.shortName}</div>
                        <div style="font-size:12px;color:#807766">${p.brand}${
                            distance ? ` &middot; ${distance}` : ""
                        }</div>
                        <a href="/hotels/${p.slug}" style="display:inline-block;margin-top:6px;font-size:13px;font-weight:600;color:#8a6232">View hotel &rarr;</a>
                    </div>`,
                );
                new maplibregl.Marker({ color: GOLD })
                    .setLngLat([lng, lat])
                    .setPopup(popup)
                    .addTo(m);
                bounds.extend([lng, lat]);
            }

            // Soft halo around the base to read as "the installation," + fit all pins.
            m.on("load", () => {
                if (!cancelled) setReady(true);
                m.addSource("flw-gate", {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        properties: {},
                        geometry: {
                            type: "Point",
                            coordinates: [FLW_MAIN_GATE.lng, FLW_MAIN_GATE.lat],
                        },
                    },
                });
                m.addLayer({
                    id: "flw-area",
                    type: "circle",
                    source: "flw-gate",
                    paint: {
                        "circle-color": NAVY,
                        "circle-opacity": 0.1,
                        "circle-stroke-color": NAVY,
                        "circle-stroke-opacity": 0.5,
                        "circle-stroke-width": 2,
                        "circle-radius": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            10,
                            18,
                            12,
                            48,
                            14,
                            120,
                        ],
                    },
                });
                // Name the installation directly on the map, below the gate marker.
                m.addLayer({
                    id: "flw-label",
                    type: "symbol",
                    source: "flw-gate",
                    layout: {
                        "text-field": "Ft Leonard Wood Base",
                        "text-font": ["Noto Sans Bold"],
                        "text-size": 11,
                        "text-offset": [0, 1.4],
                        "text-anchor": "top",
                        "text-allow-overlap": true,
                    },
                    paint: {
                        "text-color": NAVY,
                        "text-halo-color": "#ffffff",
                        "text-halo-width": 1.5,
                    },
                });

                // Name each hotel below its gold pin.
                m.addSource("hotels", {
                    type: "geojson",
                    data: {
                        type: "FeatureCollection",
                        features: hotels.map((p) => ({
                            type: "Feature",
                            properties: { label: p.brand },
                            geometry: {
                                type: "Point",
                                coordinates: [p.address!.lng, p.address!.lat],
                            },
                        })),
                    },
                });
                m.addLayer({
                    id: "hotel-labels",
                    type: "symbol",
                    source: "hotels",
                    layout: {
                        "text-field": ["get", "label"],
                        "text-font": ["Noto Sans Regular"],
                        "text-size": 11,
                        "text-offset": [0, 1.3],
                        "text-anchor": "top",
                        "text-allow-overlap": true,
                    },
                    paint: {
                        "text-color": NAVY,
                        "text-halo-color": "#ffffff",
                        "text-halo-width": 1.5,
                    },
                });

                if (!bounds.isEmpty()) {
                    m.fitBounds(bounds, { padding: 70, maxZoom: 13, duration: 0 });
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
            aria-label="Map of I44 Hotels near the Fort Leonard Wood main gate"
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
