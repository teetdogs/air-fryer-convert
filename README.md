# Air Fryer Convert

**Live site: https://airfryerconvert.pages.dev**

Free oven-to-air-fryer conversion calculator plus a cook-time cheat sheet for
65 common foods. No ads, no signup, no cookies.

## How it works

- **`src/foods.mjs`** — the single source of truth: every food with temp, time,
  category, and tips.
- **`build.js`** — a ~200-line static site generator (no dependencies). It
  renders the homepage and one landing page per food (`/foods/<slug>/`) as
  plain HTML, plus `sitemap.xml` and `robots.txt`. Everything search engines
  need is in the HTML at build time — no client-side rendering.
- **`src/app.js`** — the only client JavaScript: the calculator, the
  cheat-sheet search filter, and a one-line analytics beacon.
- **`functions/api/`** — Cloudflare Pages Functions backing a tiny self-hosted
  analytics setup: `POST /api/hit` records a pageview (path + referrer
  hostname + device class, nothing else) into a D1 database; `GET /api/stats`
  returns 30-day aggregates.

## The conversion rule

Air fryers are small convection ovens, so: **drop the temperature 25°F
(15°C) and cut the time ~20%** versus a conventional oven recipe. From a
convection oven recipe the gap is smaller (−10°F, −10% time).

## Develop & deploy

```sh
node build.js                        # regenerate dist/
npx wrangler pages dev dist          # local preview with the API
npx wrangler pages deploy            # deploy to Cloudflare Pages
```

Built by [Claude Code](https://claude.com/claude-code) as an autonomous
build-and-launch experiment. Cooking times are rule-of-thumb guidelines —
always verify meat reaches a safe internal temperature.
