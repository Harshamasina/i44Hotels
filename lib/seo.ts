/**
 * Shared SEO constants and schema.org JSON-LD builders. Keeping these in one place
 * means the canonical site URL and structured-data shapes stay consistent across
 * the homepage, detail pages, sitemap, and OG routes.
 */

export const SITE_URL = "https://i44hotels.com";

/** I44 Hotels umbrella brand, for the homepage. */
export function organizationJsonLd(): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "I44 Hotels",
        url: SITE_URL,
        logo: `${SITE_URL}/brand/i44-logo.png`,
        description:
            "A family-owned hotel group operating hotels along Interstate 44, including near Fort Leonard Wood in St. Robert, Missouri.",
        // TODO(owner): add social profile URLs when available, e.g.
        // sameAs: ["https://www.facebook.com/...", "https://www.instagram.com/..."],
    };
}

/** Site-level WebSite node, for the homepage. */
export function webSiteJsonLd(): Record<string, unknown> {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "I44 Hotels",
        url: SITE_URL,
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
