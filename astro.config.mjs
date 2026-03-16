import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import keystatic from "@keystatic/astro";
import compress from "@playform/compress";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import AutoImport from "astro-auto-import";
import icon from "astro-icon";

// SEO config validation at build start
function seoConfigValidation() {
  return {
    name: "seo-config-validation",
    hooks: {
      "astro:build:start": async () => {
        const { readFileSync } = await import("node:fs");
        const raw = readFileSync("./src/data/settings/client-config/index.json", "utf-8");
        const data = JSON.parse(raw);
        const warnings = [];

        if (!data.businessName || data.businessName === "Your Business Name")
          warnings.push("business.name is not set");
        if (!data.businessUrl || data.businessUrl === "https://yourdomain.com")
          warnings.push("business.url is not set");
        if (!data.businessDescription || data.businessDescription.includes("Your business description"))
          warnings.push("business.description is not set");

        if (warnings.length > 0) {
          console.warn("\n[SEO Config] Warnings:");
          warnings.forEach((w) => console.warn(`  - ${w}`));
          console.warn("  Update in Admin > Client Settings (/admin)\n");
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://starter.cosmicthemes.com",
  adapter: netlify({
    imageCDN: false,
  }),
  redirects: {
    "/admin": "/keystatic",
  },
  // i18n configuration must match src/config/translations.json.ts
  i18n: {
    defaultLocale: "ko",
    locales: ["en", "ko"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    shikiConfig: {
      // Shiki Themes: https://shiki.style/themes
      theme: "css-variables",
      wrap: true,
    },
  },
  integrations: [
    seoConfigValidation(),
    // example auto import component into mdx files
    AutoImport({
      imports: [
        // https://github.com/delucis/astro-auto-import
        "@/components/admonition/Admonition.astro",
        // GEO/AEO components for MDX content
        "@/components/geo/CitationCapsule.astro",
        "@/components/aeo/KeyTakeaways.astro",
        "@/components/aeo/TldrBlock.astro",
        // docs MDX components
        "@/docs/components/mdx-components/Aside.astro",
        "@/docs/components/mdx-components/Badge.astro",
        "@/docs/components/mdx-components/Steps.astro",
        "@/docs/components/mdx-components/Tabs.astro",
        "@/docs/components/mdx-components/TabsContent.astro",
        "@/docs/components/mdx-components/TabsList.astro",
        "@/docs/components/mdx-components/TabsTrigger.astro",
      ],
    }),
    mdx(),
    react(),
    icon(),
    keystatic(),
    sitemap(),
    compress({
      HTML: true,
      JavaScript: true,
      CSS: false, // enabling this can cause issues
      Image: false, // astro:assets handles this. Enabling this can dramatically increase build times
      SVG: false, // astro-icon handles this
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    // stop inlining short scripts to fix issues with ClientRouter
    build: {
      assetsInlineLimit: 0,
    },
    optimizeDeps: {
      include: ["motion-on-scroll"],
      exclude: ["@keystatic/astro"],
    },
  },
});
