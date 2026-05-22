import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AUDIENCES = [
    "Military graduation groups",
    "Sports teams & tournaments",
    "Work crews & corporate",
    "Family gatherings",
    "Extended & long-term stays",
    "Bus & truck travelers",
];

export function GroupsExtendedStay() {
    return (
        <section className="bg-sand-50">
            <Container className="py-16 sm:py-20">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <div>
                        <SectionHeading
                            eyebrow="Groups & Extended Stay"
                            title="Room blocks and long stays, handled by one team"
                            subtitle="Booking for a crowd or settling in for a while? We coordinate group blocks across our hotels and set up extended stays, so you talk to one team instead of three call centers."
                        />
                        <Link href="/groups" className={cn(buttonVariants(), "mt-7")}>
                            Request a group block
                            <ArrowRight className="size-4" aria-hidden />
                        </Link>
                    </div>
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {AUDIENCES.map((a) => (
                            <li
                                key={a}
                                className="text-navy-800 border-sand-200 hover:border-gold-400 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-sm transition-colors"
                            >
                                {a}
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </section>
    );
}
