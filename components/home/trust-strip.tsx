import { Heart, Route, PawPrint, Coffee, MapPin, type LucideIcon } from "lucide-react";
import { getOperatingProperties } from "@/lib/properties";

/** Quick credibility strip directly under the hero (CLAUDE.md §8). */
export function TrustStrip() {
    const count = getOperatingProperties().length;
    const items: { label: string; Icon: LucideIcon }[] = [
        { label: "Family-owned", Icon: Heart },
        { label: `${count} hotels along I-44`, Icon: Route },
        { label: "Pet-friendly rooms", Icon: PawPrint },
        { label: "Free hot breakfast", Icon: Coffee },
        { label: "Minutes from Fort Leonard Wood", Icon: MapPin },
    ];

    return (
        <div className="border-sand-200 border-b bg-white">
            <div className="text-navy-800 mx-auto flex max-w-7xl flex-wrap justify-center gap-x-8 gap-y-3 px-4 py-4 text-sm font-medium sm:px-6">
                {items.map(({ label, Icon }) => (
                    <span key={label} className="inline-flex items-center gap-2">
                        <Icon className="text-gold-600 size-4 shrink-0" aria-hidden />
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}
