# Contact Compose Card Plan

> **For agentic workers:** steps use checkbox (`- [ ]`) syntax for tracking. There is no test suite: each task is verified with `npm run typecheck`, `npm run build` and the browser checks listed.

## Design

**What.** Rebuild `/contact` as a "write me a note" compose card. This is direction **B2** on the Claude Design canvas "Contact Page Directions" (https://claude.ai/artifact/X7vytEYV3aS4mwszUhvAMs, artboard `NoteRefined.dc.html`), with all nine of its additions:

1. Staggered entrance: header, then each card row, then the socials rise in.
2. The subject line types itself out with a caret when the topic changes.
3. The selected topic chip pops (springs in).
4. An optional message box whose text becomes the mailto body.
5. The row holding focus gets a lighter background and its label brightens.
6. Send button: on hover the arrow flies out to the top right while a second arrow slides in. On click the label reads "opening your mail app…".
7. Copy blurs into "copied" (the existing `CopyEmailButton`).
8. A time-aware Davao status line with a pulsing dot.
9. Social pills lift on hover and reveal an arrow.

**Why.** The current page is five ruled rows with a sibling-dim hover. The user finds it boring: it's only horizontal lines with little motion. B2 gives visitors one clear action (write the email) and keeps the site's palette, type and 720px column.

**Decisions (confirmed by the user in grilling):**
- Topics, in order, with their subjects:
  - `a job or internship` → `work opportunity`
  - `a project` → `project idea, want to build something?`
  - `just saying hi` → `hi sid, found your site`
- The starting topic is `just saying hi`.
- No em dashes anywhere in the page copy.
- Status copy:
  - 07:00–23:59 Davao time (`Asia/Manila`): `it's {time} in davao, i'm probably around.` with an `accent-now` dot.
  - 00:00–06:59: `it's {time} in davao, i'm asleep, i'll see it in the morning.` with a `faint` dot.
  - `{time}` is lower-case `h:mm am/pm`.
- The full subject is server-rendered on first paint. Typing runs only when the topic changes, never on load.
- The message is capped at 1000 characters. A `faint` counter `N / 1000` shows only when N > 900.
- Message placeholder: `optional, anything you want me to know up front`.

**Calls made by Claude (not confirmed by the user):**
- Colours come from the existing tokens only, so light mode follows from them:
  - card: `bg-hi`, `border-line`
  - selected chip: `bg-ink text-bg`
  - send button: `bg-ink text-bg`
- The status line renders on the client after mount, then fades in. A server-rendered time would be frozen by static caching and would cause a hydration mismatch.
- The chips are native radio inputs inside labels, so arrow keys move between them and there is one tab stop.
- The card is built from `div` elements, never `section`. `global.css` gives every `section` a scroll-driven `reveal-up`, which would stack on top of the stagger.
- The `.ruled` styles stay in `global.css`, because About, OnRepeat and ProjectList still use them.
- Hint text: `opens your mail app with this filled in.`, which becomes `your message goes in the body.` once the message is non-empty.

## Global Constraints

- Tailwind utilities first. New motion classes go in `app/global.css`. No inline `style={{}}`; per-row stagger delays are Tailwind arbitrary values (`[animation-delay:80ms]`).
- `"use client"` only on `ComposeCard.tsx` and `DavaoStatus.tsx`; `page.tsx` stays a server component and keeps its `metadata` export.
- Every animation honours `prefers-reduced-motion`. Animate only transform, opacity and filter. The background-colour transitions on row focus and pill hover are the exception.
- Touch targets are at least 40px tall (chips) or 44px (buttons, pills, links).
- Email address and contact links come from `app/lib/content/contacts.ts` (built on `socialLinks`), never hard-coded in components.
- No `any`. No new dependency.

## Review Focus

- **Before hydration / no JS:** the send link must already carry `mailto:sidadrian3@gmail.com?subject=hi%20sid%2C%20found%20your%20site`. The status line is simply absent. Nothing shows empty or broken. (Task 1, Step 4)
- **Special characters in the message:** `&`, `?`, `#`, `%`, newlines and emoji in the body must arrive intact, so encode with `encodeURIComponent`. `&body=` is omitted when the trimmed message is empty. (Task 1, Step 4)
- **Rapid topic switching mid-type:** the previous interval is cleared, and the final subject equals the last picked topic's subject. (Task 2, Step 3)
- **Reduced motion:** a topic change shows the full subject at once. There is no caret, stagger, pop, fly-through or dot pulse. (Task 2, Step 3)
- **Hydration:** no React hydration warning in the console on `/contact`, in either theme. (Task 1, Step 4)

---

### Task 1: Compose card, status line and page layout

**Files:**
- Modify: `app/lib/content/contacts.ts`: add the topic data.
- Create: `app/contact/DavaoStatus.tsx`
- Create: `app/contact/ComposeCard.tsx`
- Modify: `app/contact/page.tsx`

**Builds on:**
- `PageHeader` (`app/components/PageHeader.tsx`): title and line, unchanged.
- `CopyEmailButton` (`app/contact/CopyEmailButton.tsx`): reused as is in the "to" row.
- `contacts` and `socialLinks`.
- The `press` class and the colour tokens in `global.css`.

**Interfaces:**
- Produces in `contacts.ts`:
  - `export type NoteTopic = { id: "work" | "project" | "hi"; label: string; subject: string }`
  - `export const noteTopics: NoteTopic[]`, holding the three topics in the order above
  - `export const defaultTopic: NoteTopic["id"] = "hi"`
- Produces `export function DavaoStatus()`. It takes no props and returns `null` until mounted.
- Produces `export function ComposeCard({ email, topics }: { email: string; topics: NoteTopic[] })`.

- [ ] **Step 1: Add `NoteTopic`, `noteTopics` and `defaultTopic`** to `contacts.ts`, using the exact labels and subjects from Design.

- [ ] **Step 2: Create `DavaoStatus.tsx`** (`"use client"`).
  - It keeps `now: Date | null` (null until `useEffect`) and refreshes every 30 s.
  - Time format: `Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" })`, lower-cased.
  - Awake hours: read the hour with `hourCycle: "h23"`; awake is `hour >= 7`.
  - Markup: a `<p>`, 13px, `text-mute`, tabular numbers. It holds a 7px round dot (`bg-accent-now` when awake, `bg-faint` asleep, `aria-hidden`) and the exact copy from Design.

- [ ] **Step 3: Create `ComposeCard.tsx`** (`"use client"`). It is a rounded-2xl card (`border border-line bg-hi`, `overflow-hidden`) with rows separated by `border-line`. Each row is a grid `grid-cols-[72px_minmax(0,1fr)_auto]` (`px-[18px]`). On mobile (`max-sm`) it stacks to one column with a 6px gap. Rows, in order:
  1. **to:** a `faint` label, the email as a `mailto` link (16px, weight 550), and `<CopyEmailButton email={email} />`.
  2. **about:** a `fieldset`/`legend` (the legend is the visible "about" label) holding three `label > input[type=radio][name=topic].peer.sr-only + span` chips. Chips are 40px tall, `rounded-full`, 13px, and spaced `gap-1.5`. Unselected: `border-line text-mute`, with `hover:text-ink`. Selected: `peer-checked:bg-ink peer-checked:text-bg`. `peer-focus-visible` draws the global outline.
  3. **subject:** the current topic's subject, 16px `text-ink`, with `aria-live="polite"`.
  4. **message:** a `label htmlFor` and a `textarea` (`rows={3}`, `maxLength={1000}`, `resize-none`, transparent background, 15px, `placeholder:text-faint`). The counter shows only when the length is over 900.
  5. **Footer:** the hint text (12px `faint`) on the left. On the right, the send `<a>` with `href={mailHref}`: 44px, `rounded-full bg-ink text-bg`, 14px semibold, `press`, with the label `write the email` and a ↗ stroke SVG icon.
  - `mailHref` = `mailto:${email}?subject=${encodeURIComponent(subject)}`, plus `&body=${encodeURIComponent(msg.trim())}` when the trimmed message is non-empty.

- [ ] **Step 4: Rewrite `page.tsx`:**
  - `PageHeader` with title `contact` and the existing line.
  - `<DavaoStatus />` directly under it.
  - `<ComposeCard email={socialLinks.email} topics={noteTopics} />` with `mt-6`.
  - Then `h2` "or find me on" (14px semibold, `mb-2.5`) over a wrapping row of pills, built from `contacts.filter((c) => !c.copy)`. Each pill is an `<a>` with `target="_blank"`, `rel="noopener noreferrer"` and `aria-label="{label}: {handle}"`: 44px, `rounded-full border border-line`, 13px, showing the label in `faint` and the handle in `ink`.
  - Update `metadata.description` to `write me a note. i actually reply.`

  Verify:
  - `npm run typecheck` and `npm run build` pass.
  - `/contact` at 390 and 1440 wide, dark and light:
    - every row is visible with no horizontal scroll
    - picking a chip changes the subject and the send `href`
    - typing `a&b?c #1` puts `body=a%26b%3Fc%20%231` in the href
    - the counter appears at 901 characters and input stops at 1000
    - copy works
  - With JavaScript disabled, the send href carries the default subject.
  - No hydration warning in the console.

- [ ] **Step 5: Commit**

```bash
git add app/lib/content/contacts.ts app/contact/DavaoStatus.tsx app/contact/ComposeCard.tsx app/contact/page.tsx
git commit -m "feat(contact): rebuild contact as a compose card with topic subjects and davao status"
```

### Task 2: Motion

**Files:**
- Modify: `app/global.css`: add the motion classes below, each with a reduced-motion override.
- Modify: `app/contact/ComposeCard.tsx`, `app/contact/DavaoStatus.tsx`, `app/contact/page.tsx`: apply the classes and add the typing behaviour.

**Builds on:**
- `useReducedMotion` from `framer-motion`, as used in `ProjectPeek.tsx`.
- The `.type-once` caret colour and blink timing in `global.css`.
- The existing ease `cubic-bezier(0.23, 1, 0.32, 1)` used by `.ruled-arrow`.

**Interfaces:**
- Consumes `ComposeCard` and `DavaoStatus` from Task 1.
- Produces these CSS classes:

| Class | Effect |
|---|---|
| `.rise` | 560ms rise-in: opacity 0→1, translateY 8px→0, `both` fill |
| `.chip-pop` | runs on the checked chip's span via `.peer:checked + .chip-pop`: scale 0.92→1, 280ms, `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `.caret` | 2px × 1em `ink` bar; blink 900ms `steps(1)` |
| `.fly` | two stacked arrows in a 14px overflow-hidden box; on `a:hover` / `a:focus-visible` the first moves `translate(130%, -130%)` and the second comes in from `translate(-130%, 130%)`; 360ms |
| `.lift` | pill hover/focus: translateY −2px, `bg-hi`; the trailing arrow fades and slides in from −4px (reuse the `.ruled-arrow` values) |
| `.dot-pulse` | opacity 1→0.35→1 over 2.4s, infinite |
| `.row-focus` | on `:focus-within`, background `rgb(var(--ink) / 0.03)` and the row's label turns `ink` |

- [ ] **Step 1: Add the classes to `global.css`.**
  - Gate `.rise`, `.chip-pop`, `.caret` blink, `.fly`, `.lift` transform and `.dot-pulse` behind `@media (prefers-reduced-motion: no-preference)`.
  - Under reduce: `.caret` is hidden and the second `.fly` arrow is hidden.
  - Gate `.rise` behind `@media (scripting: enabled)`, as `.contrib-grid` is, so no-JS visitors never see hidden content.

- [ ] **Step 2: Apply the classes.**
  - Stagger with `.rise` plus `[animation-delay:…]`:
    - header block 0ms (wrap `PageHeader` and `DavaoStatus`)
    - card rows 80, 140, 200, 260 and 320ms
    - socials block 400ms
  - `DavaoStatus` fades in on mount with `.rise`, and its dot gets `.dot-pulse`.
  - Card rows get `.row-focus`. Chip spans get `.chip-pop`. The send arrow becomes `.fly`. Pills get `.lift` with a trailing `↗`.

- [ ] **Step 3: Typing and send feedback in `ComposeCard`.**
  - `typed: number` starts at the full subject length (the full subject on first paint).
  - On a topic change, reset `typed` to 0 and advance it by 1 every 22ms with `setInterval` until it reaches the length. Clear the previous interval on every change and on unmount.
  - When `useReducedMotion()` is true, set `typed` to the full length straight away.
  - Render `subject.slice(0, typed)`, followed by `<span className="caret" aria-hidden />` while `typed < subject.length`.
  - Move Task 1's `aria-live` off the visible subject (mark it `aria-hidden`) onto an `sr-only` span holding the full subject, so screen readers hear it once rather than letter by letter.
  - Send `onClick` sets `sending` for 1800ms (cleared on unmount) and must not call `preventDefault`. The label shows `opening your mail app…` while it's set.

  Verify:
  - `npm run typecheck` passes.
  - Browser checks:
    - the stagger plays once on load
    - switching chips four times in a row ends with the last chip's full subject
    - the arrow flies on hover and the label changes on click
    - with reduced motion emulated, nothing moves and subjects swap instantly
  - Both themes and both widths again, no console errors.

- [ ] **Step 4: Commit**

```bash
git add app/global.css app/contact/ComposeCard.tsx app/contact/DavaoStatus.tsx app/contact/page.tsx
git commit -m "feat(contact): add entrance stagger, typed subject, chip pop and send motion"
```

## Outcome

**Pipeline outcome:** agentic
**Lane:** small-change
**What was built:** `/contact` is now a "write me a note" compose card, direction B2 from the Claude Design canvas, with all nine approved additions: a to/copy row, topic chips, a typed subject, an optional message that goes into the mailto body, a send button with an arrow fly-through, a time-aware Davao status line, a staggered entrance, a row focus highlight and lifting social pills. The page stays a server component; `ComposeCard` and `DavaoStatus` are the only client components.
**Decisions made:**
- Subjects are finished text, not placeholders: `work opportunity`, `project idea, want to build something?`, `hi sid, found your site`. A bracketed `[ROLE]` would have reached the inbox unedited.
- The subject is server-rendered in full and only types when the topic changes, so the first paint and no-JS visitors never see it blank.
- The status line renders after mount. A server-rendered time would be frozen by static caching and cause a hydration mismatch.
- The message is capped at 1000 characters with a counter above 900, because mail apps truncate long mailto links.
- Chips are native radios, so arrow keys work and there is one tab stop. The group is `role="radiogroup"` with a label, not a `fieldset`, because `legend` does not lay out cleanly in a grid row.
- Kept the send button's box-shadow halo from the approved mockup. It is a paint property, not layout, so it does not break the repo's motion rule, but it does go beyond the plan's "transform, opacity, filter" constraint.
**Verification:** UI verified: `/contact` × 390 and 1440 × dark and light: no horizontal scroll, no console errors. Behaviour verified in the browser: default and per-topic mailto hrefs, body encoding of `a&b?c #1`, counter at 901 and the 1000 cap, copy to clipboard, arrow-key chip selection, typing with rapid topic switching, the arrow fly-through, the send label and its reset, row focus and pill lift. Also verified with JavaScript disabled (default mailto link intact) and with reduced motion emulated (no running animations, instant subject, one arrow). Contrast of `faint` on the card background is 4.69:1 dark and 4.54:1 light. `npm run typecheck` and `npm run build` pass. Two-axis code review ran: Standards found no hard violations; Spec found one gap (email link was about 24px tall), fixed in its own commit. Escalations: none.
**Notes:**
- `.rise` is not gated behind `@media (scripting: enabled)` as the plan said. CSS animations run without JavaScript, so nothing is ever left hidden.
- `CopyEmailButton` stays at 40px tall; the plan said to reuse it unchanged. Raise it to 44px later if wanted.
- `app/global.css` is now about 490 lines. It remains the single shared stylesheet, so it was not split.
- Do not run `npm run build` while `npm run dev` is running: both write `.next`, and the dev server then serves mixed chunks and fails to hydrate.
- Not built, from the design discussion: a gliding highlight between chips, a cursor-following glow on the card edge, a "sent" confirmation animation, and tinting the glow from Spotify album colour.
