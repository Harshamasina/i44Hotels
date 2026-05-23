"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Local-date ISO string (YYYY-MM-DD), the value format the form submits. */
export function toISODate(d: Date): string {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseISO(s?: string): Date | null {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return Number.isNaN(d.getTime()) ? null : d;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
const addDays = (d: Date, n: number) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const firstOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

/**
 * Themed, accessible date picker (calendar in a branded popover) so dates do not
 * fall back to the OS calendar. Submits a YYYY-MM-DD value via a hidden input.
 */
export function DatePicker({
    name,
    id,
    value,
    onChange,
    min,
    placeholder = "Select a date",
    invalid = false,
    describedBy,
}: {
    name: string;
    id?: string;
    value: string;
    onChange: (value: string) => void;
    /** Earliest selectable date (YYYY-MM-DD); earlier days are disabled. */
    min?: string;
    placeholder?: string;
    invalid?: boolean;
    describedBy?: string;
}) {
    const selected = parseISO(value);
    const minDate = parseISO(min);
    const today = startOfDay(new Date());
    const base = selected ?? minDate ?? today;

    const [open, setOpen] = useState(false);
    const [view, setView] = useState<Date>(() => firstOfMonth(base));
    const [focusDate, setFocusDate] = useState<Date>(() => base);

    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function onPointerDown(e: PointerEvent) {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open]);

    // Move DOM focus to the active day whenever it changes while open.
    useEffect(() => {
        if (!open) return;
        gridRef.current
            ?.querySelector<HTMLButtonElement>('[data-active="true"]')
            ?.focus();
    }, [open, focusDate]);

    function openCal() {
        const start = selected ?? minDate ?? today;
        setView(firstOfMonth(start));
        setFocusDate(start);
        setOpen(true);
    }

    const isDisabled = (day: Date) => (minDate ? day < startOfDay(minDate) : false);

    function pick(day: Date) {
        if (isDisabled(day)) return;
        onChange(toISODate(day));
        setOpen(false);
        triggerRef.current?.focus();
    }

    function moveFocus(next: Date) {
        setFocusDate(next);
        if (
            next.getMonth() !== view.getMonth() ||
            next.getFullYear() !== view.getFullYear()
        ) {
            setView(firstOfMonth(next));
        }
    }

    function onGridKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        switch (e.key) {
            case "ArrowLeft":
                e.preventDefault();
                moveFocus(addDays(focusDate, -1));
                break;
            case "ArrowRight":
                e.preventDefault();
                moveFocus(addDays(focusDate, 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                moveFocus(addDays(focusDate, -7));
                break;
            case "ArrowDown":
                e.preventDefault();
                moveFocus(addDays(focusDate, 7));
                break;
            case "Home":
                e.preventDefault();
                moveFocus(addDays(focusDate, -focusDate.getDay()));
                break;
            case "End":
                e.preventDefault();
                moveFocus(addDays(focusDate, 6 - focusDate.getDay()));
                break;
            case "PageUp":
                e.preventDefault();
                moveFocus(
                    new Date(
                        focusDate.getFullYear(),
                        focusDate.getMonth() - 1,
                        focusDate.getDate(),
                    ),
                );
                break;
            case "PageDown":
                e.preventDefault();
                moveFocus(
                    new Date(
                        focusDate.getFullYear(),
                        focusDate.getMonth() + 1,
                        focusDate.getDate(),
                    ),
                );
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                pick(focusDate);
                break;
            case "Escape":
                e.preventDefault();
                setOpen(false);
                triggerRef.current?.focus();
                break;
        }
    }

    const year = view.getFullYear();
    const month = view.getMonth();
    const leading = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < leading; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

    const display = selected
        ? `${MONTHS[selected.getMonth()]} ${selected.getDate()}, ${selected.getFullYear()}`
        : placeholder;

    const navBtn =
        "text-navy-700 hover:bg-sand-100 focus-visible:ring-gold-500 rounded-lg p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none";

    return (
        <div ref={rootRef} className="relative">
            <input type="hidden" name={name} value={value} />
            <button
                ref={triggerRef}
                type="button"
                id={id}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                onClick={() => (open ? setOpen(false) : openCal())}
                onKeyDown={(e) => {
                    if (
                        !open &&
                        (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")
                    ) {
                        e.preventDefault();
                        openCal();
                    }
                }}
                className={cn(
                    "focus-visible:ring-gold-500 hover:border-gold-300 flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 py-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    invalid
                        ? "border-error"
                        : open
                          ? "border-gold-400"
                          : "border-sand-300",
                )}
            >
                <span className={selected ? "text-navy-800" : "text-sand-500"}>
                    {display}
                </span>
                <CalendarIcon className="text-gold-600 size-4 shrink-0" aria-hidden />
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-label="Choose a date"
                    className="border-sand-200 animate-dropdown absolute z-20 mt-2 w-72 rounded-xl border bg-white p-3 shadow-lg"
                >
                    <div className="mb-2 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setView(addMonths(view, -1))}
                            aria-label="Previous month"
                            className={navBtn}
                        >
                            <ChevronLeft className="size-4" aria-hidden />
                        </button>
                        <span className="text-navy-800 text-sm font-semibold">
                            {MONTHS[month]} {year}
                        </span>
                        <button
                            type="button"
                            onClick={() => setView(addMonths(view, 1))}
                            aria-label="Next month"
                            className={navBtn}
                        >
                            <ChevronRight className="size-4" aria-hidden />
                        </button>
                    </div>

                    <div className="mb-1 grid grid-cols-7 gap-0.5">
                        {WEEKDAYS.map((w) => (
                            <span
                                key={w}
                                className="text-sand-500 flex h-7 items-center justify-center text-xs font-medium"
                            >
                                {w}
                            </span>
                        ))}
                    </div>

                    <div
                        ref={gridRef}
                        role="grid"
                        onKeyDown={onGridKeyDown}
                        className="grid grid-cols-7 gap-0.5"
                    >
                        {cells.map((day, i) => {
                            if (!day) return <span key={`b-${i}`} />;
                            const disabled = isDisabled(day);
                            const isSel = selected != null && sameDay(day, selected);
                            const isActive = sameDay(day, focusDate);
                            const isToday = sameDay(day, today);
                            return (
                                <button
                                    key={toISODate(day)}
                                    type="button"
                                    role="gridcell"
                                    data-active={isActive ? "true" : undefined}
                                    tabIndex={isActive ? 0 : -1}
                                    aria-selected={isSel || undefined}
                                    aria-current={isToday ? "date" : undefined}
                                    disabled={disabled}
                                    onClick={() => pick(day)}
                                    className={cn(
                                        "focus-visible:ring-gold-500 flex h-9 items-center justify-center rounded-lg text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
                                        disabled && "text-sand-300 cursor-not-allowed",
                                        !disabled &&
                                            !isSel &&
                                            "text-navy-800 hover:bg-sand-100",
                                        isSel &&
                                            "bg-gold-500 text-navy-900 font-semibold",
                                        !isSel && isToday && "ring-gold-300 ring-1",
                                    )}
                                >
                                    {day.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
