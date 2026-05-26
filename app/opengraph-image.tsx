import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og";

export const alt = "I44 Hotels - Comfortable Stays Along Interstate 44";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default branded share image for the site. */
export default async function Image() {
    const title = "I44 Hotels";
    const tagline = "Comfortable Stays Along Interstate 44";
    const sub = "Near Fort Leonard Wood / St. Robert, Missouri";
    const text = title + tagline + sub;

    const [bold, sans] = await Promise.all([
        loadGoogleFont("Hanken Grotesk", 700, text),
        loadGoogleFont("Hanken Grotesk", 500, text),
    ]);

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: "#0B1E3A",
                    padding: "80px",
                }}
            >
                <div
                    style={{ width: 96, height: 6, background: "#D8B878", marginBottom: 40 }}
                />
                <div
                    style={{
                        fontFamily: "Hanken Grotesk",
                        fontWeight: 700,
                        fontSize: 92,
                        color: "#F8EFE0",
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontFamily: "Hanken Grotesk",
                        fontSize: 40,
                        color: "#D8B878",
                        marginTop: 24,
                    }}
                >
                    {tagline}
                </div>
                <div
                    style={{
                        fontFamily: "Hanken Grotesk",
                        fontSize: 28,
                        color: "#E2CEA6",
                        marginTop: 16,
                    }}
                >
                    {sub}
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
