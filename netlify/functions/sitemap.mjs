const SITE_URL = "https://grits.online";

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function urlEntry(location, lastModified) {
  const lastmod = lastModified ? `\n    <lastmod>${escapeXml(lastModified)}</lastmod>` : "";
  return `  <url>\n    <loc>${escapeXml(location)}</loc>${lastmod}\n  </url>`;
}

async function publishedPosts() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return [];

  const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/posts?select=slug,updated_at,published_at&published=eq.true&order=published_at.desc`;
  const response = await fetch(endpoint, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });
  if (!response.ok) throw new Error(`Supabase returned ${response.status}`);
  return response.json();
}

export const handler = async () => {
  let posts = [];
  try {
    posts = await publishedPosts();
  } catch (error) {
    console.error("Could not load posts for sitemap", error);
  }

  const entries = [
    urlEntry(`${SITE_URL}/`),
    urlEntry(`${SITE_URL}/stories`),
    ...posts.map((post) => urlEntry(
      `${SITE_URL}/stories/${encodeURIComponent(post.slug)}`,
      post.updated_at ?? post.published_at,
    )),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
    body,
  };
};
