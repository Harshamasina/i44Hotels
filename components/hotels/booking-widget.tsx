"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import type { Property } from "@/lib/properties";
import { buildBookingUrl, RATE_PLANS } from "@/lib/booking";
import { DatePicker, toISODate } from "@/components/ui/date-picker";
import { Select, type SelectOption } from "@/components/ui/select";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const opts = (from: number, to: number, suffix?: (n: number) => string): SelectOption[] =>
    Array.from({ length: to - from + 1 }, (_, i) => {
        const n = from + i;
        return { value: String(n), label: suffix ? suffix(n) : String(n) };
    });

const ADULTS = opts(1, 6, (n) => `${n} adult${n > 1 ? "s" : ""}`);
const CHILDREN = opts(0, 4, (n) => (n === 0 ? "No children" : `${n} child${n > 1 ? "ren" : ""}`));
const ROOMS = opts(1, 4, (n) => `${n} room${n > 1 ? "s" : ""}`);

const labelClass = "text-sand-500 mb-1 block text-xs font-semibold tracking-[0.1em] uppercase";

/** The booking fields + submit. Self-contained state so it can be rendered in
 *  two places (desktop sidebar, mobile sheet) without sharing state. */
function BookingForm({ property, idPrefix }: { property: Property; idPrefix: string }) {
    const today = toISODate(new Date());
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [adults, setAdults] = useState("2");
    const [children, setChildren] = useState("0");
    const [rooms, setRooms] = useState("1");
    const [rate, setRate] = useState("");

    // Rate codes are only deep-linkable on Choice today (Wyndham scheme unverified).
    const showRates = property.brandParent === "Choice";
    const valid = Boolean(checkIn && checkOut && checkOut > checkIn);

    const submit = () => {
        if (!valid) return;
        const url = buildBookingUrl(property, {
            checkIn,
            checkOut,
            adults: Number(adults),
            children: Number(children),
            rooms: Number(rooms),
            ratePlanId: rate,
        });
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="space-y-3">
            <div className="grid gap-3">
                <div>
                    <label htmlFor={`${idPrefix}-in`} className={labelClass}>
                        Check-in
                    </label>
                    <DatePicker
                        id={`${idPrefix}-in`}
                        name={`${idPrefix}-checkIn`}
                        value={checkIn}
                        onChange={(v) => {
                            setCheckIn(v);
                            if (checkOut && checkOut <= v) setCheckOut("");
                        }}
                        min={today}
                        placeholder="Add date"
                        compact
                    />
                </div>
                <div>
                    <label htmlFor={`${idPrefix}-out`} className={labelClass}>
                        Check-out
                    </label>
                    <DatePicker
                        id={`${idPrefix}-out`}
                        name={`${idPrefix}-checkOut`}
                        value={checkOut}
                        onChange={setCheckOut}
                        min={checkIn || today}
                        placeholder="Add date"
                        compact
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>Adults</label>
                    <Select
                        name={`${idPrefix}-adults`}
                        value={adults}
                        onValueChange={setAdults}
                        options={ADULTS}
                    />
                </div>
                <div>
                    <label className={labelClass}>Children</label>
                    <Select
                        name={`${idPrefix}-children`}
                        value={children}
                        onValueChange={setChildren}
                        options={CHILDREN}
                    />
                </div>
            </div>

            <div>
                <label className={labelClass}>Rooms</label>
                <Select
                    name={`${idPrefix}-rooms`}
                    value={rooms}
                    onValueChange={setRooms}
                    options={ROOMS}
                />
            </div>

            {showRates && (
                <div>
                    <label className={labelClass}>Rate</label>
                    <Select
                        name={`${idPrefix}-rate`}
                        value={rate}
                        onValueChange={setRate}
                        options={RATE_PLANS.map((r) => ({
                            value: r.id,
                            label: r.label,
                        }))}
                    />
                    {rate && (
                        <p className="text-sand-500 mt-1 text-xs">
                            {rate === "rewards"
                                ? "Redeemed in your Choice Privileges account."
                                : "Valid ID required at check-in."}
                        </p>
                    )}
                </div>
            )}

            <button
                type="button"
                onClick={submit}
                disabled={!valid}
                className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full",
                    !valid && "cursor-not-allowed opacity-50",
                )}
            >
                Check availability
                <ArrowRight className="size-4" aria-hidden />
            </button>
            <p className="text-sand-500 text-center text-xs">
                Opens the official {property.brand} site. Best available rate, no
                booking fees.
            </p>
        </div>
    );
}

/**
 * Responsive booking widget: the form sits inline in the sticky sidebar on
 * desktop; on mobile a "Check availability" button opens it as a bottom sheet.
 */
export function BookingWidget({ property }: { property: Property }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <>
            {/* Desktop: inline form */}
            <div className="hidden lg:block">
                <BookingForm property={property} idPrefix="d" />
            </div>

            {/* Mobile: trigger */}
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={cn(buttonVariants({ size: "lg" }), "w-full lg:hidden")}
            >
                Check availability
                <ArrowRight className="size-4" aria-hidden />
            </button>

            {/* Mobile: bottom sheet */}
            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Check availability"
                    className="fixed inset-0 z-[60] flex flex-col justify-end lg:hidden"
                >
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={() => setOpen(false)}
                        className="bg-navy-950/50 absolute inset-0"
                    />
                    <div className="animate-dropdown relative max-h-[88vh] overflow-y-auto rounded-t-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-navy-800 font-serif text-lg">
                                Check availability
                            </p>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close"
                                className="text-navy-700 hover:bg-sand-100 inline-flex size-9 items-center justify-center rounded-full transition-colors"
                            >
                                <X className="size-5" aria-hidden />
                            </button>
                        </div>
                        <BookingForm property={property} idPrefix="m" />
                    </div>
                </div>
            )}
        </>
    );
}
