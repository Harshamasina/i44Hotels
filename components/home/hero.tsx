import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getHeroDestinations } from "@/lib/properties";
import { buttonVariants } from "@/components/ui/button";

/**
 * Homepage hero (the B+D hybrid): full-bleed navy+gold sky, centered headline,
 * and a prominent destination finder. See CLAUDE.md §8.
 * Swap the background by replacing /public/hero_bg.jpg.
 */
export function Hero() {
    const destinations = getHeroDestinations();

    return (
        <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden">
            <Image
                src="/hero_bg.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />
            {/* Navy overlay for text legibility over the bright sky */}
            <div aria-hidden className="bg-navy-900/60 absolute inset-0" />
            <div
                aria-hidden
                className="from-navy-900/40 to-navy-900/75 absolute inset-0 bg-gradient-to-b via-transparent"
            />

            <div className="text-sand-50 relative z-10 mx-auto max-w-3xl px-4 py-20 text-center">
                <p className="text-gold-300 mb-4 text-sm font-semibold tracking-[0.14em] uppercase">
                    Family-owned · Along Interstate 44
                </p>
                <h1 className="font-sans text-5xl font-bold tracking-tight text-white sm:text-6xl">
                    Comfortable Stays Along{" "}
                    <span className="whitespace-nowrap sm:block">I-44</span>
                </h1>
                <p className="text-sand-200 mx-auto mt-5 max-w-xl text-lg">
                    Welcoming, convenient hotels for families, business travelers, and
                    Fort Leonard Wood guests. Book direct and feel at home on the road.
                </p>

                {/* Destination finder */}
                <div className="shadow-navy-900/30 mx-auto mt-8 max-w-xl rounded-2xl bg-white p-5 shadow-2xl">
                    <p className="text-navy-800 mb-3 font-serif text-lg">
                        Where are you headed?
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        {destinations.map((d) => (
                            <Link
                                key={d.href}
                                href={d.href}
                                className="border-sand-300 bg-sand-50 text-navy-800 hover:border-gold-500 hover:bg-gold-100 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
                            >
                                {d.label}
                            </Link>
                        ))}
                        <Link href="/hotels" className={buttonVariants({ size: "sm" })}>
                            View all hotels
                        </Link>
                    </div>
                </div>

                <Link
                    href="/military-travel"
                    className="text-gold-300 hover:text-gold-400 mt-6 inline-flex items-center gap-1.5 font-semibold underline underline-offset-2 transition-colors"
                >
                    Here for a Fort Leonard Wood graduation? See military travel
                    <ArrowRight className="size-4" aria-hidden />
                </Link>
            </div>
        </section>
    );
}
