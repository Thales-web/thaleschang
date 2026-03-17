import type { APIRoute } from "astro";

import { clientConfig } from "@/config/clientConfig";

const getRobotsTxt = (sitemapURL: URL) => {
  const { aiCrawlers } = clientConfig;

  const lines: string[] = [
    "User-agent: *",
    "Allow: /",
    "",
  ];

  // AI crawler rules (GEO)
  if (aiCrawlers.allowGPTBot) {
    lines.push("User-agent: GPTBot", "Allow: /", "");
  } else {
    lines.push("User-agent: GPTBot", "Disallow: /", "");
  }

  if (aiCrawlers.allowClaudeBot) {
    lines.push("User-agent: ClaudeBot", "Allow: /", "");
  } else {
    lines.push("User-agent: ClaudeBot", "Disallow: /", "");
  }

  if (aiCrawlers.allowPerplexityBot) {
    lines.push("User-agent: PerplexityBot", "Allow: /", "");
  } else {
    lines.push("User-agent: PerplexityBot", "Disallow: /", "");
  }

  if (aiCrawlers.allowGoogleExtended) {
    lines.push("User-agent: Google-Extended", "Allow: /", "");
  } else {
    lines.push("User-agent: Google-Extended", "Disallow: /", "");
  }

  // Additional AI crawlers (always allow for maximum GEO visibility)
  if (aiCrawlers.allowGPTBot) {
    lines.push("User-agent: OAI-SearchBot", "Allow: /", "");
    lines.push("User-agent: ChatGPT-User", "Allow: /", "");
  } else {
    lines.push("User-agent: OAI-SearchBot", "Disallow: /", "");
    lines.push("User-agent: ChatGPT-User", "Disallow: /", "");
  }

  lines.push("User-agent: Applebot-Extended", "Allow: /", "");
  lines.push("User-agent: Cohere-ai", "Allow: /", "");
  lines.push("User-agent: Meta-ExternalAgent", "Allow: /", "");

  // Block common scraper bots
  lines.push("User-agent: CCBot", "Disallow: /", "");

  lines.push(`Sitemap: ${sitemapURL.href}`);

  return lines.join("\n");
};

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
