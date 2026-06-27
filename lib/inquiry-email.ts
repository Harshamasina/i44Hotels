import "server-only";

import { Resend } from "resend";
import { INQUIRY_REASONS, type InquiryReason } from "@/lib/inquiry";
import { SITE_URL } from "@/lib/seo";

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

/**
 * Brand palette (CLAUDE.md section 7). Inline hex is required here: email clients
 * strip <style>/class-based CSS, so Tailwind tokens do not apply and every color
 * must be set inline. This const keeps the values in one place.
 */
const COLORS = {
    navy: "#0B1E3A",
    gold: "#BF8F56",
    cream: "#F8EFE0",
    page: "#FCFAF5",
    text: "#2B2B2B",
    muted: "#6E6557",
    border: "#EFE3CE",
    white: "#FFFFFF",
};

/** Escape user values before they go into the HTML email body or an attribute. */
function esc(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/** One label/value row of the details table. Empty values are omitted. */
function row(label: string, value?: string): string {
    if (!value) return "";
    const safe = esc(value).replace(/\n/g, "<br>");
    return `<tr>
        <td style="padding:10px 16px;border-bottom:1px solid ${COLORS.border};color:${COLORS.muted};font-size:13px;white-space:nowrap;vertical-align:top">${label}</td>
        <td style="padding:10px 16px;border-bottom:1px solid ${COLORS.border};color:${COLORS.navy};font-size:14px;font-weight:600">${safe}</td>
    </tr>`;
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

    // One-click reply to the guest (their address is also set as reply-to below).
    const replySubject = `Re: Your ${label.toLowerCase()} inquiry to I44 Hotels`;
    const mailto = `mailto:${esc(data.email)}?subject=${encodeURIComponent(replySubject)}`;

    const detailRows = [
        row("Name", data.name),
        row("Email", data.email),
        row("Phone", data.phone),
        row("Hotel", data.hotel),
        row("Check-in", data.checkIn),
        row("Check-out", data.checkOut),
        row("Rooms", data.rooms),
    ].join("");

    const messageBlock = data.message
        ? `<tr><td style="padding:22px 24px 0">
                <p style="margin:0 0 8px;color:${COLORS.muted};font-size:12px;letter-spacing:0.08em;text-transform:uppercase">Message</p>
                <div style="background:${COLORS.cream};border-radius:8px;padding:14px 16px;color:${COLORS.text};font-size:14px;line-height:1.6">${esc(data.message).replace(/\n/g, "<br>")}</div>
            </td></tr>`
        : "";

    const html = `
    <div style="background:${COLORS.page};padding:24px 12px;font-family:Arial,Helvetica,sans-serif">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:${COLORS.white};border:1px solid ${COLORS.border};border-radius:12px;overflow:hidden">
            <tr>
                <td style="background:${COLORS.navy};padding:24px;text-align:center">
                    <img src="${SITE_URL}/brand/i44-logo.png" alt="I44 Hotels" width="120" style="display:block;margin:0 auto;border:0;outline:none" />
                </td>
            </tr>
            <tr><td style="height:4px;background:${COLORS.gold};font-size:0;line-height:0">&nbsp;</td></tr>
            <tr>
                <td style="padding:24px 24px 4px">
                    <h1 style="margin:0;color:${COLORS.navy};font-size:20px">New ${esc(label)} inquiry</h1>
                    <p style="margin:6px 0 0;color:${COLORS.muted};font-size:13px">Submitted via the contact form at i44hotels.com</p>
                </td>
            </tr>
            <tr>
                <td style="padding:16px 8px 0">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
                        ${detailRows}
                    </table>
                </td>
            </tr>
            ${messageBlock}
            <tr>
                <td style="padding:24px">
                    <a href="${mailto}" style="display:inline-block;background:${COLORS.gold};color:${COLORS.navy};font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:8px">Reply to ${esc(data.name)}</a>
                    <p style="margin:12px 0 0;color:${COLORS.muted};font-size:12px">Or just hit Reply, this message is set to go straight to ${esc(data.name)}.</p>
                </td>
            </tr>
            <tr>
                <td style="padding:16px 24px 24px;border-top:1px solid ${COLORS.border}">
                    <p style="margin:0;color:${COLORS.muted};font-size:12px">I44 Hotels, comfortable stays along Interstate 44.</p>
                </td>
            </tr>
        </table>
    </div>`;

    const text = [
        `New ${label} inquiry (via i44hotels.com)`,
        "==============================",
        "",
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        data.phone ? `Phone: ${data.phone}` : "",
        data.hotel ? `Hotel: ${data.hotel}` : "",
        data.checkIn ? `Check-in: ${data.checkIn}` : "",
        data.checkOut ? `Check-out: ${data.checkOut}` : "",
        data.rooms ? `Rooms: ${data.rooms}` : "",
        "",
        "Message:",
        data.message,
        "",
        "--",
        `Reply directly to this email to reach ${data.name} (${data.email}).`,
        "I44 Hotels, comfortable stays along Interstate 44.",
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
