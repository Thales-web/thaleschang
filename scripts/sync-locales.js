/**
 * sync-locales.js
 *
 * Copies root page files (default locale) to all non-default locale directories.
 * Since all pages now use getPageLocale(import.meta.url) to detect their locale,
 * root and locale-specific pages can be identical copies.
 *
 * Usage: npm run sync-locales
 */

import fs from "node:fs";
import path from "node:path";

const PAGES_DIR = path.resolve("src/pages");

// Read locales from siteSettings
const siteSettingsPath = path.resolve("src/config/siteSettings.json.ts");
const siteSettingsContent = fs.readFileSync(siteSettingsPath, "utf-8");

// Extract locales array and defaultLocale
const localesMatch = siteSettingsContent.match(
  /export const locales = \[([^\]]+)\]/,
);
const defaultMatch = siteSettingsContent.match(
  /export const defaultLocale = "([^"]+)"/,
);

if (!localesMatch || !defaultMatch) {
  console.error("Could not parse locales from siteSettings.json.ts");
  process.exit(1);
}

const locales = localesMatch[1]
  .split(",")
  .map((s) => s.trim().replace(/['"]/g, ""))
  .filter(Boolean);
const defaultLocale = defaultMatch[1];
const nonDefaultLocales = locales.filter((l) => l !== defaultLocale);

console.log(`Default locale: ${defaultLocale}`);
console.log(`Syncing to: ${nonDefaultLocales.join(", ")}`);

// Files/dirs to skip (not part of locale routing)
const SKIP = new Set([
  "robots.txt.ts",
  "rss.xml.ts",
  "llms.txt.ts",
  "og",
  ...nonDefaultLocales, // skip locale dirs themselves
]);

function getAllFiles(dir, base = dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(base, fullPath);

    // Skip non-locale entries at root level
    if (base === dir && SKIP.has(entry.name)) continue;

    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, base));
    } else if (entry.name.endsWith(".astro") || entry.name.endsWith(".ts")) {
      // Only sync .astro page files (skip .ts API routes at root)
      if (entry.name.endsWith(".ts") && base === dir) continue;
      results.push(relPath);
    }
  }
  return results;
}

const rootFiles = getAllFiles(PAGES_DIR);
let synced = 0;
let skipped = 0;

for (const locale of nonDefaultLocales) {
  const localeDir = path.join(PAGES_DIR, locale);

  for (const relFile of rootFiles) {
    const srcPath = path.join(PAGES_DIR, relFile);
    const destPath = path.join(localeDir, relFile);
    const destDir = path.dirname(destPath);

    const srcContent = fs.readFileSync(srcPath, "utf-8");

    // Check if destination exists and is identical
    if (fs.existsSync(destPath)) {
      const destContent = fs.readFileSync(destPath, "utf-8");
      if (srcContent === destContent) {
        skipped++;
        continue;
      }
    }

    // Create directory and write file
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(destPath, srcContent, "utf-8");
    console.log(`  ${locale}/${relFile}`);
    synced++;
  }
}

console.log(`\nDone! Synced: ${synced}, Already up-to-date: ${skipped}`);
