/**
 * validate-schema.js
 *
 * Post-build JSON-LD Schema.org validator.
 * Scans dist/ HTML files, extracts JSON-LD blocks, and validates against
 * Schema.org required fields and data format rules.
 *
 * Usage: npm run validate-schema (after build)
 */

import fs from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");

// ============================================================
// Schema.org Required Fields & Rules
// ============================================================

const SCHEMA_RULES = {
  Organization: {
    required: ["name", "url"],
    recommended: ["logo", "description", "sameAs"],
    urlFields: ["url", "logo"],
  },
  LocalBusiness: {
    required: ["name", "url", "address"],
    recommended: ["logo", "description", "telephone", "openingHoursSpecification", "geo"],
    urlFields: ["url", "logo"],
  },
  ProfessionalService: {
    required: ["name", "url"],
    recommended: ["logo", "description", "address", "telephone"],
    urlFields: ["url", "logo"],
  },
  WebSite: {
    required: ["name", "url"],
    recommended: [],
    urlFields: ["url"],
  },
  BlogPosting: {
    required: ["headline", "author", "datePublished"],
    recommended: ["image", "description", "publisher", "dateModified"],
    urlFields: [],
    dateFields: ["datePublished", "dateModified"],
  },
  FAQPage: {
    required: ["mainEntity"],
    recommended: [],
    urlFields: [],
  },
  Service: {
    required: ["name", "provider"],
    recommended: ["description", "image"],
    urlFields: [],
  },
  Person: {
    required: ["name"],
    recommended: ["description", "url", "email"],
    urlFields: ["url"],
  },
  BreadcrumbList: {
    required: ["itemListElement"],
    recommended: [],
    urlFields: [],
  },
  SiteNavigationElement: {
    required: ["name", "url"],
    recommended: [],
    urlFields: [],
  },
};

// ============================================================
// Validators
// ============================================================

function validateJsonLd(schema, filePath) {
  const issues = [];
  const relPath = path.relative(DIST_DIR, filePath);

  // Basic structure
  if (!schema["@context"]) {
    issues.push({ severity: "error", file: relPath, message: "Missing @context" });
  } else if (!schema["@context"].includes("schema.org")) {
    issues.push({
      severity: "error",
      file: relPath,
      message: `Invalid @context: "${schema["@context"]}"`,
    });
  }

  if (!schema["@type"]) {
    issues.push({ severity: "error", file: relPath, message: "Missing @type" });
    return issues;
  }

  const type = schema["@type"];
  const rules = SCHEMA_RULES[type];

  if (!rules) {
    // Unknown type — not necessarily an error
    return issues;
  }

  // Required fields
  for (const field of rules.required) {
    if (schema[field] === undefined || schema[field] === null || schema[field] === "") {
      issues.push({
        severity: "error",
        file: relPath,
        message: `[${type}] Missing required field: "${field}"`,
      });
    }
  }

  // Recommended fields
  for (const field of rules.recommended) {
    if (schema[field] === undefined || schema[field] === null || schema[field] === "") {
      issues.push({
        severity: "warning",
        file: relPath,
        message: `[${type}] Missing recommended field: "${field}"`,
      });
    }
  }

  // URL format validation
  if (rules.urlFields) {
    for (const field of rules.urlFields) {
      const value = typeof schema[field] === "object" ? schema[field]?.url : schema[field];
      if (value && typeof value === "string" && !value.startsWith("http")) {
        issues.push({
          severity: "warning",
          file: relPath,
          message: `[${type}] "${field}" should be an absolute URL, got: "${value.slice(0, 60)}"`,
        });
      }
    }
  }

  // Date format validation
  if (rules.dateFields) {
    for (const field of rules.dateFields) {
      if (schema[field] && typeof schema[field] === "string") {
        const date = new Date(schema[field]);
        if (isNaN(date.getTime())) {
          issues.push({
            severity: "error",
            file: relPath,
            message: `[${type}] Invalid date in "${field}": "${schema[field]}"`,
          });
        }
      }
    }
  }

  // FAQ-specific: validate Question items
  if (type === "FAQPage" && Array.isArray(schema.mainEntity)) {
    for (let i = 0; i < schema.mainEntity.length; i++) {
      const q = schema.mainEntity[i];
      if (q["@type"] !== "Question") {
        issues.push({
          severity: "error",
          file: relPath,
          message: `[FAQPage] mainEntity[${i}] should be @type "Question", got "${q["@type"]}"`,
        });
      }
      if (!q.name) {
        issues.push({
          severity: "error",
          file: relPath,
          message: `[FAQPage] mainEntity[${i}] missing "name" (question text)`,
        });
      }
      if (!q.acceptedAnswer?.text) {
        issues.push({
          severity: "error",
          file: relPath,
          message: `[FAQPage] mainEntity[${i}] missing "acceptedAnswer.text"`,
        });
      }
    }
  }

  // BlogPosting: headline length
  if (type === "BlogPosting" && schema.headline) {
    if (schema.headline.length > 110) {
      issues.push({
        severity: "warning",
        file: relPath,
        message: `[BlogPosting] headline too long (${schema.headline.length} chars). Google recommends ≤110.`,
      });
    }
  }

  return issues;
}

// ============================================================
// HTML Scanner
// ============================================================

function findHtmlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findHtmlFiles(fullPath));
    } else if (entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractJsonLd(html) {
  const schemas = [];
  const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      schemas.push(JSON.parse(match[1]));
    } catch {
      schemas.push({ _parseError: true, _raw: match[1].slice(0, 100) });
    }
  }
  return schemas;
}

// ============================================================
// Main
// ============================================================

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error("❌ dist/ directory not found. Run `npm run build` first.");
    process.exit(1);
  }

  console.log("\n🔍 Schema.org JSON-LD Validation\n");

  const htmlFiles = findHtmlFiles(DIST_DIR);
  console.log(`   Scanning ${htmlFiles.length} HTML files...\n`);

  const allIssues = [];
  let totalSchemas = 0;
  const typeCounts = {};

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf-8");
    const schemas = extractJsonLd(html);

    for (const schema of schemas) {
      totalSchemas++;

      if (schema._parseError) {
        allIssues.push({
          severity: "error",
          file: path.relative(DIST_DIR, file),
          message: `JSON parse error: ${schema._raw}...`,
        });
        continue;
      }

      // Count types
      const type = schema["@type"] || "unknown";
      typeCounts[type] = (typeCounts[type] || 0) + 1;

      const issues = validateJsonLd(schema, file);
      allIssues.push(...issues);
    }
  }

  // Report: Schema type summary
  console.log("   Schema types found:");
  for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${type}: ${count}`);
  }
  console.log(`\n   Total: ${totalSchemas} schemas across ${htmlFiles.length} pages\n`);

  // Report: Issues
  const errors = allIssues.filter((i) => i.severity === "error");
  const warnings = allIssues.filter((i) => i.severity === "warning");

  if (errors.length === 0 && warnings.length === 0) {
    console.log("   ✅ All schemas valid!\n");
    return;
  }

  // Deduplicate similar issues (same message across many pages)
  const deduped = new Map();
  for (const issue of allIssues) {
    const key = `${issue.severity}:${issue.message}`;
    if (!deduped.has(key)) {
      deduped.set(key, { ...issue, count: 1, files: [issue.file] });
    } else {
      const existing = deduped.get(key);
      existing.count++;
      if (existing.files.length < 3) existing.files.push(issue.file);
    }
  }

  if (errors.length > 0) {
    console.error(`   ❌ ${errors.length} error(s):`);
    for (const [, issue] of deduped) {
      if (issue.severity !== "error") continue;
      const suffix = issue.count > 1 ? ` (×${issue.count} pages)` : "";
      const fileRef = issue.files.slice(0, 2).join(", ");
      console.error(`     - ${issue.message}${suffix}`);
      console.error(`       in: ${fileRef}${issue.count > 2 ? ", ..." : ""}`);
    }
    console.error("");
  }

  if (warnings.length > 0) {
    console.warn(`   ⚠️  ${warnings.length} warning(s):`);
    for (const [, issue] of deduped) {
      if (issue.severity !== "warning") continue;
      const suffix = issue.count > 1 ? ` (×${issue.count} pages)` : "";
      const fileRef = issue.files.slice(0, 2).join(", ");
      console.warn(`     - ${issue.message}${suffix}`);
      console.warn(`       in: ${fileRef}${issue.count > 2 ? ", ..." : ""}`);
    }
    console.warn("");
  }

  // Exit with error code if there are errors (useful for CI)
  if (errors.length > 0) {
    process.exit(1);
  }
}

main();
