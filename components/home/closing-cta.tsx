import Link from "next/link";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";

export function ClosingCta() {
    return (
        <section className="bg-navy-800">
            <Container className="py-16 text-center sm:py-20">
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                    Find your stay along I-44
                </h2>
                <p className="text-sand-200 mx-auto mt-4 max-w-xl text-lg">
                    Comfortable rooms, easy booking, and a warm welcome, whether you are
                    here for a night or a graduation weekend.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link href="/hotels" className={buttonVariants({ size: "lg" })}>
                        Book Now
                    </Link>
                    <Link
                        href="/hotels"
                        className={buttonVariants({ variant: "outlineGold", size: "lg" })}
                    >
                        Explore Our Hotels
                    </Link>
                </div>
            </Container>
        </section>
    );
}
