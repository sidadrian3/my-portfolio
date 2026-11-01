# Setup and Follow-ups

What is still open after the portfolio redesign (branch `feat/portfolio-redesign`): accounts to connect, placeholders to fill, and optional upgrades. Nothing here blocks the site from running; each unfinished item has a graceful fallback, listed alongside it.

## 1. Environment variables

Set each one in **both** places, then restart `npm run dev` locally and **redeploy** on Vercel (variables only apply to new deployments):

- `.env.local` in the project root (already gitignored; never commit it)
- Vercel → your project → Settings → Environment Variables → add for Production and Preview

| Variable | Read in | Used for | If missing |
|---|---|---|---|
| `SPOTIFY_CLIENT_ID` | `app/lib/spotify.ts` | Spotify API login | On repeat shows "spotify's taking a break." |
| `SPOTIFY_CLIENT_SECRET` | `app/lib/spotify.ts` | Spotify API login | same |
| `SPOTIFY_REFRESH_TOKEN` | `app/lib/spotify.ts` | Spotify access for your account | same |
| `GITHUB_TOKEN` | `app/lib/github.ts` | Shipping graph | Shipping shows only "my contributions live on github ↗" |

Never paste these values into a chat, an issue or a commit.

### 1a. `GITHUB_TOKEN`

1. Open github.com/settings/tokens → **Generate new token → Generate new token (classic)**.
2. Note: `portfolio contributions`. Pick a long expiration (the graph stops showing when it expires).
3. **Tick no scopes.** A token with no permissions can only read public data, which is all the graph needs.
4. Generate, copy the `ghp_…` value (GitHub shows it once), and add it as `GITHUB_TOKEN`.

The graph shows private contributions only because your GitHub profile has **Contribution settings → Private contributions** turned on. That shows anonymous counts and dates, never repo names. Turn it off there and the graph drops back to your public total.

### 1b. Re-authorize Spotify (needed for "Recently played")

The current refresh token was created without the `user-read-recently-played` scope, so the site falls back to "#1 this month" and hides the Recently played tab. To fix it, make a new refresh token with all three scopes the code uses:

`user-read-currently-playing user-top-read user-read-recently-played`

1. Spotify Developer Dashboard → your app → Settings. Note the **Client ID** and make sure a **Redirect URI** is registered. Spotify currently accepts HTTPS or loopback addresses such as `http://127.0.0.1:3000/callback`, not `localhost`. The page does not need to exist; you only need the address bar after the redirect.
2. Open this in your browser (replace the two placeholders; the redirect URI must be URL-encoded):

   ```
   https://accounts.spotify.com/authorize?client_id=<CLIENT_ID>&response_type=code&redirect_uri=<ENCODED_REDIRECT_URI>&scope=user-read-currently-playing%20user-top-read%20user-read-recently-played
   ```

3. Approve. The browser redirects to your redirect URI with `?code=…` in the address bar (the page itself may show an error; ignore it). Copy the `code` value. It is single-use and expires in a few minutes.
4. Exchange it for tokens in a terminal (replace the placeholders; `printf` keeps the secret out of the command echo, but it still lands in your shell history, so clear it afterwards):

   ```bash
   curl -s -X POST https://accounts.spotify.com/api/token \
     -H "Authorization: Basic $(printf '%s' '<CLIENT_ID>:<CLIENT_SECRET>' | base64)" \
     -d grant_type=authorization_code \
     -d code=<CODE> \
     -d redirect_uri=<REDIRECT_URI>
   ```

5. Copy `refresh_token` from the JSON response into `SPOTIFY_REFRESH_TOKEN` (local and Vercel). `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` stay as they are.
6. Check: `curl -s "http://localhost:3000/api/spotify/recently-played?limit=1"` should return `{"items":[…]}` instead of `{"error":"scope"}`. The home page then shows "Last played" and a Recently played tab.

### 1c. Spotify profile link (for the error fallback)

1. Open Spotify (desktop, mobile or open.spotify.com), go to your **profile**, open the `…` menu and choose **Share → Copy link to profile**.
2. The link looks like `https://open.spotify.com/user/<your-id>?si=…`. Delete everything from `?si=` onward; that part is only a tracking tag.
3. Add it to `socialLinks` in `app/config.ts` as `spotify`, and in `app/components/OnRepeat.tsx` (search for `taking a break`) change the plain text into a link to `socialLinks.spotify`. Until then the fallback is plain text.

## 2. Placeholders to fill

All live content is in `app/lib/content/` and `app/config.ts`.

| Where | What to replace |
|---|---|
| `app/lib/content/experience.ts` | BANSAG `role: "[role]"` (your role there) |
| `app/lib/content/experience.ts` | `end: "[end]"` on Ateneo de Davao University and Brokenshire College of Toril (graduation years, or `"now"`) |
| `app/lib/content/photos.ts` | One shared `caption` constant (`"[event] · [place] · [date]"`) is used by all four photos. Give each photo its own caption string. The About stack's flip side and the Photos page both read it. |
| `app/config.ts` → `metaData.now` | The line next to "Now" on the home page (currently "starting BANSAG with my friends from school") |

Copy drafted for you and worth a read-through, since it's in your voice: the bio in `app/components/Hero.tsx`, the four entries in `app/lib/content/hobbies.ts` (including "rank: don't ask."), project summaries in `app/lib/content/projects.ts`, and `metaData.description` in `app/config.ts`.

## 3. Optional

- **Project screenshots.** Put images in `public/projects/` (for example `adto.png`) and add `image: "/projects/adto.png"` to that project in `app/lib/content/projects.ts`. The peek and the drawer show it instead of the generated poster. Use roughly a 1.6:1 landscape crop (the peek is 220×136), at least 440 px wide for sharp screens. Leave the NDA project without one.
- **Custom domain.** When you have one, change `metaData.baseUrl` in `app/config.ts` (used for link previews, the sitemap and the share image) and add the domain in Vercel.
- **README.** It still describes the old site (Next.js 13, pnpm, a contact form, React Type Animation). Worth a rewrite when you have a moment.
- **Unused packages.** `react-type-animation`, `next-mdx-remote`, `katex`, `react-tweet`, `feed`, `react-youtube`, `react-wrap-balancer`, `sugar-high`, `rehype-katex`, `remark-math` and `@tailwindcss/typography` are no longer used. Removing them means updating both `package-lock.json` and `pnpm-lock.yaml`, so it is a separate small task.
- **"Replay the year" on the GitHub graph.** A play button that redraws the year week by week while the total counts up. Left out on purpose; it needs a client-side timeline and a play/pause for accessibility.

## 4. Things to know

- Running `npm run build` while `npm run dev` is running breaks the dev server (they share `.next`). Stop dev, delete `.next`, then start dev again.
- The small "N" circle at the bottom-left of the page in development is Next.js's dev indicator. It does not appear in production.
- `.superpowers/` (brainstorming mockups) is gitignored and safe to delete.
- Design decisions and the verification record are in `docs/specs/Portfolio Redesign Design Spec.md` and the `## Outcome` section of `docs/plans/Portfolio Redesign Plan.md`.
