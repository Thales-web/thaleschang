import { glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

// Type-check frontmatter using a schema
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // reference the authors collection https://docs.astro.build/en/guides/content-collections/#defining-collection-references
      authors: z.array(reference("authors")),
      // Transform string to Date object
      pubDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      updatedDate: z
        .string()
        .or(z.date())
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
      heroImage: image().optional(),
      categories: z
        .union([z.array(z.string()), z.string()])
        .transform((val) =>
          typeof val === "string"
            ? val
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : val,
        ),
      tags: z
        .union([z.array(z.string()), z.string()])
        .transform((val) =>
          typeof val === "string"
            ? val
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : val,
        ),
      // SEO fields
      metaDescription: z.string().optional(), // overrides description for meta/OG tags
      keywords: z.array(z.string()).optional(), // keywords for AEO/GEO optimization
      noindex: z.boolean().optional().default(false), // exclude from search engine indexing
      // mappingKey allows you to match entries across languages for SEO purposes
      mappingKey: z.string().optional(),
      // blog posts will be excluded from build if draft is "true"
      draft: z.boolean().optional(),
    }),
});

// authors
const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/authors" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      avatar: image(),
      about: z.string(),
      email: z.string(),
      authorLink: z.string(), // author page link. Could be a personal website, github, twitter, whatever you want
    }),
});

// services collection
const servicesCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/services" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      titleLong: z.string(),
      description: z.string(),
      icon: z.string(),
      image: image(),
      metaDescription: z.string().optional(),
      noindex: z.boolean().optional().default(false),
      mappingKey: z.string().optional(),
      order: z.number().optional(),
      draft: z.boolean().optional(),
    }),
});

// careers/job postings
const careersCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/careers" }),
  schema: () =>
    z.object({
      title: z.string(),
      category: z.string(),
      location: z.string(),
      type: z.enum(["Full-time", "Part-time", "Contract", "Remote"]),
      description: z.string(),
      requirements: z.array(z.string()),
      applicationUrl: z.string().url(),
      publishDate: z
        .string()
        .or(z.date())
        .transform((val) => new Date(val)),
      // mappingKey allows you to match entries across languages for SEO purposes
      mappingKey: z.string().optional(),
      draft: z.boolean().optional().default(false),
    }),
});

// projects
const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      image: image(),
      technologies: z.array(z.string()),
      demoUrl: z.string().url().optional(),
      githubUrl: z.string().url().optional(),
      completionDate: z.date(),
      keyFeatures: z.array(z.string()),
      metaDescription: z.string().optional(),
      noindex: z.boolean().optional().default(false),
      order: z.number().optional(),
      mappingKey: z.string().optional(),
      draft: z.boolean().optional(),
    }),
});

// resume
const resumeCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{json,jsonc}", base: "./src/data/resume" }),
  schema: ({ image }) =>
    z.object({
      diplomas: z.array(
        z.object({
          title: z.string(),
          school: z.string(),
          year: z.number(),
        }),
      ),
      certifications: z.array(
        z.object({
          title: z.string(),
          year: z.number(),
        }),
      ),
      experience: z.array(
        z.object({
          title: z.string(),
          company: z.string(),
          companyImage: image(),
          dates: z.string(),
          location: z.string(),
          responsibilities: z.array(z.string()),
        }),
      ),
      hardSkills: z.array(
        z.object({
          skill: z.string(),
          percentage: z.number().min(0).max(100),
        }),
      ),
      softSkills: z.array(
        z.object({
          skill: z.string(),
          icon: z.string(),
        }),
      ),
      languages: z.array(
        z.object({
          language: z.string(),
          level: z.number().min(1).max(10),
        }),
      ),
      tools: z.array(
        z.object({
          name: z.string(),
          category: z.string(),
          image: image(),
          link: z.string().url(),
        }),
      ),
      mappingKey: z.string().optional(),
    }),
});

// other pages
const otherPagesCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/otherPages" }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      // mappingKey allows you to match entries across languages for SEO purposes
      mappingKey: z.string().optional(),
      draft: z.boolean().optional(),
    }),
});

// documentation pages
const docsCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/docs/data/docs" }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      // section field associates docs with specific documentation tabs (e.g. "main", "api", "tutorials")
      section: z.string().default("main"),
      sidebar: z
        .object({
          label: z.string().optional(),
          order: z.number().optional(),
          badge: z
            .object({
              text: z.string(),
              variant: z
                .enum(["note", "tip", "caution", "danger", "info"])
                .default("note"),
            })
            .optional(),
        })
        .optional(),
      tableOfContents: z
        .object({
          minHeadingLevel: z.number().min(1).max(6).optional(),
          maxHeadingLevel: z.number().min(1).max(6).optional(),
        })
        .optional(),
      pagefind: z.boolean().optional(),
      draft: z.boolean().optional(),
      // mappingKey allows you to match docs entries across languages
      mappingKey: z.string().optional(),
    }),
});

// candidates directory
const candidatesCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/candidates" }),
  schema: ({ image }) =>
    z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
      resumeUrl: z.string().optional(),
      coverLetter: z.string().optional(),
      location: z.string().optional(),
      experienceLevel: z.string().optional(),
      jobPreferences: z.array(z.string()).optional(),
      dateApplied: z.string(),
      linkedinProfile: z.string().optional(),
      githubProfile: z.string().optional(),
      portfolioUrl: z.string().optional(),
      status: z.string().optional(),
      avatar: z
        .object({
          url: image(),
          alt: z.string(),
        })
        .optional(),
      isFeatured: z.boolean().optional(),
      mappingKey: z.string().optional(),
      draft: z.boolean().optional(),
    }),
});

// companies directory
const companiesCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/companies" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      founded: z.string().optional(),
      headquarters: z.string().optional(),
      website: z.string(),
      hiringPage: z.string().optional(),
      description: z.string(),
      logo: image().optional(),
      location: z.string().optional(),
      size: z.string().optional(),
      industry: z.string().optional(),
      benefits: z.array(z.string()).optional(),
      companyType: z.string().optional(),
      remotePolicy: z.string().optional(),
      culture: z.string().optional(),
      mission: z.string().optional(),
      about: z.string().optional(),
      values: z.array(z.string()).optional(),
      milestones: z.array(z.string()).optional(),
      socials: z
        .object({
          twitter: z.string().optional(),
          linkedin: z.string().optional(),
          github: z.string().optional(),
        })
        .optional(),
      mappingKey: z.string().optional(),
      draft: z.boolean().optional(),
    }),
});

// each code toggle section is it's own content file
const codeToggleCollection = defineCollection({
  loader: glob({ pattern: "**/[^_]*{md,mdx}", base: "./src/data/codeToggles" }),
  schema: () =>
    z.object({
      language: z.string(),
      order: z.number(),
      icon: z.string().optional(),
      draft: z.boolean().optional(),
    }),
});

export const collections = {
  blog: blogCollection,
  authors: authorsCollection,
  services: servicesCollection,
  careers: careersCollection,
  projects: projectsCollection,
  resume: resumeCollection,
  otherPages: otherPagesCollection,
  codeToggles: codeToggleCollection,
  docs: docsCollection,
  candidates: candidatesCollection,
  companies: companiesCollection,
};
