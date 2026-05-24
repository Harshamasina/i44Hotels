"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Returns a ref + a boolean that flips true (once, then stops observing) when the
 * element first scrolls near the viewport. Used to defer heavy work (e.g. loading
 * the MapLibre bundle) until the user is about to see it. `rootMargin` preloads a
 * bit early so it feels instant. Falls back to true where IntersectionObserver is
 * unavailable (old browsers / SSR safety).
 */
export function useInView<T extends HTMLElement>(
    rootMargin = "300px",
): [RefObject<T | null>, boolean] {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (inView || !el) return;
        if (typeof IntersectionObserver === "undefined") {
            setInView(true);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [inView, rootMargin]);

    return [ref, inView];
}
