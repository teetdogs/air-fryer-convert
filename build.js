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
<meta name="google-site-verification" content="LcpnVLHXPmKgp6twzPgq8_SUbKhG1YailyAN24X9TO4">
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
  <p>AirFryerConvert is a free tool — no ads, no signup, no cookies.
     <a href="https://github.com/teetdogs/air-fryer-convert">Open source on GitHub</a> ·
     <a href="/stats/">Live visitor stats</a> (this site is an AI-built experiment — the numbers are public).</p>
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
      <label for="oven-temp"><span id="in-temp-word">Oven</span> temperature
        <span class="unit-toggle"><button id="btn-f" class="on" type="button">°F</button><button id="btn-c" type="button">°C</button></span>
      </label>
      <input id="oven-temp" type="number" inputmode="numeric" value="400" min="1">
    </div>
    <div class="field">
      <label for="oven-time"><span id="in-time-word">Oven</span> time (minutes)</label>
      <input id="oven-time" type="number" inputmode="numeric" value="20" min="1">
    </div>
  </div>
  <label class="check"><input id="convection" type="checkbox"> My recipe is for a convection / fan oven</label>
  <label class="check">My air fryer:
    <select id="fryer">
      <option value="standard" selected>Standard basket (1500–1800W)</option>
      <option value="compact">Compact / low wattage (&lt;1500W) — runs slower</option>
      <option value="large">Large or oven-style (1800W+) — runs faster</option>
    </select>
  </label>
  <div class="result">
    <div class="box"><div class="lbl"><span class="out-word">Air fryer</span> temp</div><div class="big" id="out-temp">375°F</div></div>
    <div class="box"><div class="lbl"><span class="out-word">Air fryer</span> time</div><div class="big" id="out-time">16 min</div></div>
  </div>
  <button id="swap" class="swap" type="button">↔ Going the other way? Air fryer → oven</button>
  <p class="rule-note">The rule of thumb: <strong>−25°F (−15°C), −20% time.</strong> Start checking a couple of minutes early — every air fryer runs a little different.</p>
</div>

<section id="cheat-sheet">
  <h1 style="font-size:1.5rem">Air Fryer Cook Times Cheat Sheet
    <button class="print-btn" onclick="window.print()" type="button">🖨 Print</button></h1>
  <input class="search" id="food-search" type="search" placeholder="Search ${foods.length} foods… (wings, salmon, fries)" aria-label="Search foods">
  ${tableHtml}
</section>

<section class="card">
  <h2 style="margin-top:0">Air Fryer Conversion FAQ</h2>
  ${faqHtml}
</section>

<h2 style="font-size:1.1rem">Quick oven-temperature conversions</h2>
<div class="related">${[300, 325, 350, 375, 400, 425, 450].map((t) => `<a href="/convert/${t}-oven-to-air-fryer/">${t}°F oven</a>`).join("")}
${[140, 150, 160, 170, 180, 190, 200, 220].map((c) => `<a href="/convert/${c}c-oven-to-air-fryer/">${c}°C oven</a>`).join("")}</div>`;

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

// ── Oven-temp conversion pages (/convert/350-oven-to-air-fryer/) ─────
// "convert 350 oven to air fryer" is a heavily searched query family;
// each common oven temperature gets a page with the direct answer.
const OVEN_TEMPS = [300, 325, 350, 375, 400, 425, 450];

function convertPage(f) {
  const af = f - 25;
  const afC = fToC(af);
  const ovenC = fToC(f);
  const times = [10, 15, 20, 25, 30, 45, 60];
  const title = `${f}°F Oven to Air Fryer Conversion — Use ${af}°F and Less Time`;
  const desc = `A ${f}°F oven recipe converts to about ${af}°F (${afC}°C) in an air fryer, with roughly 20% less cooking time. See converted times for 10–60 minute recipes.`;

  const rows = times.map((t) => `
    <tr><td class="t">${t} min</td><td class="t">${Math.round(t * 0.8)} min</td></tr>`).join("");

  const related = foods.filter((x) => Math.abs(x.tempF - af) <= 10).slice(0, 6);
  const others = OVEN_TEMPS.filter((t) => t !== f);

  const body = `
<p class="crumb"><a href="/">← Calculator &amp; cheat sheet</a> / Oven conversions</p>
<h1>${f}°F Oven to Air Fryer</h1>
<div class="stat-row">
  <div class="box"><div class="lbl">Oven says</div><div class="big">${f}°F</div><div class="lbl">${ovenC}°C</div></div>
  <div class="box"><div class="lbl">Air fryer setting</div><div class="big">${af}°F</div><div class="lbl">${afC}°C</div></div>
  <div class="box"><div class="lbl">Cooking time</div><div class="big">−20%</div><div class="lbl">check early</div></div>
</div>
<div class="card">
  <h2 style="margin-top:0">Converted cooking times at ${f}°F</h2>
  <table class="foods">
    <thead><tr><th>Oven time (${f}°F)</th><th>Air fryer time (${af}°F)</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="rule-note">Air fryers are small convection ovens — the fan and close heating element cook faster,
  so you drop the temperature about 25°F and cut the time about 20%. Start checking a few minutes
  early the first time; models vary. For a convection/fan oven recipe, drop only ~10°F and ~10% time.</p>
</div>
<p>Need a different temperature or time? The <a href="/">conversion calculator</a> handles any recipe, in °F or °C.</p>
${related.length ? `<h2 style="font-size:1.1rem">Foods that cook near ${af}°F in the air fryer</h2>
<div class="related">${related.map((r) => `<a href="/foods/${r.slug}/">${esc(r.name)}</a>`).join("")}</div>` : ""}
<h2 style="font-size:1.1rem">Other oven temperatures</h2>
<div class="related">${others.map((t) => `<a href="/convert/${t}-oven-to-air-fryer/">${t}°F oven</a>`).join("")}</div>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${f} degrees in an air fryer?`,
        acceptedAnswer: { "@type": "Answer", text: `A ${f}°F oven temperature converts to about ${af}°F (${afC}°C) in an air fryer. Also reduce the cooking time by roughly 20%.` },
      },
      {
        "@type": "Question",
        name: `How long do I cook a ${f}°F oven recipe in the air fryer?`,
        acceptedAnswer: { "@type": "Answer", text: `Multiply the oven time by 0.8 at ${af}°F: a 20-minute oven recipe takes about 16 minutes, a 30-minute recipe about 24 minutes. Check a few minutes early — air fryer models vary.` },
      },
    ],
  };

  return page({ title, desc, path: `/convert/${f}-oven-to-air-fryer/`, body, jsonLd });
}

// ── Celsius oven-temp pages (/convert/180c-oven-to-air-fryer/) ────────
// UK/EU searchers ask "180 c oven to air fryer" — °C recipes also often
// state fan-oven temps, so each page answers both cases.
const C_TEMPS = [140, 150, 160, 170, 180, 190, 200, 220];
const cToF = (c) => Math.round((c * 9 / 5 + 32) / 5) * 5;

function convertPageC(c) {
  const af = c - 15;        // from a conventional °C recipe
  const afFan = c - 5;      // from a fan/convection °C recipe
  const times = [10, 15, 20, 25, 30, 45, 60];
  const title = `${c}°C Oven to Air Fryer Conversion — Use ${af}°C and Less Time`;
  const desc = `A ${c}°C oven recipe converts to about ${af}°C in an air fryer (${afFan}°C if the recipe was for a fan oven), with roughly 20% less cooking time.`;

  const rows = times.map((t) => `
    <tr><td class="t">${t} min</td><td class="t">${Math.round(t * 0.8)} min</td></tr>`).join("");
  const others = C_TEMPS.filter((t) => t !== c);

  const body = `
<p class="crumb"><a href="/">← Calculator &amp; cheat sheet</a> / Oven conversions (°C)</p>
<h1>${c}°C Oven to Air Fryer</h1>
<div class="stat-row">
  <div class="box"><div class="lbl">Oven says</div><div class="big">${c}°C</div><div class="lbl">${cToF(c)}°F</div></div>
  <div class="box"><div class="lbl">Air fryer setting</div><div class="big">${af}°C</div><div class="lbl">from conventional</div></div>
  <div class="box"><div class="lbl">If fan oven recipe</div><div class="big">${afFan}°C</div><div class="lbl">smaller drop</div></div>
</div>
<div class="card">
  <h2 style="margin-top:0">Converted cooking times at ${c}°C</h2>
  <table class="foods">
    <thead><tr><th>Oven time (${c}°C)</th><th>Air fryer time (${af}°C)</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="rule-note">From a conventional oven recipe, drop about 15°C and cut the time about 20%.
  Fan (convection) recipes already assume circulating air, so the change is smaller: about −5°C and −10% time.
  Start checking a few minutes early — air fryer models vary.</p>
</div>
<p>Different temperature or time? The <a href="/">conversion calculator</a> handles any recipe in °C or °F.</p>
<h2 style="font-size:1.1rem">Other oven temperatures</h2>
<div class="related">${others.map((t) => `<a href="/convert/${t}c-oven-to-air-fryer/">${t}°C oven</a>`).join("")}
${OVEN_TEMPS.map((t) => `<a href="/convert/${t}-oven-to-air-fryer/">${t}°F oven</a>`).join("")}</div>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is ${c} degrees Celsius in an air fryer?`,
        acceptedAnswer: { "@type": "Answer", text: `A ${c}°C conventional oven temperature converts to about ${af}°C in an air fryer (use ${afFan}°C if the recipe was written for a fan oven). Also reduce cooking time by roughly 20%.` },
      },
      {
        "@type": "Question",
        name: `How long do I cook a ${c}°C oven recipe in the air fryer?`,
        acceptedAnswer: { "@type": "Answer", text: `Multiply the oven time by 0.8 at ${af}°C: a 20-minute oven recipe takes about 16 minutes. Check early — models vary.` },
      },
    ],
  };

  return page({ title, desc, path: `/convert/${c}c-oven-to-air-fryer/`, body, jsonLd });
}

// ── Public live-stats page (/stats/) ──────────────────────────────────
// The experiment is public, so its traffic numbers are too.
function statsPage() {
  const body = `
<h1>Live Experiment Stats</h1>
<p class="sub">This site was built and launched autonomously by Claude (an AI) as a $0-budget
experiment in building something people actually use. These are its real visitor numbers,
straight from the site's own cookieless analytics. Updated on every page load.</p>
<div class="card">
  <div class="stat-row" id="totals"><div class="box"><div class="lbl">Loading</div><div class="big">…</div></div></div>
  <h2 style="font-size:1rem">Daily visits (last 30 days)</h2>
  <div id="chart" style="display:flex;align-items:flex-end;gap:3px;height:120px"></div>
</div>
<div class="card"><h2 style="margin-top:0;font-size:1rem">Where visitors come from</h2><table class="foods" id="refs"></table></div>
<div class="card"><h2 style="margin-top:0;font-size:1rem">Most-viewed pages</h2><table class="foods" id="pages"></table></div>
<p><a href="/">← Back to the calculator</a></p>
<script>
fetch("/api/stats").then(r => r.json()).then(s => {
  const totalDevices = s.devices.filter(d => d.device !== "bot").reduce((a, d) => a + d.views, 0);
  const bots = (s.devices.find(d => d.device === "bot") || {}).views || 0;
  document.getElementById("totals").innerHTML =
    '<div class="box"><div class="lbl">Human pageviews</div><div class="big">' + s.totalHumanViews + '</div></div>' +
    '<div class="box"><div class="lbl">Search-engine bot hits</div><div class="big">' + bots + '</div></div>';
  const max = Math.max(1, ...s.last30Days.map(d => d.views));
  document.getElementById("chart").innerHTML = s.last30Days.map(d =>
    '<div title="' + d.day + ': ' + d.views + '" style="flex:1;background:var(--accent);border-radius:3px 3px 0 0;height:' +
    Math.max(4, Math.round(d.views / max * 110)) + 'px"></div>').join("");
  const row = (a, b) => '<tr><td>' + a + '</td><td class="t">' + b + '</td></tr>';
  document.getElementById("refs").innerHTML = "<tbody>" +
    (s.topReferrers.length ? s.topReferrers.map(r => row(r.ref, r.views)).join("") : row("(direct / none yet)", "—")) + "</tbody>";
  document.getElementById("pages").innerHTML = "<tbody>" + s.topPages.map(p =>
    row('<a href="' + p.path + '">' + p.path + '</a>', p.views)).join("") + "</tbody>";
});
</script>`;
  return page({
    title: "Live Stats — the AI-built Air Fryer Convert experiment",
    desc: "Real-time visitor numbers for Air Fryer Convert, a website built and launched autonomously by Claude (an AI) on a $0 budget.",
    path: "/stats/",
    body,
  });
}

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
  <p class="rule-note">Times assume a standard 1500–1800W basket air fryer. Compact or very full
  baskets can need 2–3 extra minutes; large oven-style units often finish a bit sooner.</p>
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

for (const t of OVEN_TEMPS) {
  mkdirSync(`${OUT}/convert/${t}-oven-to-air-fryer`, { recursive: true });
  writeFileSync(`${OUT}/convert/${t}-oven-to-air-fryer/index.html`, convertPage(t));
}

for (const c of C_TEMPS) {
  mkdirSync(`${OUT}/convert/${c}c-oven-to-air-fryer`, { recursive: true });
  writeFileSync(`${OUT}/convert/${c}c-oven-to-air-fryer/index.html`, convertPageC(c));
}

mkdirSync(`${OUT}/stats`, { recursive: true });
writeFileSync(`${OUT}/stats/index.html`, statsPage());

copyFileSync("src/styles.css", `${OUT}/styles.css`);
if (existsSync("src/google3b9dddb74fd3526a.html")) copyFileSync("src/google3b9dddb74fd3526a.html", `${OUT}/google3b9dddb74fd3526a.html`);
copyFileSync("src/app.js", `${OUT}/app.js`);
if (existsSync("src/og.png")) copyFileSync("src/og.png", `${OUT}/og.png`);
if (existsSync("src/pin.png")) copyFileSync("src/pin.png", `${OUT}/pin.png`);
if (existsSync("src/_headers")) copyFileSync("src/_headers", `${OUT}/_headers`);

// IndexNow key file (lets us ping search engines about new/changed URLs)
if (existsSync("indexnow-key.txt")) {
  const key = readFileSync("indexnow-key.txt", "utf8").trim();
  writeFileSync(`${OUT}/${key}.txt`, key);
}

const urls = ["/", ...foods.map((f) => `/foods/${f.slug}/`),
  ...OVEN_TEMPS.map((t) => `/convert/${t}-oven-to-air-fryer/`),
  ...C_TEMPS.map((c) => `/convert/${c}c-oven-to-air-fryer/`), "/stats/"];
writeFileSync(`${OUT}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${ORIGIN}${u}</loc></url>`).join("\n") +
  `\n</urlset>\n`);

writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${ORIGIN}/sitemap.xml\n`);

console.log(`Built ${urls.length} pages → ${OUT}/`);
