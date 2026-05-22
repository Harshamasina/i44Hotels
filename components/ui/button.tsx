import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "outlineGold" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
    // Gold bg + navy text per the §7 accessibility rule (never white on gold).
    primary: "bg-gold-500 text-navy-900 shadow-sm hover:bg-gold-400",
    // For light backgrounds.
    outline: "border border-navy-300 text-navy-800 hover:bg-sand-100",
    // For dark/navy backgrounds (e.g. the FLW band, footer).
    outlineGold:
        "border border-gold-500 text-gold-300 hover:bg-gold-500 hover:text-navy-900",
    ghost: "text-navy-800 hover:bg-sand-100",
};

const sizes: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
};

/** Shared button styles, also usable on <Link> / <a> elements. */
export function buttonVariants({
    variant = "primary",
    size = "md",
    className,
}: {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
} = {}): string {
    return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
};

export function Button({
    variant = "primary",
    size = "md",
    className,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={buttonVariants({ variant, size, className })}
            {...props}
        />
    );
}
