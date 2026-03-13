/**
 * * Configuration of the i18n system data files and text translations
 * Example translations below are for English and French, with textTranslations used in src/layouts/BlogLayoutCenter.astro and src/components/Hero/[hero].astro
 */

/**
 * * Data file configuration for the i18n system
 * Every {Data} key must exist in the below object
 */
import testimonialDataKo from "./ko/testimonialData.json";
import siteDataKo from "./ko/siteData.json";
import navDataKo from "./ko/navData.json";
import faqDataKo from "./ko/faqData.json";
import faqDataEn from "./en/faqData.json";
import navDataEn from "./en/navData.json";
import siteDataEn from "./en/siteData.json";
import testimonialDataEn from "./en/testimonialData.json";

import sidebarNavDataKo from "@/docs/config/ko/sidebarNavData.json";
import sidebarNavDataEn from "@/docs/config/en/sidebarNavData.json";


export const dataTranslations = {
  ko: {
    faqData: faqDataKo,
    navData: navDataKo,
    siteData: siteDataKo,
    testimonialData: testimonialDataKo,
    sidebarNavData: sidebarNavDataKo,
  },
  en: {
    siteData: siteDataEn,
    navData: navDataEn,
    testimonialData: testimonialDataEn,
    faqData: faqDataEn,
    sidebarNavData: sidebarNavDataEn,
  },

} as const;

/**
 * * Text translations are used with the `useTranslation` function from src/js/i18nUtils.ts to translate various strings on your site.
 *
 * ## Example
 *
 * ```ts
 * import { getLocaleFromUrl } from "@/js/localeUtils";
 * import { useTranslations } from "@/js/translationUtils";
 * const currLocale = getLocaleFromUrl(Astro.url);
 * const t = useTranslations(currLocale);
 * t("back_to_all_posts"); // this would be "Retour à tous les articles" if the current locale is "fr"
 * ```
 * or
 * ```ts
 * import { useTranslations } from "@/js/translationUtils";
 * const t = useTranslations("fr");
 * t("back_to_all_posts"); // this would be "Retour à tous les articles"
 * ```
 */
export const textTranslations = {
  ko: {
    hero_text: "Everything you need for an amazing website.",
    hero_description: `Transforming ideas into beautiful, functional designs that leave lasting impressions.`,

    // blog
    back_to_all_posts: "Back to all posts",
    updated: "Updated",
    share_this_article: "Share this article",
    table_of_contents: "Table of Contents",
    tags: "Tags",
    related_posts: "Related Posts",

    // docs
    docs_title: "문서",
    docs_previous: "이전",
    docs_next: "다음",
    docs_on_this_page: "이 페이지에서",
    docs_search_placeholder: "문서 검색...",
  },
  en: {
    hero_text: "Everything you need for an amazing website.",
    hero_description: `Transforming ideas into beautiful, functional designs that leave lasting impressions.`,

    // blog
    back_to_all_posts: "Back to all posts",
    updated: "Updated",
    share_this_article: "Share this article",
    table_of_contents: "Table of Contents",
    tags: "Tags",
    related_posts: "Related Posts",

    // docs
    docs_title: "Documentation",
    docs_previous: "Previous",
    docs_next: "Next",
    docs_on_this_page: "On this page",
    docs_search_placeholder: "Search docs...",
  },
  
} as const;

/**
 * * Route translations are used to translate route names for the language switcher component
 * This can be useful for SEO reasons. The key does not matter, it just needs to match between languages
 *
 * These routes must be everything after the base domain. So if this is "atlas.com/blog", the route would be "blog"
 * Or if this is "atlas.com/legal/privacy", the route would be "legal/privacy"
 *
 * This also supports wildcards. For example, "categories/*" would match "categories/1" or "categories/2" etc for that language.
 *
 * Note: This works in conjunction with the localizedCollections object below
 */
export const routeTranslations = {
  ko: {
    aboutKey: "about",
    categoryKey: "categories",
    categoryKey2: "categories/*",
    categoryKey3: "categories",
    tagKey: "tags",
    tagKey2: "tags/*",
    tagKey3: "tags",
    blogKey: "blog",
    servicesKey: "services",
    projectsKey: "projects",
    docsKey: "docs",
    docsKey2: "docs/*",
  },
  en: {
    aboutKey: "about",
    categoryKey: "categories",
    categoryKey2: "categories/*",
    categoryKey3: "categories",
    tagKey: "tags",
    tagKey2: "tags/*",
    tagKey3: "tags",
    blogKey: "blog",
    servicesKey: "services",
    projectsKey: "projects",
    docsKey: "docs",
    docsKey2: "docs/*",
  },
  
} as const;

/**
 * * Content collection translations used by the language switcher and hreflang generator
 *
 * Per-collection, per-locale route base mapping (collections to localize are the keys)
 *
 * If you have a key of "blog" then the blog content collection will be localized. This will look
 * for a "mappingKey" in the entry metadata, and use that to map the entry to the correct locale
 *
 * You can use the locale value to map the collection to a different route if desired
 */
export const localizedCollections = {
  blog: {
		en: "blog",
		ko: "blog"
	},
  services: {
		en: "services",
		ko: "services"
	},
  projects: {
		en: "projects",
		ko: "projects"
	},
  docs: {
		en: "docs",
		ko: "docs"
	},
} as const;
