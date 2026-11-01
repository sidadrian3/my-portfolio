## Agent skills

### Issue tracker

GitHub Issues, via `gh` when available. If `gh` is missing or unauthenticated, skip the tracker and say so.

### Specs and plans

- Save design specs to `docs/specs/<Name> Design Spec.md` and plans to `docs/plans/<Name> Plan.md` (Title Case, no date prefix).
- A finished plan ends with an `## Outcome` section (decisions, verification, notes). It is the record the `workflow` skill's prior-context scan reads later.
- Agent skills live in `.agents/skills/` (`.claude/skills` is a symlink to it). Both folders are gitignored local tooling.

---

## Repo Layout

Single Next.js 15 App Router app (React 19, TypeScript, Tailwind 3, framer-motion, MDX posts).

```
app/
  components/   # shared components (SectionLabel, SpotlightCard, GrainOverlay, …)
  lib/          # posts.ts, spotify.ts — data helpers
  api/          # route handlers (Spotify now-playing / top-tracks)
  <route>/      # about, contact, photos, og, …
docs/
  specs/  plans/
```

Package manager: `package-lock.json` and `pnpm-lock.yaml` both exist and the project deploys on Vercel. Use `npm` for scripts unless told otherwise.

## Checks

There is no test suite and no linter. The checks are:

```bash
npm run typecheck   # tsc --noEmit
npm run build       # next build — run when touching routing, data fetching, metadata or config
```

UI changes are verified in the browser at `http://localhost:3000` (`npm run dev`), at mobile and desktop widths, in both light and dark themes.

---

## Coding Standards

- **Styling:** Tailwind utilities first; shared design tokens and effects live in `app/global.css`. No inline `style={{}}` unless a value is genuinely dynamic.
- **Server components by default.** Add `"use client"` only where hooks or interactivity need it, as low in the tree as possible.
- **Secrets stay server-side.** `.env.local` values are read only in server code and route handlers (`app/api/`, `app/lib/spotify.ts`). Never ship tokens to the client.
- **Motion:** honour `prefers-reduced-motion`; animate transform/opacity, not layout.
- **No God files.** A file passing ~400 lines is a prompt to check that it still has one responsibility. Split only if it has two.
- **Reuse first.** Check `app/components/` and `app/lib/` before writing a new component or helper.
- **No `any`.** Use `unknown`, a proper type, or a generic.
- **Self-documenting code.** Clear names, small functions, early returns. Comments only for the non-obvious _why_, one short line. No commented-out code.
- **No deprecated APIs.**
- **Accessibility:** semantic elements, alt text, visible focus, contrast in both themes.
- **Commits:** `feat(scope):`, `fix(scope):`, `refactor(scope):`, `docs:`. Stage only the files a task changed; unrelated uncommitted work may be in the tree.

---

## Agentic Workflows & Review

1. **Chain of Thought.** Before proposing any complex solution, open a `### Thought Process` section covering the core challenge, edge cases, and impact on existing pages.
2. **Independent review.** Inefficiencies, security issues and DRY violations are caught by the `code-review` skill's Standards axis, not by an inline self-review while coding.
3. **Proactive inquiry.** If a task is ambiguous, give two interpretations and ask before executing.
4. **Performance-first.** Prefer server rendering, optimised images and non-blocking work; explain trade-offs against readability.

---

## Workflow Intent Detection

When the user sends a message with strong-signal work language, show the intent gate before taking any action.

**Strong signals (trigger the gate):**

- Action verbs: `let's`, `build`, `add`, `implement`, `create`, `fix`, `refactor`, `clean up`, `extract`
- Bug language: `broken`, `crash`, `error`, `not working`, `failing`

**Gate format (output exactly one line, no emojis):**

```
Detected: [feature / bug / refactor] — "[one-line summary of the request]"
Start workflow? [yes / no / just talking]
```

- `yes` → invoke the `workflow` skill
- `no` → treat as normal conversation
- `just talking` → treat as normal conversation; do not offer the gate again this session

**Do NOT intercept messages that:**

- Start with: `what if`, `I think`, `should we`, `could we`, `I noticed`
- End with `?` (questions)
- Are replies within an already-active brainstorming or planning conversation
- Are slash commands (`/feature`, `/fix`, `/refactor`) — these invoke the workflow skill directly
