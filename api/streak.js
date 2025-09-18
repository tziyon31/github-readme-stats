// /api/streak.js  — Edge Function proxy ל-streak-stats

export const config = { runtime: "edge" };

export default async function handler(req) {
  try {
    const { search } = new URL(req.url);
    const upstream = await fetch(
      `https://streak-stats.demolab.com/${search}`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (GitHub README Proxy)" },
        cache: "no-store",
        // חשוב ב-Edge: אין בקשות ארוכות, אז נשמור את זה lean
      }
    );

    const svg = await upstream.text();

    return new Response(svg, {
      status: upstream.status,
      headers: {
        "content-type": "image/svg+xml; charset=utf-8",
        "cache-control": "s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (e) {
    // fallback SVG כדי לא לשבור README
    return new Response(
      `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="40">
         <rect width="100%" height="100%" fill="#0b1020"/>
         <text x="10" y="26" fill="#fff" font-family="Arial" font-size="14">
           Proxy error — try again later
         </text>
       </svg>`,
      {
        status: 200,
        headers: { "content-type": "image/svg+xml; charset=utf-8" },
      }
    );
  }
}
