# CLAUDE.md — I44 Hotels Website

> Project context, brand, architecture, and conventions for anyone (human or agent) working in this repo.
> **Execution roadmap and working rules live in [AGENTS.md](./AGENTS.md).** Read both before building.

> 🚧 **Status: BUILDING — Phases 0, 1 & 2 complete** (scaffold, design-system primitives, header/footer/nav, hero, data model + amenity registry, `/styleguide`; builds pass). Phase 3 (homepage sections) next. See [AGENTS.md](./AGENTS.md) for live phase status. All foundational decisions are locked: **stack** (Next.js + TypeScript + Tailwind + shadcn/ui, hosted on **Cloudflare**, domain **i44hotels.com**, §4), **palette** (§7), **typography** (Fraunces + Hanken Grotesk, §7), **logos** (§7), **design references** (§7), **IA** (§6), and the **`Property` data model** (§5). The phased build plan is in [AGENTS.md](./AGENTS.md). No application code written yet — begin Phase 0 once the owner gives the explicit "start building" go.

---

## 1. What we're building

A **professional, modern hospitality marketing website** for **I44 Hotels**, a hotel **ownership/management group** with properties along the **Interstate-44 corridor** in the United States.

The site's job: position I44 Hotels as dependable, comfortable, and convenient; make it effortless to find a hotel, understand amenities, and **book directly**; and serve travelers visiting for leisure, business, **Fort Leonard Wood graduations / military family visits**, group stays, and extended stays.

It must feel like a **polished hotel group brand** — warm, trustworthy, modern-rustic — *not* a generic motel site.

## 2. The single most important concept: I44 is an *umbrella brand*

I44 Hotels does **not** own one hotel. It owns a **portfolio of different franchise flags**, e.g.:

| Flag | Franchise parent | Tier |
|------|------------------|------|
| Days Inn | Wyndham | economy |
| Comfort Inn | Choice | midscale |
| Hyatt Select | Hyatt | upscale (coming soon) |

**Confirmed properties are listed in [PROPERTIES.md](./PROPERTIES.md)** (the source-of-truth reference the Phase 2 data is built from): Days Inn St. Robert, Comfort Inn St. Robert/FLW, Comfort Inn Sullivan, + Hyatt Select (coming soon).

Implications that drive every design decision:

- **The site sits *above* the flags.** I44 Hotels owns the chrome (header, footer, colors, voice). Each property wears its **franchise flag as a quality badge** (logos shown on cards & detail pages).
- **The site is a *feeder*, not a competitor, to the flags.** "Book Now" deep-links **per-property to each flag's official booking engine** (Wyndham / Choice / Hyatt) — which *is* the true direct, best-rate channel (no OTA markup). **I44 does not need its own booking engine.**
- **Why a guest comes to i44hotels.com instead of choicehotels.com:** cross-flag discovery along I-44 (budget→upscale in one place), Fort Leonard Wood / military expertise, **cross-property group blocks** the flag sites can't coordinate, and family-owned care. These differentiators should be visible on the homepage.
- **Portfolio today: 3 operating + 1 coming soon** (see PROPERTIES.md). **3 of the 4 properties are in St. Robert next to Fort Leonard Wood** (Days Inn, Comfort Inn St. Robert, and the coming-soon Hyatt Select) — the graduation-travel focus is central to the whole portfolio (§2.5); only Comfort Inn Sullivan is a separate I-44 corridor stop. Architecture still **built to grow**.

## 2.5. Strategic priority: Fort Leonard Wood graduation travel (St. Robert, MO)

**This is the project's #1 strategic focus and should shape the homepage, the Military Travel page, and SEO.**

- **The destination:** Several I44 Hotels properties sit in/near **St. Robert and Waynesville, Missouri** — the gateway towns to **Fort Leonard Wood (FLW)**, a major U.S. Army training installation just off I-44.
- **The core traveler:** **Families coming for graduations.** FLW runs basic training (BCT) and One Station Unit Training / AIT on a continuous, near-**weekly graduation cycle** — typically a **Family Day followed by a graduation ceremony**. Each cycle brings a fresh wave of parents, spouses, children, and extended family needing lodging for a few nights, often booking weeks in advance, frequently as **groups/room blocks**.
- **Why this matters commercially:** It is a high-volume, repeating, predictable demand stream with strong intent. Capturing "Fort Leonard Wood hotels," "FLW graduation hotels," and "St. Robert / Waynesville hotels" searches is the single biggest SEO/conversion opportunity.
- **How it shapes the build:**
  - The **Military Travel page is a flagship SEO + reassurance page** (not a minor section). It should speak directly to graduation families: what to expect, how far each hotel is from base, booking early, group blocks for extended family, local dining/things to do between Family Day and graduation, and directions to the FLW gates.
  - The homepage must carry a **prominent Fort Leonard Wood graduation callout** above the fold-ish, not buried.
  - Property data should expose **distance/drive-time to Fort Leonard Wood** so the FLW page can list "closest hotels to base" dynamically and sort by proximity.
  - **Tone discipline:** warm, respectful, proud-to-host — celebrate the milestone. Avoid camo/tactical/aggressive or government-agency styling.
  - **Messaging anchor:** "Stay Close. Feel Welcome." — built for families here to celebrate their soldier.

## 3. Target audiences

1. **Leisure / road-trip travelers** — comfortable, reliable stops along I-44.
2. **Business travelers** — clean rooms, fast booking, parking, Wi-Fi, breakfast, fitness.
3. **Military families visiting Fort Leonard Wood (PRIMARY focus)** — see §2.5. Families travel to **St. Robert / Waynesville, MO** for **Army basic training & AIT graduations** (Family Day + graduation ceremonies, on a near-weekly cycle), as well as ceremonies and training events. This is the highest-priority audience. Tone: respectful, warm, welcoming — NOT tactical or government-feeling. They need reassurance, clear distance-to-base info, easy booking, and group options for extended family.
4. **Group & extended-stay** — sports teams, work crews, military groups, family gatherings; need room blocks and direct contact.
5. **Pet owners & large-vehicle travelers** — pet-friendly rooms, truck/bus parking.

## 4. Tech stack (CONFIRMED)

> Decided after evaluating Astro vs. Next.js. Chose **Next.js** because the team has strong React/Next.js experience (leverages existing skills + native shadcn/ui) and future app-like features (guest accounts, custom booking flow, dashboards) are possible. Astro was the close runner-up on pure marketing-site performance; Next.js's gap is closed via Server Components, static generation, and tight client-component boundaries to keep shipped JS minimal.

| Layer | Choice | Rationale |
|------|--------|-----------|
| Framework | **Next.js (App Router) + TypeScript** | SEO (per-property pages, FLW/local search), static generation, dynamic `/hotels/[slug]` routes, image optimization, easy content growth |
| Styling | **Tailwind CSS + shadcn/ui** | Fast, polished, accessible components; design tokens centralized |
| Content | **Typed structured data in-repo (TS / MDX)** | Owner confirmed content is **developer-managed** — no CMS. Components are built so a headless CMS could be added later without rewrites |
| Forms | Form handler (Resend email or Formspree) | Inquiry forms (group / military / extended-stay / contact) |
| Hosting | **Cloudflare** (Pages/Workers) | Owner-chosen. Domain: **i44hotels.com**. Deploy Next.js via an adapter (see note). Global edge CDN. |
| Domain | **i44hotels.com** | Canonical site URL for SEO metadata, sitemap, JSON-LD, OG tags |

> **Cloudflare deployment note:** Next.js doesn't run natively on Cloudflare like it does on Vercel — it needs an adapter. Recommended: **OpenNext (`@opennextjs/cloudflare`)**, which supports full Next.js (SSR, server routes for forms, future app features) on Cloudflare Workers. ⚠️ **Image optimization:** `next/image`'s default optimizer is Vercel-specific; on Cloudflare configure a **custom loader** (Cloudflare Images / Image Resizing) or Cloudflare Polish. ⚠️ Set the metadata base URL to `https://i44hotels.com`. Final adapter approach is the one open Phase-0 decision (see AGENTS.md Phase 0).

## 5. Architecture — the data model is the backbone

Because content is developer-managed, **every page renders from a typed array of `Property` objects.** Adding a hotel = adding one data object + photos. No new code.

```ts
type Property = {
  slug: string;              // "days-inn-st-robert" → /hotels/days-inn-st-robert
  name: string;              // "Days Inn by Wyndham St. Robert / Ft. Leonard Wood"
  brand: "Days Inn" | "Comfort Inn" | "Hyatt Select" | string;
  tier: "economy" | "midscale" | "upscale";
  status: "operating" | "coming-soon";  // Hyatt Select = "coming-soon" (teaser card, no Book Now)
  brandLogo: string;         // flag badge asset
  bookingUrl?: string;       // per-property → flag's official engine (Wyndham/Choice/Hyatt). TBD/optional while coming-soon
  phone?: string;            // optional (unknown for coming-soon)
  address: { street: string; city: string; state: string; zip: string; lat: number; lng: number };
  shortDescription: string;
  distanceToFLW?: string;    // e.g. "12 min from Fort Leonard Wood"
  amenities: AmenityKey[];   // keys into a shared amenity registry (icon + label)
  roomTypes: RoomType[];
  photos: { category: PhotoCategory; src: string; alt: string }[];
  policies: { pets: string; parking: string; checkIn: string; checkOut: string };
  nearbyAttractions?: string[];
};
```

- Homepage previews, Hotels listing, detail pages, the FLW "nearest hotels" list, and group pages all derive from this array.
- **Amenities & rooms are per-property (source of truth)**, with light global "what to expect across our hotels" overview pages for SEO/first impressions.

## 6. Site structure (information architecture)

Primary nav is **lean (5 links)**: **Hotels** (dropdown listing the properties + "View all hotels") · **Military Travel** · **Groups** · **Offers** · **Contact**, plus a persistent **Book Now** (gold) button. The remaining pages (Amenities, Rooms, Gallery, Local Area) are **demoted to the footer**, which acts as the full sitemap. Mobile: hamburger drawer holding the same links, plus a sticky bottom bar (Hotels · Contact · Book Now). Rationale: ~5 items keeps the bar scannable and conversion-focused; Amenities/Rooms are per-property anyway (§5).

| Page | Notes |
|------|-------|
| Home | Main conversion page. Section flow in §8. |
| Hotels / Locations | Cards w/ flag badges + tier tags; **filter by tier / brand / "best for"**; map (5–10 props). |
| Hotel detail `/hotels/[slug]` | Hero, Book Now, address+map, phone, room types, amenities, gallery, nearby, policies, reviews. SEO landing per city/flag. |
| Amenities | Light global overview; real specifics live per-property. |
| Rooms | Light global overview; real room types live per-property. |
| **Military Travel (Fort Leonard Wood)** | **Flagship page (see §2.5).** Speaks directly to **graduation families in St. Robert / Waynesville, MO**: Family Day + ceremony guidance, book-early advice, group/room blocks for extended family, distance to FLW gates, local dining/activities between events, directions. Pulls **nearest hotels to base dynamically** from data (sorted by drive-time). Respectful, celebratory tone. "Stay Close. Feel Welcome." Targets "Fort Leonard Wood / FLW graduation / St. Robert / Waynesville hotel" searches. |
| Groups & Extended Stay | Differentiator. Inquiry form for cross-property room blocks. |
| Local Area | Attractions, dining, airports, directions — local SEO. |
| Offers / Promotions | Structure now, content later. |
| Gallery | Categorized photos (exterior, lobby, rooms, breakfast, pool, fitness, pet, parking, nearby). |
| Reviews | Trust themes; populated when approved reviews exist. |
| Contact | General + group + extended-stay + military inquiry forms; phones, addresses, map, mobile call/directions buttons. |

## 7. Design system

**Palette — FINALIZED.** Anchored to the confirmed logo (sampled values marked ★). Mood: **crisp & elegant** (near-white dominant, cream bands). Accent strategy: **gold only**. **Light mode only** (no dark mode). Principles: restraint (navy + gold + warm neutrals, no other hues), warm-tinted neutrals (taupe, never cold gray), gold used sparingly, whitespace + soft shadows over hard borders.

Defined as numbered ramps; these are the **single source of truth** in the Tailwind config. **Never hard-code hex in components** — reference tokens.

**Navy — primary (text, footer, trust)**
```
50 #EEF2F8  100 #D5DEEC  200 #AEC0DA  300 #7E97BD  400 #4E6A98
500 #2C476F 600 #173258  700 #0F2647  800 #0B1E3A ★ 900 #081838 ★ 950 #050F22
```
**Gold / bronze — accent only (CTA, highlights, icons, dividers)**
```
50 #FBF6EC  100 #F4E8CF  200 #E9D2A4  300 #DDBC79  400 #D8B878 ★
500 #BF8F56 ★ 600 #A6783F 700 #8A6232 800 #6E4E29 900 #543C20
```
**Warm neutral — surfaces, text, borders (taupe, NOT cold gray)**
```
50 #FCFAF5  100 #F8EFE0 ★(cream)  200 #EFE3CE  300 #E2CEA6 ★(sand)  400 #C4BDB0
500 #A39A8A 600 #807766 700 #4A4339 800 #2B2B2B(charcoal text) 900 #1C1A16
```
**Semantic — muted, never neon (mainly form validation)**
```
Success #4F7A5B / bg #E7F0E9   Error #B23A36 / bg #F7E7E6
Warning #C08A2D / bg #FAF0DA   Info  #3A6098 / bg #E7EEF7
```

**Usage map (crisp & elegant)**
- **Page background:** warm neutral 50 `#FCFAF5` (dominant). **Section bands:** alternate white `#FFFFFF` ↔ cream `#F8EFE0`. **Cards:** white with soft shadow, no hard border.
- **Header/nav:** white/cream with navy text + dark logo. **Footer:** navy 800 `#0B1E3A` with the light/inverted logo variant.
- **Body text:** charcoal `#2B2B2B`; **headings:** navy 800/900. **Dividers:** sand `#E2CEA6` (incl. the dashed road motif).

**Accessibility rules (non-negotiable — gold is the trap)**
- **Book Now CTA = gold `#BF8F56` background + NAVY `#0B1E3A` text** (≈5.7:1, passes AA). Never white text on gold (~2.6:1, fails).
- **Never use gold for body or small text** (gold-on-white ≈2.4:1, fails). Gold is for buttons, icons, borders, large display accents only.
- Navy on cream/white ≈13:1 — safe everywhere. Verify any new combo hits AA (4.5:1 text / 3:1 large & UI).

**Logo & brand mark** — two assets, two roles (confirmed):
- **PRIMARY web logo (header, every page): `i44_logo.png`** — cream-filled serif "I44" with gold bevel + navy outline, navy gold-edged **road with dashed centerline**, "HOTELS" serif caps, and fleur-de-lis. **Already on-palette** (sampled navy `#081F39`, gold `#C8995B`, cream `#FAECD5` — match our tokens) so **no recolor needed.** Elegant serif harmonizes with Fraunces; the dimensional bevel = the "Auberge-warmth-meets-Ritz-confidence" target.
  - **Versatility:** cream fill + navy/gold outline reads well on **both light and dark** backgrounds → likely **no separate inverted variant required** (verify on the navy footer at build).
  - **Aspect ratio ~4:3 (stacked lockup:** "I44" large, "HOTELS"+fleur below). **Decision: the header is NOT slim — give it enough height to show the full lockup legibly.** Use the full lockup throughout; only at very small sizes fall back to the shield/"I44".
- **EMBLEM / favicon: `i44_hotels_logo_transparent.png`** — the **Interstate-shield badge** (navy + gold, serif "I44", road, fleur-de-lis). On-palette. Use for **favicon, app icon, social avatar, signage, compact square contexts.**
- **RETIRED:** `i44_hotels_logo.png` (the bright royal-blue `#0D4191` horizontal lockup) — off-palette and superseded by `i44_logo.png`. Do not use.
- **Header treatment:** header/nav uses a **light cream (`#F8EFE0`) / white background**; header height accommodates the stacked logo (not a slim bar). Footer is navy — the primary logo works on it directly.
- **Asset variants still wanted** (owner to source from designer):
  1. **SVG vector of the primary logo** (`i44_logo.png`) for crisp scaling.
  2. **Favicon / app-icon** from the shield emblem (simplified if the full badge is too detailed at 32px).
  3. SVG of the shield emblem.

**Typography — FINALIZED**
- **Headings (display serif): Fraunces.** Warm, soft, modern-rustic — "premium but welcoming," echoes the logo's serif numerals. Use at large sizes only.
- **Body / UI (sans): Hanken Grotesk.** Warm, clean, highly legible; all body copy, small text, labels, forms, buttons.
- **Rules:** exactly **2 families**, ~3 weights each. **Self-host via `next/font`** (no layout shift, no external request). Never set body/small text in the serif. Headings = navy 800/900; body = charcoal `#2B2B2B`.

**Design references (north stars)**
- **Auberge Resorts** — color *mood* & whitespace: warm-neutral-dominant surfaces, calm low-contrast, generous breathing room. Governs backgrounds/spacing.
- **Montage** — *layout*: full-bleed imagery, editorial alternating image/text sections, refined property-detail pages, strong type hierarchy. Governs page structure.
- **Ritz-Carlton** — *brand DNA*: navy + gold heritage confidence and trust. Governs accents.
- **Execution steer:** blend toward Auberge's relaxed *warmth/approachability* over Ritz's formality — target "premium but welcoming," NOT exclusive/stuffy (the portfolio spans economy→upscale and serves budget-conscious military families).

**Motifs & feel**
- Restrained **road/route motif**: a thin dashed highway centerline as a divider or map path. One recurring idea, never plastered.
- Rounded cards, soft shadows, generous spacing, high-quality imagery.
- **Mobile-first.** Sticky mobile booking bar (Book / Call / Directions) persists.

## 8. Homepage section flow (conversion-ordered, mobile-first)

1. Hero — "Comfortable Stays Along I-44" + Book Now (gold) + Explore Our Hotels (outline)
2. Trust strip — family-owned · N hotels along I-44 · pet-friendly · near Fort Leonard Wood
3. Amenity highlights — icon cards
4. Property previews — 3–4 cards **with flag badges** + tier tags → View all hotels
5. Fort Leonard Wood callout — warm band → Military Travel
6. Groups & extended stay — one CTA to inquiry form
7. Reviews preview
8. Local area teaser + map
9. Footer — addresses, phones, quick links

## 9. Non-negotiable quality bars

- **SEO**: per-page metadata, semantic HTML, sitemap, JSON-LD (`Hotel` / `LocalBusiness` per property), per-city/flag/FLW targeting. **Canonical/base URL: `https://i44hotels.com`.**
- **Accessibility**: WCAG AA contrast, full keyboard nav, visible focus, labeled forms, alt text, semantic landmarks. (See the `frontend-design` skill for general UI conventions.)
- **Performance**: optimized/lazy images, no layout shift, strong Lighthouse on mobile.
- **Mobile booking** must be effortless — sticky bar, large tap targets.
- **Growth-ready**: adding properties/offers/reviews = data edits, not rewrites.

## 10. Open items pending from owner

- ~~Property list~~ ✅ provided in [PROPERTIES.md](./PROPERTIES.md) (3 operating + Hyatt Select coming soon). Still needed per property: **street address + ZIP, lat/lng, drive-time to FLW, room types, amenities, photos, short description.**
- **Per-property source/booking URLs** (the Wyndham/Choice/Hyatt brand pages) — owner referenced links but only page titles came through; **actual URLs TBD** (placeholders until then).
- **Franchise flag logos** (Days Inn, Comfort Inn, Hyatt Select) for property badges.
- Hyatt Select details (location/phone/opening) once available.
- ~~I44 logo~~ ✅ confirmed: **`i44_logo.png` = primary web logo** (on-palette, no recolor); **shield (`i44_hotels_logo_transparent.png`) = favicon/emblem**; royal-blue `i44_hotels_logo.png` **retired**. Still wanted: **SVG of `i44_logo.png`, shield-based favicon, shield SVG** (see §7), plus each franchise flag's logo for property badges.
- Real photography, room types, amenities per property, reviews, offers.
- ~~Final confirmation of the tech stack (§4).~~ ✅ Confirmed: Next.js + TypeScript + Tailwind + shadcn/ui, hosted on **Cloudflare**, domain **i44hotels.com**.

## 11. Conventions (apply once build starts)

- **Indentation: 4 spaces, no tabs** across all files (TS/TSX, CSS, JSON, MD). Enforced via `.editorconfig` (`indent_style = space`, `indent_size = 4`) + Prettier (`tabWidth: 4`). Set this up in Phase 0.
- **No em dashes (—) or en dashes (–) in code or site copy** — this includes comments, JSX text, string literals, metadata, and all user-facing content. Use hyphens, commas, colons, or separate sentences instead. (Does not retroactively apply to the existing planning `.md` docs, but applies to anything written into the app.)
- TypeScript everywhere; no `any` for content models.
- Design tokens in Tailwind config — never hard-code hex values in components.
- Reuse shared components (Button, Card, SectionHeading, Nav, Footer, BookingBar). One styling system only.
- Handle loading/empty/error states; don't ship happy-path-only UI.
- Keep content (data) separate from presentation (components).
