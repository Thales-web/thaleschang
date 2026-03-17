/**
 * Client Configuration - SEO/GEO/AEO Central Settings
 *
 * Data is managed via Keystatic CMS at /admin → "Client Settings"
 * Stored in src/data/settings/client-config/index.json
 *
 * Environment variables (PUBLIC_GA4_ID, etc.) override analytics values.
 * All structured data (JSON-LD), analytics, meta tags, and AI crawler rules
 * are derived from this configuration.
 */

import { type ClientConfigProps, type BusinessType } from "./types/configDataTypes";
import settingsData from "@/data/settings/client-config/index.json";

function buildClientConfig(): ClientConfigProps {
  const data = settingsData;

  // Build address only if at least streetAddress is provided
  const address = data.addressStreetAddress
    ? {
        streetAddress: data.addressStreetAddress,
        city: data.addressCity || "",
        region: data.addressRegion || "",
        postalCode: data.addressPostalCode || "",
        country: data.addressCountry || "",
      }
    : undefined;

  // Build geo only if both coordinates provided
  const geo =
    data.geoLatitude != null && data.geoLongitude != null
      ? { latitude: data.geoLatitude, longitude: data.geoLongitude }
      : undefined;

  return {
    business: {
      name: data.businessName,
      legalName: data.businessLegalName || undefined,
      type: (data.businessType as BusinessType) || "Organization",
      description: data.businessDescription,
      foundingDate: data.businessFoundingDate || undefined,
      url: data.businessUrl,
      logo: data.businessLogo || "/logo.svg",
      image: data.businessImage || undefined,
      phone: data.businessPhone || undefined,
      email: data.businessEmail || undefined,
      priceRange: data.businessPriceRange || undefined,
      address,
      openingHours: data.openingHours?.length ? data.openingHours : undefined,
      geo,
    },
    social: {
      twitter: data.socialTwitter || undefined,
      facebook: data.socialFacebook || undefined,
      instagram: data.socialInstagram || undefined,
      linkedin: data.socialLinkedin || undefined,
      youtube: data.socialYoutube || undefined,
      github: data.socialGithub || undefined,
      naver: data.socialNaver || undefined,
    },
    analytics: {
      // Env vars override JSON values
      googleAnalyticsId:
        import.meta.env.PUBLIC_GA4_ID || data.googleAnalyticsId || undefined,
      googleTagManagerId:
        import.meta.env.PUBLIC_GTM_ID || data.googleTagManagerId || undefined,
      googleSearchConsoleVerification:
        import.meta.env.PUBLIC_GOOGLE_VERIFICATION ||
        data.googleSearchConsoleVerification ||
        undefined,
      naverSearchAdvisorVerification:
        import.meta.env.PUBLIC_NAVER_VERIFICATION ||
        data.naverSearchAdvisorVerification ||
        undefined,
      naverAnalyticsId:
        import.meta.env.PUBLIC_NAVER_ANALYTICS_ID || data.naverAnalyticsId || undefined,
      microsoftClarityId:
        import.meta.env.PUBLIC_CLARITY_ID || data.microsoftClarityId || undefined,
      facebookPixelId:
        import.meta.env.PUBLIC_FB_PIXEL_ID || data.facebookPixelId || undefined,
      kakaoPixelId:
        import.meta.env.PUBLIC_KAKAO_PIXEL_ID || data.kakaoPixelId || undefined,
      customHeadCode: data.customHeadCode || undefined,
    },
    seo: {
      enableLocalBusiness: data.enableLocalBusiness ?? false,
      enableFaqSchema: data.enableFaqSchema ?? true,
      enableBreadcrumbSchema: data.enableBreadcrumbSchema ?? true,
    },
    aiCrawlers: {
      // Training bots — 학습 차단하면서 검색은 허용 가능
      allowGPTBot: data.allowGPTBot ?? true,
      allowClaudeBot: data.allowClaudeBot ?? true,
      allowGoogleExtended: data.allowGoogleExtended ?? true,
      allowCCBot: data.allowCCBot ?? false,
      // Search bots — 학습과 독립적으로 제어
      allowOAISearchBot: data.allowOAISearchBot ?? true,
      allowPerplexityBot: data.allowPerplexityBot ?? true,
    },
  };
}

export const clientConfig: ClientConfigProps = buildClientConfig();
export default clientConfig;
