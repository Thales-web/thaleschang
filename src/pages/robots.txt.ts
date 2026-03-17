import type { APIRoute } from "astro";

import { clientConfig } from "@/config/clientConfig";

/**
 * Dynamic robots.txt generator with GEO-optimized AI crawler management
 *
 * Architecture: Training vs Search separation
 * ─────────────────────────────────────────────
 * AI crawlers fall into two categories:
 *
 * 1. Training bots — crawl content to train AI models
 *    GPTBot (OpenAI), ClaudeBot (Anthropic), Google-Extended (Gemini), CCBot (Common Crawl)
 *
 * 2. Search bots — crawl content to serve real-time AI search results
 *    OAI-SearchBot (ChatGPT search), ChatGPT-User (ChatGPT browsing),
 *    PerplexityBot (Perplexity search)
 *
 * This separation lets you block AI training while keeping AI search visibility.
 * Example: block GPTBot (training) but allow OAI-SearchBot (search) = your content
 * won't train OpenAI models, but ChatGPT search can still cite you.
 *
 * Always-allowed bots (not configurable):
 *    Applebot-Extended, Cohere-ai, Meta-ExternalAgent, Amazonbot, Bytespider
 *    — These have minimal risk and blocking them reduces visibility without benefit.
 */

type BotRule = {
  agent: string;
  allow: boolean;
  comment?: string;
};

const getRobotsTxt = (sitemapURL: URL) => {
  const { aiCrawlers } = clientConfig;
  const lines: string[] = [];

  // ── General crawlers ──────────────────────────────────────
  lines.push(
    "# General",
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /keystatic",
    "",
  );

  // ── AI Training bots (configurable) ───────────────────────
  const trainingBots: BotRule[] = [
    { agent: "GPTBot", allow: aiCrawlers.allowGPTBot, comment: "OpenAI training" },
    { agent: "ClaudeBot", allow: aiCrawlers.allowClaudeBot, comment: "Anthropic training" },
    { agent: "Google-Extended", allow: aiCrawlers.allowGoogleExtended, comment: "Google AI training" },
    { agent: "CCBot", allow: aiCrawlers.allowCCBot, comment: "Common Crawl (open-source AI)" },
  ];

  lines.push("# AI Training Crawlers");
  for (const bot of trainingBots) {
    lines.push(
      `User-agent: ${bot.agent}`,
      bot.allow ? "Allow: /" : "Disallow: /",
      "",
    );
  }

  // ── AI Search bots (configurable, independent from training) ──
  const searchBots: BotRule[] = [
    { agent: "OAI-SearchBot", allow: aiCrawlers.allowOAISearchBot, comment: "ChatGPT web search" },
    { agent: "ChatGPT-User", allow: aiCrawlers.allowOAISearchBot, comment: "ChatGPT browsing" },
    { agent: "PerplexityBot", allow: aiCrawlers.allowPerplexityBot, comment: "Perplexity AI search" },
  ];

  lines.push("# AI Search Crawlers");
  for (const bot of searchBots) {
    lines.push(
      `User-agent: ${bot.agent}`,
      bot.allow ? "Allow: /" : "Disallow: /",
      "",
    );
  }

  // ── Always-allowed AI bots (no config needed) ─────────────
  const alwaysAllowBots = [
    "Applebot-Extended",
    "Cohere-ai",
    "Meta-ExternalAgent",
    "Amazonbot",
    "Bytespider",
    "FacebookBot",
  ];

  lines.push("# Other AI & Platform Crawlers (always allowed)");
  for (const agent of alwaysAllowBots) {
    lines.push(`User-agent: ${agent}`, "Allow: /", "");
  }

  // ── Malicious bot blocking ────────────────────────────────
  const blockedBots = [
    "AhrefsBot",
    "SemrushBot",
    "DotBot",
    "MJ12bot",
  ];

  lines.push("# Blocked scrapers");
  for (const agent of blockedBots) {
    lines.push(`User-agent: ${agent}`, "Disallow: /", "");
  }

  // ── Sitemap ───────────────────────────────────────────────
  lines.push(`Sitemap: ${sitemapURL.href}`);

  return lines.join("\n");
};

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
