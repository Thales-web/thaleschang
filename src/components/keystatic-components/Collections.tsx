/**
 * * Keystatic Collection definitions that can take in languages and return the correct content
 * This makes it much cleaner to work with content in different languages
 */

import { collection, fields, singleton } from "@keystatic/core";

import ComponentBlocks from "@/components/keystatic-components/ComponentBlocks";
import { locales } from "@/config/siteSettings.json";

/**
 * * Blog posts collection
 * This gets used by Astro Content Collections, so if you update this, you'll need to update the Astro Content Collections schema
 */
const Blog = (locale: (typeof locales)[number]) =>
  collection({
    label: `블로그 (${locale.toUpperCase()})`,
    slugField: "title",
    path: `src/data/blog/${locale}/*/`,
    columns: ["title", "draft", "categories", "pubDate", "updatedDate"],
    entryLayout: "content",
    format: { contentField: "content" },
    schema: {
      title: fields.slug({
        name: { label: "Title" },
        slug: {
          label: "SEO-friendly slug",
          description: "Never change the slug once a file is published!",
        },
      }),
      description: fields.text({
        label: "Description",
        validation: { isRequired: true, length: { min: 1, max: 160 } },
      }),
      draft: fields.checkbox({
        label: "Draft",
        description: "Set this post as draft to prevent it from being published.",
      }),

      authors: fields.array(
        fields.relationship({
          label: "Post author",
          collection: `authors`,
          // authors field in keystatic.config.tsx must match the collection name here (like "authorsEN" or "authorsFR")
          // collection: `authors${locale.toUpperCase()}`,
        }),
        {
          label: "Authors",
          validation: { length: { min: 1 } },
          itemLabel: (props) => props.value || "Please select an author",
        },
      ),
      pubDate: fields.date({ label: "Publish Date" }),
      updatedDate: fields.date({
        label: "Updated Date",
        description: "If you update this post at a later date, put that date here.",
      }),
      mappingKey: fields.text({
        label: "Mapping Key",
        description: "This is used to map entries between languages.",
      }),
      heroImage: fields.image({
        label: "Hero Image",
        publicPath: "../",
        validation: { isRequired: true },
      }),
      categories: fields.array(
        fields.relationship({
          label: "Category",
          collection: "categories",
        }),
        {
          label: "Categories",
          validation: { length: { min: 1 } },
          itemLabel: (props) => props.value || "(선택 안 됨 — 클릭하여 선택)",
        },
      ),
      tags: fields.text({
        label: "Tags",
        description: "콤마(,)로 구분하여 여러 태그를 입력하세요. 예: seo, geo, marketing",
        validation: { isRequired: true },
      }),
      content: fields.mdx({
        label: "Content",
        options: {
          bold: true,
          italic: true,
          strikethrough: true,
          code: true,
          heading: [2, 3, 4, 5, 6],
          blockquote: true,
          orderedList: true,
          unorderedList: true,
          table: true,
          link: true,
          image: {
            directory: `src/data/blog/${locale}/`,
            publicPath: "../",
            // schema: {
            //   title: fields.text({
            //     label: "Caption",
            //     description:
            //       "The text to display under the image in a caption.",
            //   }),
            // },
          },
          divider: true,
          codeBlock: true,
        },
        components: {
          Admonition: ComponentBlocks.Admonition,
          HtmlBlock: ComponentBlocks.HtmlBlock,
          TldrBlock: ComponentBlocks.TldrBlock,
          KeyTakeaways: ComponentBlocks.KeyTakeaways,
          CitationCapsule: ComponentBlocks.CitationCapsule,
        },
      }),
    },
  });

/**
 * * Authors collection
 * This gets used by Astro Content Collections, so if you update this, you'll need to update the Astro Content Collections schema
 */
const Authors = (locale: (typeof locales)[number] | "") =>
  collection({
    label: `저자 ${locale === "" ? "" : `(${locale.toUpperCase()})`}`,
    slugField: "name",
    path: `src/data/authors/${locale}/*/`,
    columns: ["name"],
    format: { contentField: "bio" },
    schema: {
      name: fields.slug({
        name: {
          label: "Name",
          validation: {
            isRequired: true,
          },
        },
        slug: {
          label: "SEO-friendly slug",
          description: "Never change the slug once this file is published!",
        },
      }),
      avatar: fields.image({
        label: "Author avatar",
        publicPath: "../",
        validation: { isRequired: true },
      }),
      about: fields.text({
        label: "About",
        description: "A short bio about the author",
        validation: { isRequired: true },
      }),
      email: fields.text({
        label: "The author's email",
        description: "This must look something like `you@email.com`",
        validation: { isRequired: true },
      }),
      authorLink: fields.url({
        label: "Author Website or Social Media Link",
        validation: { isRequired: true },
      }),
      bio: fields.mdx({
        label: "Full Bio",
        description: "The author's full bio",
        options: {
          bold: true,
          italic: true,
          strikethrough: true,
          code: true,
          heading: [2, 3, 4],
          blockquote: true,
          orderedList: true,
          unorderedList: true,
          table: false,
          link: true,
          image: {
            directory: "src/data/authors/",
            publicPath: "../",
          },
          divider: true,
          codeBlock: false,
        },
      }),
    },
  });

/**
 * * Services collection
 * This gets used by Astro Content Collections, so if you update this, you'll need to update the Astro Content Collections schema
 */
const Services = (locale: (typeof locales)[number]) =>
  collection({
    label: `서비스 (${locale.toUpperCase()})`,
    slugField: "title",
    path: `src/data/services/${locale}/*/`,
    columns: ["title", "order"],
    entryLayout: "content",
    format: { contentField: "content" },
    schema: {
      title: fields.slug({
        name: { label: "Title" },
        slug: {
          label: "SEO-friendly slug",
          description: "Never change the slug once a file is published!",
        },
      }),
      titleLong: fields.text({
        label: "Long Title",
        validation: { isRequired: true },
      }),
      description: fields.text({
        label: "Description",
        validation: { isRequired: true },
      }),
      draft: fields.checkbox({
        label: "Draft",
        description: "Set this service as draft to prevent it from being published.",
      }),
      icon: fields.text({
        label: "Icon",
        description: "Icon name for this service",
        validation: { isRequired: true },
      }),
      image: fields.image({
        label: "Service Image",
        publicPath: "../",
        validation: { isRequired: true },
      }),
      mappingKey: fields.text({
        label: "Mapping Key",
        description: "This is used to map entries between languages.",
      }),
      order: fields.number({
        label: "Order",
        description: "The order this service appears in lists (lower numbers appear first)",
      }),
      content: fields.mdx({
        label: "Content",
        options: {
          bold: true,
          italic: true,
          strikethrough: true,
          code: true,
          heading: [2, 3, 4, 5, 6],
          blockquote: true,
          orderedList: true,
          unorderedList: true,
          table: true,
          link: true,
          image: {
            directory: `src/data/services/${locale}/`,
            publicPath: "../",
          },
          divider: true,
          codeBlock: true,
        },
        components: {
          Admonition: ComponentBlocks.Admonition,
          HtmlBlock: ComponentBlocks.HtmlBlock,
          TldrBlock: ComponentBlocks.TldrBlock,
          KeyTakeaways: ComponentBlocks.KeyTakeaways,
          CitationCapsule: ComponentBlocks.CitationCapsule,
        },
      }),
    },
  });

/**
 * * Careers collection
 * This gets used by Astro Content Collections, so if you update this, you'll need to update the Astro Content Collections schema
 */
const Careers = (locale: (typeof locales)[number]) =>
  collection({
    label: `채용 (${locale.toUpperCase()})`,
    slugField: "title",
    path: `src/data/careers/${locale}/*/`,
    columns: ["title", "category", "location", "type", "publishDate"],
    entryLayout: "content",
    format: { contentField: "content" },
    schema: {
      title: fields.slug({
        name: { label: "Title" },
        slug: {
          label: "SEO-friendly slug",
          description: "Never change the slug once a file is published!",
        },
      }),
      category: fields.text({
        label: "Category",
        validation: { isRequired: true },
      }),
      location: fields.text({
        label: "Location",
        validation: { isRequired: true },
      }),
      type: fields.select({
        label: "Job Type",
        options: [
          { label: "Full-time", value: "Full-time" },
          { label: "Part-time", value: "Part-time" },
          { label: "Contract", value: "Contract" },
          { label: "Remote", value: "Remote" },
        ],
        defaultValue: "Full-time",
      }),
      description: fields.text({
        label: "Short Description",
        multiline: true,
        validation: { isRequired: true },
      }),
      requirements: fields.array(fields.text({ label: "Requirement" }), {
        label: "Requirements",
        itemLabel: (props) => props.value,
        validation: { length: { min: 1 } },
      }),
      applicationUrl: fields.url({
        label: "Application URL",
        validation: { isRequired: true },
      }),
      publishDate: fields.date({
        label: "Publish Date",
        validation: { isRequired: true },
      }),
      draft: fields.checkbox({
        label: "Draft",
        description: "Set this job posting as draft to prevent it from being published.",
      }),
      mappingKey: fields.text({
        label: "Mapping Key",
        description: "This is used to map entries between languages.",
      }),
      content: fields.mdx({
        label: "Content",
        options: {
          bold: true,
          italic: true,
          strikethrough: true,
          code: true,
          heading: [2, 3, 4, 5, 6],
          blockquote: true,
          orderedList: true,
          unorderedList: true,
          table: true,
          link: true,
          image: {
            directory: `src/data/careers/${locale}/`,
            publicPath: "../",
          },
          divider: true,
          codeBlock: true,
        },
        components: {
          Admonition: ComponentBlocks.Admonition,
          HtmlBlock: ComponentBlocks.HtmlBlock,
          TldrBlock: ComponentBlocks.TldrBlock,
          KeyTakeaways: ComponentBlocks.KeyTakeaways,
          CitationCapsule: ComponentBlocks.CitationCapsule,
        },
      }),
    },
  });

/**
 * * Projects collection
 * This gets used by Astro Content Collections, so if you update this, you'll need to update the Astro Content Collections schema
 */
const Projects = (locale: (typeof locales)[number]) =>
  collection({
    label: `프로젝트 (${locale.toUpperCase()})`,
    slugField: "title",
    path: `src/data/projects/${locale}/*/`,
    columns: ["title", "completionDate"],
    entryLayout: "content",
    format: { contentField: "content" },
    schema: {
      title: fields.slug({
        name: { label: "Title" },
        slug: {
          label: "SEO-friendly slug",
          description: "Never change the slug once a file is published!",
        },
      }),
      description: fields.text({
        label: "Description",
        validation: { isRequired: true },
      }),
      image: fields.image({
        label: "Project Image",
        publicPath: "../",
        validation: { isRequired: true },
      }),
      technologies: fields.array(fields.text({ label: "Technology" }), {
        label: "Technologies Used",
        itemLabel: (props) => props.value,
        validation: { length: { min: 1 } },
      }),
      demoUrl: fields.url({
        label: "Demo URL",
        description: "Link to live demo if available",
      }),
      githubUrl: fields.url({
        label: "GitHub URL",
        description: "Link to GitHub repository",
      }),
      completionDate: fields.date({
        label: "Completion Date",
        validation: { isRequired: true },
      }),
      keyFeatures: fields.array(fields.text({ label: "Feature" }), {
        label: "Key Features",
        itemLabel: (props) => props.value,
        validation: { length: { min: 1 } },
      }),
      order: fields.number({
        label: "Display Order",
        description: "Optional: Use to control the order of projects (lower numbers appear first)",
      }),
      mappingKey: fields.text({
        label: "Mapping Key",
        description: "This is used to map entries between languages.",
      }),
      draft: fields.checkbox({
        label: "Draft",
        description: "Set this project as draft to prevent it from being published.",
      }),
      content: fields.mdx({
        label: "Content",
        options: {
          bold: true,
          italic: true,
          strikethrough: true,
          code: true,
          heading: [2, 3, 4, 5, 6],
          blockquote: true,
          orderedList: true,
          unorderedList: true,
          table: true,
          link: true,
          image: {
            directory: `src/data/projects/${locale}/`,
            publicPath: "../",
          },
          divider: true,
          codeBlock: true,
        },
        components: {
          Admonition: ComponentBlocks.Admonition,
          HtmlBlock: ComponentBlocks.HtmlBlock,
          TldrBlock: ComponentBlocks.TldrBlock,
          KeyTakeaways: ComponentBlocks.KeyTakeaways,
          CitationCapsule: ComponentBlocks.CitationCapsule,
        },
      }),
    },
  });

/**
 * * Resume singleton
 */
const Resume = (locale: (typeof locales)[number]) =>
  singleton({
    label: `이력서 (${locale.toUpperCase()})`,
    path: `src/data/resume/${locale}/resume/index`,
    format: { data: "json" },
    schema: {
      diplomas: fields.array(
        fields.object({
          title: fields.text({ label: "Title" }),
          school: fields.text({ label: "School" }),
          year: fields.number({ label: "Year" }),
        }),
        {
          label: "Diplomas",
          itemLabel: (props) =>
            `${props.fields.title.value} - ${props.fields.school.value} (${props.fields.year.value})`,
        },
      ),
      certifications: fields.array(
        fields.object({
          title: fields.text({ label: "Title" }),
          year: fields.number({ label: "Year" }),
        }),
        {
          label: "Certifications",
          itemLabel: (props) => `${props.fields.title.value} (${props.fields.year.value})`,
        },
      ),
      experience: fields.array(
        fields.object({
          title: fields.text({ label: "Title" }),
          company: fields.text({ label: "Company" }),
          companyImage: fields.image({
            label: "Company Logo",
            publicPath: "./index/",
            validation: { isRequired: true },
          }),
          dates: fields.text({ label: "Dates" }),
          location: fields.text({ label: "Location" }),
          responsibilities: fields.array(fields.text({ label: "Responsibility" }), {
            label: "Responsibilities",
            itemLabel: (props) => props.value,
          }),
        }),
        {
          label: "Experience",
          itemLabel: (props) => `${props.fields.title.value} at ${props.fields.company.value}`,
        },
      ),
      hardSkills: fields.array(
        fields.object({
          skill: fields.text({ label: "Skill" }),
          percentage: fields.number({
            label: "Level (%)",
            description: "Enter a percentage between 0 and 100",
            validation: {
              min: 0,
              max: 100,
              isRequired: true,
            },
          }),
        }),
        {
          label: "Hard Skills",
          itemLabel: (props) => `${props.fields.skill.value} - ${props.fields.percentage.value}%`,
        },
      ),
      softSkills: fields.array(
        fields.object({
          skill: fields.text({
            label: "Skill",
            validation: { isRequired: true },
          }),
          icon: fields.text({
            label: "Icon Image",
            description: "Copy in your favorite emoji like 👑",
            validation: { isRequired: true },
          }),
        }),
        {
          label: "Soft Skills",
          itemLabel: (props) => props.fields.skill.value,
        },
      ),
      languages: fields.array(
        fields.object({
          language: fields.text({
            label: "Language",
            validation: { isRequired: true },
          }),
          level: fields.number({
            label: "Proficiency Level",
            description: "Enter a value between 1 (basic) and 10 (native)",
            validation: {
              min: 1,
              max: 10,
              isRequired: true,
            },
          }),
        }),
        {
          label: "Languages",
          itemLabel: (props) =>
            `${props.fields.language.value} - Level ${props.fields.level.value}/10`,
        },
      ),
      tools: fields.array(
        fields.object({
          name: fields.text({
            label: "Tool Name",
            validation: { isRequired: true },
          }),
          category: fields.text({
            label: "Category",
            description: "Tool category (e.g., 'Development', 'Design', 'DevOps')",
            validation: { isRequired: true },
          }),
          image: fields.image({
            label: "Tool Logo",
            description: "Logo or icon for the tool",
            publicPath: "./index/",
            validation: { isRequired: true },
          }),
          link: fields.url({
            label: "Tool Website",
            description: "Link to the tool's official website",
            validation: { isRequired: true },
          }),
        }),
        {
          label: "Tools & Technologies",
          itemLabel: (props) => `${props.fields.name.value} (${props.fields.category.value})`,
        },
      ),
      mappingKey: fields.text({
        label: "Mapping Key",
        description: "This is used to map entries between languages.",
      }),
    },
  });

/**
 * * Client Settings singleton
 * Browser-based admin panel for SEO/Schema/Analytics configuration
 * Stores data in src/data/settings/client-config/index.json
 */
const ClientSettings = () =>
  singleton({
    label: "사이트 설정 (SEO/Schema/Analytics)",
    path: "src/data/settings/client-config/index",
    format: { data: "json" },
    schema: {
      // === Business Information ===
      businessName: fields.text({
        label: "Business Name",
        description: "Organization or business name for structured data",
        validation: { isRequired: true },
      }),
      businessLegalName: fields.text({
        label: "Legal Name",
        description: "Official registered legal name (optional)",
      }),
      businessType: fields.select({
        label: "Business Type",
        description: "Schema.org business type for structured data",
        options: [
          { label: "Organization (General)", value: "Organization" },
          { label: "Local Business", value: "LocalBusiness" },
          { label: "Professional Service", value: "ProfessionalService" },
          { label: "Medical Business", value: "MedicalBusiness" },
          { label: "Restaurant", value: "Restaurant" },
          { label: "Store", value: "Store" },
          { label: "Educational Organization", value: "EducationalOrganization" },
          { label: "Financial Service", value: "FinancialService" },
          { label: "Real Estate Agent", value: "RealEstateAgent" },
          { label: "Legal Service", value: "LegalService" },
          { label: "Auto Repair", value: "AutoRepair" },
          { label: "Beauty Salon", value: "BeautySalon" },
          { label: "Fitness Center", value: "FitnessCenter" },
        ],
        defaultValue: "Organization",
      }),
      businessDescription: fields.text({
        label: "Business Description",
        description: "Used in JSON-LD structured data and AI engine context",
        multiline: true,
        validation: { isRequired: true },
      }),
      businessFoundingDate: fields.text({
        label: "Founding Date",
        description: "Format: YYYY-MM-DD",
      }),
      businessUrl: fields.text({
        label: "Site URL",
        description: "Must match astro.config.mjs site value (e.g. https://yourdomain.com)",
        validation: { isRequired: true },
      }),
      businessLogo: fields.text({
        label: "Logo Path",
        description: "Relative to public/ (e.g. /logo.svg) or absolute URL",
      }),
      businessImage: fields.text({
        label: "Default OG Image Path",
        description: "Relative to public/ (e.g. /images/og-default.jpg)",
      }),
      businessPhone: fields.text({
        label: "Phone",
        description: "e.g. +82-2-1234-5678",
      }),
      businessEmail: fields.text({
        label: "Email",
        description: "e.g. contact@yourdomain.com",
      }),
      businessPriceRange: fields.text({
        label: "Price Range",
        description: "e.g. $, $$, $$$ (for LocalBusiness schema)",
      }),

      // === Address (for LocalBusiness) ===
      addressStreetAddress: fields.text({ label: "Street Address" }),
      addressCity: fields.text({ label: "City" }),
      addressRegion: fields.text({ label: "Region / State" }),
      addressPostalCode: fields.text({ label: "Postal Code" }),
      addressCountry: fields.text({
        label: "Country Code",
        description: "ISO 3166-1 alpha-2 (e.g. KR, US, JP)",
      }),

      // === Geo Coordinates ===
      geoLatitude: fields.number({
        label: "Latitude",
        description: "e.g. 37.5665",
      }),
      geoLongitude: fields.number({
        label: "Longitude",
        description: "e.g. 126.978",
      }),

      // === Opening Hours ===
      openingHours: fields.array(
        fields.text({
          label: "Hours Entry",
          description: "Format: Mo-Fr 09:00-18:00",
        }),
        {
          label: "Opening Hours",
          itemLabel: (props) => props.value || "New entry",
        },
      ),

      // === Social Media ===
      socialTwitter: fields.text({
        label: "Twitter / X Handle",
        description: "e.g. yourbrand (without @)",
      }),
      socialFacebook: fields.text({
        label: "Facebook URL",
        description: "e.g. https://facebook.com/yourbrand",
      }),
      socialInstagram: fields.text({
        label: "Instagram URL",
        description: "e.g. https://instagram.com/yourbrand",
      }),
      socialLinkedin: fields.text({
        label: "LinkedIn URL",
        description: "e.g. https://linkedin.com/company/yourbrand",
      }),
      socialYoutube: fields.text({
        label: "YouTube URL",
        description: "e.g. https://youtube.com/@yourbrand",
      }),
      socialGithub: fields.text({
        label: "GitHub URL",
        description: "e.g. https://github.com/yourbrand",
      }),
      socialNaver: fields.text({
        label: "Naver Blog URL",
        description: "e.g. https://blog.naver.com/yourbrand",
      }),

      // === Analytics & Verification ===
      googleAnalyticsId: fields.text({
        label: "Google Analytics 4 ID",
        description: "Format: G-XXXXXXXXXX (env var PUBLIC_GA4_ID overrides this)",
      }),
      googleTagManagerId: fields.text({
        label: "Google Tag Manager ID",
        description: "Format: GTM-XXXXXXX (env var PUBLIC_GTM_ID overrides this)",
      }),
      googleSearchConsoleVerification: fields.text({
        label: "Google Search Console Verification",
        description: "Verification code (env var PUBLIC_GOOGLE_VERIFICATION overrides this)",
      }),
      naverSearchAdvisorVerification: fields.text({
        label: "Naver Search Advisor Verification",
        description: "Verification code (env var PUBLIC_NAVER_VERIFICATION overrides this)",
      }),
      naverAnalyticsId: fields.text({
        label: "Naver Analytics ID",
        description: "Naver Analytics tracking ID (env var PUBLIC_NAVER_ANALYTICS_ID overrides this)",
      }),
      microsoftClarityId: fields.text({
        label: "Microsoft Clarity ID",
        description: "Clarity project ID (env var PUBLIC_CLARITY_ID overrides this)",
      }),
      facebookPixelId: fields.text({
        label: "Facebook (Meta) Pixel ID",
        description: "FB Pixel ID (env var PUBLIC_FB_PIXEL_ID overrides this)",
      }),
      kakaoPixelId: fields.text({
        label: "Kakao Pixel ID",
        description: "Kakao Pixel tracking ID (env var PUBLIC_KAKAO_PIXEL_ID overrides this)",
      }),
      customHeadCode: fields.text({
        label: "Custom Head Code",
        description: "Custom HTML/scripts to inject into <head>. Use for third-party verification tags, pixels, etc.",
        multiline: true,
      }),

      // === SEO Feature Toggles ===
      enableLocalBusiness: fields.checkbox({
        label: "Enable Local Business Schema",
        description: "Turn ON for local business clients (requires address fields above)",
        defaultValue: false,
      }),
      enableFaqSchema: fields.checkbox({
        label: "Enable FAQ Schema",
        description: "Auto-generate FAQPage schema from FAQ components",
        defaultValue: true,
      }),
      enableBreadcrumbSchema: fields.checkbox({
        label: "Enable Breadcrumb Schema",
        description: "Auto-generate BreadcrumbList schema for navigation",
        defaultValue: true,
      }),

      // === AI Training Crawlers (학습용) ===
      allowGPTBot: fields.checkbox({
        label: "🤖 GPTBot (OpenAI 학습)",
        description: "OpenAI 모델 학습용 크롤러. 차단해도 ChatGPT 검색에는 영향 없음",
        defaultValue: true,
      }),
      allowClaudeBot: fields.checkbox({
        label: "🤖 ClaudeBot (Anthropic 학습)",
        description: "Anthropic Claude 모델 학습용 크롤러",
        defaultValue: true,
      }),
      allowGoogleExtended: fields.checkbox({
        label: "🤖 Google-Extended (Gemini 학습)",
        description: "Google Gemini 모델 학습용 크롤러",
        defaultValue: true,
      }),
      allowCCBot: fields.checkbox({
        label: "🤖 CCBot (Common Crawl)",
        description: "오픈소스 AI 모델 학습에 사용되는 Common Crawl 크롤러",
        defaultValue: false,
      }),

      // === AI Search Crawlers (검색용) ===
      allowOAISearchBot: fields.checkbox({
        label: "🔍 OAI-SearchBot (ChatGPT 검색)",
        description: "ChatGPT 웹 검색용 크롤러. GPTBot과 독립 제어 가능",
        defaultValue: true,
      }),
      allowPerplexityBot: fields.checkbox({
        label: "🔍 PerplexityBot (Perplexity 검색)",
        description: "Perplexity AI 검색용 크롤러",
        defaultValue: true,
      }),
    },
  });

/**
 * * Other Pages collection
 * For items like legal pages, about pages, etc.
 * This gets used by Astro Content Collections, so if you update this, you'll need to update the Astro Content Collections schema
 */
const OtherPages = (locale: (typeof locales)[number]) =>
  collection({
    label: `기타 페이지 (${locale.toUpperCase()})`,
    slugField: "title",
    path: `src/data/otherPages/${locale}/*/`,
    columns: ["title"],
    entryLayout: "content",
    format: { contentField: "content" },
    schema: {
      title: fields.slug({
        name: { label: "Title" },
        slug: {
          label: "SEO-friendly slug",
          description: "Never change the slug once a file is published!",
        },
      }),
      description: fields.text({
        label: "Description",
        validation: { isRequired: true, length: { min: 1, max: 160 } },
      }),
      draft: fields.checkbox({
        label: "Draft",
        description: "Set this page as draft to prevent it from being published.",
      }),
      mappingKey: fields.text({
        label: "Mapping Key",
        description: "This is used to map entries between languages.",
      }),
      content: fields.mdx({
        label: "Page Contents",
        options: {
          bold: true,
          italic: true,
          strikethrough: true,
          code: true,
          heading: [2, 3, 4, 5, 6],
          blockquote: true,
          orderedList: true,
          unorderedList: true,
          table: true,
          link: true,
          image: {
            directory: `src/data/otherPages/${locale}/`,
            publicPath: "../",
          },
          divider: true,
          codeBlock: true,
        },
        components: {
          Admonition: ComponentBlocks.Admonition,
          HtmlBlock: ComponentBlocks.HtmlBlock,
          TldrBlock: ComponentBlocks.TldrBlock,
          KeyTakeaways: ComponentBlocks.KeyTakeaways,
          CitationCapsule: ComponentBlocks.CitationCapsule,
        },
      }),
    },
  });

/**
 * * FAQ Data singleton (per locale)
 * Manages FAQ items via Keystatic admin panel
 * Stores data in src/data/settings/faq-data/{locale}/index.json
 */
const FaqData = (locale: (typeof locales)[number]) =>
  singleton({
    label: `FAQ (${locale.toUpperCase()})`,
    path: `src/data/settings/faq-data/${locale}/index`,
    format: { data: "json" },
    schema: {
      items: fields.array(
        fields.object({
          question: fields.text({
            label: "Question",
            validation: { isRequired: true },
          }),
          answer: fields.text({
            label: "Answer",
            description: "HTML allowed (e.g. <a> tags for links)",
            multiline: true,
            validation: { isRequired: true },
          }),
        }),
        {
          label: "FAQ Items",
          itemLabel: (props) => props.fields.question.value || "New FAQ",
        },
      ),
    },
  });

/**
 * * Blog categories collection
 * Admin에서 카테고리 추가/수정/삭제 가능
 */
const Categories = () =>
  collection({
    label: "카테고리",
    slugField: "name",
    path: "src/data/categories/*/",
    columns: ["name"],
    format: { data: "yaml" },
    schema: {
      name: fields.slug({
        name: { label: "Category Name" },
        slug: {
          label: "Slug (URL용)",
          description: "URL에 사용되는 고유 식별자. 한 번 설정하면 변경하지 마세요.",
        },
      }),
      description: fields.text({
        label: "Description",
        description: "카테고리 설명 (선택사항)",
      }),
    },
  });

export default {
  Blog,
  Authors,
  Services,
  Careers,
  Projects,
  Resume,
  OtherPages,
  ClientSettings,
  FaqData,
  Categories,
};
