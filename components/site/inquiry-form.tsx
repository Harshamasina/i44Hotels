"use client";

import { useActionState, useId, useState } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { submitInquiry } from "@/app/actions/inquiry";
import {
    INQUIRY_REASONS,
    INITIAL_INQUIRY_STATE,
    INQUIRY_LIMITS,
    HONEYPOT_FIELD,
    TOKEN_FIELD,
    type InquiryField,
    type InquiryReason,
    type InquiryState,
} from "@/lib/inquiry";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { DatePicker, toISODate } from "@/components/ui/date-picker";
import { Turnstile } from "@/components/site/turnstile";
import { cn } from "@/lib/utils";

const fieldBase =
    "w-full rounded-xl border bg-white px-4 py-2.5 text-navy-800 placeholder:text-sand-500 transition-colors focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:outline-none";

type HotelOption = { value: string; label: string };

/**
 * The single inquiry form (CLAUDE.md §6): one form, four reasons. Lives on the
 * Contact page; the Groups page deep-links with ?reason=group. Real client-side
 * required hints plus server-side validation via the submitInquiry action.
 */
export function InquiryForm({
    hotels,
    defaultReason = "general",
    formToken,
}: {
    hotels: HotelOption[];
    defaultReason?: InquiryReason;
    /** Signed anti-bot timing token, generated on the server per page load. */
    formToken: string;
}) {
    const [state, formAction, isPending] = useActionState<InquiryState, FormData>(
        submitInquiry,
        INITIAL_INQUIRY_STATE,
    );
    const [reason, setReason] = useState<InquiryReason>(defaultReason);
    const [hotel, setHotel] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const todayISO = toISODate(new Date());
    const showStayDetails = reason === "group" || reason === "extended";

    if (state.status === "success") {
        return (
            <div
                role="status"
                className="border-success/30 bg-success-bg flex items-start gap-3 rounded-2xl border p-6"
            >
                <CheckCircle2
                    className="text-success mt-0.5 size-6 shrink-0"
                    aria-hidden
                />
                <div>
                    <h3 className="text-navy-800 text-lg font-semibold">Message sent</h3>
                    <p className="text-sand-700 mt-1">{state.message}</p>
                </div>
            </div>
        );
    }

    const v = state.values ?? {};
    const errs = state.fieldErrors ?? {};

    return (
        <form action={formAction} noValidate className="space-y-5">
            {/* Anti-bot: signed timing token (server-generated). */}
            <input type="hidden" name={TOKEN_FIELD} value={formToken} />
            {/* Anti-bot: honeypot. Hidden from people, tempting to bots. If it
                arrives filled, the server silently drops the submission. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
                <input
                    id={HONEYPOT_FIELD}
                    type="text"
                    name={HONEYPOT_FIELD}
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>

            {state.status === "error" && state.message && (
                <div
                    role="alert"
                    className="border-error/30 bg-error-bg text-error flex items-start gap-2 rounded-xl border p-3 text-sm font-medium"
                >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                    <span>{state.message}</span>
                </div>
            )}

            <Field
                name="reason"
                label="What is your message about?"
                error={errs.reason}
                required
            >
                {(id, invalid, describedBy) => (
                    <Select
                        id={id}
                        name="reason"
                        value={reason}
                        onValueChange={(val) => setReason(val as InquiryReason)}
                        options={INQUIRY_REASONS}
                        invalid={invalid}
                        describedBy={describedBy}
                    />
                )}
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
                <Field name="name" label="Your name" error={errs.name} required>
                    {(id, invalid, describedBy) => (
                        <input
                            id={id}
                            name="name"
                            type="text"
                            autoComplete="name"
                            maxLength={INQUIRY_LIMITS.name}
                            defaultValue={v.name}
                            aria-invalid={invalid}
                            aria-describedby={describedBy}
                            className={cn(
                                fieldBase,
                                invalid ? "border-error" : "border-sand-300",
                            )}
                        />
                    )}
                </Field>
                <Field name="phone" label="Phone (optional)" error={errs.phone}>
                    {(id, invalid, describedBy) => (
                        <input
                            id={id}
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            maxLength={INQUIRY_LIMITS.phone}
                            defaultValue={v.phone}
                            aria-invalid={invalid}
                            aria-describedby={describedBy}
                            className={cn(
                                fieldBase,
                                invalid ? "border-error" : "border-sand-300",
                            )}
                        />
                    )}
                </Field>
            </div>

            <Field name="email" label="Email" error={errs.email} required>
                {(id, invalid, describedBy) => (
                    <input
                        id={id}
                        name="email"
                        type="email"
                        autoComplete="email"
                        maxLength={INQUIRY_LIMITS.email}
                        defaultValue={v.email}
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        className={cn(
                            fieldBase,
                            invalid ? "border-error" : "border-sand-300",
                        )}
                    />
                )}
            </Field>

            <Field name="hotel" label="Which hotel? (optional)" error={errs.hotel}>
                {(id, invalid, describedBy) => (
                    <Select
                        id={id}
                        name="hotel"
                        value={hotel}
                        onValueChange={setHotel}
                        options={[
                            { value: "", label: "No preference / not sure" },
                            ...hotels,
                        ]}
                        placeholder="No preference / not sure"
                        invalid={invalid}
                        describedBy={describedBy}
                    />
                )}
            </Field>

            {showStayDetails && (
                <fieldset className="border-sand-200 grid gap-5 rounded-xl border p-4 sm:grid-cols-3">
                    <legend className="text-sand-600 px-1 text-sm font-medium">
                        Your stay (optional)
                    </legend>
                    <Field name="checkIn" label="Check-in" error={errs.checkIn}>
                        {(id, invalid, describedBy) => (
                            <DatePicker
                                id={id}
                                name="checkIn"
                                value={checkIn}
                                onChange={(val) => {
                                    setCheckIn(val);
                                    if (checkOut && checkOut < val) setCheckOut("");
                                }}
                                min={todayISO}
                                invalid={invalid}
                                describedBy={describedBy}
                            />
                        )}
                    </Field>
                    <Field name="checkOut" label="Check-out" error={errs.checkOut}>
                        {(id, invalid, describedBy) => (
                            <DatePicker
                                id={id}
                                name="checkOut"
                                value={checkOut}
                                onChange={setCheckOut}
                                min={checkIn || todayISO}
                                invalid={invalid}
                                describedBy={describedBy}
                            />
                        )}
                    </Field>
                    <Field name="rooms" label="Rooms" error={errs.rooms}>
                        {(id, invalid, describedBy) => (
                            <input
                                id={id}
                                name="rooms"
                                type="number"
                                min={1}
                                inputMode="numeric"
                                placeholder="e.g. 10"
                                defaultValue={v.rooms}
                                aria-invalid={invalid}
                                aria-describedby={describedBy}
                                className={cn(
                                    fieldBase,
                                    invalid ? "border-error" : "border-sand-300",
                                )}
                            />
                        )}
                    </Field>
                </fieldset>
            )}

            <Field name="message" label="Your message" error={errs.message} required>
                {(id, invalid, describedBy) => (
                    <textarea
                        id={id}
                        name="message"
                        rows={5}
                        maxLength={INQUIRY_LIMITS.message}
                        defaultValue={v.message}
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        placeholder={
                            showStayDetails
                                ? "Tell us about your group: how many rooms, dates, and anything we should know."
                                : "How can we help with your stay?"
                        }
                        className={cn(
                            fieldBase,
                            "resize-y",
                            invalid ? "border-error" : "border-sand-300",
                        )}
                    />
                )}
            </Field>

            <Turnstile />

            <Button type="submit" size="lg" disabled={isPending}>
                {isPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {isPending ? "Sending..." : "Send message"}
            </Button>
            <p className="text-sand-500 text-xs">
                We use your details only to reply about your stay.
            </p>
        </form>
    );
}

/**
 * Labelled field wrapper: associates the label, required marker, and error
 * message with the control (passed as a render child receiving id + invalid).
 */
function Field({
    name,
    label,
    error,
    required = false,
    children,
}: {
    name: InquiryField;
    label: string;
    error?: string;
    required?: boolean;
    children: (id: string, invalid: boolean, describedBy?: string) => React.ReactNode;
}) {
    const id = useId();
    const errorId = `${id}-error`;
    const invalid = Boolean(error);
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-navy-800 text-sm font-medium">
                {label}
                {required && (
                    <span className="text-error ml-0.5" aria-hidden>
                        *
                    </span>
                )}
            </label>
            {children(id, invalid, invalid ? errorId : undefined)}
            {invalid && (
                <p id={errorId} className="text-error flex items-center gap-1 text-sm">
                    <AlertCircle className="size-3.5 shrink-0" aria-hidden />
                    {error}
                </p>
            )}
        </div>
    );
}
