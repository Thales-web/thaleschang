/**
 * Client Configuration Validation
 * Logs warnings during build if required settings are missing or invalid.
 */

import { clientConfig } from "@/config/clientConfig";

export function validateClientConfig(): void {
  const warnings: string[] = [];
  const { business, analytics } = clientConfig;

  // Required business fields
  if (!business.name || business.name === "Your Business Name") {
    warnings.push("clientConfig.business.name is not set - update in src/config/clientConfig.ts");
  }

  if (!business.url || business.url === "https://yourdomain.com") {
    warnings.push("clientConfig.business.url is not set - update in src/config/clientConfig.ts");
  }

  if (!business.description || business.description.includes("Your business description")) {
    warnings.push(
      "clientConfig.business.description is not set - update in src/config/clientConfig.ts",
    );
  }

  // LocalBusiness requires address
  if (clientConfig.seo.enableLocalBusiness && !business.address) {
    warnings.push(
      "LocalBusiness is enabled but business.address is not set - required for local SEO",
    );
  }

  // Analytics ID format validation
  if (analytics.googleAnalyticsId && !analytics.googleAnalyticsId.startsWith("G-")) {
    warnings.push(
      `GA4 ID "${analytics.googleAnalyticsId}" should start with "G-" (e.g., G-XXXXXXXXXX)`,
    );
  }

  if (analytics.googleTagManagerId && !analytics.googleTagManagerId.startsWith("GTM-")) {
    warnings.push(
      `GTM ID "${analytics.googleTagManagerId}" should start with "GTM-" (e.g., GTM-XXXXXXX)`,
    );
  }

  // Output warnings
  if (warnings.length > 0) {
    console.warn("\n[SEO Config] Warnings:");
    warnings.forEach((w) => console.warn(`  - ${w}`));
    console.warn("");
  }
}
