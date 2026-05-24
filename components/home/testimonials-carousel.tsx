"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { brandLogo } from "@/lib/properties";
import type { PooledReview } from "@/lib/reviews";
import { Stars } from "@/components/ui/stars";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6500;

/**
 * Review carousel: a sliding track (one card per view) that animates smoothly
 * between slides, with autoplay (paused on hover/focus, off for prefers-reduced-
 * motion), arrows, dots, swipe, and arrow keys. Each card carries the motel's flag
 * logo, name, and that hotel's overall Google rating so guests can see how each
 * property scores.
 */
export function TestimonialsCarousel({
    reviews,
    averageRating,
    totalCount,
}: {
    reviews: PooledReview[];
    averageRating: number;
    totalCount: number;
}) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const count = reviews.length;
    const touchX = useRef<number | null>(null);

    const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

    useEffect(() => {
        if (paused || count <= 1) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const id = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
        return () => window.clearInterval(id);
    }, [paused, count]);

    return (
        <div className="mt-8">
            {totalCount > 0 && (
                <div className="mb-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
                    <Stars rating={averageRating} />
                    <span className="text-navy-800 font-semibold">
                        {averageRating.toFixed(1)}
                    </span>
                    <span className="text-sand-600">
                        across {totalCount.toLocaleString()} Google reviews
                    </span>
                </div>
            )}

            <div
                className="relative mx-auto max-w-3xl"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocusCapture={() => setPaused(true)}
                onBlurCapture={() => setPaused(false)}
                onKeyDown={(e) => {
                    if (e.key === "ArrowLeft") go(index - 1);
                    if (e.key === "ArrowRight") go(index + 1);
                }}
                onTouchStart={(e) => {
                    touchX.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                    if (touchX.current === null) return;
                    const dx = e.changedTouches[0].clientX - touchX.current;
                    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
                    touchX.current = null;
                }}
            >
                {/* Clip the track; vertical padding keeps the card shadow from being clipped. */}
                <div className="overflow-hidden px-1 py-4">
                    <div
                        className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
                        style={{ transform: `translateX(-${index * 100}%)` }}
                    >
                        {reviews.map((r, i) => (
                            <div
                                key={`${r.hotelSlug}-${i}`}
                                className="w-full shrink-0"
                                aria-hidden={i !== index}
                                inert={i !== index}
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`Review ${i + 1} of ${count}`}
                            >
                                <ReviewCard review={r} />
                            </div>
                        ))}
                    </div>
                </div>

                {count > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => go(index - 1)}
                            aria-label="Previous review"
                            className="border-sand-200 text-navy-700 hover:bg-gold-50 hover:text-gold-700 absolute top-1/2 -left-5 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md transition-colors lg:flex"
                        >
                            <ChevronLeft className="size-5" aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(index + 1)}
                            aria-label="Next review"
                            className="border-sand-200 text-navy-700 hover:bg-gold-50 hover:text-gold-700 absolute top-1/2 -right-5 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md transition-colors lg:flex"
                        >
                            <ChevronRight className="size-5" aria-hidden />
                        </button>
                    </>
                )}
            </div>

            {count > 1 && (
                <div className="mt-6 flex items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => go(index - 1)}
                        aria-label="Previous review"
                        className="border-sand-200 text-navy-700 hover:bg-gold-50 hover:text-gold-700 inline-flex size-9 items-center justify-center rounded-full border bg-white shadow-sm transition-colors lg:hidden"
                    >
                        <ChevronLeft className="size-4" aria-hidden />
                    </button>

                    <div className="flex items-center gap-1">
                        {reviews.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setIndex(i)}
                                aria-label={`Go to review ${i + 1}`}
                                aria-current={i === index}
                                className="group flex h-6 items-center justify-center px-2"
                            >
                                <span
                                    className={cn(
                                        "block h-2 rounded-full transition-all",
                                        i === index
                                            ? "bg-gold-500 w-6"
                                            : "bg-sand-300 group-hover:bg-sand-400 w-2",
                                    )}
                                />
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => go(index + 1)}
                        aria-label="Next review"
                        className="border-sand-200 text-navy-700 hover:bg-gold-50 hover:text-gold-700 inline-flex size-9 items-center justify-center rounded-full border bg-white shadow-sm transition-colors lg:hidden"
                    >
                        <ChevronRight className="size-4" aria-hidden />
                    </button>
                </div>
            )}

            <p className="text-sand-500 mt-6 text-center text-xs">Reviews provided by Google.</p>
        </div>
    );
}

/** A single review card. Footer pinned to the bottom so slide heights line up. */
function ReviewCard({ review: r }: { review: PooledReview }) {
    return (
        <article className="border-sand-200 shadow-navy-900/5 flex h-full flex-col rounded-3xl border bg-white p-8 shadow-lg sm:p-10">
            <Quote className="text-gold-400 size-9" aria-hidden />
            <Stars rating={r.rating} className="mt-4" />
            <blockquote className="text-navy-800 mt-4 line-clamp-6 text-lg leading-relaxed sm:text-xl">
                {r.text}
            </blockquote>

            <div className="border-sand-200 mt-auto flex items-center justify-between gap-4 border-t pt-6">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="bg-gold-100 text-gold-700 inline-flex size-11 shrink-0 items-center justify-center rounded-full font-serif text-base font-semibold">
                        {r.author.charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                        <span className="text-navy-800 block truncate font-semibold">
                            {r.author}
                        </span>
                        <span className="text-sand-500 block text-xs">{r.relativeTime}</span>
                    </span>
                </div>

                <Link
                    href={`/hotels/${r.hotelSlug}`}
                    className="group flex shrink-0 items-center gap-2.5"
                    title={`See ${r.hotelName}`}
                >
                    <span className="border-sand-200 inline-flex h-10 w-16 items-center justify-center rounded-lg border bg-white px-2 shadow-sm">
                        <span className="relative block h-6 w-full">
                            <Image
                                src={brandLogo(r.hotelBrand)}
                                alt={r.hotelBrand}
                                fill
                                sizes="64px"
                                loading="eager"
                                className="object-contain"
                            />
                        </span>
                    </span>
                    <span className="min-w-0">
                        <span className="text-sand-600 group-hover:text-gold-700 hidden max-w-[8rem] truncate text-xs font-medium transition-colors sm:block">
                            {r.hotelName}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-xs">
                            <Star
                                className="fill-gold-500 text-gold-500 size-3.5 shrink-0"
                                aria-hidden
                            />
                            <span className="text-navy-800 font-semibold">
                                {r.hotelRating.toFixed(1)}
                            </span>
                            <span className="text-sand-500 hidden sm:inline">
                                ({r.hotelReviewCount.toLocaleString()})
                            </span>
                        </span>
                    </span>
                </Link>
            </div>
        </article>
    );
}
