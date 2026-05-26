import {
    Croissant,
    Waves,
    Dumbbell,
    Coffee,
    PawPrint,
    Truck,
    Wifi,
    SquareParking,
    Cookie,
    Dices,
    Smartphone,
    type LucideIcon,
} from "lucide-react";

/** Stable keys for the amenities the group offers (CLAUDE.md amenities list). */
export type AmenityKey =
    | "breakfast"
    | "pool"
    | "fitness"
    | "coffee"
    | "petFriendly"
    | "truckParking"
    | "wifi"
    | "parking"
    | "cookies"
    | "boardGames"
    | "contactlessCheckin";

/** Single source of truth: each amenity's display label + icon. */
export const AMENITIES: Record<AmenityKey, { label: string; Icon: LucideIcon }> = {
    breakfast: { label: "Free hot breakfast", Icon: Croissant },
    pool: { label: "Indoor heated pool", Icon: Waves },
    fitness: { label: "Fitness center", Icon: Dumbbell },
    coffee: { label: "24-hour coffee in lobby", Icon: Coffee },
    petFriendly: { label: "Pet-friendly rooms", Icon: PawPrint },
    truckParking: { label: "Truck & bus parking", Icon: Truck },
    wifi: { label: "Free Wi-Fi", Icon: Wifi },
    parking: { label: "Free parking", Icon: SquareParking },
    cookies: { label: "Fresh afternoon cookies", Icon: Cookie },
    boardGames: { label: "Board games & coloring", Icon: Dices },
    contactlessCheckin: { label: "Contactless check-in", Icon: Smartphone },
};

export function amenity(key: AmenityKey) {
    return AMENITIES[key];
}
