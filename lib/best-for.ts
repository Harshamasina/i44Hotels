import {
    GraduationCap,
    Map,
    Briefcase,
    Users,
    PawPrint,
    Truck,
    type LucideIcon,
} from "lucide-react";

import type { BestForKey } from "./properties";

/**
 * Single source of truth for the audience tags shown on hotel cards and used by
 * the /hotels filter (CLAUDE.md section 3). Labels stay warm and respectful;
 * the military tag uses a graduation cap, not anything tactical (section 2.5).
 */
export const BEST_FOR: Record<BestForKey, { label: string; Icon: LucideIcon }> = {
    military: { label: "Military families", Icon: GraduationCap },
    leisure: { label: "Road trip & leisure", Icon: Map },
    business: { label: "Business", Icon: Briefcase },
    groups: { label: "Groups & extended stay", Icon: Users },
    pets: { label: "Pet-friendly", Icon: PawPrint },
    largeVehicle: { label: "Truck & RV parking", Icon: Truck },
};

export function bestFor(key: BestForKey) {
    return BEST_FOR[key];
}
