# About Page Redesign Implementation Plan

> **For agentic workers:** Implement task-by-task in this session (small-change lane). Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/about` as direction C from the Claude Design canvas: history first, two dated rails, a one-row hobbies strip and a centred photo fan; and stop presenting the shelved BANSAG project as current.

**Architecture:** All server components. The rails are a small local component in `app/about/page.tsx`; the fan is a new server component, `PhotoFan`, whose hover highlight is pure CSS, replacing the client-side `PhotoStack` (framer-motion + `"use client"`).

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind 3 (`future.hoverOnlyWhenSupported`), `next/image`, `next-themes` (`.light` / `.dark` class on `<html>`).

**Spec:** this file's `## Design` section. Canvas: https://claude.ai/artifact/C9Tei4oUmsaBsgKu7ARTMK (artboard "C · Timeline").

## Design

**What.** `/about` becomes, in order: page header (unchanged), **Experience**, **Education**, **Off the clock**, **Snapshots**.

- Experience and Education are separate stacked sections (`Section stacked`), each a vertical rail: years column (96px, right-aligned, `faint`) · rail (24px: a 1px line plus a 9px ring dot) · text (org in `ink` medium, role in `mute`, optional line in `mute`). The rail line starts at the first dot and ends at the last. Below `sm` the years column is hidden and the years are appended to the role line (`role · years`).
- Every dot is a grey ring. `TimelineEntry.current` stays supported (ring in `accent-now`, years read `start–now`) but no entry sets it.
- Off the clock: 4 columns at `sm` and up, 2×2 below. Copy unchanged.
- Snapshots: heading and content centred. The first four photos in polaroid frames, fanned with fixed tilts/lifts and negative margins, centred. Hovering one straightens it, lifts it 14px, scales it 1.06 and raises it above the others; the others do not change. Photos are not links, not buttons and not focusable. "more photos →" (link to `/photos`) is centred below. Frame: `ink` (cream) in dark, white in light.
- Removed: `PhotoStack` (flip-to-caption stack) and its "tap to flip" hint. `/photos` is untouched.

**Content changes.**
- BANSAG: role `Full-stack developer`, start `2026`, no `current`, line `a startup a few of us from school started, building systems for our community.`
- Home "Now" (`metaData.now`): `going back to the fundamentals and good practices, and building full-stack with AI in the loop.`

**Why.** The owner wants experience and education read first, hobbies second, photos last; the old page led with the photo stack. BANSAG is on hiatus, so the green "current" dot, `2026–now` and "starting BANSAG" overstated it. The old stack was pinned left at a fixed width outside the label grid, so it lined up with nothing; the fan is centred on purpose.

**Decisions from the grilling round.** Four photos on phones too, heavier overlap accepted. Light-theme frame white. Stacked headings on about (home keeps the label column). Off the clock in four columns. Section is called "Snapshots".

**Assumptions (builder's calls).**
- The photos lose `priority` and lazy-load: they are now at the bottom of the page.
- On touch devices the fan is static: `hoverOnlyWhenSupported` already drops `hover:` there.
- Reduced motion: the hovered photo still rises above the others (z-index) but does not move or scale.
- `[end]` education years and `[event] · [place] · [date]` captions stay placeholders (owner's to fill). Captions are no longer shown on `/about`; `/photos` still shows them.

## Global Constraints

- Server components only; no `"use client"` in any file this plan touches.
- Tailwind utilities only; the per-photo `--tilt` / `--lift` CSS variables are the one inline `style` (genuinely per-item values).
- Colours from existing tokens (`bg ink mute faint line hi accent-now`) plus `white` for the light-mode frame; no new tokens.
- Motion: transform only, honour `prefers-reduced-motion`.
- Commits: no Co-Authored-By or Claude attribution lines (owner's standing rule).

## Review Focus

1. **Narrowest width (360px, `html` min-width):** the fan must not cause horizontal scroll. Check `document.documentElement.scrollWidth === innerWidth` at 360 and 390.
2. **Touch devices:** no stuck highlight after a tap. Verified by `hoverOnlyWhenSupported`; confirm in a touch-emulated viewport.
3. **Light theme:** white frames and a lighter shadow are visible on the cream page, and rail lines and dots are visible on both themes.
4. **Long org names at 390px:** "SAMAHAN Systems and Development" wraps inside the text column without pushing the rail.
5. **Fewer than four photos:** `PhotoFan` slices to at most four and renders whatever exists without a gap.

---

### Task 1: Content: BANSAG as past work, new Now line

**Files:**
- Modify: `app/lib/content/experience.ts:11-18`
- Modify: `app/config.ts:8`

**Interfaces:** none new; `TimelineEntry` keeps its shape (`current?: boolean` stays).

- [ ] **Step 1:** In `experience.ts`, set BANSAG `role: "Full-stack developer"`, `line: "a startup a few of us from school started, building systems for our community."` and delete `current: true`.
- [ ] **Step 2:** In `config.ts`, set `now: "going back to the fundamentals and good practices, and building full-stack with AI in the loop."`.
- [ ] **Step 3:** Run `npm run typecheck`. Expected: exit 0.
- [ ] **Step 4: Commit**

```bash
git add app/lib/content/experience.ts app/config.ts
git commit -m "feat(content): show bansag as past work and update the now line"
```

### Task 2: About layout: two rails, hobbies strip, photo fan

**Files:**
- Create: `app/components/PhotoFan.tsx`
- Modify: `app/about/page.tsx`
- Delete: `app/components/PhotoStack.tsx` (only importer is `app/about/page.tsx`)

**Builds on:** `Section` (`stacked`, `className`), `PageHeader`, the `press` link class, `Photo` from `app/lib/content/photos.ts`, `TimelineEntry` from `app/lib/content/experience.ts`.

**Interfaces:**
- Produces: `export function PhotoFan({ photos }: { photos: Photo[] })`, a server component.

- [ ] **Step 1: Create `PhotoFan`.**
  - Constants: `FAN_SIZE = 4`; `FAN = [{ tilt: -7, lift: 6 }, { tilt: -2, lift: -6 }, { tilt: 3, lift: -4 }, { tilt: 8, lift: 8 }]` (deg, px).
  - Markup: a `<ul>` (flex, centred, `py-2 pb-5`) of `<li>`s, each with `style={{ "--tilt": "…deg", "--lift": "…px" } as React.CSSProperties}` and a `next/image` `fill` image, `alt={photo.alt}`, `sizes="(min-width: 640px) 190px, 46vw"`, no `priority`. Then a centred `Link href="/photos" className="press text-[15px] text-ink"` "more photos →".
  - Item size: `w-[46%] -mx-[4%]` below `sm`, `sm:w-[190px] sm:-mx-3.5`, `aspect-square relative overflow-hidden`.
  - Frame: `border-[6px] border-b-[22px] rounded-[3px] bg-hi border-ink [.light_&]:border-white`, shadow `shadow-[0_10px_30px_rgb(0_0_0/0.6)] [.light_&]:shadow-[0_10px_24px_rgb(20_18_16/0.18)]`.
  - Motion: rest `[transform:rotate(var(--tilt))_translateY(var(--lift))]`; `hover:z-10 hover:[transform:translateY(-14px)_scale(1.06)]`; `transition-transform duration-[260ms] ease-[cubic-bezier(0.23,1,0.32,1)]`; reduced motion `motion-reduce:transition-none motion-reduce:hover:[transform:rotate(var(--tilt))_translateY(var(--lift))]`.
- [ ] **Step 2: Rewrite `app/about/page.tsx`.**
  - Replace `TimelineList` with a local `TimelineRail({ entries }: { entries: TimelineEntry[] })`: an `<ol>` of `<li>`s with `grid grid-cols-[24px_minmax(0,1fr)] sm:grid-cols-[96px_24px_minmax(0,1fr)] gap-x-4`. Years `<span>` `hidden sm:block text-right text-[13px] tabular-nums text-faint pt-[3px]`. Rail cell `aria-hidden`, relative and centred: a line `absolute w-px bg-faint/40`, `top-[11px]` on the first item, else `top-0`; `bottom-[calc(100%-11px)]` on the last item, else `bottom-0`. Dot `relative mt-[7px] size-[9px] rounded-full border-[1.5px] bg-bg`, `border-accent-now` if `current`, else `border-faint`. Text `pb-7`: org `text-[15px] font-medium text-ink`, role `text-[15px] text-mute` plus `<span className="text-faint sm:hidden"> · {yearsLabel(entry)}</span>`, line `mt-1.5 text-[15px] text-mute` only when non-empty. Keep `yearsLabel` as is.
  - Order: `PageHeader`, `<Section label="Experience" stacked>`, `<Section label="Education" stacked>`, `<Section label="Off the clock" stacked>` with `grid grid-cols-2 gap-6 sm:grid-cols-4` (line `text-[14px] leading-[1.45]`), `<Section label="Snapshots" stacked className="text-center"><PhotoFan photos={photos} /></Section>`.
  - Remove the `PhotoStack` import.
- [ ] **Step 3:** Delete `app/components/PhotoStack.tsx`.
- [ ] **Step 4:** Run `npm run typecheck && npm run build`. Expected: both exit 0 and `/about` builds as static.
- [ ] **Step 5: Browser check** at `http://localhost:3000/about` (dev server started after the build, `.next` cleared): 360, 390 and 1440 × dark and light. No horizontal scroll (Review Focus 1); rails, dots, frames and shadows visible (3); the SAMAHAN row wraps cleanly (4); hover highlight on desktop, none stuck after a tap in touch emulation (2); with reduced motion emulated, hover does not move the photo. No console errors or hydration warnings. Also check `/` shows the new Now line.
- [ ] **Step 6: Commit**

```bash
git add app/components/PhotoFan.tsx app/about/page.tsx app/components/PhotoStack.tsx
git commit -m "feat(about): split experience and education rails, add centred photo fan"
```
