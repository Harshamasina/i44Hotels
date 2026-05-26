import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { MobileBookingBar } from "@/components/site/mobile-booking-bar";

// Single brand family for headings + body / UI (Fraunces retired, CLAUDE.md §7)
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
    openGraph: {
        type: "website",
        siteName: "I44 Hotels",
        locale: "en_US",
        url: "/",
        title: "I44 Hotels | Comfortable Stays Along I-44",
        description:
            "Comfortable, convenient hotels along Interstate 44 for families, business travelers, and Fort Leonard Wood graduation guests. Book direct with I44 Hotels.",
    },
    twitter: {
        card: "summary_large_image",
        title: "I44 Hotels | Comfortable Stays Along I-44",
        description:
            "Comfortable, convenient hotels along Interstate 44, near Fort Leonard Wood. Book direct with I44 Hotels.",
    },
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
            className={`${hanken.variable} h-full antialiased`}
        >
            <body className="bg-sand-50 text-sand-800 flex min-h-full w-full flex-col pb-14 md:pb-0">
                <SiteHeader />
                <main className="w-full flex-1 overflow-x-clip">{children}</main>
                <SiteFooter />
                <MobileBookingBar />
            </body>
        </html>
    );
}
