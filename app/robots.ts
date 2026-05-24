import type { MetadataRoute } from "next";

const SITE_URL = "https://i44hotels.com";

/** robots.txt: index everything except the internal component preview. */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/styleguide"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
