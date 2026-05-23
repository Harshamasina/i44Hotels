import "server-only";

import { Resend } from "resend";
import { INQUIRY_REASONS, type InquiryReason } from "@/lib/inquiry";

export type InquiryEmailData = {
    reason: InquiryReason;
    name: string;
    email: string;
    phone?: string;
    hotel?: string;
    checkIn?: string;
    checkOut?: string;
    rooms?: string;
    message: string;
};

const reasonLabel = (r: InquiryReason) =>
    INQUIRY_REASONS.find((x) => x.value === r)?.label ?? r;

/** Escape user values before they go into the HTML email body. */
function esc(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function row(label: string, value?: string): string {
    if (!value) return "";
    const safe = esc(value).replace(/\n/g, "<br>");
    return `<tr><td style="padding:6px 12px;color:#807766;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 12px;color:#0b1e3a">${safe}</td></tr>`;
}

/**
 * Send a validated inquiry via Resend. Header-injection-safe: From and To come
 * from env (never user input), and the visitor's address is only ever used as a
 * validated reply-to. If Resend is not configured, logs and reports success so
 * local dev does not error (configure RESEND_API_KEY + the from/to addresses to
 * actually deliver).
 */
export async function sendInquiryEmail(
    data: InquiryEmailData,
): Promise<{ ok: boolean; skipped?: boolean }> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.INQUIRY_FROM_EMAIL;
    const to = process.env.INQUIRY_TO_EMAIL;

    if (!apiKey || !from || !to) {
        console.warn(
            "[inquiry] Resend not configured (RESEND_API_KEY / INQUIRY_FROM_EMAIL / INQUIRY_TO_EMAIL); message not sent.",
        );
        return { ok: true, skipped: true };
    }

    const label = reasonLabel(data.reason);
    const subject = `New ${label} inquiry from ${data.name}`;

    const html = `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px">
            <h2 style="color:#0b1e3a;margin:0 0 4px">New ${esc(label)} inquiry</h2>
            <p style="color:#807766;margin:0 0 16px">Submitted via i44hotels.com</p>
            <table style="border-collapse:collapse;width:100%;font-size:14px">
                ${row("Name", data.name)}
                ${row("Email", data.email)}
                ${row("Phone", data.phone)}
                ${row("Hotel", data.hotel)}
                ${row("Check-in", data.checkIn)}
                ${row("Check-out", data.checkOut)}
                ${row("Rooms", data.rooms)}
                ${row("Message", data.message)}
            </table>
        </div>`;

    const text = [
        `New ${label} inquiry (i44hotels.com)`,
        "",
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        data.phone ? `Phone: ${data.phone}` : "",
        data.hotel ? `Hotel: ${data.hotel}` : "",
        data.checkIn ? `Check-in: ${data.checkIn}` : "",
        data.checkOut ? `Check-out: ${data.checkOut}` : "",
        data.rooms ? `Rooms: ${data.rooms}` : "",
        "",
        data.message,
    ]
        .filter(Boolean)
        .join("\n");

    try {
        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
            from,
            to,
            replyTo: data.email,
            subject,
            html,
            text,
        });
        if (error) {
            console.error("[inquiry] Resend error:", error);
            return { ok: false };
        }
        return { ok: true };
    } catch (err) {
        console.error("[inquiry] Resend threw:", err);
        return { ok: false };
    }
}
