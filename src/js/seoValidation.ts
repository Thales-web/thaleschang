/**
 * Build-time SEO Validation
 *
 * Checks content frontmatter for common SEO issues and logs warnings.
 * Run via: npx astro build (automatically invoked in BaseHead.astro)
 * Or standalone: npx tsx src/js/seoValidation.ts
 */

import { getCollection } from "astro:content";

interface SeoIssue {
  severity: "error" | "warning" | "info";
  collection: string;
  id: string;
  message: string;
}

export async function validateSeo(): Promise<SeoIssue[]> {
  const issues: SeoIssue[] = [];

  // Validate blog posts
  const blogPosts = await getCollection("blog", ({ data }) => data.draft !== true);
  for (const post of blogPosts) {
    const { title, description, metaDescription } = post.data;
    const desc = metaDescription || description;

    // Title length (30-60 chars optimal for SERP)
    if (title.length < 30) {
      issues.push({
        severity: "warning",
        collection: "blog",
        id: post.id,
        message: `Title too short (${title.length} chars). Aim for 30-60 characters.`,
      });
    }
    if (title.length > 60) {
      issues.push({
        severity: "warning",
        collection: "blog",
        id: post.id,
        message: `Title may be truncated in SERP (${title.length} chars). Aim for ≤60 characters.`,
      });
    }

    // Meta description length (120-160 chars optimal)
    if (desc.length < 120) {
      issues.push({
        severity: "warning",
        collection: "blog",
        id: post.id,
        message: `Description too short (${desc.length} chars). Aim for 120-160 characters.`,
      });
    }
    if (desc.length > 160) {
      issues.push({
        severity: "info",
        collection: "blog",
        id: post.id,
        message: `Description may be truncated (${desc.length} chars). Aim for ≤160 characters.`,
      });
    }

    // Missing hero image
    if (!post.data.heroImage) {
      issues.push({
        severity: "warning",
        collection: "blog",
        id: post.id,
        message: "No heroImage set. Blog posts with images get higher engagement.",
      });
    }
  }

  // Validate services
  const services = await getCollection("services", ({ data }) => data.draft !== true);
  for (const service of services) {
    const desc = service.data.metaDescription || service.data.description;

    if (desc.length < 120) {
      issues.push({
        severity: "warning",
        collection: "services",
        id: service.id,
        message: `Description too short (${desc.length} chars). Aim for 120-160 characters.`,
      });
    }
  }

  // Validate projects
  const projects = await getCollection("projects", ({ data }) => data.draft !== true);
  for (const project of projects) {
    const desc = project.data.metaDescription || project.data.description;

    if (desc.length < 120) {
      issues.push({
        severity: "warning",
        collection: "projects",
        id: project.id,
        message: `Description too short (${desc.length} chars). Aim for 120-160 characters.`,
      });
    }
  }

  return issues;
}

export function logSeoIssues(issues: SeoIssue[]): void {
  if (issues.length === 0) return;

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const infos = issues.filter((i) => i.severity === "info");

  console.warn("\n[SEO Validation] Results:");

  if (errors.length > 0) {
    console.error(`  ❌ ${errors.length} error(s):`);
    errors.forEach((e) => console.error(`    - [${e.collection}/${e.id}] ${e.message}`));
  }
  if (warnings.length > 0) {
    console.warn(`  ⚠️  ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.warn(`    - [${w.collection}/${w.id}] ${w.message}`));
  }
  if (infos.length > 0) {
    console.info(`  ℹ️  ${infos.length} info(s):`);
    infos.forEach((i) => console.info(`    - [${i.collection}/${i.id}] ${i.message}`));
  }
  console.warn("");
}
