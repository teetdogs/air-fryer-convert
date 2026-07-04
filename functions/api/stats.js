// GET /api/stats — read-only traffic summary (last 30 days).
// Aggregate-only output, so it's fine for this to be public.
export async function onRequestGet({ env }) {
  const q = (sql) => env.DB.prepare(sql).all();

  const [byDay, topPaths, topRefs, devices, total] = await Promise.all([
    q(`SELECT date(ts) AS day, COUNT(*) AS views FROM hits
       WHERE ts > datetime('now','-30 days') AND device != 'bot'
       GROUP BY day ORDER BY day`),
    q(`SELECT path, COUNT(*) AS views FROM hits
       WHERE ts > datetime('now','-30 days') AND device != 'bot'
       GROUP BY path ORDER BY views DESC LIMIT 15`),
    q(`SELECT ref, COUNT(*) AS views FROM hits
       WHERE ts > datetime('now','-30 days') AND device != 'bot' AND ref != ''
       GROUP BY ref ORDER BY views DESC LIMIT 15`),
    q(`SELECT device, COUNT(*) AS views FROM hits
       WHERE ts > datetime('now','-30 days')
       GROUP BY device`),
    q(`SELECT COUNT(*) AS views FROM hits WHERE device != 'bot'`),
  ]);

  return Response.json({
    totalHumanViews: total.results[0].views,
    last30Days: byDay.results,
    topPages: topPaths.results,
    topReferrers: topRefs.results,
    devices: devices.results,
  }, { headers: { "cache-control": "no-store" } });
}
