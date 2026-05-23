"use client";

import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Cloudflare Turnstile bot challenge. Renders only when a site key is set, so
 * the form works in dev without keys. Cloudflare auto-injects the response into
 * a hidden `cf-turnstile-response` input inside the form, which the server
 * action verifies. Pair with TURNSTILE_SECRET_KEY on the server to enforce it.
 */
export function Turnstile() {
    if (!SITE_KEY) return null;
    return (
        <div className="flex flex-col gap-1.5">
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                strategy="afterInteractive"
            />
            <div className="cf-turnstile" data-sitekey={SITE_KEY} data-theme="light" />
        </div>
    );
}
