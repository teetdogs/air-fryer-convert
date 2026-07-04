// POST /api/hit — record one pageview. No cookies, no IPs, no fingerprinting:
// just path, referrer hostname, coarse user-agent class, and a timestamp.
export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const path = String(body.path || "/").slice(0, 200);

    let ref = "";
    try { ref = body.ref ? new URL(body.ref).hostname : ""; } catch { ref = "other"; }
    // Ignore self-referrals so internal navigation doesn't look like a source.
    if (ref.endsWith("airfryerconvert.pages.dev")) ref = "";

    const ua = request.headers.get("user-agent") || "";
    const device = /bot|crawl|spider/i.test(ua) ? "bot"
      : /mobile|iphone|android/i.test(ua) ? "mobile" : "desktop";

    await env.DB.prepare(
      "INSERT INTO hits (ts, path, ref, device) VALUES (datetime('now'), ?, ?, ?)"
    ).bind(path, ref.slice(0, 100), device).run();
  } catch {
    // Swallow everything — analytics failures should be invisible to visitors.
  }
  return new Response(null, { status: 204 });
}
