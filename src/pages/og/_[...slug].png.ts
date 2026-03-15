/**
 * Dynamic OG Image Generation
 *
 * Generates branded Open Graph images for blog posts using satori.
 * Each image includes: post title, description, date, and site branding.
 *
 * Usage: /og/en/my-blog-post.png
 *
 * To enable: npm install satori sharp
 * Without these packages, this endpoint generates no pages (safe to leave in place).
 */

import type { APIRoute, GetStaticPathsResult } from "astro";

// Check if required packages are available
let hasSatori = false;
try {
  await import("satori");
  await import("sharp");
  hasSatori = true;
} catch {
  // satori/sharp not installed — endpoint will generate no pages
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  if (!hasSatori) return [];

  const { getAllPosts } = await import("@/js/blogUtils");
  const posts = await getAllPosts();

  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const satori = (await import("satori")).default;
  const sharp = (await import("sharp")).default;

  const { clientConfig } = await import("@/config/clientConfig");
  const { formatDate } = await import("@/js/textUtils");

  const { post } = props;
  const title = post.data.title;
  const description = post.data.description.slice(0, 120);
  const date = formatDate(post.data.pubDate, "ko");
  const businessName = clientConfig.business.name;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          color: "white",
          fontFamily: "sans-serif",
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column", gap: "20px" },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "48px",
                      fontWeight: 700,
                      lineHeight: 1.3,
                      maxWidth: "900px",
                      overflow: "hidden",
                    },
                    children: title,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "24px",
                      opacity: 0.8,
                      lineHeight: 1.5,
                      maxWidth: "800px",
                    },
                    children: description,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "2px solid rgba(255,255,255,0.2)",
                paddingTop: "30px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { fontSize: "28px", fontWeight: 600 },
                    children: businessName,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { fontSize: "22px", opacity: 0.7 },
                    children: date,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
