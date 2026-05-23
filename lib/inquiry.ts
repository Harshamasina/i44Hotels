/**
 * Shared types and option lists for the single inquiry form (CLAUDE.md §6).
 * One form serves general questions, group / room-block requests, extended
 * stays, and military / Fort Leonard Wood trips, selected via the reason field.
 * The Groups page deep-links here with the reason pre-selected (?reason=group).
 *
 * No "use server" here so this module is safe to import from client components.
 * The submit handler lives in app/actions/inquiry.ts.
 */

export type InquiryReason = "general" | "group" | "extended" | "military";

export const INQUIRY_REASONS: { value: InquiryReason; label: string }[] = [
    { value: "general", label: "General question" },
    { value: "group", label: "Group / room block" },
    { value: "extended", label: "Extended stay" },
    { value: "military", label: "Military / Fort Leonard Wood" },
];

export function isInquiryReason(value: string | undefined): value is InquiryReason {
    return INQUIRY_REASONS.some((r) => r.value === value);
}

/**
 * Per-field length caps, enforced on the server (and used as input maxLength
 * hints on the client). Caps bound the work an attacker can push through the
 * form and keep emails sane. Safe to share with client components.
 */
export const INQUIRY_LIMITS = {
    name: 100,
    email: 254,
    phone: 40,
    hotel: 80,
    rooms: 6,
    message: 4000,
} as const;

/** Hidden form-field names used for anti-bot defenses (kept in one place). */
export const HONEYPOT_FIELD = "website";
export const TOKEN_FIELD = "formToken";
export const TURNSTILE_FIELD = "cf-turnstile-response";

/** Result returned from the submit action, consumed by useActionState. */
export type InquiryState = {
    status: "idle" | "success" | "error";
    /** Banner message shown after a submit attempt. */
    message?: string;
    /** Per-field validation errors, keyed by input name. */
    fieldErrors?: Partial<Record<InquiryField, string>>;
    /** Echo back the submitted values so the form can repopulate on error. */
    values?: Partial<Record<InquiryField, string>>;
};

export type InquiryField =
    | "reason"
    | "name"
    | "email"
    | "phone"
    | "hotel"
    | "checkIn"
    | "checkOut"
    | "rooms"
    | "message";

export const INITIAL_INQUIRY_STATE: InquiryState = { status: "idle" };
