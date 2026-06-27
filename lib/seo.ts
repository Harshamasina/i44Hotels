/**
 * Shared SEO constants and schema.org JSON-LD builders. Keeping these in one place
 * means the canonical site URL and structured-data shapes stay consistent across
 * the homepage, detail pages, sitemap, and OG routes.
 */

import type { Metadata } from "next";

export const SITE_URL = "https://i44hotels.com";
export const SITE_NAME = "I44 Hotels";

/**
 * Per-page Metadata with a canonical URL and matching Open Graph + Twitter tags.
 *
 * Without this, a sub-page that sets only `title`/`description` inherits the root
 * layout's Open Graph block wholesale: the homepage title, the homepage
 * description, and og:url "/". So a social share of, say, the Military Travel page
 * would show homepage copy and link back to Home. Routing every page through this
 * helper makes og:title / og:description / og:url track the actual page.
 *
 * `title` is the page-specific part. The root layout's title template adds the
 * " | I44 Hotels" suffix to the <title> tag; we add the same suffix to the OG and
 * Twitter titles here so the social card matches the browser tab.
 */
export function pageMetadata({
    title,
    description,
    path,
}: {
    title: string;
    description: string;
    path: string;
}): Metadata {
    const sharedTitle = `${title} | ${SITE_NAME}`;
    return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: {
            type: "website",
            siteName: SITE_NAME,
            locale: "en_US",
            url: path,
            title: sharedTitle,
            description,
        },
        twitter: {
            card: "summary_large_image",
            title: sharedTitle,
            description,
        },
    };
}

/** I44 Hotels umbrella brand, for the homepage. */
export function organizationJsonLd(): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/brand/i44-logo.png`,
        description:
            "A family-owned hotel group operating hotels along Interstate 44, including near Fort Leonard Wood in St. Robert, Missouri.",
        // Topical signals: this group serves the I-44 corridor and specializes in
        // Fort Leonard Wood graduation travel (CLAUDE.md section 2.5).
        areaServed: "Interstate 44 corridor, Missouri",
        knowsAbout: [
            "Fort Leonard Wood",
            "St. Robert, Missouri hotels",
            "Waynesville, Missouri hotels",
            "Army graduation travel",
        ],
        // TODO(owner): add social profile URLs when available, e.g.
        // sameAs: ["https://www.facebook.com/...", "https://www.instagram.com/..."],
    };
}

/** Site-level WebSite node, for the homepage. */
export function webSiteJsonLd(): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
    };
}

/**
 * ItemList of the portfolio's hotels, in display order. Helps Google understand
 * the umbrella-brand structure (one site, several hotels) from the homepage and
 * the /hotels hub, and is a strong signal toward branded sitelinks.
 */
export function hotelsItemListJsonLd(
    hotels: { slug: string; name: string }[],
): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "I44 Hotels along Interstate 44",
        itemListElement: hotels.map((h, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: h.name,
            url: `${SITE_URL}/hotels/${h.slug}`,
        })),
    };
}

/** FAQPage from a list of question/answer pairs (military-travel, /faq). */
export function faqPageJsonLd(
    faqs: { q: string; a: string }[],
): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    };
}

/** BreadcrumbList from a Home-rooted trail of { name, path } crumbs. */
export function breadcrumbJsonLd(
    items: { name: string; path: string }[],
): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: it.name,
            item: `${SITE_URL}${it.path}`,
        })),
    };
}
