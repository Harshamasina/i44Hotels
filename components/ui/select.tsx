"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

/**
 * Themed, accessible select (ARIA combobox + listbox) so the open list matches
 * the app instead of the OS default. Submits via a hidden input named `name`,
 * so it works inside a plain <form> / server action like a native select.
 */
export function Select({
    name,
    id,
    value,
    onValueChange,
    options,
    placeholder = "Select an option",
    invalid = false,
    describedBy,
    className,
    triggerClassName,
    menuClassName,
}: {
    name: string;
    id?: string;
    value: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    invalid?: boolean;
    describedBy?: string;
    className?: string;
    triggerClassName?: string;
    menuClassName?: string;
}) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const uid = useId();
    const listId = `${uid}-listbox`;
    const optionId = (i: number) => `${uid}-opt-${i}`;

    const selected = options.find((o) => o.value === value);

    useEffect(() => {
        if (!open) return;
        function onPointerDown(e: PointerEvent) {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("pointerdown", onPointerDown);
        return () => document.removeEventListener("pointerdown", onPointerDown);
    }, [open]);

    function openMenu() {
        const idx = options.findIndex((o) => o.value === value);
        setActiveIndex(idx >= 0 ? idx : 0);
        setOpen(true);
    }

    function commit(index: number) {
        const opt = options[index];
        if (opt) onValueChange(opt.value);
        setOpen(false);
        triggerRef.current?.focus();
    }

    function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                if (!open) openMenu();
                else setActiveIndex((i) => Math.min(i + 1, options.length - 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                if (!open) openMenu();
                else setActiveIndex((i) => Math.max(i - 1, 0));
                break;
            case "Home":
                if (open) {
                    e.preventDefault();
                    setActiveIndex(0);
                }
                break;
            case "End":
                if (open) {
                    e.preventDefault();
                    setActiveIndex(options.length - 1);
                }
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                if (!open) openMenu();
                else commit(activeIndex);
                break;
            case "Escape":
                if (open) {
                    e.preventDefault();
                    setOpen(false);
                }
                break;
            case "Tab":
                if (open) setOpen(false);
                break;
        }
    }

    return (
        <div ref={rootRef} className={cn("relative", className)}>
            <input type="hidden" name={name} value={value} />
            <button
                ref={triggerRef}
                type="button"
                id={id}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={listId}
                aria-activedescendant={open ? optionId(activeIndex) : undefined}
                aria-invalid={invalid}
                aria-describedby={describedBy}
                onClick={() => (open ? setOpen(false) : openMenu())}
                onKeyDown={onKeyDown}
                className={cn(
                    "focus-visible:ring-gold-500 hover:border-gold-300 flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 py-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    invalid
                        ? "border-error"
                        : open
                          ? "border-gold-400"
                          : "border-sand-300",
                    triggerClassName,
                )}
            >
                <span className={selected ? "text-navy-800" : "text-sand-500"}>
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown
                    className={cn(
                        "text-gold-600 size-4 shrink-0 transition-transform duration-200",
                        open && "rotate-180",
                    )}
                    aria-hidden
                />
            </button>

            {open && (
                <ul
                    id={listId}
                    role="listbox"
                    className={cn(
                        "border-sand-200 animate-dropdown absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border bg-white p-1.5 shadow-lg",
                        menuClassName,
                    )}
                >
                    {options.map((opt, i) => {
                        const isSelected = opt.value === value;
                        const isActive = i === activeIndex;
                        return (
                            <li
                                key={opt.value}
                                id={optionId(i)}
                                role="option"
                                aria-selected={isSelected}
                                onMouseEnter={() => setActiveIndex(i)}
                                onClick={() => commit(i)}
                                className={cn(
                                    "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm",
                                    isActive
                                        ? "bg-sand-100 text-navy-900"
                                        : "text-navy-800",
                                )}
                            >
                                <span className={isSelected ? "font-medium" : undefined}>
                                    {opt.label}
                                </span>
                                {isSelected && (
                                    <Check
                                        className="text-gold-600 size-4 shrink-0"
                                        aria-hidden
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
