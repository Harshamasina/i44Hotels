import "server-only";

/**
 * Server-only anti-abuse helpers for the inquiry form. Layered defenses
 * (CLAUDE.md §9): a signed timing token, an in-memory IP rate limit, a content
 * spam heuristic, sanitization, and Cloudflare Turnstile verification. None of
 * this runs on the client, and nothing here is exported to the bundle.
 *
 * Cloudflare note: the rate limiter below is per-worker-instance and resets on
 * cold start, so it is a best-effort first layer. For durable, cross-instance
 * limiting in production, add a Cloudflare WAF "Rate limiting rule" on the
 * /contact route (Security > WAF > Rate limiting rules), or swap checkRateLimit
 * for a KV / Upstash-backed counter behind the same signature.
 */

const encoder = new TextEncoder();

// Control characters (0x00-0x1F and 0x7F), stripped from all user input.
const CONTROL_CHARS = /[\x00-\x1F\x7F]+/g;
// Same, but keep newline (0x0A) and tab (0x09) for the multiline message body.
const CONTROL_CHARS_KEEP_NL = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/g;

function getSecret(): string {
    // FORM_SECRET signs the timing token. In dev we fall back so the form works
    // without setup, but this MUST be set in production.
    return process.env.FORM_SECRET ?? "i44-dev-insecure-form-secret";
}

function toHex(buf: ArrayBuffer): string {
    return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

async function hmacHex(message: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(getSecret()),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
    return toHex(sig);
}

/** Length-safe, constant-time string comparison (avoids early-exit timing leaks). */
function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

/**
 * Create a signed token embedding the issue time. Rendered into the form on the
 * server; verified on submit to enforce a minimum dwell time and reject forged
 * or stale tokens.
 */
export async function createFormToken(): Promise<string> {
    const issued = Date.now().toString();
    const sig = await hmacHex(issued);
    return `${issued}.${sig}`;
}

const MIN_DWELL_MS = 3_000; // Faster than a human could fill the form => bot.
const MAX_AGE_MS = 2 * 60 * 60 * 1000; // Token good for 2 hours.

export type TokenVerdict = "ok" | "too-fast" | "expired" | "invalid";

export async function verifyFormToken(token: string | undefined): Promise<TokenVerdict> {
    if (!token) return "invalid";
    const dot = token.indexOf(".");
    if (dot < 1) return "invalid";
    const issued = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    if (!/^\d+$/.test(issued)) return "invalid";

    const expected = await hmacHex(issued);
    if (!safeEqual(sig, expected)) return "invalid";

    const age = Date.now() - Number(issued);
    if (age < MIN_DWELL_MS) return "too-fast";
    if (age > MAX_AGE_MS) return "expired";
    return "ok";
}

/* Rate limiting -------------------------------------------------------------
 * Best-effort, in-memory sliding window keyed by client IP. See the Cloudflare
 * note at the top of the file for the durable production layer. */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): { ok: boolean; retryAfter?: number } {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

    if (recent.length >= MAX_PER_WINDOW) {
        hits.set(key, recent);
        const retryAfter = Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
        return { ok: false, retryAfter };
    }

    recent.push(now);
    hits.set(key, recent);

    // Opportunistic cleanup so the map cannot grow without bound.
    if (hits.size > 5000) {
        for (const [k, v] of hits) {
            if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
        }
    }
    return { ok: true };
}

/** Best available client IP from Cloudflare / proxy headers. */
export function clientIp(headers: Headers): string {
    return (
        headers.get("cf-connecting-ip") ??
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        headers.get("x-real-ip") ??
        "unknown"
    );
}

/* Content checks & sanitization --------------------------------------------- */

/** Collapse whitespace and strip control chars from single-line fields. */
export function cleanLine(value: string, max: number): string {
    return value.replace(CONTROL_CHARS, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

/** Keep newlines for the message body, but strip other control chars and cap length. */
export function cleanMultiline(value: string, max: number): string {
    return value
        .replace(CONTROL_CHARS_KEEP_NL, "")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
        .slice(0, max);
}

/** Heuristic: a message stuffed with links is almost always spam. */
export function looksLikeSpam(message: string): boolean {
    const urls = (message.match(/https?:\/\/|www\./gi) ?? []).length;
    return urls > 5;
}

/* Cloudflare Turnstile ------------------------------------------------------- */

/**
 * Verify a Turnstile token with Cloudflare. If TURNSTILE_SECRET_KEY is not set,
 * verification is skipped (so local dev works without keys); set both the secret
 * and NEXT_PUBLIC_TURNSTILE_SITE_KEY to enable the bot challenge in production.
 */
export async function verifyTurnstile(
    token: string | undefined,
    ip: string,
): Promise<{ ok: boolean; skipped?: boolean }> {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) return { ok: true, skipped: true };
    if (!token) return { ok: false };

    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.append("remoteip", ip);

    try {
        const res = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: { "content-type": "application/x-www-form-urlencoded" },
                body,
            },
        );
        const data = (await res.json()) as { success?: boolean };
        return { ok: data.success === true };
    } catch {
        return { ok: false };
    }
}
