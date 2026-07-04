// Static site generator: node build.js  →  dist/
// Everything is rendered to plain HTML at build time so search engines see
// real content, not an empty shell waiting for JavaScript.
import { mkdirSync, writeFileSync, copyFileSync, rmSync, readFileSync, existsSync } from "node:fs";
import foods from "./src/foods.mjs";

const ORIGIN = "https://airfryerconvert.pages.dev";
const OUT = "dist";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fToC = (f) => Math.round((f - 32) * 5 / 9 / 5) * 5;

const flipText = {
  flip: "Flip halfway through cooking.",
  shake: "Shake the basket once or twice during cooking.",
  none: "No flipping needed.",
};

function page({ title, desc, path, body, jsonLd }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${ORIGIN}${path}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${ORIGIN}${path}">
<meta property="og:type" content="website">
<meta property="og:image" content="${ORIGIN}/og.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍟</text></svg>">
<link rel="stylesheet" href="/styles.css">
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ""}
</head>
<body>
<header class="site wrap">
  <a class="logo" href="/">Air Fryer <em>Convert</em></a>
  <p class="tag">Oven-to-air-fryer conversion calculator &amp; cook time cheat sheet</p>
</header>
<main class="wrap">
${body}
</main>
<footer class="site wrap">
  <p>AirFryerConvert is a free tool — no ads, no signup, no cookies.</p>
  <p class="disclaimer">Times and temperatures are guidelines for standard basket air fryers; models vary.
     Always confirm meat and poultry reach a safe internal temperature with a food thermometer.</p>
</footer>
<script src="/app.js" defer></script>
</body>
</html>`;
}

// ── Homepage ──────────────────────────────────────────────────────────
const cats = [...new Set(foods.map((f) => f.cat))];

const tableHtml = cats.map((cat) => {
  const rows = foods.filter((f) => f.cat === cat).map((f) => `
    <tr data-name="${esc(f.name.toLowerCase())}">
      <td><a href="/foods/${f.slug}/">${esc(f.name)}</a></td>
      <td class="t">${f.tempF}°F / ${fToC(f.tempF)}°C</td>
      <td class="t">${f.lo}–${f.hi} min</td>
      <td class="note">${esc(f.note)}</td>
    </tr>`).join("");
  return `
  <div class="cat-block">
    <h2 class="cat">${esc(cat)}</h2>
    <table class="foods">
      <thead><tr><th>Food</th><th>Temp</th><th>Time</th><th class="note">Notes</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
}).join("");

const faqs = [
  ["How do I convert an oven recipe to an air fryer?", "Lower the temperature by 25°F (about 15°C) and reduce the cooking time by roughly 20%. So a recipe that calls for 400°F for 20 minutes in the oven becomes about 375°F for 16 minutes in the air fryer. Check a few minutes early the first time — air fryers vary."],
  ["Why do air fryers cook faster than ovens?", "An air fryer is a small, powerful convection oven. The heating element is close to the food and a fan circulates hot air rapidly in a compact space, so heat transfers faster than in a large oven cavity."],
  ["Do I need to preheat an air fryer?", "Usually 2–3 minutes is plenty, and many recipes skip it entirely. Preheating matters most for foods you want seared quickly, like steak — for frozen foods it makes little difference."],
  ["What if my oven recipe uses convection?", "Convection ovens already circulate air, so the gap is smaller: drop the temperature about 10°F and reduce time by about 10%. The calculator has a convection checkbox that applies this automatically."],
  ["Why did my food come out dry?", "The most common cause is running the full oven time. Air fryers pull moisture fast — cut the time by 20% and start checking early. For lean meats like chicken breast or pork chops, a quick brine or oil rub helps a lot."],
];

const faqHtml = faqs.map(([q, a]) => `
  <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("");

const homeBody = `
<h1 style="text-align:center">Oven to Air Fryer Conversion Calculator</h1>
<p class="sub">Enter your recipe's oven settings and get air fryer settings instantly —
or look up any of ${foods.length} common foods in the cheat sheet below.</p>

<div class="card">
  <div class="calc-grid">
    <div class="field">
      <label for="oven-temp">Oven temperature
        <span class="unit-toggle"><button id="btn-f" class="on" type="button">°F</button><button id="btn-c" type="button">°C</button></span>
      </label>
      <input id="oven-temp" type="number" inputmode="numeric" value="400" min="1">
    </div>
    <div class="field">
      <label for="oven-time">Oven time (minutes)</label>
      <input id="oven-time" type="number" inputmode="numeric" value="20" min="1">
    </div>
  </div>
  <label class="check"><input id="convection" type="checkbox"> My recipe is for a convection / fan oven</label>
  <div class="result">
    <div class="box"><div class="lbl">Air fryer temp</div><div class="big" id="out-temp">375°F</div></div>
    <div class="box"><div class="lbl">Air fryer time</div><div class="big" id="out-time">16 min</div></div>
  </div>
  <p class="rule-note">The rule of thumb: <strong>−25°F (−15°C), −20% time.</strong> Start checking a couple of minutes early — every air fryer runs a little different.</p>
</div>

<section id="cheat-sheet">
  <h1 style="font-size:1.5rem">Air Fryer Cook Times Cheat Sheet</h1>
  <input class="search" id="food-search" type="search" placeholder="Search ${foods.length} foods… (wings, salmon, fries)" aria-label="Search foods">
  ${tableHtml}
</section>

<section class="card">
  <h2 style="margin-top:0">Air Fryer Conversion FAQ</h2>
  ${faqHtml}
</section>`;

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Air Fryer Convert",
      url: ORIGIN,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: "Free calculator that converts oven recipe temperatures and times to air fryer settings, with a cook-time cheat sheet for common foods.",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([q, a]) => ({
        "@type": "Question", name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

// ── Food pages ────────────────────────────────────────────────────────
function foodPage(f) {
  const tempC = fToC(f.tempF);
  const related = foods.filter((x) => x.cat === f.cat && x.slug !== f.slug).slice(0, 6);
  const title = `${f.name} in the Air Fryer — Time & Temperature`;
  const desc = `Air fry ${f.name.toLowerCase()} at ${f.tempF}°F (${tempC}°C) for ${f.lo}–${f.hi} minutes. ${f.note}`;

  const steps = [
    `Set the air fryer to <strong>${f.tempF}°F (${tempC}°C)</strong>. A 2–3 minute preheat is optional but helps browning.`,
    `Cook for <strong>${f.lo}–${f.hi} minutes</strong>. ${flipText[f.flip]}`,
    f.internal
      ? `Check doneness with a thermometer: it's ready at an internal temperature of <strong>${f.internal}°F</strong>.`
      : `Start checking at the ${f.lo}-minute mark — air fryer models vary quite a bit.`,
  ];

  const body = `
<p class="crumb"><a href="/">← Calculator &amp; cheat sheet</a> / ${esc(f.cat)}</p>
<h1>${esc(f.name)} in the Air Fryer</h1>
<div class="stat-row">
  <div class="box"><div class="lbl">Temperature</div><div class="big">${f.tempF}°F</div><div class="lbl">${tempC}°C</div></div>
  <div class="box"><div class="lbl">Time</div><div class="big">${f.lo}–${f.hi}</div><div class="lbl">minutes</div></div>
  ${f.internal ? `<div class="box"><div class="lbl">Done at</div><div class="big">${f.internal}°F</div><div class="lbl">internal</div></div>` : ""}
</div>
<div class="card">
  <h2 style="margin-top:0">How to make it</h2>
  <ol class="steps">${steps.map((s) => `<li>${s}</li>`).join("")}</ol>
  <p><strong>Tip:</strong> ${esc(f.note)}</p>
</div>
<p>Cooking from an oven recipe instead? The <a href="/">conversion calculator</a> turns any oven temperature and time into air fryer settings.</p>
<h2 style="font-size:1.1rem">More ${esc(f.cat.toLowerCase())}</h2>
<div class="related">${related.map((r) => `<a href="/foods/${r.slug}/">${esc(r.name)}</a>`).join("")}</div>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What temperature do you air fry ${f.name.toLowerCase()}?`,
        acceptedAnswer: { "@type": "Answer", text: `${f.tempF}°F (${tempC}°C) is the sweet spot for ${f.name.toLowerCase()} in a basket air fryer.` },
      },
      {
        "@type": "Question",
        name: `How long do you air fry ${f.name.toLowerCase()}?`,
        acceptedAnswer: { "@type": "Answer", text: `${f.lo}–${f.hi} minutes at ${f.tempF}°F. ${f.note}` },
      },
    ],
  };

  return page({ title, desc, path: `/foods/${f.slug}/`, body, jsonLd });
}

// ── Write everything ──────────────────────────────────────────────────
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

writeFileSync(`${OUT}/index.html`, page({
  title: "Air Fryer Conversion Calculator — Oven to Air Fryer Time & Temp",
  desc: `Free calculator to convert any oven recipe to air fryer settings, plus a cook-time cheat sheet for ${foods.length} foods. No ads, no signup.`,
  path: "/",
  body: homeBody,
  jsonLd: homeJsonLd,
}));

for (const f of foods) {
  mkdirSync(`${OUT}/foods/${f.slug}`, { recursive: true });
  writeFileSync(`${OUT}/foods/${f.slug}/index.html`, foodPage(f));
}

copyFileSync("src/styles.css", `${OUT}/styles.css`);
copyFileSync("src/app.js", `${OUT}/app.js`);
if (existsSync("src/og.png")) copyFileSync("src/og.png", `${OUT}/og.png`);

// IndexNow key file (lets us ping search engines about new/changed URLs)
if (existsSync("indexnow-key.txt")) {
  const key = readFileSync("indexnow-key.txt", "utf8").trim();
  writeFileSync(`${OUT}/${key}.txt`, key);
}

const urls = ["/", ...foods.map((f) => `/foods/${f.slug}/`)];
writeFileSync(`${OUT}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${ORIGIN}${u}</loc></url>`).join("\n") +
  `\n</urlset>\n`);

writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`);

console.log(`Built ${urls.length} pages → ${OUT}/`);
