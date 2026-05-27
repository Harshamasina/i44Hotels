"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid2x2, Images } from "lucide-react";
import type { PropertyPhoto, PhotoCategory } from "@/lib/properties";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER: PhotoCategory[] = [
    "exterior",
    "lobby",
    "room",
    "breakfast",
    "amenity",
    "meeting",
    "pool",
    "fitness",
    "nearby",
];

const CATEGORY_LABEL: Record<PhotoCategory, string> = {
    exterior: "Exterior",
    lobby: "Lobby",
    room: "Rooms",
    breakfast: "Breakfast",
    amenity: "Amenities",
    meeting: "Meeting",
    pool: "Pool",
    fitness: "Fitness",
    nearby: "Nearby",
};

type Filter = PhotoCategory | "all";

/**
 * Hotel photo gallery: a hero collage that opens a full-screen modal with two
 * modes, a light grid overview and an immersive (dark) lightbox, with granular
 * category tabs, keyboard + swipe navigation, click-to-zoom, focus trapping,
 * and scroll lock. All images lazy-load except the collage lead.
 */
export function PhotoGallery({
    photos,
    hotelName,
}: {
    photos: PropertyPhoto[];
    hotelName: string;
}) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"grid" | "single">("grid");
    const [filter, setFilter] = useState<Filter>("all");
    const [index, setIndex] = useState(0);
    const [zoom, setZoom] = useState(false);

    const dialogRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const touchX = useRef<number | null>(null);
    const activeThumbRef = useRef<HTMLButtonElement | null>(null);

    const categories = useMemo(
        () => CATEGORY_ORDER.filter((c) => photos.some((p) => p.category === c)),
        [photos],
    );
    const list = useMemo(
        () => (filter === "all" ? photos : photos.filter((p) => p.category === filter)),
        [photos, filter],
    );
    const count = (c: Filter) =>
        c === "all" ? photos.length : photos.filter((p) => p.category === c).length;

    const collage = photos.slice(0, 5);
    const active = list[Math.min(index, list.length - 1)];

    const openModal = useCallback((trigger: HTMLElement, m: "grid" | "single", i = 0) => {
        triggerRef.current = trigger;
        setFilter("all");
        setIndex(i);
        setMode(m);
        setZoom(false);
        setOpen(true);
    }, []);

    const close = useCallback(() => {
        setOpen(false);
        triggerRef.current?.focus();
    }, []);

    const next = useCallback(() => {
        setZoom(false);
        setIndex((i) => (i + 1) % list.length);
    }, [list.length]);
    const prev = useCallback(() => {
        setZoom(false);
        setIndex((i) => (i - 1 + list.length) % list.length);
    }, [list.length]);

    const chooseFilter = useCallback((f: Filter) => {
        setFilter(f);
        setIndex(0);
        setZoom(false);
    }, []);

    // Scroll lock + keyboard handling while open.
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                close();
            } else if (mode === "single") {
                if (e.key === "ArrowRight") next();
                else if (e.key === "ArrowLeft") prev();
            }
        };
        window.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialogRef.current?.focus();
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, mode, next, prev, close]);

    // Keep the active filmstrip thumbnail centered as you navigate, so neighbors
    // stay visible without needing a visible scrollbar.
    useEffect(() => {
        if (open && mode === "single") {
            activeThumbRef.current?.scrollIntoView({
                inline: "center",
                block: "nearest",
                behavior: "smooth",
            });
        }
    }, [index, filter, mode, open]);

    // Basic focus trap: keep Tab focus within the dialog.
    const onDialogKeyDown = (e: React.KeyboardEvent) => {
        if (e.key !== "Tab" || !dialogRef.current) return;
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    const onTouchStart = (e: React.TouchEvent) => {
        touchX.current = e.touches[0].clientX;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        touchX.current = null;
    };

    if (photos.length === 0) return null;

    return (
        <>
            {/* Hero collage */}
            <div>
                <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl sm:h-[26rem]">
                    {collage.map((photo, i) => {
                        const lead = i === 0;
                        const isLast = i === collage.length - 1;
                        const showAll = isLast && photos.length > collage.length;
                        return (
                            <button
                                key={photo.src}
                                type="button"
                                onClick={(e) =>
                                    openModal(e.currentTarget, "single", i)
                                }
                                aria-label={
                                    showAll
                                        ? "Open slideshow to see more photos"
                                        : `View photo: ${photo.alt}`
                                }
                                className={cn(
                                    "group relative cursor-pointer overflow-hidden",
                                    lead
                                        ? "col-span-4 row-span-2 aspect-3/2 sm:col-span-2 sm:aspect-auto"
                                        : "hidden aspect-3/2 sm:block sm:aspect-auto",
                                )}
                            >
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    fill
                                    priority={lead}
                                    sizes={
                                        lead ? "(min-width:640px) 50vw, 100vw" : "25vw"
                                    }
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {/* "Show all" overlay sits on the last tile. */}
                                {showAll && (
                                    <span className="bg-navy-900/55 group-hover:bg-navy-900/65 absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white transition-colors">
                                        <Images className="size-6" aria-hidden />
                                        <span className="text-sm font-semibold">
                                            +{photos.length - collage.length} photos
                                        </span>
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Standalone gallery button, in normal flow below the collage. */}
                <div className="mt-3 flex justify-end">
                    <button
                        type="button"
                        onClick={(e) => openModal(e.currentTarget, "grid")}
                        className="text-navy-800 border-sand-300 hover:border-gold-300 inline-flex cursor-pointer items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold transition-colors"
                    >
                        <Images className="size-4" aria-hidden />
                        View all {photos.length} photos
                    </button>
                </div>
            </div>

            {/* Modal */}
            {open && (
                <div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${hotelName} photos`}
                    tabIndex={-1}
                    onKeyDown={onDialogKeyDown}
                    className={cn(
                        // z-60 so the fullscreen gallery covers the mobile booking bar (z-50).
                        "fixed inset-0 z-[60] flex flex-col outline-none",
                        mode === "grid" ? "bg-sand-50" : "bg-navy-950/97",
                    )}
                >
                    {/* Top bar */}
                    <div
                        className={cn(
                            "flex items-center justify-between gap-4 px-4 py-3 sm:px-6",
                            mode === "grid"
                                ? "border-sand-200 bg-sand-50/95 border-b backdrop-blur"
                                : "text-white",
                        )}
                    >
                        <div className="min-w-0">
                            {mode === "grid" ? (
                                <p className="text-navy-800 truncate font-serif text-lg">
                                    {hotelName}
                                </p>
                            ) : (
                                <p className="truncate text-sm font-medium text-white/90">
                                    {filter === "all"
                                        ? "All photos"
                                        : CATEGORY_LABEL[filter]}{" "}
                                    &middot; {index + 1} / {list.length}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setMode((m) => (m === "grid" ? "single" : "grid"))
                                }
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition",
                                    mode === "grid"
                                        ? "text-navy-700 hover:bg-sand-200"
                                        : "text-white hover:bg-white/15",
                                )}
                            >
                                <Grid2x2 className="size-4" aria-hidden />
                                {mode === "grid" ? "Slideshow" : "Grid"}
                            </button>
                            <button
                                type="button"
                                onClick={close}
                                aria-label="Close gallery"
                                className={cn(
                                    "inline-flex size-9 items-center justify-center rounded-full transition",
                                    mode === "grid"
                                        ? "text-navy-700 hover:bg-sand-200"
                                        : "text-white hover:bg-white/15",
                                )}
                            >
                                <X className="size-5" aria-hidden />
                            </button>
                        </div>
                    </div>

                    {/* Category tabs */}
                    <div
                        className={cn(
                            "flex gap-2 overflow-x-auto px-4 py-3 sm:px-6",
                            mode === "single" && "justify-center",
                        )}
                    >
                        {(["all", ...categories] as Filter[]).map((c) => {
                            const activeTab = filter === c;
                            const label = c === "all" ? "All" : CATEGORY_LABEL[c];
                            return (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => chooseFilter(c)}
                                    aria-pressed={activeTab}
                                    className={cn(
                                        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                                        activeTab
                                            ? "border-gold-500 bg-gold-500 text-navy-900"
                                            : mode === "grid"
                                              ? "border-sand-300 text-navy-700 bg-white hover:border-gold-300"
                                              : "border-white/25 text-white/80 hover:border-white/60",
                                    )}
                                >
                                    {label}
                                    <span
                                        className={cn(
                                            "text-xs",
                                            activeTab
                                                ? "text-navy-900/70"
                                                : "opacity-60",
                                        )}
                                    >
                                        {count(c)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Body */}
                    {mode === "grid" ? (
                        <div className="flex-1 overflow-y-auto px-4 pb-10 sm:px-6">
                            <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>button]:mb-3">
                                {list.map((photo, i) => (
                                    <button
                                        key={photo.src}
                                        type="button"
                                        onClick={() => {
                                            setIndex(i);
                                            setMode("single");
                                            setZoom(false);
                                        }}
                                        className="group relative block w-full cursor-pointer overflow-hidden rounded-xl"
                                    >
                                        <Image
                                            src={photo.src}
                                            alt={photo.alt}
                                            width={600}
                                            height={400}
                                            loading="lazy"
                                            sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                                            className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        active && (
                            <div className="flex flex-1 flex-col overflow-hidden">
                                <div
                                    className="relative flex min-h-0 flex-1 items-center justify-center px-4"
                                    onTouchStart={onTouchStart}
                                    onTouchEnd={onTouchEnd}
                                >
                                    <button
                                        type="button"
                                        onClick={prev}
                                        aria-label="Previous photo"
                                        className="absolute left-2 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:left-6"
                                    >
                                        <ChevronLeft className="size-6" aria-hidden />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setZoom((z) => !z)}
                                        aria-label={zoom ? "Zoom out" : "Zoom in"}
                                        className="flex h-full max-w-5xl cursor-zoom-in items-center justify-center"
                                    >
                                        {/* Plain img so the border radius clips the actual
                                            (object-contain) photo, not its letterbox box.
                                            eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={active.src}
                                            alt={active.alt}
                                            className={cn(
                                                "max-h-full w-auto max-w-full rounded-2xl object-contain shadow-2xl transition-transform duration-300",
                                                zoom && "scale-150 cursor-zoom-out",
                                            )}
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={next}
                                        aria-label="Next photo"
                                        className="absolute right-2 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 sm:right-6"
                                    >
                                        <ChevronRight className="size-6" aria-hidden />
                                    </button>
                                </div>

                                <p className="px-6 pt-3 text-center text-sm text-white/80">
                                    {active.alt}
                                </p>

                                {/* Filmstrip: scrollbar hidden; active thumb auto-centers. */}
                                <div className="flex gap-2 overflow-x-auto px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                    {list.map((photo, i) => (
                                        <button
                                            key={photo.src}
                                            type="button"
                                            ref={i === index ? activeThumbRef : undefined}
                                            onClick={() => {
                                                setIndex(i);
                                                setZoom(false);
                                            }}
                                            aria-label={`Go to photo ${i + 1}`}
                                            className={cn(
                                                "relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-md ring-2 transition",
                                                i === index
                                                    ? "ring-gold-500"
                                                    : "opacity-60 ring-transparent hover:opacity-100",
                                            )}
                                        >
                                            <Image
                                                src={photo.src}
                                                alt=""
                                                fill
                                                sizes="80px"
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </>
    );
}
