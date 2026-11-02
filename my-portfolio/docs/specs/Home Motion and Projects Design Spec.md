# Home Motion and Projects Design Spec

## Intent

The home page's Now, Projects and Shipping sections read as cream-and-grey text and one block of green: correct, but flat. This change swaps in the three projects Sid wants to show (Finance App, FitLevelUp, Apartment System) and adds motion and project colour so the page feels alive, without leaving the black and warm off-white theme or the ruled-list layout.

Approved designs: Claude Design canvas "Home Motion Directions" (https://claude.ai/artifact/YVJ1qRLXaqmWaep3UJtCWg), artboard **D · A + C mix** for Now and Projects, and **E · Shipping (sample data)** for Shipping.

## Goals

- Projects lists only Finance App, FitLevelUp and Apartment System, in that order, with real copy, links and status.
- Colour comes from each project's own brand, used for its index, hover wash, title on hover and status dot.
- Now, Projects and Shipping each play one entrance, once, when they come into view.
- Hover and keyboard focus on project rows feel responsive (wash, nudge, title scramble); the cursor peek stays.
- Shipping shows four real numbers from the GitHub calendar that light up their days on the graph.

## Non-goals

- No real screenshots. Posters stay; `image` already switches a project to a screenshot later.
- No "replay the year" animation for the graph.
- No new GitHub or Spotify calls, no new API routes, no new dependencies.
- No change to Hero, On repeat, the nav or other pages (About only changes an import).

## Anti-goals

- Pills, badges, glass, glow blobs, gradient washes across the page.
- Anything hidden that a reduced-motion or no-JS visitor never gets to see.
- Scrambled text reaching a screen reader.
- Invented numbers. Every Shipping figure is computed from the real calendar.

---

## Content

### Projects (`app/lib/content/projects.ts`)

ADTO, Lyla's and Project Management System are removed. The `nda` flag and the striped NDA poster go with them.

| Field | Finance App | FitLevelUp | Apartment System |
|---|---|---|---|
| slug | `finance-app` | `fitlevelup` | `apartment-system` |
| year | 2026 | 2026 | 2026 |
| kind | web | web | web |
| status | `live` | `live` | `in progress` |
| summary | a household budget that shows what's safe to spend after every bill and goal. | workouts and runs, played like an RPG. xp, quests, streaks. | rent and metered water billing for a small rental property. |
| description | A household finance app built around one loop: plan the month, see what's safe to spend after every expense and savings commitment, and track plan against actual as the month goes. Households have owners and members, and it installs as a PWA. | A gamified fitness tracker. Log gym sessions and runs, earn XP, level up, clear daily and weekly quests, unlock achievements and keep a daily streak alive. | A management system for a small rental property: billing cycles for rent and metered water, payments made outside the app and confirmed by staff, and email reminders, with admin, staff and tenant logins. Still in progress, so the code stays private. |
| stack | Next.js · Supabase · Drizzle · TanStack Query | Next.js · MongoDB · Better Auth · TanStack Query | Next.js · NestJS · Supabase · Resend |
| links | Live → https://finance-app-wluh-eight.vercel.app | Live → https://fit-level-up-black.vercel.app, GitHub → https://github.com/sidadrian3/fit_level_up | none |
| poster tint | `#2b4f6e` | `#5d7400` | `#1e3a8a` |
| accent (dark / light) | `#8fae86` / `#123351` | `#d1ff1a` / `#5b6e00` | `#8fa4ec` / `#1e3a8a` |

Accent contrast (text at 13–15px): dark 8.6 / 18.0 / 8.7 : 1 on black; light 11.4 / 5.0 / 9.1 : 1 on `#F5F0E8`. All pass AA.

`Project` gains `status: "live" | "in progress"` and `accent: { dark: string; light: string }`; `nda` is removed.

### Now (`app/config.ts`)

`now` becomes a list of pieces with highlights marked, and `nowUpdated` sits beside it:

```ts
now: [
  "going back to the ",
  { highlight: "fundamentals and good practices" },
  ", and building ",
  { highlight: "full-stack with AI in the loop" },
  ".",
],
nowUpdated: "2026-11",
```

The stamp renders `updated nov 2026` (lower-case month, from `nowUpdated`).

---

## Design

All entrances play **once**, when the block is ~30% on screen (the existing `TimelineReveal` / contribution-wave pattern), and are keyed off a `data-reveal="idle | play | done"` attribute. The hidden idle state lives inside `prefers-reduced-motion: no-preference` **and** `scripting: enabled`, so reduced-motion and no-JS visitors see final content from first paint. The global scroll-driven `section` reveal is turned off for these three sections (`[animation:none]`, as About does), so nothing animates twice.

Easing everywhere: `cubic-bezier(0.23, 1, 0.32, 1)` (the site's existing ease-out). Only `transform` and `opacity` animate, except the Now highlight (text colour plus underline `background-size`, both paint-only).

### Now

- **Stamp** on its own line **after** the sentence (a trailing meta line, not an eyebrow): a still 6px dot in `accent-now`, then `updated nov 2026` in `faint`, 13px, `mt-2`. Fades in (400ms) once the words have risen (~900ms).
- **Sentence**: each word sits in its own `overflow: hidden` inline-block mask and rises from `translateY(105%)` (700ms, 25ms stagger, starting at 100ms). Works at any width with no measuring; still plain text for screen readers.
- **Highlights**: the two marked phrases start in `mute` and turn `ink` (500ms) while a 1px underline draws left to right (800ms), at 700ms and 1000ms. The underline is a `background` on the phrase with `box-decoration-break: clone`, so it follows line wraps.
- Reduced motion / no-JS: phrases are already `ink` and underlined; the stamp is simply there.

### Projects

Row layout (unchanged grammar, new pieces): `index · title + summary · arrow · status + year`.

- **Index** `01` `02` `03`, 13px tabular, in the project's accent.
- **Status**: `live` with a pulsing dot in the accent colour, or `in progress` in `faint`; then the year.
- **Entrance** (row i, relative to reveal): the top hairline draws left to right (`scaleX`, 600ms, delay `i × 110ms`); the title and summary each rise out of a mask (700ms, delays `i × 110 + 100` and `+ 170ms`); index and status fade in (500ms, `i × 110 + 350ms`).
- **Hover / keyboard focus** (hover only where hover is supported):
  - a wash of the accent (13% dark, 10% light) sweeps in behind the row from the left (`scaleX` 0 → 1, 240ms enter, 150ms exit);
  - title and summary nudge 4px right (200ms);
  - the title turns the accent colour (200ms); on **mouse hover only** it also **scrambles**: random lower-case letters resolve left to right, two characters per 20ms frame (≤ 320ms), spaces kept; re-entering mid-scramble does not restart it. Keyboard focus gets colour, wash and nudge, never the scramble;
  - the arrow slides in (existing `.ruled-arrow`), siblings dim to 45% (existing `.ruled`);
  - the **cursor peek stays** exactly as it is.
- **Open row** (drawer expanded, any device): keeps the wash and the accent title. This is what touch visitors get instead of hover. No scramble on tap.
- **Drawer**: unchanged structure. Poster uses the new tint; links as in the table; Apartment System shows no link row.
- Scramble accessibility: the visible scrambling text is `aria-hidden`; the real title sits beside it in `sr-only`, so the button's name never changes.
- Reduced motion: no entrance movement, the wash fades in (opacity, 150ms) instead of sweeping, no nudge, no scramble; colour changes stay.
- Title-on-wash contrast is checked in both themes at build (≥ 4.5:1); the light wash is 10% for FitLevelUp's `#5b6e00`.

### Shipping

- **Stats row** above the graph: four items, 4 columns on ≥ 640px, 2×2 below.

  | Number | Label | Sub-line |
  |---|---|---|
  | total contributions | contributions | last 12 months |
  | current streak (days) | day streak | since `mon d` |
  | longest streak (days) | longest streak | `mon d – mon d` |
  | best day (count) | best day | `mon d` |

  Number 28px / weight 650 / `-0.03em` / tabular / `ink`; label 13px `mute`; sub-line 13px `faint`. If a streak is 0, the sub-line reads `—`.
- **Entrance**: stats rise in (560ms, 70ms stagger); numbers count up from 0 (1000ms ease-out cubic, after 200ms). Month labels fade in with the existing cell wave.
- **Stat ↔ graph**: hovering or focusing a stat dims unrelated cells to ~18% and marks the related ones:
  - contributions → zero days dim;
  - day streak / longest streak → that run's cells get a 1px `ink` outline, others dim;
  - best day → that cell scales ×1.8 from its centre with an `ink` outline, others dim.
  The other stats dim to 45% (the `.ruled` feel). Stats are **toggle buttons** (`aria-pressed`): hover or focus previews the highlight, click or tap pins it (so touch visitors get it too), clicking again, pressing Escape or pinning another stat clears or moves it. Each button's name includes what it highlights (e.g. "longest streak, 41 days, highlight on graph").
- **Today**: the last cell gets a pulsing `accent-now` ring (2.4s ping). The project `live` dots and this ring are the only looping animations on the page.
- **Month labels**: short lower-case month names (`nov … oct`) above the columns where a month starts, 11px `faint`, skipping the first and last column so labels never clip.
- Existing behaviour stays: wave-in, hover lens, tooltip, arrow-key navigation, horizontal scroll on phones, total line with `github ↗`. The lens and the best-day scale never apply at once (stat highlight clears when the pointer enters the graph).
- **Computing the numbers** (server, pure function over the calendar): flatten the weeks to days; total = calendar total; current streak counts back from today, or from yesterday when today is still 0; longest = longest run of days with count > 0; best = highest single-day count (earliest wins ties).
- Reduced motion: no count-up (final numbers), stats fade in instead of rising, no ping, no scale on best day (outline only); dimming still works.
- No calendar (no token / API down): the existing fallback line, no stats.

## Files touched (expected)

| Area | Files |
|---|---|
| Content | `app/lib/content/projects.ts`, `app/config.ts` |
| Home | `app/page.tsx`, new `app/components/NowLine.tsx` |
| Reveal | new `app/components/useRevealOnce.ts`; `app/components/TimelineReveal.tsx` renamed `RevealOnce.tsx` and built on it (About's import updated) |
| Projects | `app/components/projects/ProjectList.tsx`, `ProjectPoster.tsx` (NDA removal), new `app/components/projects/useScramble.ts` |
| Shipping | new `app/lib/contributions.ts` (pure summary function), `app/components/ContributionGraph.tsx`, `ContributionGrid.tsx` (reveal phase from parent, highlight, month labels, today ring), new `app/components/ShippingPanel.tsx` (client: reveal + focus state), new `app/components/ShippingStats.tsx`, new `app/components/useCountUp.ts` |
| Styles | `app/global.css` (keyframes and `data-reveal`-keyed rules only; hover states as Tailwind) |

## Builder's calls (made without Sid; flag if wrong)

- Drawer descriptions and stacks are written from each project's README.
- Per-row accents travel as inline CSS variables (`--accent-dark`, `--accent-light`); one rule picks the right one under `.light`. That is a genuinely dynamic value, so it is allowed inline.
- The IntersectionObserver in `TimelineReveal` and `ContributionGrid` moves into one `useRevealOnce` hook, now that four places need it. `TimelineReveal` becomes the generic `RevealOnce` (same behaviour), since Now uses it too; About only changes its import.
- The graph's reveal phase moves up to `ShippingPanel` so the stats, months and wave share one trigger.
- Streaks use the calendar's own dates (GitHub's day boundaries), not the visitor's time zone.

## Design pass (folded in above)

- `emil-design-eng`: hover timings cut to 240/150/200ms, exit faster than enter; no scramble on keyboard focus; scramble ≤ 320ms and not restartable mid-run; looping pings limited to live dots and today; count-up 1000ms; hairline 600ms; reduced motion keeps fades; best day ×1.8 from centre.
- `design-taste-frontend`: the Now stamp moved from above the sentence (eyebrow) to a trailing meta line; "live" must be true, so both Live URLs are checked at build.
- `ui-ux-pro-max`: stats are toggle buttons with a click/tap action and `aria-pressed`, not inert buttons; wash contrast checked per theme.
- `ui-styling`: not applicable (no shadcn/Base UI components; existing Tailwind tokens reused).

## Open assumptions

- Visitors may reach finance-app's sign-up page from the Live link (owner OK'd "for now").
- `nowUpdated` is edited by hand with the sentence.
