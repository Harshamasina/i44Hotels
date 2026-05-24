import type { MetadataRoute } from "next";
import { getAllProperties } from "@/lib/properties";
import { SITE_URL } from "@/lib/seo";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

/** Static routes worth indexing (excludes /styleguide, which robots disallows). */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Freq }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/military-travel", priority: 0.9, changeFrequency: "monthly" },
    { path: "/hotels", priority: 0.8, changeFrequency: "weekly" },
    { path: "/groups", priority: 0.7, changeFrequency: "monthly" },
    { path: "/local-area", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
    { path: "/offers", priority: 0.6, changeFrequency: "weekly" },
    { path: "/amenities", priority: 0.5, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
];

/** Sitemap built from the data layer so new properties appear automatically. */
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
        url: `${SITE_URL}${r.path}`,
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
    }));

    const hotelEntries: MetadataRoute.Sitemap = getAllProperties().map((p) => ({
        url: `${SITE_URL}/hotels/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: p.status === "coming-soon" ? 0.5 : 0.9,
    }));

    return [...staticEntries, ...hotelEntries];
}
