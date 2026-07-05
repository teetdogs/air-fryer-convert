# Launch kit — Air Fryer Convert

Live site: **https://airfryerconvert.pages.dev**
Traffic dashboard (JSON): **https://airfryerconvert.pages.dev/api/stats**

## What's already done (automated)

- ✅ Deployed to Cloudflare Pages (free tier, no cost)
- ✅ Google Search Console: property verified, `sitemap.xml` submitted
- ✅ IndexNow: all 66 URLs submitted (covers Bing, Yandex, Seznam, Naver)
- ✅ Self-hosted analytics: every pageview logged to D1 (path, referrer domain,
  device class — no cookies, no personal data)

Search traffic on a new domain typically takes **2–6 weeks** to start. The food
pages (`/foods/chicken-wings/` etc.) target long-tail queries like "chicken
wings air fryer time" — those are the likeliest early winners on Bing.

## Things only you can do (each is 2–5 minutes, all free)

These are posts from *your* accounts, so I drafted them but didn't send them.

### 1. Reddit — ⚠️ NOT r/airfryer (their rules ban all links, verified 2026-07-04)
Link-friendly alternatives, in order of traffic potential:
- **r/InternetIsBeautiful** (17M) — exists for free web tools; site must be free
  and signup-less, which this is. Best single-shot venue.
- **r/SideProject** (300K) — self-promo is the point of the sub.
Suggested post (works for either):

> **Title:** I made a free oven-to-air-fryer conversion calculator (no ads, no signup)
>
> I got tired of googling "what temp for X in the air fryer" every time a
> recipe only had oven instructions, so I built a little calculator: enter the
> oven temp/time, get air fryer settings. There's also a cheat sheet with
> times for 65 common foods.
>
> https://airfryerconvert.pages.dev
>
> It's free, no ads, works on your phone. Would love feedback on cook times
> you'd tweak — the ranges are rule-of-thumb for basket fryers.

### 2. Pinterest (the sleeper channel for kitchen tools)
Kitchen/recipe content compounds on Pinterest for years. Create a pin with
the site's `og.png` image (download from
https://airfryerconvert.pages.dev/og.png), title "Oven to Air Fryer
Conversion Chart — free calculator", link to the site. Pin it to a cooking
board.

### 3. Facebook groups
"Air Fryer Recipes" groups have millions of members. Same pitch as Reddit —
lead with the problem ("recipe only has oven instructions"), not the tool.

### 4. Make the GitHub repo public (SEO backlink + credibility)
I created it private because publishing source is your call:
`gh repo edit teetdogs/air-fryer-convert --visibility public`
Then add the URL to the repo's About section.

### 5. Retry "Request Indexing" in Search Console (quota reset daily)
https://search.google.com/search-console — inspect
`https://airfryerconvert.pages.dev/` → Request indexing. Do the homepage
first, then 2–3 popular food pages (chicken-wings, salmon, frozen-french-fries).

## Checking traffic

- Quick look: https://airfryerconvert.pages.dev/api/stats
- Google side: Search Console → Performance (impressions show up before clicks)
- Cloudflare side: dash.cloudflare.com → Workers & Pages → airfryerconvert → Metrics

## Deploying changes

```sh
cd ~/Documents/air-fryer-convert
node build.js && npx wrangler pages deploy
```
