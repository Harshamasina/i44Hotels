import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

// Display serif for headings (CLAUDE.md §7)
const fraunces = Fraunces({
    variable: "--font-fraunces",
    subsets: ["latin"],
    display: "swap",
});

// Clean sans for body / UI (CLAUDE.md §7)
const hanken = Hanken_Grotesk({
    variable: "--font-hanken",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://i44hotels.com"),
    title: {
        default: "I44 Hotels | Comfortable Stays Along I-44",
        template: "%s | I44 Hotels",
    },
    description:
        "Comfortable, convenient hotels along Interstate 44 for families, business travelers, and Fort Leonard Wood graduation guests. Book direct with I44 Hotels.",
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon.svg", type: "image/svg+xml" },
        ],
        apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
    themeColor: "#0b1e3a", // brand navy
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${fraunces.variable} ${hanken.variable} h-full antialiased`}
        >
            <body className="bg-sand-50 text-sand-800 flex min-h-full flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
            </body>
        </html>
    );
}
