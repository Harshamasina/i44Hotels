# PROPERTIES.md — I44 Hotels Property Reference

> Source-of-truth reference for the real properties under I44 Hotels, provided by the owner.
> This is the raw reference; the typed `Property` data objects (Phase 2, see [CLAUDE.md](./CLAUDE.md) §5) will be built from it.
> Each property's marketing **content (descriptions, amenities, room types, photos)** is to be sourced from its **franchise brand page** (links below), and "Book Now" deep-links to that same brand booking engine.

> ⚠️ **URLs pending.** The owner referenced hyperlinks, but only page titles came through (hrefs lost on paste). Exact **source/booking URLs are TBD** — owner to provide. Do not fabricate URLs.

## Quick reference

| # | Property | Flag (parent) | Tier | City, State | Phone | Near FLW? | Status |
|---|----------|---------------|------|-------------|-------|-----------|--------|
| 1 | Days Inn by Wyndham St. Robert Waynesville/Ft. Leonard Wood | Days Inn (Wyndham) | economy | St. Robert, MO | 573-336-5556 | ✅ Yes (gateway town) | Operating |
| 2 | Comfort Inn St. Robert/Fort Leonard Wood | Comfort Inn (Choice) | midscale | Saint Robert, MO | 573-336-3553 | ✅ Yes (gateway town) | Operating |
| 3 | Comfort Inn Sullivan | Comfort Inn (Choice) | midscale | Sullivan, MO | 573-468-7800 | ❌ No (I-44 corridor stop) | Operating |
| 4 | Hyatt Select | Hyatt Select (Hyatt) | upscale | St. Robert, MO | TBD | ✅ Yes (gateway town) | **Coming Soon** |

**Current portfolio:** 3 operating + 1 coming soon. Architecture still built to grow (CLAUDE.md §2).
**FLW concentration:** **3 of 4 properties are in St. Robert** next to Fort Leonard Wood (only Comfort Inn Sullivan is elsewhere) → the graduation-travel focus is central to the whole portfolio (CLAUDE.md §2.5).

---

## Property details

### 1. Days Inn by Wyndham St. Robert Waynesville/Ft. Leonard Wood
- **Flag / parent:** Days Inn — Wyndham · **Tier:** economy
- **City:** St. Robert, MO · **Phone:** 573-336-5556
- **FLW:** In the Fort Leonard Wood gateway town — a primary graduation-travel hotel.
- **Booking engine:** Wyndham (daysinn.com / wyndhamhotels.com) — **exact deep-link URL TBD**
- **Source page title:** "Days Inn by Wyndham St. Robert Waynesville/Ft. Leonard Wood | St. Robert, MO Hotels"
- **Still needed:** street address + ZIP, lat/lng, drive-time to FLW gates, room types, amenities, photos, source/booking URL, short description.

### 2. Comfort Inn St. Robert/Fort Leonard Wood
- **Flag / parent:** Comfort Inn — Choice Hotels · **Tier:** midscale
- **City:** Saint Robert, MO · **Phone:** 573-336-3553
- **FLW:** In the Fort Leonard Wood gateway town — a primary graduation-travel hotel.
- **Booking engine:** Choice (choicehotels.com) — **exact deep-link URL TBD**
- **Source page title:** "Hotel in Saint Robert, MO | Comfort Inn St. Robert/Fort Leonard Wood"
- **Still needed:** street address + ZIP, lat/lng, drive-time to FLW gates, room types, amenities, photos, source/booking URL, short description.

### 3. Comfort Inn Sullivan
- **Flag / parent:** Comfort Inn — Choice Hotels · **Tier:** midscale
- **City:** Sullivan, MO · **Phone:** 573-468-7800
- **FLW:** Not in the FLW area — an **I-44 corridor stop** (further east, toward St. Louis). Serves road-trip / leisure / business travelers. Should appear far down any "nearest to FLW" sort.
- **Booking engine:** Choice (choicehotels.com) — **exact deep-link URL TBD**
- **Source page title:** "Hotel in Sullivan, MO | Comfort Inn Sullivan"
- **Still needed:** street address + ZIP, lat/lng, room types, amenities, photos, source/booking URL, short description.

### 4. Hyatt Select St. Robert — Coming Soon
- **Flag / parent:** Hyatt Select — Hyatt · **Tier:** upscale
- **City:** St. Robert, MO (Fort Leonard Wood gateway town) — will be the **upscale option for graduation families**.
- **Status:** Coming soon. Phone, street address, opening date, and details **TBD**.
- **Build implication:** the site must support a **"coming soon" property state** (teaser card on Hotels page, no Book Now / an "Opening soon" or "Notify me" treatment instead). Uses the `status` field on the `Property` model.

---

## Notes for the build
- **Booking & content per brand:** Days Inn → Wyndham engine; both Comfort Inns → Choice engine; Hyatt Select → Hyatt engine. Per-property `bookingUrl` points to that brand's official page (Phase 11).
- **Flag badges:** need official brand logos for Days Inn, Comfort Inn, and Hyatt Select (CLAUDE.md §10).
- **Tones of voice still I44's** — even though content is sourced from brand pages, rewrite descriptions in the warm I44 group voice; don't paste franchise marketing verbatim.
