# About Motion and Snapshots First Implementation Plan

> **For agentic workers:** Implement task-by-task in this session (small-change lane). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On `/about`, put the Snapshots photo fan directly under the page header, and give the Experience and Education timelines a staggered entrance with a drawn rail line, plus a slide-and-light-up hover.

**Architecture:** One small client component, `TimelineReveal`, watches its timeline and flips `data-reveal` from `idle` to `play` once, the same pattern as `ContributionGrid`'s wave. All motion is CSS: the entrance in `global.css`, the hover as Tailwind `group-hover` utilities. Everything else stays a server component.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind 3 (`future.hoverOnlyWhenSupported`), `next-themes`.

**Canvas:** https://claude.ai/artifact/C9Tei4oUmsaBsgKu7ARTMK (artboard "D · C with Snapshots first, motion options").

## Design

**What.** `/about` becomes, in order: header, **Snapshots**, **Experience**, **Education**, **Off the clock**.

- **Snapshots** moves to directly under the header, unchanged apart from position. The four photos get `priority` (they are now the first thing on the page).
- **Entrance (Stagger + line draw).** Each timeline plays once, on its own, the first time it is at least 30% on screen. Each row's text and year fade up 8px over 560ms (`cubic-bezier(0.23, 1, 0.32, 1)`), row `i` delayed `i × 90ms`. Each dot pops in (scale 0.4 to 1, 320ms, overshoot curve) 60ms before its row. Each rail segment draws downward (`scaleY` 0 to 1 from the top, 520ms). Education starts at 0ms from its own trigger.
- **Hover (Slide + Light up).** Per row: the dot fills with `ink` and its border goes `ink`, scaling to 1.3; the year goes `ink`; role and line go `ink/85`; the text block slides 4px right. Colour 200ms, transforms 200 to 220ms. No sibling dimming.
- **Scroll reveal.** The global `section` scroll-driven reveal is switched off on the Experience and Education sections (`[animation:none]`), so rows are not animated twice. Other sections keep it.

**Why.** The owner finds the top of `/about` boring; the photo fan is the most visual block, so it leads. The timelines are static; a staggered entrance and a hover highlight make them feel alive without dimming anything (earlier feedback: dimmed siblings "seem off").

**Decisions from the grilling round.**
- Each timeline triggers on its own (no shared 270ms offset for Education as in the canvas, which assumed both were on screen).
- The four fan photos get `priority`.

**Assumptions (builder's calls).**
- No JavaScript: rows are visible and static. Hidden state only applies under `@media (scripting: enabled)`, as for the contribution grid.
- Reduced motion: no entrance, no slide, no scale. The hover colour change stays (it is not motion).
- Touch: no hover; `hoverOnlyWhenSupported` drops `group-hover:`.
- Per-row delay is passed as a `--i` CSS variable, the one inline `style` (genuinely per-item).
- The page is mostly static HTML before hydration, so rows are hidden between first paint and the observer firing (a few frames). Accepted.
- `[end]` education years and photo captions remain placeholders.

## Global Constraints

- Only `TimelineReveal.tsx` is `"use client"`; `PhotoFan`, `Section` and `page.tsx` stay server components.
- Tailwind utilities first; `global.css` only for the entrance keyframes and states, which need `data-reveal` selectors.
- Animate `transform` and `opacity` only. Honour `prefers-reduced-motion`.
- Colours from existing tokens only; the hover fill uses `ink`, so it works in light and dark.
- Commits: `feat(about): ...`, staged files only. The owner's standing rule on attribution lines applies: no Co-Authored-By or Claude attribution lines in commits.

## Review Focus

1. **No double animation:** Experience and Education sections have no scroll-driven reveal (`getComputedStyle(section).animationName === "none"`); other sections still do.
2. **Entrance plays once, per timeline, and hover works afterwards:** the `backwards` fill must not leave the hover transform overridden (hover after the entrance finishes still scales the dot and slides the text).
3. **Reduced motion and no-JS:** all rows visible and static; hover does not move anything under reduced motion.
4. **Fan at the top:** no horizontal scroll at 360 and 390; hovered photo still clears the "Snapshots" heading.
5. **Both themes:** hover fill and rail line are visible in light and dark.
6. **No flash:** with the page scrolled to Experience on load, rows are not stuck hidden.

---

### Task 1: Snapshots first, photos preload

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `app/components/PhotoFan.tsx`

**Builds on:** `Section` (`stacked`, `className`), `PhotoFan`, `PageHeader`.

- [ ] **Step 1:** In `PhotoFan.tsx`, add `priority` to the `<Image>`.
- [ ] **Step 2:** In `page.tsx`, move `<Section label="Snapshots" stacked className="text-center"><PhotoFan photos={photos} /></Section>` to directly after `PageHeader`.
- [ ] **Step 3:** Run `npm run typecheck`. Expected: exit 0.
- [ ] **Step 4: Commit**

```bash
git add app/about/page.tsx app/components/PhotoFan.tsx
git commit -m "feat(about): put the snapshots fan first"
```

### Task 2: Timeline entrance and hover

**Files:**
- Create: `app/components/TimelineReveal.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/global.css`

**Builds on:** `ContributionGrid`'s observer pattern (`app/components/ContributionGrid.tsx:71-90`), the global `rise` keyframes and easing, `Section`'s `className`.

**Interfaces:**
- Produces: `export function TimelineReveal({ children }: { children: React.ReactNode })`, a client component rendering `<div data-reveal={phase}>{children}</div>`, where `phase` is `"idle" | "play" | "done"`.

- [ ] **Step 1: Create `TimelineReveal`.** `"use client"`. State `phase` starts `"idle"`. In `useEffect`: if reduced motion matches or `IntersectionObserver` is missing, `setPhase("done")` and return; otherwise observe the wrapper with `{ threshold: 0.3 }`, on first intersect `setPhase("play")` and disconnect; clean up on unmount. Short comment: the wave pattern is reused, plays once.
- [ ] **Step 2: Entrance CSS in `global.css`**, inside `@media (prefers-reduced-motion: no-preference) { @media (scripting: enabled) { … } }`, placed after the contribution-grid block:
  - `[data-reveal="idle"] :is(.tl-text, .tl-dot, .tl-line) { opacity: 0 }`
  - `[data-reveal="play"] .tl-text { animation: rise 560ms cubic-bezier(0.23, 1, 0.32, 1) backwards; animation-delay: calc(var(--i) * 90ms) }`
  - `[data-reveal="play"] .tl-dot { animation: tl-pop 320ms cubic-bezier(0.34, 1.56, 0.64, 1) backwards; animation-delay: calc(var(--i) * 90ms - 60ms) }` (clamp: negative delay on row 0 is fine, it just starts mid-way; use `max(0ms, …)`)
  - `[data-reveal="play"] .tl-line { animation: tl-draw 520ms cubic-bezier(0.23, 1, 0.32, 1) backwards; animation-delay: calc(var(--i) * 90ms) }`
  - `@keyframes tl-pop { from { opacity: 0; transform: scale(0.4) } to { opacity: 1; transform: none } }` and `@keyframes tl-draw { from { transform: scaleY(0) } to { transform: none } }`.
  - `backwards` fill, not `both`: after the entrance, hover transforms must not be overridden.
- [ ] **Step 3: Rewrite `TimelineRail` in `page.tsx`.**
  - Wrap the `<ol>` in `<TimelineReveal>`.
  - `<li>` gets `group` and `style={{ "--i": index } as CSSProperties}`.
  - Year span: add `tl-text transition-colors duration-200 group-hover:text-ink`.
  - Line span: add `tl-line origin-top`.
  - Dot span: add `tl-dot transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.3] group-hover:border-ink group-hover:bg-ink motion-reduce:transition-none motion-reduce:group-hover:scale-100`. Note the dot class must keep `bg-bg` as its rest fill.
  - Text div: add `tl-text transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0`; role and line `<p>`s add `transition-colors duration-200 group-hover:text-ink/85`.
  - The mobile year span inside the role line is not separately animated.
- [ ] **Step 4:** Add `className="[animation:none]"` to the Experience and Education `<Section>`s.
- [ ] **Step 5:** Run `npm run typecheck && npm run build`. Expected: both exit 0 and `/about` is static.
- [ ] **Step 6: Browser check** (dev server on a free port, `.next` cleared, not run alongside `npm run build`): `/about` at 360, 390 and 1440, dark and light. Check each item in Review Focus. No console errors or hydration warnings.
- [ ] **Step 7: Commit**

```bash
git add app/components/TimelineReveal.tsx app/about/page.tsx app/global.css
git commit -m "feat(about): stagger the timelines in and highlight rows on hover"
```

## Outcome

**Pipeline outcome:** agentic
**Lane:** small-change
**What was built:** `/about` now reads Snapshots, Experience, Education, Off the clock. Each timeline plays a staggered entrance once, when it scrolls into view: rows rise 90ms apart, dots pop in just before their row, and the rail line draws downward. Hovering a row fills and scales the dot, brightens the year and text, and slides the text 4px right. Photos in the fan now preload.

**Decisions made:**
- Each timeline triggers on its own, so Education does not play off-screen: the canvas's shared 270ms offset assumed both were visible.
- The four fan photos use `priority`: they are the first thing on the page.
- The hidden state sits inside `no-preference` and `scripting: enabled`: reduced-motion and no-JS visitors see static rows from first paint.
- Hover is Tailwind `group-hover`; only the entrance needs `global.css`, because it keys off `data-reveal`.
- Review declined:
  - A shared observer hook with `ContributionGrid`: it would mean editing an unrelated working component for two uses.
  - A `Section` prop in place of `[animation:none]`.
  - A `TimelineRow` extraction.
  - An easing token in `tailwind.config.js`.
  
  Each is used once or twice.
- Review claimed reduced-motion users see a hidden flash: not true, the idle-hide rule is inside the `no-preference` block (verified: opacity 1 and `done` right after load).

**Verification:** UI verified: `/about` × 360, 390, 1440 × dark and light: no horizontal scroll, no console errors, order is Snapshots, Experience, Education, Off the clock; only the two timeline sections have no scroll reveal; entrance samples show staggered opacity; hover after the entrance scales the dot to 1.3, slides the text 4px and leaves siblings unchanged; reduced motion hovers with colour only, no movement; no-JS shows all rows. `npm run typecheck` and `npm run build` pass. Two-axis review: Standards no hard violations, Spec no missing requirements · Escalations: none.

**Notes:**
- `[end]` education years and photo captions are still placeholders.
- Under reduced motion the dot's hover colour change is instant, not a fade (`motion-reduce:transition-none`).
- I ran `npm run build` while the owner's dev server was on port 3000, which broke its cache. I restarted the server (`npm run dev` is running on port 3000).
