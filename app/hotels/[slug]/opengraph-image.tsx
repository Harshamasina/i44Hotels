import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getAllProperties, getPropertyBySlug, type Brand } from "@/lib/properties";
import { loadGoogleFont } from "@/lib/og";

export const alt = "I44 Hotels property";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
    return getAllProperties().map((p) => ({ slug: p.slug }));
}

// PNG flag logos only (Satori cannot rasterize the SVG/webp variants).
const LOGO_FILE: Partial<Record<Brand, string>> = {
    "Days Inn": "days-inn.png",
    "Comfort Inn": "comfort-inn.png",
};

async function logoDataUrl(brand: Brand): Promise<string | null> {
    const file = LOGO_FILE[brand];
    if (!file) return null;
    try {
        const buf = await readFile(join(process.cwd(), "public", "brand", "flags", file));
        return `data:image/png;base64,${buf.toString("base64")}`;
    } catch {
        return null;
    }
}

/** Per-property branded share image: flag + name + location, on the brand navy. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const p = getPropertyBySlug(slug);

    const heading = p?.shortName ?? "I44 Hotels";
    const tierLabel = p ? (p.tier === "economy" ? "Economy" : "Upper-Midscale") : "";
    const sub = p
        ? p.nearFLW
            ? "Minutes from Fort Leonard Wood"
            : `${p.city}, ${p.state}`
        : "Comfortable stays along Interstate 44";
    const footer = "Book direct / i44hotels.com";
    const text = heading + tierLabel + sub + footer;

    const [bold, sans, logo] = await Promise.all([
        loadGoogleFont("Hanken Grotesk", 700, text),
        loadGoogleFont("Hanken Grotesk", 500, text),
        p ? logoDataUrl(p.brand) : Promise.resolve(null),
    ]);

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "#0B1E3A",
                    padding: "72px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center" }}>
                    {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={logo}
                            alt=""
                            width={150}
                            height={64}
                            style={{
                                background: "#FFFFFF",
                                borderRadius: 12,
                                padding: "10px 16px",
                                objectFit: "contain",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                fontFamily: "Hanken Grotesk",
                                fontWeight: 700,
                                fontSize: 40,
                                color: "#D8B878",
                            }}
                        >
                            I44 Hotels
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    {tierLabel ? (
                        <div
                            style={{
                                fontFamily: "Hanken Grotesk",
                                fontSize: 26,
                                letterSpacing: 4,
                                textTransform: "uppercase",
                                color: "#D8B878",
                                marginBottom: 16,
                            }}
                        >
                            {tierLabel}
                        </div>
                    ) : null}
                    <div
                        style={{
                            fontFamily: "Hanken Grotesk",
                            fontWeight: 700,
                            fontSize: 76,
                            color: "#F8EFE0",
                            lineHeight: 1.05,
                        }}
                    >
                        {heading}
                    </div>
                    <div
                        style={{
                            fontFamily: "Hanken Grotesk",
                            fontSize: 34,
                            color: "#E2CEA6",
                            marginTop: 20,
                        }}
                    >
                        {sub}
                    </div>
                </div>

                <div
                    style={{
                        fontFamily: "Hanken Grotesk",
                        fontSize: 26,
                        color: "#A39A8A",
                    }}
                >
                    {footer}
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                { name: "Hanken Grotesk", data: bold, weight: 700, style: "normal" },
                { name: "Hanken Grotesk", data: sans, weight: 500, style: "normal" },
            ],
        },
    );
}
