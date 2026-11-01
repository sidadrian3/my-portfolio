# Portfolio Redesign Design Spec

## Intent

The site drifted from its inspiration (phillipche.com) into a generic dark "Apple glass" template: a centred hero that fills the first screen, a looping typewriter, glass cards nested three deep, mono-caps eyebrow labels, hidden project descriptions, placeholder contact data and low-contrast text.

This redesign returns to the reference's structure (narrow left-aligned column, real headings in a label column, quiet lists, personal voice) while keeping Sid's palette (black + warm off-white `#F5F0E8`) and the Spotify work. It must serve two readers at once: friends and peers (personality first) and recruiters (work proof visible on the home page, history one click away).

## Goals

- Home page shows who Sid is, what he's doing now, his projects and his activity without scrolling past an empty hero.
- Projects can be "peeked" at: a preview follows the cursor on desktop; touch and keyboard users get an inline drawer.
- About reads as structured history: Experience, Education, Off the clock.
- Light and dark themes from one token system, dark by default, with a toggle.
- Live data: Spotify (now playing → recently played fallback, top tracks) and GitHub contributions.
- Every placeholder, dead link and broken config value is fixed.
- WCAG AA contrast in both themes, full keyboard access, `prefers-reduced-motion` honoured.

## Non-goals

- No blog. The dead blog/RSS plumbing is removed, not rebuilt.
- No real project screenshots or photo captions yet (Sid adds them later; the design ships with fallbacks and placeholders).
- No dependency removal. Unused packages (`next-mdx-remote`, `katex`, `react-tweet`, …) stay in `package.json`; both lockfiles exist and Vercel builds with pnpm, so pruning is a separate task.
- No CMS. Content lives in typed data files.

## Anti-goals (failure even if it works)

- Anything that looks "vibe-coded": rounded outlined pills, badges, chips, glass cards, glow blobs.
- Information that only exists inside a hover effect.
- A first screen that is mostly empty space.
- Invented facts in the copy (no made-up numbers, ranks or roles).

---

## Global system

### Theme and tokens

- `next-themes` (already installed), `attribute="class"`, `defaultTheme="dark"`, `enableSystem={false}`, `disableTransitionOnChange`, `suppressHydrationWarning` on `<html>`. The toggle persists the visitor's choice. Dark values live in `:root`, light values in `.light` (see Design pass).
- All colour comes from CSS variables in `app/global.css`, exposed to Tailwind as semantic names. No component uses `text-white/…`, `bg-black` or raw hex again.

| Token | Dark (default) | Light |
|---|---|---|
| `--bg` | `#000000` | `#F5F0E8` |
| `--ink` (primary text) | `#F5F0E8` | `#141210` |
| `--mute` (body text) | ink at 66% (≈7.8:1) | ink at 68% (≈6:1) |
| `--faint` (dates, meta) | ink at 52% (≈4.8:1) | ink at 62% (≈4.6:1) |
| `--line` (hairline rules) | ink at 12% | ink at 12% |
| `--hi` (hover wash) | ink at 6% | ink at 5% |
| `--glow` (lamp light RGB) | `245 240 232` | `245 240 232`, drawn darker via opacity/blend |
| `--grain-opacity` / blend | `.07` / `screen` | `.09` / `multiply` |
| `--contrib-0…4` | `ink/7%`, `#1f3a2b`, `#2e5a3f`, `#4a8a5f`, `#7bbf8a` | `ink/7%`, `#c9dcc8`, `#9cc19f`, `#5f9a6c`, `#3a6e48` |

Accent colours for the experience dots: current role = sage `#7bbf8a` (dark) / `#3a6e48` (light); past = `--faint`.

Text selection uses ink on a low-opacity ink background, replacing the off-palette `#47a3f3` blue.

### Typography

- **Roboto Flex only**, loaded once in `app/layout.tsx` as a variable font (`next/font/google`, no fixed weights, `display: swap`). Remove Inter and Jockey One and the duplicate font loaders in `ClientLayout.tsx` and `nav.tsx`.
- Headings: weight ~650, tracking `-0.03em`. Body: 400, 15–16px, line-height 1.6. Meta (years, counts): `tabular-nums`, `--faint`.
- No mono uppercase eyebrow labels anywhere.
- Scale: hero h1 46px desktop / 36px mobile; page h1 32px; section label 15px/600; row title 15px/500; body 15px; meta 13px.

### Layout grammar

- Single column, `max-width: 720px`, centred on the page, content left-aligned, 16px side gutter on mobile, 28px on desktop.
- **Section** = label column (120px) + content at ≥ 640px; below that the label stacks above the content. Sections are separated by a hairline `--line` rule.
- **Ruled index list** (the one list style for projects, tracks, experience, education, contact): rows divided by hairlines, optional `01`-style index or year in `--faint`. Hovering or focusing a row dims its siblings to ~45% opacity and slides in a `↗` arrow on linked rows.
- **No rounded outline pills or badges.** Tags render as plain text joined by ` · `. Corner radius on anything that remains a surface is ≤ 4px.

### Atmosphere

- **Grain:** a CSS background on a `body::before` layer (`pointer-events: none`), not a fixed DOM element at `z-[100]`. Film grain in dark (`screen`), paper grain in light (`multiply`), opacity from tokens.
- **Lamp light:** a radial gradient at the top of the page (no `blur()` filter), colour `rgb(var(--glow) / α)`. Replaces the blurred blob and the radial background in `ClientLayout`.
- **Album-tinted lamp (home only):** while a track is playing, `--glow` eases (~800ms) to the album's dominant colour, with saturation and lightness clamped so it stays a hint; it eases back to cream when playback stops or the visitor leaves the home page. Reduced motion: switch without easing.

### Navigation

- Left: `sid.` (heading weight), links home.
- Right: Home · About · Photos · Contact, then the sun/moon theme toggle (icon button with `aria-label`, ≥ 40px hit area).
- Active tab: a 1px underline that glides between tabs (CSS `transform` transition; see Design pass); jumps instantly under reduced motion.
- One row at every width (no wrapping to two rows on mobile).
- The nav lives outside the per-route animated region, so it doesn't remount or fade on navigation (fixes `ClientLayout` keying the whole tree on `pathname`).

### Footer

Hairline rule, name on the left, icon links on the right: GitHub, LinkedIn, Instagram, Facebook, Email, each with an `aria-label`. No RSS.

### Motion budget

| Motion | Where | Reduced motion |
|---|---|---|
| Name types once, cursor blinks then stops | Home hero | Full text shown immediately |
| Section fade-up on first view (opacity + ≤ 12px translate, once) | All pages | Opacity only, or none |
| Project preview follows cursor (spring, slight tilt) | Projects, pointer devices | Preview appears fixed beside the row without following |
| Drawer open/close | Projects, touch/keyboard | Instant |
| Photo stack flip | About | Crossfade to caption side |
| Nav underline glide | Nav | Instant jump |
| Sibling dim + arrow slide | Ruled lists | Dim only |
| Album glow on track hover | On repeat | Kept (colour only) |
| Lamp light colour ease | Home | Instant |

Only `transform` and `opacity` animate (plus the lamp's background colour).

---

## Pages

### Home (`/`)

Order:

1. **Hero:** avatar (56px, in colour, no grayscale) → h1 "hey, i'm sid." typed once → bio paragraph. The h1's accessible text is the full static string; the typing animation is `aria-hidden`.
2. **Now** section: one line, text from `config.ts` (`now` field) so Sid can edit it without touching components.
3. **Projects** section: ruled list, each row shows title, one-line summary and year. See *Project peek* below.
4. **Shipping** section: GitHub contribution graph + "N contributions in the last year · github ↗".
5. **On repeat** section: Spotify (see below), ending with the line "music depends on the mood. it always ends up at daniel caesar."

The page becomes a server component; interactive parts are client islands (`Hero` typing, `ProjectList`, `OnRepeat`, lamp-tint hook).

### Project peek

- **Data:** each project has `slug`, `title`, `year`, `kind` (web / mobile), `summary` (one line, always visible), `description` (longer), `stack: string[]`, `links?: {label, url}[]`, `image?: string`, `tint: string` (poster colour), `nda?: boolean`.
- **Desktop (`(hover: hover) and (pointer: fine)`):** hovering a row shows a ~220×136px preview that follows the cursor with a spring and a −2° tilt, rendered in a portal and clamped inside the viewport. If `image` exists it shows the image; otherwise a **poster**: `tint`-coloured gradient, kind + year in small mono, title in heading weight, stack line. NDA projects use a striped neutral poster. Clicking the row opens the drawer as well (so links are reachable without leaving hover).
- **Touch and keyboard:** each row is a `<button aria-expanded aria-controls>` that opens an inline drawer: preview (image or poster in a minimal window frame), full description, stack, links. Enter/Space toggles; one drawer open at a time is the builder's call.
- The summary is always in the row, so the preview never holds information found nowhere else.

### On repeat (Spotify)

- Header row: **Now playing** (album art 56px, title, artist, live link) when playing; otherwise **Last played** from recently played.
- Tabs as plain text with an underline: Recently played · 4 weeks · 6 months · All time. Default tab: Recently played.
- List: ruled index, 5 tracks, album art 40px (≤ 4px radius), title, artist, `↗` on hover, album-colour glow on hover (kept from today).
- **New:** `GET /api/spotify/recently-played` → `getRecentlyPlayed(limit)` in `app/lib/spotify.ts`. Requires scope `user-read-recently-played`.
- **Fallbacks:** if recently played fails (e.g. 401/403 before the token is regenerated), the header falls back to the #1 top track (4 weeks) and the Recently played tab is hidden. If Spotify fails entirely, the section shows "spotify's taking a break." with a link to the profile. No dead grey boxes.
- Loading states keep the final row heights (no layout shift).

### Shipping (GitHub contributions)

- `app/lib/github.ts`: `getContributionCalendar(login)` calls GitHub GraphQL `user.contributionsCollection.contributionCalendar` with `GITHUB_TOKEN` (server only), cached with `next: { revalidate: 3600 }`. Login: `sidadrian3`.
- Rendered by a **server component** directly on the home page (no API route needed), wrapped in `Suspense` with a fixed-size skeleton.
- SVG grid, 53 weeks × 7 days, ~10px cells, 3px gap, ≤ 2px radius, colours `--contrib-0…4` by GitHub's quartile level. Each cell has a `<title>` ("12 contributions on Oct 3, 2026"). The SVG has `role="img"` and an `aria-label` with the yearly total.
- Narrow screens: the most recent weeks are visible first (scroll container starting at the right end, or fewer weeks shown; builder's call).
- Failure or missing token: render the caption line only, linking to the GitHub profile.

### About (`/about`)

1. Page heading "about" + one line.
2. **Photo stack:** 3 photos, tilted (−6°, 3°, −2°), overlapping. Hover/focus/tap flips the top photo to show its caption (event · place · date placeholders). "more photos →" links to `/photos`. Each photo is a focusable button with alt text.
3. **Experience:** ruled list; each row: dot (sage if current), organisation, role, years, one line.
4. **Education:** same row style.
5. **Off the clock:** 2×2 grid at ≥ 640px, 1 column below; title + one line each. No invented stats.

The Food Ordering system is removed from the timeline (it lives in Projects).

### Photos (`/photos`)

Heading + one line, then each photo **once** in a responsive grid (2 columns mobile, 3 desktop), each a `<figure>` with a `<figcaption>` placeholder `[event] · [place] · [date]`. Photo data (src, alt, caption) lives in one shared file used by About and Photos.

### Contact (`/contact`)

Heading + one line, then a ruled list:

```
Email      sidadrian3@gmail.com      [copy]
LinkedIn   sid-adrian-digamon        ↗
GitHub     sidadrian3                ↗
Instagram  @sidadrian                ↗
Facebook   adrian.digamon            ↗
```

The copy button writes the email to the clipboard and shows "copied" for ~1.5s, announced via `aria-live="polite"`; it falls back to a `mailto:` link if the Clipboard API is unavailable.

---

## Fixes (independent of layout)

- `config.ts`:
  - `baseUrl` → `https://my-portfolio-sepia-zeta-23.vercel.app`
  - `title` → `Sid Adrian Digamon`, `name` → `Sid`, new description
  - `socialLinks`: drop the fake `twitter` key; `github` → `https://github.com/sidadrian3` (the current `siddigamon` 404s), `instagram` → `https://www.instagram.com/sidadrian/`, `facebook` → `https://www.facebook.com/adrian.digamon`, keep `linkedin` and `email`
  - add `now`
- Contact placeholders (`@yourusername`, `Your Name`) replaced.
- Fake `https://github.com` project link removed; the NDA project shows no links.
- Remove dead blog/feed plumbing:
  - the RSS/Atom/JSON `<link>`s in `layout.tsx`
  - the RSS icon in the footer
  - the feed rewrites in `next.config.ts`
  - `/blog` and blog posts in `sitemap.ts` (add `/contact`)
  - `app/lib/posts.ts`, `app/components/mdx.tsx`, `app/components/caption.tsx`
- Delete components the new design replaces:
  - `GrainOverlay`, `SpotlightCard`, `SectionLabel`, `techStack`
  - `image-grid`, `Timeline` + `timeline-data`
  - `Projects` (replaced)
  - `NowPlaying` + `SpotifyTopTracks` (merged into `OnRepeat`)
  - `contact/grid-contacts`
- Remove undefined classes (`no-scrollbar`, `shadow-apple-glow`) and the `apple-*` tokens/fonts in `tailwind.config.js`.
- Replace `any` in touched files (`spotify.ts` mappers, `Projects`, `footer`); type the `cx` helper or delete it (it's unused).
- Remove the commented-out `icons` block and commented imports.

---

## Copy drafts (Sid to edit)

**Meta description:** cs grad from ateneo de davao building back-ends. projects, experience, and what i'm listening to.

**Home**
- h1: hey, i'm sid.
- bio: cs grad from ateneo de davao. i build back-ends, lift, run, and eat an honestly concerning amount of chicken and steak.
- Now: starting BANSAG with my friends from school
- Projects:
  - **ADTO** (2025): every Ateneo event in one place. back-end, admin team.
    *Drawer:* A centralized platform for discovering and joining Ateneo de Davao University events, built under SAMAHAN Systems Development. I worked on the Admin team's back-end. · React · NestJS · PostgreSQL · Website ↗ · Facebook ↗
  - **Lyla's Food Ordering & Inventory** (2024): orders and stock for a real bakery, built for SAD II.
    *Drawer:* A food ordering and inventory management app for Lyla's Cakes, Pastries and Breads, built for System Analysis and Design II. · React Native · Supabase · PostgreSQL · GitHub ↗
  - **Project Management System** (2024): for an enterprise client. under NDA, so no screenshots, sorry.
    *Drawer:* A project management system for an enterprise client. I worked mostly on the back-end. · Next.js · Nest.js
- Shipping caption: {n} contributions in the last year · github ↗
- On repeat line: music depends on the mood. it always ends up at daniel caesar.

**About**
- h1: about · line: the longer version.
- Experience:
  - **BANSAG**, [role], 2026–, a startup we're planning as a group of fresh grads, building systems for our community.
  - **SAMAHAN Systems and Development**, Back-end developer, 2025, one of the developers behind ADTO.
  - **Orange & Bronze**, Software engineering intern, 2025, internship at a Makati-based software company.
- Education:
  - **Ateneo de Davao University**, BS Computer Science, 2022–[end]
  - **Brokenshire College of Toril**, Senior high, STEM strand, 2020–[end]
- Off the clock:
  - **gym & running**: the only reason i can justify the chicken and steak.
  - **games**: AAA story games solo. valorant when the squad's online. rank: don't ask.
  - **music**: random, depends on the mood. always settles on daniel caesar.
  - **food**: chicken or steak. that's the whole menu.

**Photos:** h1 photos · line: bits of the last few years. · captions `[event] · [place] · [date]`

**Contact:** h1 contact · line: best way to reach me is email. i actually reply.

`[bracketed]` text is a placeholder Sid fills in.

---

## Design pass adjustments (Step 3.5)

These come from the `design-taste-frontend`, `emil-design-eng`, `ui-ux-pro-max` and `ui-styling` critiques and override anything above that conflicts.

### Tokens and theming (`ui-styling`)

| Before | After | Why |
| --- | --- | --- |
| Light values in `:root`, dark in `.dark` | **Dark values in `:root`**, light values in `.light` | First paint and no-JS render are dark, matching the default; no flash |
| Tokens as full colour strings | Base colours as RGB channels (`--ink: 245 240 232`), Tailwind maps `ink: "rgb(var(--ink) / <alpha-value>)"` | `text-ink/60`-style opacity utilities work against tokens |
| `--mute` / `--faint` derived ad hoc | Explicit `mute` and `faint` tokens per theme with the contrast values in the table | Contrast stays guaranteed and reviewable in one place |
| No `color-scheme` | `color-scheme: dark` on `:root`, `light` on `.light` | Native scrollbars and form controls match the theme |
| Theme switch animates every colour | `next-themes` `disableTransitionOnChange` | Avoids a staggered cross-fade of every element on toggle |

### Motion (`emil-design-eng`)

| Before | After | Why |
| --- | --- | --- |
| Nav underline via framer `layoutId` | One persistent underline element moved with a **CSS `transform` transition**, 250ms `cubic-bezier(0.77, 0, 0.175, 1)`, positioned from measured tab offsets | `layoutId` runs on the main thread and drops frames exactly when a new route is loading; the nav no longer remounts, so a CSS transition works |
| Peek appears with spring scale | Enter: `opacity 0 → 1`, `scale(0.95) → 1`, 150ms `cubic-bezier(0.23, 1, 0.32, 1)`, `transform-origin: bottom center`. Exit 100ms. Position follows the cursor via `useSpring` (`stiffness ~300, damping ~30`) applied as a `transform` string | Never appear from nothing; exit faster than enter; origin points at the cursor |
| Peek re-animates when moving between rows | Moving from one row to the next swaps poster content **instantly** without replaying the enter animation (tooltip pattern) | Feels faster; the animation only marks the first appearance |
| All hover effects always on | Peek, sibling dim and arrow slide gated behind `@media (hover: hover) and (pointer: fine)`; the same dim applies on `:focus-visible` | Touch devices fire false hovers |
| Drawer animates height | Grid-rows technique (`grid-template-rows: 0fr → 1fr`), 200ms `cubic-bezier(0.32, 0.72, 0, 1)`; instant under reduced motion | The one accepted non-transform animation; short, occasional, and avoids measuring heights |
| Photo flip | `rotateY` with `preserve-3d`, spring `{ duration: 0.5, bounce: 0.15 }`; reduced motion → crossfade | Physical, interruptible |
| Lamp tint via a variable on `<html>` | Registered `@property --lamp { syntax: '<color>' }` set **on the lamp element only**, `transition: --lamp 800ms ease`; alpha applied with `color-mix()` | A variable on the root recalculates styles for the whole page; gradients can't transition, but a typed custom property can |
| Typing speed unspecified | ~50ms per character (≈650ms for "hey, i'm sid."), cursor blinks 3 times, then fades | Short enough to never block reading |
| Section fade-ups | Once, `opacity` + 8px `translateY`, 300ms ease-out, 50ms stagger between rows, never delays interaction | Keeps reading content immediately available |
| Pressables have no press state | Rows, copy button and theme toggle: `scale(0.97)` on `:active`, 160ms ease-out | Confirms the click was heard |
| "copied" swaps abruptly | 150ms opacity crossfade with `blur(2px)` mid-transition | Masks the two-state swap |
| `transition: all` (current code) | Name exact properties everywhere | Avoids animating layout by accident |

### UX and accessibility (`ui-ux-pro-max`, web-relevant checks)

- **Colour is never the only signal:** the current-role dot is paired with the text "now" in the year column; contribution cells have `<title>` text and the yearly total is printed.
- **Hit areas ≥ 40px** for icon-only controls (theme toggle, footer icons, copy button), even when the glyph is 18–20px.
- **Visible focus:** a 2px `ink` outline with 2px offset on every interactive element, both themes.
- **Sticky nav:** `scroll-margin-top` on sections so anchor jumps don't hide headings under the nav.
- **Spacing rhythm:** 4/8px steps; section gaps 48px (mobile) / 64px (desktop); row padding 12px.
- **One icon family:** `react-icons` stays; brand logos from `fa6`, UI glyphs (arrow, copy, sun/moon) from `fi` (Feather). No mixing within a level.
- **Loading states** reserve their final height (Spotify rows, contribution graph) so nothing shifts.

### Taste audit (`design-taste-frontend`)

- Retires: centred hero by reflex (LAY-002); first viewport failure (LAY-003); decorative mono eyebrows; glass/blur effect stacking (VIS-013); radius monoculture (VIS-011); contrast sacrificed for a muted look (VIS-004).
- Watch during build: three ruled-list sections stacked on Home (Projects, Shipping, On repeat) could become monotonous. Shipping breaks the rhythm with the graph, and On repeat with album art. Keep those visual carriers; don't add a fourth plain list.
- Headline measure: "hey, i'm sid." must stay on one line at every width ≥ 360px.

## Files touched (expected)

| Area | Files |
|---|---|
| Tokens, theme, type | `app/global.css`, `tailwind.config.js`, `app/layout.tsx`, `app/components/ClientLayout.tsx`, new `app/components/ThemeProvider.tsx`, new `app/components/ThemeToggle.tsx` |
| Shell | `app/components/nav.tsx`, `app/components/footer.tsx`, new `app/components/Section.tsx` |
| Config and content | `app/config.ts`, `app/components/project-data.tsx` → `app/lib/content/projects.ts`, new `app/lib/content/experience.ts`, new `app/lib/content/photos.ts`, new `app/lib/content/hobbies.ts` |
| Home | `app/page.tsx`, new `app/components/Hero.tsx`, new `app/components/projects/*` (list, peek, poster, drawer), new `app/components/OnRepeat.tsx`, new `app/components/ContributionGraph.tsx`, new lamp-tint hook |
| Data | `app/lib/spotify.ts`, new `app/api/spotify/recently-played/route.ts`, new `app/lib/github.ts` |
| Pages | `app/about/page.tsx`, new `app/components/PhotoStack.tsx`, `app/photos/page.tsx`, `app/contact/page.tsx`, new `app/contact/CopyEmailButton.tsx` |
| Cleanup | `next.config.ts`, `app/sitemap.ts`, deletions listed under Fixes, `.gitignore` (add `.superpowers/`) |

## Builder's calls (made without Sid; flag if wrong)

- Content moves to `app/lib/content/*.ts` so copy edits never touch components.
- One drawer open at a time.
- Contribution graph is a server component, not an API route.
- Experience dot colours: sage for current, faint for past (the old rainbow colours are dropped).
- The top-tracks route's `limit` is clamped to 1–10 and `time_range` validated against the three allowed values.
- Album colour clamp for the lamp: convert to HSL, cap saturation at 55%, clamp lightness to 35–60%, render at ≤ 14% alpha.
- Poster tints: ADTO `#1d3b6e`, Lyla's `#5a3a1a`, Project Management System uses the striped neutral NDA poster. Project order: ADTO, Lyla's, PMS.
- The hero avatar (`/myprofile.jpg`, alt "Sid Adrian Digamon") is not a link (it pointed at Facebook-as-Twitter before).

## Setup only Sid can do

1. Regenerate the Spotify refresh token with scopes `user-read-currently-playing user-top-read user-read-recently-played`; update `SPOTIFY_REFRESH_TOKEN` in `.env.local` and on Vercel. Until then, the recently-played fallback logic applies.
2. Create a GitHub fine-grained token (no repository access needed, public data only) and set `GITHUB_TOKEN` in `.env.local` and on Vercel.

## Open assumptions

- BANSAG role, education end years, photo captions and project images are placeholders.
- The production URL is the repo's Vercel homepage alias; a custom domain later is a one-line change.
