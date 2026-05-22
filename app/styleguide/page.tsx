import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge, TierBadge, ComingSoonBadge, FlagBadge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { RouteDivider } from "@/components/ui/route-divider";

export const metadata: Metadata = {
    title: "Style Guide",
    robots: { index: false, follow: false },
};

const COLORS = [
    { name: "navy-800", className: "bg-navy-800" },
    { name: "navy-900", className: "bg-navy-900" },
    { name: "gold-500", className: "bg-gold-500" },
    { name: "gold-400", className: "bg-gold-400" },
    { name: "sand-300", className: "bg-sand-300" },
    { name: "sand-100", className: "bg-sand-100" },
    { name: "sand-50", className: "bg-sand-50 ring-1 ring-sand-200" },
    { name: "success", className: "bg-success" },
    { name: "error", className: "bg-error" },
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="border-sand-200 border-t py-12">
            <h2 className="text-navy-800 mb-6 text-2xl font-semibold">{title}</h2>
            {children}
        </section>
    );
}

export default function StyleguidePage() {
    return (
        <Container className="py-12">
            <p className="text-gold-600 text-sm font-semibold tracking-[0.14em] uppercase">
                I44 Hotels
            </p>
            <h1 className="text-navy-800 text-4xl font-semibold">Style Guide</h1>
            <p className="text-sand-700 mt-2">
                Design-system primitives (Phase 1). Tab through to check focus states.
            </p>

            <Block title="Colors">
                <div className="flex flex-wrap gap-4">
                    {COLORS.map((c) => (
                        <div key={c.name} className="text-center">
                            <div className={`h-16 w-24 rounded-lg ${c.className}`} />
                            <p className="text-sand-700 mt-1 text-xs">{c.name}</p>
                        </div>
                    ))}
                </div>
            </Block>

            <Block title="Typography">
                <h1 className="text-navy-800 text-5xl font-semibold">Fraunces heading</h1>
                <h2 className="text-navy-800 mt-3 text-3xl font-semibold">
                    Fraunces subheading
                </h2>
                <p className="text-sand-800 mt-4 max-w-2xl">
                    Body copy is set in Hanken Grotesk. Welcoming, convenient hotels for
                    families, business travelers, and Fort Leonard Wood guests.
                </p>
            </Block>

            <Block title="Buttons">
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary" size="sm">
                        Primary sm
                    </Button>
                    <Button variant="primary">Primary md</Button>
                    <Button variant="primary" size="lg">
                        Primary lg
                    </Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="primary" disabled>
                        Disabled
                    </Button>
                </div>
                <div className="from-navy-700 to-navy-900 mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-gradient-to-br p-5">
                    <Button variant="outlineGold">Outline gold (on navy)</Button>
                    <Button variant="primary">Primary on navy</Button>
                </div>
            </Block>

            <Block title="Card">
                <Card className="max-w-sm p-6">
                    <h3 className="text-navy-800 text-xl font-semibold">Card title</h3>
                    <p className="text-sand-700 mt-2 text-sm">
                        Rounded, soft shadow, no hard border.
                    </p>
                    <Button className="mt-4" size="sm">
                        Action
                    </Button>
                </Card>
            </Block>

            <Block title="Badges">
                <div className="flex flex-wrap items-center gap-3">
                    <TierBadge tier="economy" />
                    <TierBadge tier="midscale" />
                    <TierBadge tier="upscale" />
                    <ComingSoonBadge />
                    <Badge className="bg-success-bg text-success">Available</Badge>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-5">
                    <FlagBadge brand="Days Inn" />
                    <FlagBadge brand="Comfort Inn" />
                    <FlagBadge brand="Hyatt Select" />
                </div>
            </Block>

            <Block title="Section heading">
                <SectionHeading
                    eyebrow="Fort Leonard Wood Travel"
                    title="Stay Close. Feel Welcome."
                    subtitle="A reusable heading with eyebrow, title, and subtitle."
                />
                <div className="from-navy-700 to-navy-900 mt-6 rounded-xl bg-gradient-to-br p-8">
                    <SectionHeading
                        tone="light"
                        align="center"
                        eyebrow="On a dark band"
                        title="Light tone, centered"
                        subtitle="Same component, tone='light', align='center'."
                    />
                </div>
            </Block>

            <Block title="Route divider">
                <RouteDivider />
            </Block>
        </Container>
    );
}
