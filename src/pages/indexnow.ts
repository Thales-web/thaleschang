import type { APIRoute } from "astro";

/**
 * IndexNow API endpoint
 *
 * Allows notifying Bing, Yandex, and other search engines of content changes.
 * Usage: POST /indexnow with JSON body { "urls": ["/blog/my-post/"] }
 *
 * The API key is stored in the environment variable INDEXNOW_API_KEY.
 * You must also place a text file at /[key].txt containing the key itself.
 */

export const POST: APIRoute = async ({ request, site }) => {
  const apiKey = import.meta.env.INDEXNOW_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "INDEXNOW_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const body = await request.json();
    const urls: string[] = body.urls || [];

    if (urls.length === 0) {
      return new Response(
        JSON.stringify({ error: "No URLs provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const siteUrl = site?.toString().replace(/\/$/, "") || "";
    const fullUrls = urls.map((url) =>
      url.startsWith("http") ? url : `${siteUrl}${url}`,
    );

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: new URL(siteUrl).host,
        key: apiKey,
        keyLocation: `${siteUrl}/${apiKey}.txt`,
        urlList: fullUrls,
      }),
    });

    return new Response(
      JSON.stringify({
        success: response.ok,
        status: response.status,
        urlsSubmitted: fullUrls.length,
      }),
      { status: response.ok ? 200 : 502, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to submit to IndexNow" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
