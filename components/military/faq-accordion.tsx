"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type Faq = { q: string; a: string };

/**
 * Accessible FAQ accordion with a smooth open/close height transition.
 * Uses the grid-rows 0fr -> 1fr technique so the answer animates instead of
 * popping (native <details> can't transition its display:none content). The
 * matching FAQPage JSON-LD is rendered server-side on the page for SEO.
 */
export function FaqAccordion({ items }: { items: Faq[] }) {
    return (
        <div className="mx-auto max-w-3xl space-y-3">
            {items.map((item) => (
                <FaqItem key={item.q} item={item} />
            ))}
        </div>
    );
}

function FaqItem({ item }: { item: Faq }) {
    const [open, setOpen] = useState(false);
    const panelId = useId();

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
            <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpen((v) => !v)}
                className="text-navy-800 focus-visible:ring-gold-500 flex w-full cursor-pointer items-center justify-between gap-4 text-left font-semibold focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
                {item.q}
                <span
                    aria-hidden
                    className={cn(
                        "text-gold-600 shrink-0 text-xl leading-none transition-transform duration-200 ease-out",
                        open && "rotate-45",
                    )}
                >
                    +
                </span>
            </button>
            <div
                id={panelId}
                role="region"
                className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
            >
                <div className="overflow-hidden">
                    <p className="text-sand-700 mt-3">{item.a}</p>
                </div>
            </div>
        </div>
    );
}
