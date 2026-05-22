import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Users, ArrowRight, type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Fort Leonard Wood callout, directly below the hero (CLAUDE.md §2.5, §8).
 * Warm and respectful, no tactical imagery. Full experience lives on /military-travel.
 */
export function FlwBand() {
    const points: { label: string; Icon: LucideIcon }[] = [
        { label: "Minutes from the gates", Icon: MapPin },
        { label: "Graduation room blocks", Icon: BedDouble },
        { label: "Family-friendly amenities", Icon: Users },
    ];

    return (
        <section className="bg-navy-900 text-sand-100 relative overflow-hidden">
            {/* Family-reunion photo on the right. Its left/bottom scrims fade to
                the section's solid navy-900 (same color), so the photo melts in
                with no seam. Hidden on small screens where it would crowd copy. */}
            <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block xl:w-[55%]">
                <Image
                    src="/brand/flags/military.jpg"
                    alt="A soldier in uniform reunited with their two young children"
                    fill
                    sizes="55vw"
                    className="object-cover object-center"
                />
                <div
                    aria-hidden
                    className="from-navy-900 via-navy-900/40 absolute inset-0 bg-linear-to-r to-transparent"
                />
                <div
                    aria-hidden
                    className="from-navy-900/50 absolute inset-0 bg-linear-to-t to-transparent"
                />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="lg:max-w-xl">
                    <p className="text-gold-300 mb-3 text-sm font-semibold tracking-[0.14em] uppercase">
                        Fort Leonard Wood Travel
                    </p>
                    <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                        Stay Close. Feel Welcome.
                    </h2>
                    <p className="text-sand-200 mt-4 max-w-2xl text-lg">
                        Here to celebrate your soldier? Our hotels are minutes from the
                        Fort Leonard Wood gates, ready for graduation weekend with easy
                        booking, family-friendly amenities, and room blocks for visiting
                        relatives.
                    </p>

                    <ul className="text-sand-100 mt-6 flex flex-wrap gap-x-7 gap-y-3 font-medium">
                        {points.map(({ label, Icon }) => (
                            <li key={label} className="inline-flex items-center gap-2">
                                <Icon
                                    className="text-gold-400 size-4 shrink-0"
                                    aria-hidden
                                />
                                {label}
                            </li>
                        ))}
                    </ul>

                    <Link
                        href="/military-travel"
                        className={cn(
                            buttonVariants({ variant: "outlineGold", size: "lg" }),
                            "mt-8",
                        )}
                    >
                        Plan your stay
                        <ArrowRight className="size-4" aria-hidden />
                    </Link>
                </div>
            </div>
        </section>
    );
}
