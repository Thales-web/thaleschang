/**
 * Category name lookup utility
 * Reads category YAML files at build time to provide slug → name mapping
 */
import fs from "node:fs";
import path from "node:path";
import { humanize } from "./textUtils";

const categoryMap = new Map<string, string>();

// Read category YAML files from the filesystem at build time
const categoriesDir = path.resolve("src/data/categories");
if (fs.existsSync(categoriesDir)) {
  for (const slug of fs.readdirSync(categoriesDir)) {
    const yamlPath = path.join(categoriesDir, slug, "index.yaml");
    if (fs.existsSync(yamlPath)) {
      const content = fs.readFileSync(yamlPath, "utf-8");
      // Simple YAML parse: extract name field
      const nameMatch = content.match(/^name:\s*["']?(.+?)["']?\s*$/m);
      if (nameMatch) {
        categoryMap.set(slug, nameMatch[1]);
      }
    }
  }
}

/** Get display name for a category slug. Falls back to humanize(slug). */
export function getCategoryName(slug: string): string {
  return categoryMap.get(slug) || humanize(slug);
}

/** Get the full slug → name map */
export function getAllCategoryNames(): Map<string, string> {
  return categoryMap;
}
