# AGENTS.md — I44 Hotels Build Roadmap & Operating Rules

> The **phased execution plan** for building the I44 Hotels website, plus working rules for any agent (or human) doing the work.
> Project context, brand, architecture, and the `Property` data model live in **[CLAUDE.md](./CLAUDE.md)** — read it first.

> 🚧 **Current status: BUILDING — Phase 0 complete (pending first Cloudflare deploy).** Scaffold + toolchain done: Next.js 16 + TS + Tailwind v4 + design tokens + Fraunces/Hanken fonts + OpenNext Cloudflare adapter + favicons/manifest + 4-space Prettier/.editorconfig + placeholder header/footer/home. `npm run build` and `opennextjs-cloudflare build` both pass. **Remaining for Phase 0:** the first deploy needs the owner's Cloudflare auth (`wrangler login`, then `npm run deploy`). **Next up: Phase 1 (design system & components).**
>
> Hard external dependencies still open: franchise booking/source URLs + addresses (Phase 2/5/11). Logos, fonts, palette, stack all resolved.

---

## How to work on this project (operating rules)

1. **Respect the data-driven architecture.** Everything renders from the typed `Property` array (see CLAUDE.md §5). Never hard-code a hotel's details into a component.
2. **One styling system.** Tailwind + design tokens only. Never hard-code hex values — use the tokens in CLAUDE.md §7.
3. **Placeholders are explicit.** Booking URLs, photos, copy, reviews, and offers that aren't final must be obvious placeholders, never fake-finished. Track every placeholder so it's easy to find and replace.
4. **Mobile-first, accessible, SEO-correct by default** — these are acceptance criteria on *every* phase, not a cleanup phase. (Phase 10 is hardening, not first contact.)
5. **Ask before assuming** on: real property data, brand assets, booking engine specifics, and any change to the agreed stack. Use placeholders and keep moving rather than inventing facts.
6. **Each phase has a Definition of Done.** Don't advance until it's met and the owner has seen the result for visible phases (3+).
7. **Commit per phase** with a clear message; keep phases independently reviewable.
8. **Update CLAUDE.md §10 (open items)** as owner inputs arrive (booking URLs, property list, assets).

---

## Phase overview

| # | Phase | Depends on | Owner input needed |
|---|-------|-----------|--------------------|
| 0 | Foundations & scaffolding | — | — (stack/fonts/tokens all decided) |
| 1 | Design system & shared components | 0 | Recolored navy logo SVGs (for polish; PNG placeholder OK to start) |
| 2 | Content layer & data model | 0 | Property list (can use placeholders) |
| 3 | Homepage | 1, 2 | — |
| 4 | Hotels / Locations listing | 1, 2 | — |
| 5 | Property detail pages | 1, 2 | — |
| 6 | Fort Leonard Wood / Military Travel | 1, 2 | FLW copy/photos |
| 7 | Groups & Extended Stay + forms | 1, 2, 9-forms | Form recipient/routing |
| 8 | Supporting pages (Amenities, Rooms, Local Area, Offers, Gallery, Reviews) | 1, 2 | Content/photos |
| 9 | Contact + forms infrastructure | 1 | Form handler choice, recipients |
| 10 | SEO, performance & accessibility hardening | 3–9 | — |
| 11 | Booking integration (swap placeholders) | 5 | **Real per-property booking URLs** |
| 12 | Launch prep & deployment | all | Cloudflare account access, analytics (domain i44hotels.com confirmed) |

---

## Phase details

### Phase 0 — Foundations & scaffolding
**Goal:** A running Next.js app with the toolchain in place, deployable to Cloudflare.
**Open decision (resolve first):** Cloudflare deployment approach — **recommended: OpenNext (`@opennextjs/cloudflare`)** for full Next.js (SSR + server routes for forms + growth room). Configure a **`next/image` custom loader** (Cloudflare Images / Image Resizing) since the default optimizer is Vercel-only.
**Deliverables:** Next.js (App Router) + TypeScript project; chosen Cloudflare adapter wired (`wrangler` config); Tailwind configured with the §7 design-token ramps (navy / gold / warm-neutral / semantic); **fonts via `next/font`: Fraunces (headings) + Hanken Grotesk (body)**; shadcn/ui initialized and themed to the tokens (light mode only); metadata base URL `https://i44hotels.com`; favicons + `site.webmanifest` from the `logos/` set (theme-color → brand navy `#0B1E3A`); brand assets organized into `/public` (primary logo, shield, franchise flags; ignore the retired royal-blue logo); ESLint + Prettier (**4-space indent**, `tabWidth: 4`) + `.editorconfig` (`indent_size = 4`, no tabs); folder structure (`/app`, `/components`, `/content` or `/data`, `/lib`, `/public`); base layout with placeholder header/footer; deploy a blank build to **Cloudflare**.
**Done when:** `dev` runs clean, tokens/fonts/favicons load, and a blank page deploys to Cloudflare.

### Phase 1 — Design system & shared components
**Goal:** Reusable, accessible building blocks.
**Deliverables:** Button (primary = **gold bg + navy text** per §7 a11y rule, outline, ghost), Card (rounded + soft shadow, no hard border), SectionHeading (Fraunces), Tag/Badge (incl. **franchise flag badge** + **tier tag**), Header (light cream/white bg, navy text, primary horizontal logo) w/ desktop nav + mobile menu + persistent **Book Now**, Footer (navy bg, inverted logo variant), **sticky mobile booking bar (Book / Call / Directions)**, amenity icon system, container/spacing primitives, the route/dashed-line divider motif.
**Done when:** A component preview shows every primitive at all states (hover/focus/disabled), keyboard-navigable, AA contrast.

### Phase 2 — Content layer & data model
**Goal:** The backbone all pages read from.
**Deliverables:** `Property` type (incl. `status: "operating" | "coming-soon"`) + `RoomType`, `AmenityKey` registry (icon+label), `PhotoCategory`; **the real properties from [PROPERTIES.md](./PROPERTIES.md)** — Days Inn St. Robert, Comfort Inn St. Robert/FLW, Comfort Inn Sullivan (operating), Hyatt Select (coming-soon) — with placeholders for fields still TBD (addresses, URLs, photos, etc.); helper functions (`getAllProperties`, `getPropertyBySlug`, `getNearestToFLW`, `filterByTier/brand/bestFor`); placeholder images by category.
**Done when:** Helpers return typed data; the 4 real properties load; coming-soon state handled; TBD fields clearly marked; adding a property is a one-object edit.

### Phase 3 — Homepage
**Goal:** The main conversion page.
**Deliverables:** All 9 sections in CLAUDE.md §8, wired to the data layer; primary + secondary CTAs; flag-badged property previews; FLW + groups callouts; reviews/local teasers.
**Done when:** Looks polished on mobile + desktop; all CTAs route correctly (booking = placeholder); owner has reviewed.

### Phase 4 — Hotels / Locations listing
**Goal:** Browse the portfolio.
**Deliverables:** Responsive card grid with flag badges + tier tags; **filtering by tier / brand / "best for"**; map view of properties; per-card View Hotel + Book Now.
**Done when:** Filters work, map plots all properties, cards link to detail pages.

### Phase 5 — Property detail pages
**Goal:** Per-property SEO + conversion page at `/hotels/[slug]`.
**Deliverables:** Hero image, Book Now, address + embedded map, phone (tap-to-call), room types, amenities (from registry), gallery, nearby attractions, policies, reviews; statically generated per slug; per-page metadata + JSON-LD `Hotel`.
**Done when:** Every placeholder property renders a complete page; metadata/structured data validate.

### Phase 6 — Fort Leonard Wood / Military Travel
**Goal:** Flagship SEO + reassurance page.
**Deliverables:** Respectful, welcoming hero ("Stay Close. Feel Welcome."); graduation/travel guidance; **nearest-hotels-to-base list pulled dynamically** (sorted by distance); group-block CTA; directions/tips; targeted metadata for "Fort Leonard Wood hotels / graduation lodging."
**Done when:** Tone reviewed by owner; nearest-hotels list is data-driven; SEO metadata in place.

### Phase 7 — Groups & Extended Stay
**Goal:** The cross-property differentiator.
**Deliverables:** Page covering military/family/sports/crew/long-stay/bus-truck/event needs; **group-block + extended-stay inquiry forms** (uses Phase 9 infra) with validation and confirmation states.
**Done when:** Forms submit + validate; owner-defined routing works; states (success/error) handled.

### Phase 8 — Supporting pages
**Goal:** Round out the IA.
**Deliverables:** Amenities overview (light/global), Rooms overview (light/global), Local Area (attractions/dining/airports/directions + local SEO), Offers (structure now, content later), Gallery (categorized), Reviews (trust themes, populated when available).
**Done when:** All nav links resolve to real pages; placeholders clearly marked.

### Phase 9 — Contact + forms infrastructure
**Goal:** Reliable inquiry capture.
**Deliverables:** Form handler (Resend/Formspree) + server route; shared validated form components; Contact page with general + group + extended-stay + military inquiry types; phones, addresses, map; **mobile call/directions buttons**; spam protection.
**Done when:** All inquiry types deliver to owner-defined recipients; validation + success/error states solid.

### Phase 10 — SEO, performance & accessibility hardening
**Goal:** Pass the quality bars sitewide.
**Deliverables:** `sitemap.xml`, `robots.txt`, canonical/OG/Twitter metadata, JSON-LD coverage; image optimization + lazy-loading audit; Lighthouse (mobile) targets; full keyboard/screen-reader/contrast a11y pass; analytics readiness.
**Done when:** Lighthouse SEO/Best-Practices/Accessibility ≥ targets on mobile; no a11y blockers.

### Phase 11 — Booking integration (swap placeholders)
**Goal:** Turn on real direct booking.
**Deliverables:** Replace each property's placeholder `bookingUrl` with its **flag's official engine URL**; verify deep-links per property; consistent Book Now behavior (new tab, tracking params if any).
**Depends on owner providing real booking URLs.**
**Done when:** Every Book Now reaches the correct property's real reservation flow.

### Phase 12 — Launch prep & deployment
**Goal:** Go live.
**Deliverables:** Production deploy on **Cloudflare** with the **i44hotels.com** domain (Cloudflare DNS + SSL), analytics, final assets/photography/copy swapped in, 404/500 pages, cross-device QA, redirects (incl. www → apex).
**Done when:** Owner sign-off on production; monitoring/analytics live.

---

## Definition of Done (every phase)
- Mobile-first layout holds at ~360px, tablet, and wide.
- Keyboard-navigable; visible focus; AA contrast; labeled inputs; alt text.
- No hard-coded content in components; reads from the data layer.
- All non-final content is an obvious, tracked placeholder.
- Owner has reviewed visible phases (3+) before advancing.
