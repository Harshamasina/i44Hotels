"use server";

import { headers } from "next/headers";
import {
    isInquiryReason,
    INQUIRY_LIMITS,
    HONEYPOT_FIELD,
    TOKEN_FIELD,
    TURNSTILE_FIELD,
    type InquiryField,
    type InquiryReason,
    type InquiryState,
} from "@/lib/inquiry";
import {
    verifyFormToken,
    checkRateLimit,
    clientIp,
    cleanLine,
    cleanMultiline,
    looksLikeSpam,
    verifyTurnstile,
} from "@/lib/inquiry-security";
import { sendInquiryEmail } from "@/lib/inquiry-email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function raw(formData: FormData, key: string): string {
    return (formData.get(key) ?? "").toString();
}

// Bots that tripped a silent trap (honeypot / too-fast) get a fake success so
// they cannot learn what caught them.
const FAKE_SUCCESS: InquiryState = {
    status: "success",
    message:
        "Thank you. Your message is on its way and our team will get back to you shortly.",
};

/**
 * Inquiry submit handler (signature for React useActionState). Runs layered
 * anti-abuse checks before sending via Resend: honeypot, signed timing token,
 * per-IP rate limit, field validation + sanitization, spam heuristic, then
 * Cloudflare Turnstile. Server Actions already carry same-origin CSRF defense.
 */
export async function submitInquiry(
    _prev: InquiryState,
    formData: FormData,
): Promise<InquiryState> {
    // 1. Honeypot: a hidden field real users never fill.
    if (raw(formData, HONEYPOT_FIELD).trim() !== "") {
        return FAKE_SUCCESS;
    }

    // 2. Signed timing token: reject forged/stale tokens and impossibly fast
    //    (bot) submissions. "too-fast" is silently dropped like the honeypot.
    const verdict = await verifyFormToken(raw(formData, TOKEN_FIELD));
    if (verdict === "too-fast") return FAKE_SUCCESS;
    if (verdict === "invalid" || verdict === "expired") {
        return {
            status: "error",
            message:
                "Your session expired. Please refresh the page and send your message again.",
        };
    }

    // 3. Per-IP rate limit.
    const hdrs = await headers();
    const ip = clientIp(hdrs);
    const limit = checkRateLimit(ip);
    if (!limit.ok) {
        return {
            status: "error",
            message:
                "You have sent a few messages already. Please wait a little while before trying again.",
        };
    }

    // 4. Validate + sanitize.
    const reasonRaw = raw(formData, "reason");
    const name = cleanLine(raw(formData, "name"), INQUIRY_LIMITS.name);
    const email = cleanLine(raw(formData, "email"), INQUIRY_LIMITS.email);
    const phone = cleanLine(raw(formData, "phone"), INQUIRY_LIMITS.phone);
    const hotel = cleanLine(raw(formData, "hotel"), INQUIRY_LIMITS.hotel);
    const checkIn = cleanLine(raw(formData, "checkIn"), 10);
    const checkOut = cleanLine(raw(formData, "checkOut"), 10);
    const rooms = cleanLine(raw(formData, "rooms"), INQUIRY_LIMITS.rooms);
    const message = cleanMultiline(raw(formData, "message"), INQUIRY_LIMITS.message);

    const values: Partial<Record<InquiryField, string>> = {
        reason: reasonRaw,
        name,
        email,
        phone,
        hotel,
        checkIn,
        checkOut,
        rooms,
        message,
    };

    const fieldErrors: Partial<Record<InquiryField, string>> = {};

    if (!isInquiryReason(reasonRaw)) {
        fieldErrors.reason = "Please choose what your message is about.";
    }
    if (!name) {
        fieldErrors.name = "Please tell us your name.";
    }
    if (!email) {
        fieldErrors.email = "Please add an email so we can reply.";
    } else if (!EMAIL_RE.test(email)) {
        fieldErrors.email = "That email does not look right. Please check it.";
    }
    if (!message) {
        fieldErrors.message = "Please add a few details about your stay.";
    }
    if (checkIn && checkOut && checkOut < checkIn) {
        fieldErrors.checkOut = "Check-out should be on or after check-in.";
    }

    if (Object.keys(fieldErrors).length > 0) {
        return {
            status: "error",
            message: "Please fix the highlighted fields and try again.",
            fieldErrors,
            values,
        };
    }

    // 5. Spam heuristic: link-stuffed messages are silently dropped.
    if (looksLikeSpam(message)) {
        return FAKE_SUCCESS;
    }

    // 6. Cloudflare Turnstile (skipped when not configured).
    const turnstile = await verifyTurnstile(raw(formData, TURNSTILE_FIELD), ip);
    if (!turnstile.ok) {
        return {
            status: "error",
            message:
                "We could not verify that you are human. Please complete the check and try again.",
        };
    }

    // 7. Deliver via Resend.
    const sent = await sendInquiryEmail({
        reason: reasonRaw as InquiryReason,
        name,
        email,
        phone: phone || undefined,
        hotel: hotel || undefined,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        rooms: rooms || undefined,
        message,
    });

    if (!sent.ok) {
        return {
            status: "error",
            message:
                "Something went wrong sending your message. Please try again, or call the hotel directly.",
        };
    }

    return {
        status: "success",
        message:
            "Thank you. Your message is on its way and our team will get back to you shortly.",
    };
}
