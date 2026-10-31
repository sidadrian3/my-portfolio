# Portfolio Redesign Implementation Plan

> **For agentic workers:** Implement task-by-task in order (this repo's `feature` pipeline coordinates one fresh sub-agent per task). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio on the reference's structure (narrow left-aligned column, label-column sections, ruled lists, personal copy) with a dark-default token theme, a project peek, recently-played Spotify and a GitHub contribution graph.

**Architecture:** One CSS-variable token layer (`app/global.css` → Tailwind semantic colours) drives both themes. Pages become server components that compose small client islands (hero typing, project list, Spotify, photo stack, copy button, nav, theme toggle). Content lives in typed files under `app/lib/content/`; external data (Spotify, GitHub) stays in `app/lib/*` and route handlers, never in client code.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind 3.4, framer-motion 12, next-themes 0.4 (already installed), react-icons, react-type-animation, fast-average-color. No new dependencies.

**Spec:** `docs/specs/Portfolio Redesign Design Spec.md`. Read it, including the "Design pass adjustments" section, which overrides earlier sections where they conflict.

**Branch:** `feat/portfolio-redesign`, created from `feat/improve-ui`.

## Global Constraints

- Colours only via the semantic Tailwind tokens `bg`, `ink`, `mute`, `faint`, `line`, `hi`, `contrib-0…4`. No `text-white…`, `bg-black`, `neutral-*` or raw hex in components (tints in content data are the only exception).
- Dark values live in `:root`, light values in `.light`; `next-themes` with `attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`, `disableTransitionOnChange`.
- Roboto Flex is the only font, loaded once in `app/layout.tsx`.
- No rounded outlined pills, badges or chips. Radius ≤ 4px on any surface (≤ 2px on contribution cells). Tags render as text joined by ` · `.
- No mono uppercase eyebrow labels; section labels are `Section` headings.
- Only `transform` and `opacity` animate, except the drawer's grid-rows and the lamp's `--lamp` colour. Every animation has the reduced-motion behaviour listed in the spec's motion table.
- Hover-only effects are gated behind `@media (hover: hover) and (pointer: fine)`.
- Icon-only controls have an `aria-label` and a ≥ 40px hit area; every interactive element shows a 2px `ink` focus outline with 2px offset.
- No `any`; server components by default; `"use client"` only on the islands named in each task.
- Copy comes verbatim from the spec's "Copy drafts" section; `[bracketed]` placeholders stay as written.
- Secrets (`SPOTIFY_*`, `GITHUB_TOKEN`) are read only in `app/lib/*` and `app/api/*`.
- Commit messages: `feat(<scope>): …`; stage only the task's files.

## Review Focus

1. **Spotify token without `user-read-recently-played`.** The current token lacks the scope, so `/api/spotify/recently-played` returns an error today. Expected: the header shows the #1 four-week top track and the "Recently played" tab is hidden; nothing looks broken. Owned by Task 4, Step 5.
2. **`GITHUB_TOKEN` missing or GitHub down.** Expected: the Shipping section shows only the caption linking to the profile, with no empty box and no thrown error. Owned by Task 5, Step 3.
3. **Touch and keyboard on projects.** Expected: no cursor preview on touch; Tab reaches each row, Enter/Space opens its drawer, links inside are reachable, and only one drawer is open at a time. Owned by Task 3, Step 4.
4. **Theme first paint and persistence.** Expected: a first visit renders dark with no light flash; toggling to light survives a reload; no element keeps hard-coded white or black text in light. Owned by Task 9, Step 4.
5. **Extreme album colours (pure white, pure black, neon green).** Expected: the lamp tint stays a hint (saturation ≤ 55%, lightness 35–60%). Owned by Task 4, Step 2.

---

### Task 1: Foundation: tokens, font, theme provider, atmosphere, config and dead-code removal

**Files:**
- Modify: `app/global.css`, `tailwind.config.js`, `app/layout.tsx`, `app/components/ClientLayout.tsx`, `app/config.ts`, `app/page.tsx` (avatar link only), `next.config.ts`, `app/sitemap.ts`
- Create: `app/components/ThemeProvider.tsx`
- Delete: `app/lib/posts.ts`, `app/components/mdx.tsx`, `app/components/caption.tsx`, `app/components/GrainOverlay.tsx`

**Reuses:** existing `next-themes` package, `framer-motion` page fade in `ClientLayout`.

**Interfaces:**
- Produces, CSS: tokens as RGB channels on `:root` (dark) and `.light`:

  | Token | Dark | Light |
  |---|---|---|
  | `--bg` | `0 0 0` | `245 240 232` |
  | `--ink` | `245 240 232` | `20 18 16` |
  | `--mute` | `162 158 153` | `92 89 85` |
  | `--faint` | `127 125 121` | `106 102 98` |
  | `--line` | `29 29 28` | `218 213 206` |
  | `--hi` | `15 14 14` | `234 229 221` |
  | `--contrib-0…4` | `27 27 26`, `31 58 43`, `46 90 63`, `74 138 95`, `123 191 138` | `226 221 213`, `201 220 200`, `156 193 159`, `95 154 108`, `58 110 72` |
  | `--accent-now` | `123 191 138` | `58 110 72` |
  | `--grain-opacity` / `--grain-blend` | `.07` / `screen` | `.09` / `multiply` |

  plus `color-scheme` per theme, `@property --lamp { syntax: '<color>'; inherits: false; initial-value: rgb(245 240 232); }`, `body::before` grain, `::selection` in ink tokens, `:focus-visible` outline rule, `.title { text-wrap: balance }` kept.
- Produces, Tailwind: `colors.{bg,ink,mute,faint,line,hi,accent-now}` and `colors.contrib.{0..4}` as `rgb(var(--x) / <alpha-value>)`; `fontFamily.sans: ["var(--font-roboto-flex)", "system-ui", "sans-serif"]`. Remove `apple-*` colours, `apple`, `jockeyOne`, `inter`, `robotoFlex` font families and the unused `fall-in` / `slide-up` keyframes.
- Produces, DOM: `ClientLayout` renders `<div data-lamp aria-hidden className="lamp …">` (fixed, top, radial gradient using `color-mix(in srgb, var(--lamp) 14%, transparent)`, `transition: --lamp 800ms ease`), then `<Navbar />` **outside** the keyed `motion.main`, then `<main>`, then `<Footer />`.
- Produces, config:
  ```ts
  export const metaData: { baseUrl: string; title: string; name: string; description: string; ogImage: string; now: string };
  export const socialLinks: { github: string; linkedin: string; instagram: string; facebook: string; email: string };
  ```
  values: `baseUrl "https://my-portfolio-sepia-zeta-23.vercel.app"`, `title "Sid Adrian Digamon"`, `name "Sid"`, description and `now` from the spec's copy, `github "https://github.com/sidadrian3"`, `instagram "https://www.instagram.com/sidadrian/"`, `facebook "https://www.facebook.com/adrian.digamon"`, `linkedin` unchanged, `email "sidadrian3@gmail.com"`.
- `ThemeProvider` (`"use client"`): `ThemeProvider({ children }: { children: React.ReactNode })` wrapping `next-themes` with the Global Constraints settings. In this task `forcedTheme="dark"` is set so light can't activate before Task 9.

- [ ] **Step 1:** (Branch `feat/portfolio-redesign` already exists; `.superpowers/` is already ignored.)
- [ ] **Step 2:** Write the token layer, `@property`, grain, focus and selection rules in `app/global.css`; delete the `.prose`, `.anchor`, `--sh-*`, `.tweet` and `.callout` rules (they served `mdx.tsx`, deleted in this task).
- [ ] **Step 3:** Update `tailwind.config.js` per Interfaces.
- [ ] **Step 4:** `app/layout.tsx`: load `Roboto_Flex({ subsets: ["latin"], variable: "--font-roboto-flex", display: "swap" })` only; `<html lang="en" suppressHydrationWarning className={robotoFlex.variable}>`; `<body className="bg-bg text-ink font-sans antialiased">` wrapped in `ThemeProvider`; delete the RSS/Atom/JSON `<link>`s, the commented `icons` block and the untyped `cx` helper.
- [ ] **Step 5:** Rewrite `ClientLayout.tsx` per Interfaces: remove its font loaders, `GrainOverlay`, inline radial `style`, and the `key={pathname}` on the outer wrapper (the fade keys only `<main>`; reduced motion → opacity only, via `useReducedMotion`). Container: `mx-auto w-full max-w-[720px] px-4 sm:px-7`.
- [ ] **Step 6:** Update `config.ts`; in `app/page.tsx` replace the `<a href={socialLinks.twitter}>` avatar wrapper with the bare `Image` (alt "Sid Adrian Digamon").
- [ ] **Step 7:** `next.config.ts`: delete `rewrites()`. `sitemap.ts`: routes `["", "about", "photos", "contact"]`, no posts import. Delete the four files listed.
- [ ] **Step 8:** Verify: `npm run typecheck` passes; `npm run build` passes; `grep -rn "jockey\|Inter(\|posts\|GrainOverlay\|twitter" app` returns nothing. In the browser, `/` renders dark with visible grain and a cream lamp at the top; navigating between pages does not fade the nav.
- [ ] **Step 9:** Commit: `feat(theme): add token layer, single font and theme provider; fix config and remove dead feed code`

---

### Task 2: Shell: Section, ruled list, nav and footer

**Files:**
- Create: `app/components/Section.tsx`
- Modify: `app/components/nav.tsx`, `app/components/footer.tsx`, `app/global.css` (ruled-list rules)

**Reuses:** `metaData`, `socialLinks` (Task 1); `react-icons/fa6` brand icons, `react-icons/fi` UI glyphs.

**Interfaces:**
- Produces: `Section({ label, id, children, className }: { label: string; id?: string; children: React.ReactNode; className?: string })` (server). Renders `<section id aria-labelledby>` with a hairline top border (`border-line`), a grid of `sm:grid-cols-[120px_1fr] gap-x-5`, an `<h2>` label (15px/600, `text-ink`), `scroll-mt-20`, vertical padding 48px mobile / 64px desktop.
- Produces CSS classes in `global.css`:
  - `.ruled` on a `<ul>/<ol>`: children separated by `border-line` hairlines (top on each, bottom on last).
  - Inside `@media (hover: hover) and (pointer: fine)`: `.ruled:hover > *` and `.ruled:has(:focus-visible) > *` at `opacity: .45`; the hovered/focused child at `1`; `transition: opacity 150ms ease`.
  - `.ruled-arrow`: `opacity: 0; transform: translateX(-4px)`, revealed on row hover/focus with a 200ms `cubic-bezier(0.23, 1, 0.32, 1)` transition.
  - `.press`: `transition: transform 160ms ease-out; &:active { transform: scale(.97) }`.
  - Reduced motion: no transforms, opacity changes stay.
- `Navbar` (`"use client"`): left `sid.` link (`text-ink`, 600, tracking `-0.02em`); right links Home `/`, About `/about`, Photos `/photos`, Contact `/contact`; one row at all widths (`gap-1 sm:gap-2`, `text-sm`, links `px-2.5 py-2`); active link `text-ink`, others `text-mute hover:text-ink`; `aria-current="page"` on the active link. One absolutely positioned 1px `bg-ink` underline element whose `transform: translateX(..) scaleX(..)` is set from the active link's measured `offsetLeft`/`offsetWidth` (`useLayoutEffect` + `ResizeObserver`), with `transition: transform 250ms cubic-bezier(0.77, 0, 0.175, 1)`; `transition: none` under reduced motion. Sticky top with `bg-bg/80 backdrop-blur-sm border-b border-line`. Leave an empty slot right of the links for the Task 9 toggle.
- `Footer` (server, drop `"use client"`): hairline top, name left (`text-mute text-sm`), icon links right: GitHub (`FaGithub`), LinkedIn (`FaLinkedinIn`), Instagram (`FaInstagram`), Facebook (`FaFacebook`), Email (`FiMail`, `mailto:`), each `aria-label`, `h-10 w-10` hit area, `text-mute hover:text-ink`. No RSS.

- [ ] **Step 1:** Add the ruled-list and `.press` CSS.
- [ ] **Step 2:** Create `Section.tsx`.
- [ ] **Step 3:** Rewrite `nav.tsx` (delete its font loaders and commented imports).
- [ ] **Step 4:** Rewrite `footer.tsx`.
- [ ] **Step 5:** Verify: typecheck passes. Browser at 390px: nav is one row and doesn't overflow; at 1440px, clicking About → Contact glides the underline; Tab through the nav shows focus outlines; the footer icons each announce their label (inspect the accessibility tree).
- [ ] **Step 6:** Commit: `feat(shell): add Section and ruled list styles, rebuild nav and footer`

---

### Task 3: Projects with peek and drawer

**Files:**
- Create: `app/lib/content/projects.ts`, `app/components/projects/ProjectList.tsx`, `app/components/projects/ProjectPeek.tsx`, `app/components/projects/ProjectPoster.tsx`
- Modify: `app/about/page.tsx` (swap the old `Projects` for `ProjectList` inside a `Section label="Projects"`, temporarily, until Task 6 moves it to Home)
- Delete: `app/components/Projects.tsx`, `app/components/project-data.tsx`

**Reuses:** `Section`, `.ruled`, `.ruled-arrow`, `.press` (Task 2); `framer-motion` (`useMotionValue`, `useSpring`, `useReducedMotion`, `AnimatePresence`).

**Interfaces:**
- Produces:
  ```ts
  export type ProjectLink = { label: string; url: string };
  export type Project = {
    slug: string; title: string; year: number; kind: "web" | "mobile";
    summary: string; description: string; stack: string[];
    links?: ProjectLink[]; image?: string; tint?: string; nda?: boolean;
  };
  export const projects: Project[];
  ```
  Data in this order: `adto` (tint `#1d3b6e`, links Website + Facebook from the old data), `lylas` (tint `#5a3a1a`, GitHub `https://github.com/JamesManon-og/FoodOrdering`), `pms` (`nda: true`, no links). Titles, summaries and descriptions verbatim from the spec.
- `ProjectPoster({ project, framed }: { project: Project; framed?: boolean })` (server-safe, no hooks): `image` → `next/image` cover; else a gradient from `tint` into `#0d0d0d` (NDA: 135° stripes `#161616`/`#101010`), `kind · year` in small mono at 75% opacity, title 19px/700, stack joined by ` · `. Text colour is always `#F5F0E8` (the poster is a dark object in both themes). `framed` adds a 14px window bar with three dots.
- `ProjectList({ projects }: { projects: Project[] })` (`"use client"`): `<ul className="ruled">`. Each `<li>` holds a `<button aria-expanded aria-controls className="press w-full text-left">` row with title (15px/500), summary (`text-mute`), year (`text-faint tabular-nums`), then a drawer region `id` with `grid-template-rows: 0fr → 1fr` (200ms `cubic-bezier(0.32, 0.72, 0, 1)`, instant under reduced motion) containing `ProjectPoster framed` (150px wide on `sm+`, full width on mobile), the description, stack and links (`↗`, `target="_blank" rel="noopener noreferrer"`). One drawer open at a time; Escape closes the open drawer and returns focus to its button.
- `ProjectPeek({ project }: { project: Project | null })` (`"use client"`): rendered by `ProjectList` only when `matchMedia("(hover: hover) and (pointer: fine)")` matches. Portal to `document.body`, `pointer-events: none`, 220×136px, `rotate(-2deg)`, translated `-50% -115%` from the cursor; position from `useSpring` (stiffness 300, damping 30) applied as a `transform` string; enter `opacity 0→1, scale .95→1` 150ms `cubic-bezier(0.23, 1, 0.32, 1)` with `transform-origin: bottom center`; exit 100ms; switching rows swaps content without replaying the enter; clamped inside the viewport. Reduced motion: fixed beside the hovered row, opacity only.

- [ ] **Step 1:** Create `projects.ts`.
- [ ] **Step 2:** Create `ProjectPoster.tsx`.
- [ ] **Step 3:** Create `ProjectList.tsx` and `ProjectPeek.tsx`; mount on `/about`; delete the two old files.
- [ ] **Step 4:** Verify (Review Focus 3): typecheck passes. Desktop: hovering rows shows the tilted poster following the cursor; moving between rows swaps it without re-popping. Playwright with `hasTouch: true, isMobile: true` at 390px: tapping a row opens its drawer, no peek element exists in the DOM, and tapping a second row closes the first. Keyboard: Tab to a row, Enter opens it, Tab reaches its links, Escape closes it and focus returns to the row button.
- [ ] **Step 5:** Commit: `feat(projects): add project list with cursor peek, poster fallback and drawer`

---

### Task 4: On repeat (Spotify recently played, top tracks, album-tinted lamp)

**Files:**
- Modify: `app/lib/spotify.ts`, `app/api/spotify/top-tracks/route.ts`
- Create: `app/api/spotify/recently-played/route.ts`, `app/lib/color.ts`, `app/components/OnRepeat.tsx`, `app/components/useLampTint.ts`
- Modify: `app/page.tsx` (replace `NowPlaying` + `SpotifyTopTracks` + the glass card with `<Section label="On repeat"><OnRepeat /></Section>`)
- Delete: `app/components/NowPlaying.tsx`, `app/components/SpotifyTopTracks.tsx`

**Reuses:** `getAccessToken`, `getTopTracks`, `getNowPlaying` (existing); `/api/spotify/now-playing` and `/api/spotify/top-tracks` (existing); `fast-average-color` (existing); `Section`, `.ruled`, `.ruled-arrow` (Task 2).

**Interfaces:**
- `spotify.ts`: replace every `any` with typed API shapes (`SpotifyApiTrack = { name: string; artists: { name: string }[]; album: { name: string; images: { url: string }[] }; external_urls: { spotify: string } }`) and a shared `toTrack(t: SpotifyApiTrack): SpotifyTrack`. Add:
  ```ts
  export type RecentTrack = SpotifyTrack & { playedAt: string };
  export async function getRecentlyPlayed(limit: number): Promise<RecentTrack[]>; // GET /me/player/recently-played?limit=
  ```
  It throws `SpotifyScopeError` on 401/403 and `Error` otherwise.
- `GET /api/spotify/recently-played?limit=5` → `200 { items: RecentTrack[] }`; on `SpotifyScopeError` → `403 { error: "scope" }`; other errors → `502 { error: "unavailable" }`. `limit` clamped 1–10. `revalidate = 60`.
- `top-tracks/route.ts`: validate `time_range ∈ {short_term, medium_term, long_term}` (else `short_term`), clamp `limit` 1–10.
- `color.ts` (pure, no imports): `export function clampLampColor(hex: string): string` → `rgb(r g b)` after HSL clamp: saturation ≤ 0.55, lightness clamped to [0.35, 0.60].
- `useLampTint(color: string | null): void` (`"use client"` hook): sets `style.setProperty("--lamp", clampLampColor(color))` on `document.querySelector("[data-lamp]")` when `color` is non-null, and removes the property on `null` and on unmount.
- `OnRepeat()` (`"use client"`):
  - Header row: Now playing (56px art, ≤ 4px radius; title; artist; link) when `/api/spotify/now-playing` says playing, else "Last played" from recently played, else (recently played failed) the #1 `short_term` top track labelled "#1 this month".
  - Text tabs with an underline for the active one: Recently played · 4 weeks · 6 months · All time; the Recently played tab is omitted when that route fails.
  - `<ol className="ruled">` of 5 tracks: 40px art, title, artist, `.ruled-arrow`, album-colour glow on hover (existing FastAverageColor approach, `crossOrigin: "anonymous"`).
  - Closing line from the spec copy.
  - Skeleton rows at final height while loading.
  - Total failure → "spotify's taking a break." + profile link.
  - Calls `useLampTint(dominantColor)` only while playing.
  - Polls now-playing every 30s, paused while `document.hidden`.

- [ ] **Step 1:** Type `spotify.ts`, add `getRecentlyPlayed` and the route; harden `top-tracks`.
- [ ] **Step 2:** Create `color.ts` and verify (Review Focus 5) with Node 24's built-in TS support:
  ```bash
  node --input-type=module -e "import {clampLampColor as c} from './app/lib/color.ts'; for (const h of ['#ffffff','#000000','#00ff00','#d6783c']) console.log(h, c(h));"
  ```
  Expected: every output's HSL has saturation ≤ 55% and lightness between 35% and 60% (e.g. `#00ff00` → a muted green, `#ffffff` → a mid grey, not white).
- [ ] **Step 3:** Create `useLampTint.ts` and `OnRepeat.tsx`; mount on `/`; delete the old two components.
- [ ] **Step 4:** Verify: typecheck and build pass. `curl -s localhost:3000/api/spotify/recently-played` returns either items or `{"error":"scope"}`; `curl -s "localhost:3000/api/spotify/top-tracks?limit=999&time_range=x"` returns at most 10 items.
- [ ] **Step 5:** Verify Review Focus 1 with the current token (which lacks the scope): the home page's header shows "#1 this month", the tab row has no "Recently played", and there's no console error beyond the handled 403. Then play a track on Spotify: the lamp eases to a muted album colour within ~1s, and eases back after pausing (within the 30s poll).
- [ ] **Step 6:** Commit: `feat(spotify): add recently played, merge music into On repeat and tint the lamp`

---

### Task 5: Shipping (GitHub contribution graph)

**Files:**
- Create: `app/lib/github.ts`, `app/components/ContributionGraph.tsx`
- Modify: `app/about/page.tsx` (temporary mount beneath Projects. `app/page.tsx` is still a client component until Task 6 and can't render an async server component; Task 6 moves the section to Home.)

**Reuses:** `Section` (Task 2); `contrib-0…4` tokens (Task 1); `socialLinks.github` (Task 1).

**Interfaces:**
- `github.ts`:
  ```ts
  export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
  export type ContributionCalendar = { total: number; weeks: { days: ContributionDay[] }[] };
  export async function getContributionCalendar(login: string): Promise<ContributionCalendar | null>;
  ```
  POST `https://api.github.com/graphql` with `Authorization: bearer ${process.env.GITHUB_TOKEN}`, query `user(login) { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } }`, `next: { revalidate: 3600 }`. Map `NONE|FIRST_QUARTILE|SECOND_QUARTILE|THIRD_QUARTILE|FOURTH_QUARTILE` → `0…4`. Returns `null` (never throws) when the token is missing, the response isn't OK, or the payload lacks `data.user`.
- `ContributionGraph({ login }: { login: string })` (async server component):
  - SVG grid of 53 weeks × 7 days, 10px cells, 3px gap, `rx=2`, `fill="rgb(var(--contrib-N))"`.
  - Each `<rect>` has a `<title>` like "12 contributions on Oct 3, 2026" (`Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })`).
  - Root `role="img" aria-label="{total} contributions in the last year"`.
  - Wrapped in an `overflow-x-auto` container with `dir="rtl"` on the scroller and `dir="ltr"` on the SVG, so narrow screens start at the most recent weeks.
  - Caption below: "{total} contributions in the last year · github ↗" (`text-faint`, link to `socialLinks.github`).
  - On `null`: caption only, reading "my contributions live on github ↗".
- `ContributionGraphSkeleton()`: same outer size, `bg-hi` block, no shift.

- [ ] **Step 1:** Create `github.ts`.
- [ ] **Step 2:** Create `ContributionGraph.tsx` (with the skeleton export); mount in a `Section label="Shipping"` on `/about` under Projects inside `<Suspense fallback={<ContributionGraphSkeleton />}>`.
- [ ] **Step 3:** Verify (Review Focus 2): with `GITHUB_TOKEN` unset, `/about` shows the fallback caption and the build passes; with a token in `.env.local`, the grid renders 53 columns, hovering a cell shows its tooltip, and at 390px the scroller opens on the newest weeks. typecheck and build pass.
- [ ] **Step 4:** Commit: `feat(github): add contribution graph from the GitHub GraphQL API`

---

### Task 6: Home page assembly

**Files:**
- Modify: `app/page.tsx` (becomes a server component)
- Create: `app/components/Hero.tsx`
- Modify: `app/about/page.tsx` (remove the temporary Projects and Shipping sections from Tasks 3 and 5)

**Reuses:** `Section`, `ProjectList` + `projects`, `ContributionGraph`, `OnRepeat`, `metaData.now`.

**Interfaces:**
- `Hero()` (server component, no hooks):
  - 56px avatar `next/image` from `/myprofile.jpg` (not `unoptimized`, `priority`).
  - `<h1>` with the full text "hey, i'm sid." in the DOM from first paint. The typing is **CSS only**: a `.type-once` class reveals the text with `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` over ~650ms using `steps(13, end)`, plus a `::after` cursor that blinks 3 times and then disappears (`animation-fill-mode: forwards`). Both are inside `@media (prefers-reduced-motion: no-preference)`; with reduced motion the text is simply shown, no cursor. No `react-type-animation`, no JS, no hydration risk. (Changed from the original plan's `TypeAnimation`: it renders empty on the server and needs extra code to avoid a flash and a reduced-motion mismatch.)
  - Size `text-[36px] sm:text-[46px]`, weight 650, `tracking-[-0.035em]`, one line ≥ 360px.
  - Bio paragraph (`text-mute`, 16px, `max-w-[540px]`), copy from the spec.
- `app/page.tsx` order: `Hero` → `<Section label="Now">` with `metaData.now` as plain text → `<Section label="Projects" id="projects"><ProjectList projects={projects} /></Section>` → `<Section label="Shipping"><Suspense …><ContributionGraph login="sidadrian3" /></Suspense></Section>` → `<Section label="On repeat"><OnRepeat /></Section>`. No `"use client"`, no framer-motion import.
- Section fade-up: one small client wrapper is **not** added; instead `global.css` gets `@supports (animation-timeline: view())` scroll-driven `opacity`/8px `translateY` reveal on `section` elements, disabled under reduced motion. (Keeps Home a pure server component.)

- [ ] **Step 1:** Create `Hero.tsx` and the `.type-once` CSS.
- [ ] **Step 2:** Rewrite `app/page.tsx`; move Projects and Shipping off `/about`; add the CSS scroll reveal.
- [ ] **Step 3:** Verify: typecheck and build pass; the build output lists `/` as static or ISR, not dynamic-only. At 1440×900, the hero, Now and the first project row are above the fold; at 390×844, the hero and Now are above the fold. Screen reader text of the h1 is "hey, i'm sid." from first paint.
- [ ] **Step 4:** Commit: `feat(home): assemble hero, now, projects, shipping and on repeat`

### ⏸ Checkpoint (after Task 6)

Capture Playwright screenshots of `/` at 1440×900 (fold and full page) and 390×844 (fold and full page), dark theme, and send them to Sid with a one-paragraph summary. **Wait for approval** before Task 7. Feedback that changes tokens, type or the ruled list is applied as a `fix(home): …` commit before continuing.

---

### Task 7: About page

**Files:**
- Create: `app/lib/content/experience.ts`, `app/lib/content/hobbies.ts`, `app/lib/content/photos.ts`, `app/components/PhotoStack.tsx`
- Modify: `app/about/page.tsx`
- Delete: `app/components/Timeline.tsx`, `app/components/timeline-data.tsx`

**Reuses:** `Section`, `.ruled`, `.press`; `next/image`.

**Interfaces:**
- `experience.ts`:
  ```ts
  export type TimelineEntry = { org: string; role: string; start: string; end?: string; line: string; current?: boolean };
  export const experience: TimelineEntry[]; // BANSAG (current), SAMAHAN Systems and Development, Orange & Bronze
  export const education: TimelineEntry[];  // Ateneo de Davao University, Brokenshire College of Toril
  ```
  Text verbatim from the spec, `[role]` and `[end]` placeholders kept.
- `hobbies.ts`: `export type Hobby = { title: string; line: string }; export const hobbies: Hobby[]` (4 items from the spec).
- `photos.ts`: `export type Photo = { src: string; alt: string; caption: string }; export const photos: Photo[]` for `/photos/photo1.jpg…photo4.jpg` with the existing alt text corrected to describe the actual images (group photo at an event hall; group selfie in a computer lab; IT Week 2025 audience; group selfie in a computer lab) and caption `"[event] · [place] · [date]"`.
- `PhotoStack({ photos }: { photos: Photo[] })` (`"use client"`):
  - First 3 photos absolutely stacked with rotations `-6deg, 3deg, -2deg`; 220×220 on mobile, 260×260 on `sm+`; ≤ 4px radius.
  - The top card is a `<button aria-pressed>` flipping on hover (pointer devices), focus and tap: `rotateY(180deg)`, `preserve-3d`, spring `{ duration: 0.5, bounce: 0.15 }`; the back shows the caption on `bg-hi`. Reduced motion: opacity crossfade.
  - Clicking the stack cycles the top photo; Enter/Space does the same.
  - Link "more photos →" to `/photos`.
- `app/about/page.tsx`:
  - h1 "about" (32px/650) + line.
  - `PhotoStack`.
  - `<Section label="Experience">` rows: dot (`bg-accent-now` if `current`, else `bg-faint`), org (15px/500), role (`text-mute`), years (`text-faint tabular-nums`, plus "now" when current), line.
  - `<Section label="Education">` with the same rows.
  - `<Section label="Off the clock">`: `grid sm:grid-cols-2 gap-6`, title + line.
  - Export `metadata = { title: "About", description: … }`.

- [ ] **Step 1:** Create the three content files.
- [ ] **Step 2:** Create `PhotoStack.tsx`.
- [ ] **Step 3:** Rewrite `app/about/page.tsx`; delete `Timeline.tsx` and `timeline-data.tsx`.
- [ ] **Step 4:** Verify: typecheck passes. Hover, Tab+Enter and tap all flip the top photo; with reduced motion emulated (`page.emulateMedia({ reducedMotion: "reduce" })`) the flip is a crossfade; "Food Ordering" no longer appears in the experience list; the current BANSAG row shows both the sage dot and "now".
- [ ] **Step 5:** Commit: `feat(about): add photo stack, experience, education and off the clock`

---

### Task 8: Photos and Contact pages

**Files:**
- Modify: `app/photos/page.tsx`, `app/contact/page.tsx`
- Create: `app/lib/content/contacts.ts`, `app/contact/CopyEmailButton.tsx`
- Delete: `app/components/image-grid.tsx`, `app/contact/grid-contacts.tsx`, `app/components/SpotlightCard.tsx`, `app/components/techStack.tsx`

**Reuses:** `photos` (Task 7), `socialLinks` (Task 1), `Section`, `.ruled`, `.ruled-arrow`, `.press`.

**Interfaces:**
- `/photos`: h1 "photos" + line; `grid grid-cols-2 sm:grid-cols-3 gap-4`; each photo once as `<figure>` with `next/image` (`sizes="(min-width: 640px) 33vw, 50vw"`, `aspect-square object-cover`, ≤ 4px radius) and `<figcaption className="text-faint text-sm">`.
- `contacts.ts`: `export type ContactRow = { label: string; handle: string; href: string; copy?: boolean }; export const contacts: ContactRow[]`. Rows built from `socialLinks`: Email `sidadrian3@gmail.com` (copy), LinkedIn `sid-adrian-digamon`, GitHub `sidadrian3`, Instagram `@sidadrian`, Facebook `adrian.digamon`.
- `CopyEmailButton({ email }: { email: string })` (`"use client"`):
  - Writes to `navigator.clipboard`; label "copy" → "copied" for 1500ms with a 150ms opacity + `blur(2px)` crossfade.
  - `aria-live="polite"` status.
  - Falls back to `location.href = mailto:` when the Clipboard API is unavailable or rejects.
  - `.press`, ≥ 40px hit area.
- `/contact`: h1 "contact" + line; `<ul className="ruled">` rows of `grid grid-cols-[96px_1fr_auto]`: label (`text-faint`), handle (link, `text-ink`), then `CopyEmailButton` or `.ruled-arrow` `↗`.

- [ ] **Step 1:** Rewrite `/photos`.
- [ ] **Step 2:** Create `contacts.ts` and `CopyEmailButton.tsx`; rewrite `/contact`; delete the four files.
- [ ] **Step 3:** Verify: typecheck and build pass. `/photos` shows exactly 4 figures. On `/contact`, clicking copy puts `sidadrian3@gmail.com` on the clipboard (Playwright with `clipboard-read` permission: `await page.evaluate(() => navigator.clipboard.readText())`) and shows "copied"; every external link opens in a new tab; no text reads `@yourusername` or `Your Name`.
- [ ] **Step 4:** Commit: `feat(pages): rebuild photos and contact with ruled rows and copy email`

---

### Task 9: Light theme, toggle and final sweep

**Files:**
- Create: `app/components/ThemeToggle.tsx`
- Modify: `app/components/ThemeProvider.tsx` (remove `forcedTheme`), `app/components/nav.tsx` (mount the toggle), any file the sweep finds
- Delete: `app/components/SectionLabel.tsx` and anything else under `app/components/` no longer imported

**Reuses:** `next-themes` `useTheme`; `react-icons/fi` `FiSun` / `FiMoon`; `.press`.

**Interfaces:**
- `ThemeToggle()` (`"use client"`):
  - Icon button, `aria-label` "Switch to light theme" / "Switch to dark theme", `h-10 w-10`, `.press`.
  - Renders a same-size placeholder until mounted (avoids hydration mismatch).
  - The icon swaps with a 150ms opacity crossfade.

- [ ] **Step 1:** Create `ThemeToggle.tsx`, mount it in the nav slot, remove `forcedTheme`.
- [ ] **Step 2:** Sweep: `grep -rnE "text-white|bg-black|bg-white|neutral-|white/|black/|#[0-9a-fA-F]{3,6}" app --include=*.tsx` → replace with tokens; allowed hits are content tints in `app/lib/content/` and the poster's fixed `#F5F0E8`/`#0d0d0d`. `grep -rn "rounded-full\|rounded-xl\|rounded-2xl" app` → only the avatar may stay `rounded-full`.
- [ ] **Step 3:** Delete unimported components (`grep -rL` each file under `app/components/` against imports); confirm `SectionLabel`, `SpotlightCard`, `GrainOverlay`, `techStack` are gone.
- [ ] **Step 4:** Verify (Review Focus 4): typecheck and build pass. Playwright with a fresh context: the first load of `/` is dark with no light frame (screenshot right after `domcontentloaded`); clicking the toggle switches to light; a reload stays light; every route is checked in light at 390 and 1440 for unreadable text (body contrast spot-check with the DevTools contrast picker on `mute` and `faint` text: ≥ 4.5:1).
- [ ] **Step 5:** Commit: `feat(theme): add light theme toggle and remove leftover hard-coded colours`

---

## Self-review notes

- **Spec coverage.** Every spec section maps to a task:
  - Tokens, font and atmosphere: 1
  - Nav, footer and ruled lists: 2
  - Project peek: 3
  - Spotify and lamp: 4
  - GitHub: 5
  - Home: 6
  - About: 7
  - Photos and Contact: 8
  - Light toggle and sweep: 9
  - Config, dead-code, sitemap and `.gitignore` fixes: 1 and 8–9
  - Copy: Tasks 3 and 6–8 use it verbatim
- **Change from the 10-step outline agreed earlier.** The "content files" step is folded into the tasks that use each file (3, 7, 8), so a content file never lands without its consumer. That makes 9 tasks, with the checkpoint after the home page (now Task 6).
- **Task 5 mounting.** The graph is an async server component and `page.tsx` is still a client component until Task 6, so Task 5 mounts it temporarily on `/about` and Task 6 moves it.
