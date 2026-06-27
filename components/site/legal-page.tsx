import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Shared shell for the Privacy Policy and Terms of Use pages: a cream header band
 * with the title and "last updated" line, then a readable prose column. Keeps both
 * legal pages visually consistent.
 */
export function LegalPage({
    title,
    subtitle,
    lastUpdated,
    children,
}: {
    title: string;
    subtitle: string;
    lastUpdated: string;
    children: ReactNode;
}) {
    return (
        <>
            <section className="bg-sand-100">
                <Container className="py-14 sm:py-20">
                    <SectionHeading
                        as="h1"
                        eyebrow="Legal"
                        title={title}
                        subtitle={subtitle}
                    />
                    <p className="text-sand-600 mt-5 text-sm">
                        Last updated: {lastUpdated}
                    </p>
                </Container>
            </section>

            <section className="bg-white">
                <Container className="py-12 sm:py-16">
                    <div className="text-sand-700 mx-auto max-w-3xl space-y-10 leading-relaxed">
                        {children}
                    </div>
                </Container>
            </section>
        </>
    );
}

/** One titled block within a legal page. */
export function LegalSection({
    heading,
    children,
}: {
    heading: string;
    children: ReactNode;
}) {
    return (
        <section className="space-y-3">
            <h2 className="text-navy-800 font-serif text-2xl">{heading}</h2>
            {children}
        </section>
    );
}
