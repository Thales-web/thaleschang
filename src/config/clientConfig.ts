/**
 * Client Configuration - SEO/GEO/AEO Central Settings
 *
 * This is the SINGLE FILE to customize per client.
 * All structured data (JSON-LD), analytics, meta tags, and AI crawler rules
 * are derived from this configuration.
 */

import { type ClientConfigProps } from "./types/configDataTypes";

export const clientConfig: ClientConfigProps = {
  // ============================================================
  // Business Information - used for Organization/LocalBusiness schema
  // ============================================================
  business: {
    name: "Your Business Name",
    legalName: "Your Business Legal Name Co., Ltd.",
    type: "Organization", // Change to "LocalBusiness", "ProfessionalService", etc. for local businesses
    description: "Your business description for structured data and AI engines.",
    foundingDate: "2024-01-01",
    url: "https://yourdomain.com", // Must match astro.config.mjs `site` value

    // Logo path (relative to public/ or absolute URL)
    logo: "/logo.svg",
    image: "/images/og-default.jpg",

    // Uncomment and fill for LocalBusiness schema
    // address: {
    //   streetAddress: "123 Main St",
    //   city: "Seoul",
    //   region: "Seoul",
    //   postalCode: "06000",
    //   country: "KR",
    // },
    // phone: "+82-2-1234-5678",
    // email: "contact@yourdomain.com",
    // priceRange: "$$",
    // openingHours: ["Mo-Fr 09:00-18:00"],
    // geo: {
    //   latitude: 37.5665,
    //   longitude: 126.978,
    // },
  },

  // ============================================================
  // Social Media Links - used for Organization schema sameAs
  // ============================================================
  social: {
    // twitter: "yourbrand",
    // facebook: "https://facebook.com/yourbrand",
    // instagram: "https://instagram.com/yourbrand",
    // linkedin: "https://linkedin.com/company/yourbrand",
    // youtube: "https://youtube.com/@yourbrand",
    // github: "https://github.com/yourbrand",
    // naver: "https://blog.naver.com/yourbrand",
  },

  // ============================================================
  // Analytics & Search Console Verification
  // ============================================================
  analytics: {
    // googleAnalyticsId: "G-XXXXXXXXXX",
    // googleTagManagerId: "GTM-XXXXXXX",
    // googleSearchConsoleVerification: "your-verification-code",
    // naverSearchAdvisorVerification: "your-naver-verification-code",
  },

  // ============================================================
  // SEO Feature Toggles
  // ============================================================
  seo: {
    enableLocalBusiness: false, // Set to true for local business clients
    enableFaqSchema: true, // Auto-generate FAQPage schema from FAQ components
    enableBreadcrumbSchema: true, // Auto-generate BreadcrumbList schema
  },

  // ============================================================
  // AI Crawler Access Control (GEO)
  // ============================================================
  aiCrawlers: {
    allowGPTBot: true, // ChatGPT / OpenAI
    allowClaudeBot: true, // Claude / Anthropic
    allowPerplexityBot: true, // Perplexity AI
    allowGoogleExtended: true, // Google AI (Gemini)
  },
};

export default clientConfig;
