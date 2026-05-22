/**
 * Placeholder home page (Phase 0 baseline).
 * The full conversion-ordered homepage is built in Phase 3 (CLAUDE.md §8).
 */
export default function HomePage() {
    return (
        <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:py-32">
            <span className="bg-gold-100 text-gold-700 rounded-full px-4 py-1 text-sm font-medium">
                Coming soon
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Comfortable Stays Along I-44
            </h1>
            <p className="text-sand-700 mt-6 max-w-xl text-lg">
                Modern hospitality, convenient locations, and welcoming amenities for
                families, business travelers, military guests, and road-trip travelers.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                    href="/hotels"
                    className="bg-gold-500 text-navy-900 hover:bg-gold-400 rounded-full px-6 py-3 font-semibold shadow-sm transition-colors"
                >
                    Book Now
                </a>
                <a
                    href="/hotels"
                    className="border-navy-300 text-navy-800 hover:bg-sand-100 rounded-full border px-6 py-3 font-semibold transition-colors"
                >
                    Explore Our Hotels
                </a>
            </div>
            <p className="text-sand-500 mt-16 text-sm">
                Site under construction. Foundation in place (Phase 0).
            </p>
        </section>
    );
}
