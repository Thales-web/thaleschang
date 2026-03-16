import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { clientConfig } from "@/config/clientConfig";
import { defaultLocale } from "@/config/siteSettings.json";
import { filterCollectionByLanguage } from "@/js/localeUtils";

export const GET: APIRoute = async () => {
  const { business } = clientConfig;

  // Fetch content collections
  const allServices = await getCollection("services", (entry) => !entry.data.draft);
  const allBlog = await getCollection("blog", (entry) => !entry.data.draft);
  const allProjects = await getCollection("projects", (entry) => !entry.data.draft);

  // Filter to default locale
  const services = filterCollectionByLanguage(allServices, defaultLocale);
  const blog = filterCollectionByLanguage(allBlog, defaultLocale);
  const projects = filterCollectionByLanguage(allProjects, defaultLocale);

  const lines: string[] = [
    `# ${business.name}`,
    "",
    `> ${business.description}`,
    "",
  ];

  // Services section
  if (services.length > 0) {
    lines.push("## Services", "");
    for (const service of services) {
      lines.push(`- [${service.data.title}](/services/${service.id}): ${service.data.description}`);
    }
    lines.push("");
  }

  // Blog section
  if (blog.length > 0) {
    lines.push("## Blog", "");
    for (const post of blog) {
      lines.push(`- [${post.data.title}](/blog/${post.id}): ${post.data.description}`);
    }
    lines.push("");
  }

  // Projects section
  if (projects.length > 0) {
    lines.push("## Projects", "");
    for (const project of projects) {
      lines.push(`- [${project.data.title}](/projects/${project.id}): ${project.data.description}`);
    }
    lines.push("");
  }

  // Contact section
  lines.push("## Contact", "");
  if (business.email) lines.push(`- Email: ${business.email}`);
  if (business.phone) lines.push(`- Phone: ${business.phone}`);
  lines.push(`- Website: ${business.url}`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
