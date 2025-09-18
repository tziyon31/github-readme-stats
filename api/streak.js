export default async function handler(req, res) {
  try {
    const url = new URL("https://streak-stats.demolab.com/");
    for (const [k, v] of Object.entries(req.query || {})) {
      if (typeof v === "string") url.searchParams.append(k, v);
    }

    const upstream = await fetch(url.toString(), {
      headers: { "User-Agent": "Mozilla/5.0 (GitHub README Proxy)" },
    });

    const svg = await upstream.text();

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=600");
    res.status(upstream.ok ? 200 : upstream.status).send(svg);
  } catch (err) {
    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res
      .status(200)
      .send(
        `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="40">
           <rect width="100%" height="100%" fill="#0b1020"/>
           <text x="10" y="26" fill="#fff" font-family="Arial" font-size="14">
             Proxy error — try again later
           </text>
         </svg>`
      );
  }
}
