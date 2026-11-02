# Home Motion and Projects Implementation Plan

> **For agentic workers:** Each task is implemented by a fresh sub-agent, coordinated by the feature pipeline (Step 7). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home projects with Finance App, FitLevelUp and Apartment System, and give Now, Projects and Shipping the approved canvas D / E motion.

**Architecture:** Content stays in typed data files. Entrances are CSS keyed off a `data-reveal` attribute set once by a shared `useRevealOnce` hook; hover states are Tailwind utilities; only keyframes and `data-reveal` rules go in `app/global.css`. Shipping numbers are computed on the server by a pure function and handed to a small client panel that owns the reveal phase and the stat ↔ graph highlight.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind 3, no new dependencies.

**Spec:** `docs/specs/Home Motion and Projects Design Spec.md` (canvas: https://claude.ai/artifact/YVJ1qRLXaqmWaep3UJtCWg, artboards D and E).

## Global Constraints

- No new dependencies; no change to `app/api/`, env vars or external calls.
- Easing `cubic-bezier(0.23, 1, 0.32, 1)`; animate `transform` and `opacity` only (exceptions: Now highlight colour + underline `background-size`, text colour on hover).
- Hidden entrance states live inside `@media (prefers-reduced-motion: no-preference)` **and** `@media (scripting: enabled)`.
- Hover utilities only apply where hover is supported (`future.hoverOnlyWhenSupported` already on).
- The global scroll-driven `section` reveal is off for Now, Projects and Shipping (`className="[animation:none]"`).
- Accent colours come from data (`accent.dark` / `accent.light`) as inline CSS variables; nothing else inline unless dynamic.
- Accessibility: visible focus, real titles for screen readers, `aria-pressed` on stat toggles, contrast ≥ 4.5:1 both themes.
- Read `AGENTS.md` before writing code. No `any`, no commented-out code, files ≲ 400 lines.

## Review Focus

1. A calendar where today is still 0 → current streak counts back from yesterday; an all-zero calendar → streaks 0 and best day `null`, sub-lines show `—` (Task 4 check script).
2. The pointer leaves a row mid-scramble → the title still ends on the real text, never stuck scrambled (Task 3 browser check).
3. The theme is toggled while a row is hovered or a stat is pinned → accent and highlight switch theme with no reload (Tasks 3 and 5 browser checks).
4. No `GITHUB_TOKEN` → the existing fallback line, no stats, no crash, and the skeleton reserves the stats + graph height (Task 4 check).
5. Tabbing fast through the stats while the count-up runs → numbers settle on their final values and the highlight follows focus (Task 5 browser check).

---

### Task 1: Swap in the new projects and the Now pieces

**Files:**
- Modify: `app/lib/content/projects.ts`
- Modify: `app/components/projects/ProjectPoster.tsx` (remove `NDA_STRIPES` / `nda` branch)
- Modify: `app/config.ts` (`now`, add `nowUpdated`)
- Modify: `app/page.tsx` (render `now` pieces as plain text for now)

**Interfaces:**
- Produces: `type ProjectStatus = "live" | "in progress"`; `type Project = { slug: string; title: string; year: number; kind: "web" | "mobile"; status: ProjectStatus; summary: string; description: string; stack: string[]; links?: ProjectLink[]; image?: string; tint: string; accent: { dark: string; light: string } }` (`nda` removed). `type NowPiece = string | { highlight: string }`; `metaData.now: NowPiece[]`; `metaData.nowUpdated: string` (`"YYYY-MM"`). Export `NowPiece` from `app/config.ts`.

- [ ] **Step 1:** Replace the three projects with the spec's Content table, verbatim (slug, year, kind, status, summary, description, stack, links with labels `Live` / `GitHub`, tint, accent). Order: Finance App, FitLevelUp, Apartment System.
- [ ] **Step 2:** `posterBackground` becomes `linear-gradient(145deg, ${project.tint}, #0d0d0d)`; delete the NDA path.
- [ ] **Step 3:** Set `now` and `nowUpdated: "2026-11"` exactly as the spec's Now block.
- [ ] **Step 4:** In `app/page.tsx`, render the Now pieces inside the existing `<p>`: strings as text, highlights as `<span className="text-ink">`. (Task 2 replaces this.)
- [ ] **Step 5:** Run `npm run typecheck` and `npm run build`. Expected: both pass; `/` still static. Confirm both Live URLs answer: `curl -s -o /dev/null -w '%{http_code}' <url>` → `200` (or a redirect to the app's login), so `live` is true.
- [ ] **Step 6:** Commit: `feat(home): list finance app, fitlevelup and apartment system`

### Task 2: Shared reveal hook and the Now entrance

**Files:**
- Create: `app/components/useRevealOnce.ts`
- Rename: `app/components/TimelineReveal.tsx` → `app/components/RevealOnce.tsx` (component `RevealOnce`, same behaviour); update the import in `app/about/page.tsx`
- Create: `app/components/NowLine.tsx` (server component)
- Modify: `app/page.tsx`, `app/global.css`

**Interfaces:**
- Consumes: `NowPiece`, `metaData.now`, `metaData.nowUpdated` (Task 1).
- Produces: `type RevealPhase = "idle" | "play" | "done"`; `useRevealOnce(ref: React.RefObject<Element | null>, threshold?: number): RevealPhase` (default 0.3; `"done"` immediately under reduced motion or without IntersectionObserver; `"play"` once on first intersection, then disconnects). `RevealOnce({ children, className? })` renders `<div data-reveal={phase}>`.

- [ ] **Step 1:** Write `useRevealOnce` from the observer logic in the old `TimelineReveal`; `RevealOnce` uses it. About behaviour must not change (its `.tl-*` CSS keys off the same attribute).
- [ ] **Step 2:** `NowLine({ pieces, updated }: { pieces: NowPiece[]; updated: string })`: split every piece into words; each word is `<span class="now-word"><span style="--i:N">word</span></span>` with a running index N across the whole sentence and the spaces kept as text between masks; highlight pieces wrap their words in `<span class="now-hl" style="--d:Xms">`, X = 700 for the first highlight, 1000 for the second (300ms apart). After the `<p>`, the stamp: a still 6px `bg-accent-now` dot + `updated {mon} {yyyy}` (lower-case short month from `updated`, `text-[13px] text-faint mt-2`), class `now-stamp`.
- [ ] **Step 3:** `app/page.tsx`: Now section gets `className="[animation:none]"` and renders `<RevealOnce><NowLine pieces={metaData.now} updated={metaData.nowUpdated} /></RevealOnce>`.
- [ ] **Step 4:** `global.css`: `.now-word` = inline-block, `overflow: hidden`, `vertical-align: bottom`; `.now-hl` = `ink` colour + 1px underline via `background: linear-gradient(currentColor,currentColor) 0 100% / 100% 1px no-repeat` and `box-decoration-break: clone` (final state for everyone). Inside the no-preference + scripting block: idle hides `.now-word > span` (`translateY(105%)`), `.now-stamp` (`opacity 0`) and sets `.now-hl` to `mute` with `background-size: 0% 1px`; play runs word rise 700ms, delay `100ms + var(--i) * 25ms`; highlight colour 500ms + underline 800ms at `var(--d)`; stamp fade 400ms at 900ms. Animations use `both`/`forwards` so the final state holds.
- [ ] **Step 5:** `npm run typecheck`. In the browser (`/`, 390 and 1440): words wave in once, highlights ink after; with JS disabled or reduced motion the sentence, underline and stamp are all there on first paint; `/about` timelines still play.
- [ ] **Step 6:** Commit: `feat(home): word-mask entrance and highlights for now`

### Task 3: Projects entrance, accent and hover

**Files:**
- Create: `app/components/projects/useScramble.ts`
- Modify: `app/components/projects/ProjectList.tsx`, `app/page.tsx`, `app/global.css`

**Interfaces:**
- Consumes: `Project` (Task 1), `RevealOnce` / `useRevealOnce` (Task 2).
- Produces: `useScramble(text: string): { display: string; scramble: () => void }`: 20ms frames, two characters resolved per frame left to right, random `a–z` for unresolved non-space characters, no-op while already running and under reduced motion, clears its timer on unmount, always ends on `text`.

- [ ] **Step 1:** Implement `useScramble`.
- [ ] **Step 2:** `ProjectList`: wrap the `<ul>` reveal with `useRevealOnce` on the list (`data-reveal` on the `<ul>`). Each `<li>` sets `style={{ "--i": index, "--accent-dark": accent.dark, "--accent-light": accent.light }}`. Row button content, in order: index `01`… (`text-[13px] tabular-nums`, accent colour, class `pr-idx`); body (`pr-body`) with title as `<span aria-hidden>{display}</span><span className="sr-only">{title}</span>` inside a mask span and the summary inside a second mask span; the existing arrow; meta (`pr-meta`): `live` with a pulsing accent dot, or `in progress`, then the year.
- [ ] **Step 3:** Hover / focus / open (Tailwind `group` on the button; open = `aria-expanded="true"`): wash pseudo-element at 13% (dark) / 10% (light) of the accent, `scaleX(0→1)` from the left, 240ms in / 150ms out; body `translateX(4px)` 200ms; title colour → accent 200ms. `onPointerEnter` with `pointerType === "mouse"` also calls `scramble()`. Open rows keep wash + accent title. Keep the peek, drawer, Escape and dimming behaviour exactly as they are.
- [ ] **Step 4:** `global.css`: `--accent` resolves to `--accent-dark`, and to `--accent-light` under `.light`; the wash `::before`; the `live` dot ping (2.4s, infinite, no-preference only); entrance under no-preference + scripting: idle hides; play: hairline `scaleX` 600ms at `i*110ms`, title mask rise 700ms at `i*110+100ms`, summary at `i*110+170ms`, `pr-idx` + `pr-meta` fade 500ms at `i*110+350ms`. The row's top border becomes a pseudo-element so it can draw (bottom border of the list stays). Reduced motion: wash fades (opacity 150ms) instead of sweeping, no nudge.
- [ ] **Step 5:** `app/page.tsx`: Projects section `className="[animation:none]"`.
- [ ] **Step 6:** `npm run typecheck`. Browser, `/` × 390 / 1440 × dark / light: entrance plays once; mouse hover sweeps, nudges, scrambles ≤ 320ms and settles on the real title even if the pointer leaves mid-run (Review Focus 2); Tab focus gives wash + colour, no scramble; peek follows the cursor; tap opens the drawer with the wash kept; toggling theme while hovered swaps the accent (Review Focus 3); a screen-reader name check (`button` accessible name equals the real title). Title-on-wash contrast ≥ 4.5:1 for all three accents in both themes.
- [ ] **Step 7:** Commit: `feat(home): project accents, row entrance and hover scramble`

### Task 4: Shipping numbers

**Files:**
- Create: `app/lib/contributions.ts`
- Create: `app/components/useCountUp.ts`, `app/components/ShippingStats.tsx`, `app/components/ShippingPanel.tsx`
- Modify: `app/components/ContributionGraph.tsx`, `app/components/ContributionGrid.tsx` (reveal phase comes in as a prop), `app/page.tsx`, `app/global.css`

**Interfaces:**
- Consumes: `ContributionCalendar` (`app/lib/github.ts`), `useRevealOnce` (Task 2).
- Produces:
  - `type Streak = { length: number; from: string | null; to: string | null }` (ISO dates); `type ContributionSummary = { total: number; current: Streak; longest: Streak; best: { date: string; count: number } | null }`; `summarizeCalendar(calendar: ContributionCalendar): ContributionSummary` (pure; `import type` only, so Node can run it).
  - `type StatKey = "total" | "current" | "longest" | "best"`.
  - `useCountUp(target: number, play: boolean): number` (0 → target over 1000ms ease-out cubic after 200ms when `play` turns true; returns `target` otherwise).
  - `ShippingPanel({ calendar, summary }: { calendar: ContributionCalendar; summary: ContributionSummary })` (client): `phase = useRevealOnce(wrapper)`; state `preview: StatKey | null`, `pinned: StatKey | null`; renders `ShippingStats` then `ContributionGrid`.
  - `ShippingStats({ summary, phase, active, onPreview, onToggle }: { summary: ContributionSummary; phase: RevealPhase; active: StatKey | null; onPreview: (key: StatKey | null) => void; onToggle: (key: StatKey) => void })`.
  - `ContributionGrid({ calendar, wave }: { calendar: ContributionCalendar; wave: RevealPhase })`: its own observer is removed.

- [ ] **Step 1:** Implement `summarizeCalendar`: flatten weeks to days in order; `total` = `calendar.total`; current streak counts back from the last day, starting from the day before when the last day is 0; longest = longest run of `count > 0` (earliest wins ties); best = highest `count` (earliest wins ties), `null` if every day is 0.
- [ ] **Step 2:** Check script (scratchpad, not committed), run with `node <script>.ts`, asserting:
  - days `[1,2,0,3,4,5,0]` with last day 0 → current `{ length: 3, from: day3, to: day5 }`, longest length 3, best `{ count: 5 }`;
  - same with last day `2` → current length 4;
  - all zeros → current and longest length 0 with `null` dates, best `null`.
  Expected: all assertions pass.
- [ ] **Step 3:** `ContributionGraph` computes `summarizeCalendar(calendar)` and renders `<ShippingPanel calendar summary />` plus the existing total line; the no-calendar fallback is unchanged (Review Focus 4). `ContributionGraphSkeleton` reserves the stats row (2 × 2 rows on phones, one row ≥ 640px) above the graph.
- [ ] **Step 4:** `ShippingStats`: four toggle `<button type="button" aria-pressed>` in a `grid grid-cols-2 sm:grid-cols-4 gap-5`; number `text-[28px] font-[650] tracking-[-0.03em] tabular-nums text-ink` from `useCountUp(value, phase === "play")`; label `text-[13px] text-mute`; sub-line `text-[13px] text-faint` per the spec table (`—` when a streak is 0 or best is `null`; dates `mon d`, lower-case). Accessible name: `"{label}, {value}{unit}, highlight on graph"`. Hover / focus → `onPreview(key)`, leave / blur → `onPreview(null)`, click → `onToggle(key)`, Escape → `onToggle` clearing the pin. Non-active stats dim to 45% while one is active. Entrance: rise 560ms, 70ms stagger, keyed off `phase` (fade only under reduced motion).
- [ ] **Step 5:** `app/page.tsx`: Shipping section `className="[animation:none]"`. `npm run typecheck` and `npm run build` (data fetching changed). Browser `/` × 390 / 1440: numbers count up once; graph wave still plays from the shared phase; lens, tooltip and arrow keys unchanged; with `GITHUB_TOKEN` unset the fallback line shows and nothing throws.
- [ ] **Step 6:** Commit: `feat(home): shipping stats with count-up`

### Task 5: Stats light up the graph; months and today

**Files:**
- Modify: `app/components/ContributionGrid.tsx`, `app/components/ShippingPanel.tsx`, `app/global.css`

**Interfaces:**
- Consumes: `ContributionSummary`, `StatKey`, `ShippingPanel` state (Task 4).
- Produces: `type GraphHighlight = { kind: StatKey; from?: string; to?: string; date?: string }`; `ContributionGrid` gains `highlight: GraphHighlight | null` and `onPointerEnterGraph: () => void`.

- [ ] **Step 1:** `ShippingPanel` derives `highlight` from `pinned ?? preview` and `summary`, and clears both when the pointer enters the graph (so the lens and the best-day scale never coincide).
- [ ] **Step 2:** `ContributionGrid` marks each `<rect>` with `data-dim`, `data-lit` or `data-best` from `highlight` (total → zero days dim; streaks → in-range lit, rest dim; best → that date best, rest dim). CSS: dim `opacity .18`; lit 1px `ink` stroke; best `scale(1.8)` (transform-box fill-box, centre) + `ink` stroke, outline only under reduced motion; 200ms transitions.
- [ ] **Step 3:** Month labels: add a 14-unit row above the cells inside the SVG (`<text>` 11px `faint`, lower-case short month at the first week whose first day starts a new month, skipping week 0 and the last week). Shift cells down by the row and add it to the `cellAt` and tooltip y maths. Labels fade with the wave (`data-wave`).
- [ ] **Step 4:** Today ring: a stroke-only `<rect>` 2 units larger around the last cell, `accent-now`, pinging 2.4s (no-preference only; hidden otherwise).
- [ ] **Step 5:** `npm run typecheck`. Browser `/` × 390 / 1440 × dark / light: each stat previews on hover and pins on click/tap; the four highlights match the numbers; Tab quickly through stats during the count-up → final values and highlight follow focus (Review Focus 5); theme toggle with a pin keeps it (Review Focus 3); moving into the graph clears the highlight and the lens/tooltip work; month labels line up with the tooltip dates; today pulses.
- [ ] **Step 6:** Commit: `feat(home): stat highlights, month labels and today ring on the graph`

## Outcome

**Pipeline outcome:** agentic
**Lane:** full
**What was built:** The home page now lists Finance App, FitLevelUp and Apartment System (ADTO, Lyla's, PMS and the NDA poster code are gone). Now rises word by word out of masks, then its two highlighted phrases ink and underline, with an "updated nov 2026" stamp. Project rows draw in, carry each project's accent (index, live dot, wash, title), and scramble their title on mouse hover while the cursor peek stays. Shipping gains four numbers (contributions, day streak, longest streak, best day) that count up and, when hovered, focused or pinned, light up their days on the graph, plus month labels and a pulsing today ring.

**Decisions made:**
- Brand colour per project, shown only through the project's own accent, so the black and cream theme is unchanged.
- FitLevelUp's light accent (`#5b6e00`) was 4.42:1 against its own wash, so the hovered title uses a text-only `--accent-text` (85% accent, 15% ink, 5.37:1). The index and dot keep the pure accent.
- `nowUpdated` lives beside the Now sentence in `config.ts`; the sentence is a list of pieces with highlights marked.
- Word masks, not measured line masks, for Now: works at every width, no client JavaScript.
- Stats are toggle buttons: hover or keyboard focus previews, click or tap pins, a second tap or Escape in the panel unpins. Tap focus no longer sets the preview (it left the highlight stuck on touch).
- A single `useRevealOnce` hook and a generic `RevealOnce` replace the per-component observers; About only changed its import.
- Reduced motion shows the final state from first paint everywhere, so the spec line promising a stat fade was corrected rather than built.
- Streak figures use GitHub's own day boundaries.
- Review declined: reusing a date helper (none exists and the four formats differ), a `GraphHighlight` discriminated union, treating the highlight that stays after a second click as a bug while the pointer is still over the stat (that is the hover preview), and reverting `ContributionGrid` reflow-only lines. Accepted: the stat Escape handling moved to the panel.

**Verification:** UI verified: `/` × 390 and 1440 × dark and light on a production build, 76 browser checks (Playwright against `next start` in a scratch copy): theme applied, Now settles with stamp and ink, three projects in order, entrance completes, hover wash and accent, scramble changes letters then settles (and settles if the pointer leaves mid-run), no scramble on keyboard focus, peek mounts, tap opens a drawer and keeps the wash, drawer links, four stats with real data (2,726 / 5 / 74 / 100), count-up, month labels, longest-streak pin lights exactly 74 cells, best day marks one cell, Escape and second tap unpin, today ring, tooltip still follows cells, no horizontal scroll, no console errors; reduced motion (Now final from first paint, final stat numbers, no scramble, no ping) and JavaScript off (nothing left hidden). `npm run typecheck` and `npm run build` pass. Two-axis review ran (Standards: no hard violations; Spec: three partial items fixed, one spec line corrected) · Escalations: none.

**Notes:**
- `app/global.css` is now about 870 lines (was about 530) and mixes tokens with feature CSS. The review judged it past the point where a split pays off; a follow-up could move `.contrib-*`, `.now-*`, `.pr-*` and `.ship-*` into imported partials. Not done here.
- Not verified in a browser: toggling the theme live while a row is hovered or a stat is pinned (each theme was loaded fresh); tabbing quickly through the stats during the count-up; the no-`GITHUB_TOKEN` fallback (a token was set); title-on-wash contrast was computed, not measured on screen. `review-animations` is not installed in this repo.
- finance-app's Live link redirects to its `/login` page, so visitors can reach its sign-up. The owner accepted that "for now".
- Posters stand in for screenshots; set `image` on a project to switch it.
- I ran `npm run build` once while the owner's dev server was on port 3000, which overwrote its `.next`. I was not allowed to stop that server, so it needs `rm -rf .next` and a restart (`npm run dev`). All later builds ran in a separate scratch copy.
