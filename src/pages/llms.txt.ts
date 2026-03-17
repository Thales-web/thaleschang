import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { clientConfig } from "@/config/clientConfig";
import { defaultLocale } from "@/config/siteSettings.json";
import { filterCollectionByLanguage } from "@/js/localeUtils";

/**
 * llms.txt — AI model content index
 *
 * Provides AI systems with a structured overview of the site's
 * content, purpose, and key pages using absolute URLs.
 * See: https://llmstxt.org/
 */

export const GET: APIRoute = async () => {
  const { business } = clientConfig;
  const baseUrl = business.url.replace(/\/$/, "");

  // Fetch content collections
  const allServices = await getCollection("services", (entry) => !entry.data.draft);
  const allBlog = await getCollection("blog", (entry) => !entry.data.draft);
  const allProjects = await getCollection("projects", (entry) => !entry.data.draft);
  const allAuthors = await getCollection("authors");

  // Filter to default locale (cast to preserve type)
  const services = filterCollectionByLanguage(allServices, defaultLocale) as typeof allServices;
  const blog = filterCollectionByLanguage(allBlog, defaultLocale) as typeof allBlog;
  const projects = filterCollectionByLanguage(allProjects, defaultLocale) as typeof allProjects;

  const lines: string[] = [
    `# ${business.name}`,
    "",
    `> ${business.description}`,
    "",
  ];

  // About / Authors section
  lines.push("## About", "");
  lines.push(`- [About](${baseUrl}/about): ${business.name} 소개 페이지`);
  for (const author of allAuthors) {
    lines.push(`- [${author.data.name}](${baseUrl}/authors/${author.id}): ${author.data.about}`);
  }
  lines.push("");

  // Services section
  if (services.length > 0) {
    lines.push("## Services", "");
    for (const service of services) {
      lines.push(`- [${service.data.title}](${baseUrl}/services/${service.id}): ${service.data.description}`);
    }
    lines.push("");
  }

  // Blog section
  if (blog.length > 0) {
    lines.push("## Blog", "");
    for (const post of blog) {
      lines.push(`- [${post.data.title}](${baseUrl}/blog/${post.id}): ${post.data.description}`);
    }
    lines.push("");
  }

  // Projects section
  if (projects.length > 0) {
    lines.push("## Projects", "");
    for (const project of projects) {
      lines.push(`- [${project.data.title}](${baseUrl}/projects/${project.id}): ${project.data.description}`);
    }
    lines.push("");
  }

  // Contact section
  lines.push("## Contact", "");
  if (business.email) lines.push(`- Email: ${business.email}`);
  if (business.phone) lines.push(`- Phone: ${business.phone}`);
  lines.push(`- Website: ${baseUrl}`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
