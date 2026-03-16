/**
 * perf-budget.js
 *
 * Post-build performance budget checker.
 * Scans dist/ output and warns about oversized assets that hurt Core Web Vitals.
 *
 * Checks:
 * - Total page weight per HTML file (HTML + CSS + JS referenced)
 * - Individual JS/CSS bundle sizes
 * - Image file sizes
 * - Font file count and sizes
 * - Third-party script detection
 *
 * Usage: npm run perf-budget
 * No Chrome required — works purely on build output.
 */

import fs from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");

// === Configurable Budgets (bytes) ===
const BUDGETS = {
  maxJsBundleSize: 150 * 1024, // 150 KB per JS file
  maxCssBundleSize: 50 * 1024, // 50 KB per CSS file
  maxImageSize: 500 * 1024, // 500 KB per image
  maxTotalJsPerPage: 300 * 1024, // 300 KB total JS per page
  maxTotalCssPerPage: 100 * 1024, // 100 KB total CSS per page
  maxFontFiles: 6, // max font files total
  maxFontFileSize: 3 * 1024 * 1024, // 3 MB per font file (CJK variable fonts are large)
};

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function findFiles(dir, extensions) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findFiles(fullPath, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

function analyzeAssets() {
  const warnings = [];
  const stats = {
    jsFiles: 0,
    cssFiles: 0,
    imageFiles: 0,
    fontFiles: 0,
    totalJsSize: 0,
    totalCssSize: 0,
    totalImageSize: 0,
    totalFontSize: 0,
    largestJs: { file: "", size: 0 },
    largestCss: { file: "", size: 0 },
    largestImage: { file: "", size: 0 },
  };

  // JS bundles (skip Keystatic CMS bundles — admin-only, not served to visitors)
  const jsFiles = findFiles(DIST_DIR, [".js"]).filter(
    (f) => !path.relative(DIST_DIR, f).replace(/\\/g, "/").includes("keystatic"),
  );
  for (const file of jsFiles) {
    const size = getFileSize(file);
    const rel = path.relative(DIST_DIR, file).replace(/\\/g, "/");
    stats.jsFiles++;
    stats.totalJsSize += size;
    if (size > stats.largestJs.size) stats.largestJs = { file: rel, size };
    if (size > BUDGETS.maxJsBundleSize) {
      warnings.push({
        type: "js",
        severity: "warning",
        message: `JS bundle too large: ${rel} (${formatBytes(size)} > ${formatBytes(BUDGETS.maxJsBundleSize)})`,
      });
    }
  }

  // CSS bundles
  const cssFiles = findFiles(DIST_DIR, [".css"]);
  for (const file of cssFiles) {
    const size = getFileSize(file);
    const rel = path.relative(DIST_DIR, file).replace(/\\/g, "/");
    stats.cssFiles++;
    stats.totalCssSize += size;
    if (size > stats.largestCss.size) stats.largestCss = { file: rel, size };
    if (size > BUDGETS.maxCssBundleSize) {
      warnings.push({
        type: "css",
        severity: "warning",
        message: `CSS bundle too large: ${rel} (${formatBytes(size)} > ${formatBytes(BUDGETS.maxCssBundleSize)})`,
      });
    }
  }

  // Images
  const imageFiles = findFiles(DIST_DIR, [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".avif",
    ".svg",
  ]);
  for (const file of imageFiles) {
    const size = getFileSize(file);
    const rel = path.relative(DIST_DIR, file).replace(/\\/g, "/");
    stats.imageFiles++;
    stats.totalImageSize += size;
    if (size > stats.largestImage.size) stats.largestImage = { file: rel, size };
    if (size > BUDGETS.maxImageSize) {
      warnings.push({
        type: "image",
        severity: "warning",
        message: `Image too large: ${rel} (${formatBytes(size)} > ${formatBytes(BUDGETS.maxImageSize)})`,
      });
    }
  }

  // Fonts
  const fontFiles = findFiles(DIST_DIR, [".woff", ".woff2", ".ttf", ".otf", ".eot"]);
  stats.fontFiles = fontFiles.length;
  for (const file of fontFiles) {
    const size = getFileSize(file);
    stats.totalFontSize += size;
    const rel = path.relative(DIST_DIR, file).replace(/\\/g, "/");
    if (size > BUDGETS.maxFontFileSize) {
      warnings.push({
        type: "font",
        severity: "warning",
        message: `Font file too large: ${rel} (${formatBytes(size)} > ${formatBytes(BUDGETS.maxFontFileSize)})`,
      });
    }
  }
  if (stats.fontFiles > BUDGETS.maxFontFiles) {
    warnings.push({
      type: "font",
      severity: "warning",
      message: `Too many font files: ${stats.fontFiles} (max ${BUDGETS.maxFontFiles}). Consider subsetting or reducing font variants.`,
    });
  }

  return { stats, warnings };
}

function analyzePages() {
  const warnings = [];
  const htmlFiles = findFiles(DIST_DIR, [".html"]);
  const pageStats = [];

  for (const file of htmlFiles) {
    const rel = path.relative(DIST_DIR, file).replace(/\\/g, "/");
    if (rel.startsWith("keystatic/") || rel === "_seo-report.html") continue;

    const html = fs.readFileSync(file, "utf-8");
    const pagePath = "/" + rel.replace(/index\.html$/, "");

    // Find referenced JS files
    const scriptMatches = html.match(/src=["']([^"']*\.js)["']/gi) || [];
    let pageJsSize = 0;
    for (const match of scriptMatches) {
      const src = match.match(/src=["']([^"']*)["']/i)?.[1];
      if (!src || src.startsWith("http")) continue;
      const absPath = path.join(DIST_DIR, src.startsWith("/") ? src.slice(1) : src);
      pageJsSize += getFileSize(absPath);
    }

    // Find referenced CSS files
    const linkMatches =
      html.match(/<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']*)["']/gi) || [];
    let pageCssSize = 0;
    for (const match of linkMatches) {
      const href = match.match(/href=["']([^"']*)["']/i)?.[1];
      if (!href || href.startsWith("http")) continue;
      const absPath = path.join(DIST_DIR, href.startsWith("/") ? href.slice(1) : href);
      pageCssSize += getFileSize(absPath);
    }

    // Check for render-blocking third-party scripts
    const thirdPartyScripts = (html.match(/<script[^>]*src=["'](https?:\/\/[^"']*)["']/gi) || [])
      .filter((s) => !s.includes("async") && !s.includes("defer"));

    if (thirdPartyScripts.length > 0) {
      warnings.push({
        type: "third-party",
        severity: "info",
        message: `${pagePath}: ${thirdPartyScripts.length} render-blocking third-party script(s)`,
      });
    }

    // Check preload hints for LCP
    const hasPreloadImage = /<link[^>]*rel=["']preload["'][^>]*as=["']image["']/i.test(html);
    const hasEagerImage = /<img[^>]*loading=["']eager["']/i.test(html);

    pageStats.push({
      path: pagePath,
      jsSize: pageJsSize,
      cssSize: pageCssSize,
      hasPreloadImage,
      hasEagerImage,
    });

    if (pageJsSize > BUDGETS.maxTotalJsPerPage) {
      warnings.push({
        type: "page-js",
        severity: "warning",
        message: `${pagePath}: Total JS ${formatBytes(pageJsSize)} exceeds budget ${formatBytes(BUDGETS.maxTotalJsPerPage)}`,
      });
    }
    if (pageCssSize > BUDGETS.maxTotalCssPerPage) {
      warnings.push({
        type: "page-css",
        severity: "warning",
        message: `${pagePath}: Total CSS ${formatBytes(pageCssSize)} exceeds budget ${formatBytes(BUDGETS.maxTotalCssPerPage)}`,
      });
    }
  }

  return { pageStats, warnings };
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error("❌ dist/ directory not found. Run `npm run build` first.");
    process.exit(1);
  }

  console.log("\n⚡ Performance Budget Check\n");

  const { stats, warnings: assetWarnings } = analyzeAssets();
  const { pageStats, warnings: pageWarnings } = analyzePages();
  const allWarnings = [...assetWarnings, ...pageWarnings];

  // Summary
  console.log("  Assets Summary:");
  console.log(`    JS:     ${stats.jsFiles} files, ${formatBytes(stats.totalJsSize)} total`);
  console.log(`    CSS:    ${stats.cssFiles} files, ${formatBytes(stats.totalCssSize)} total`);
  console.log(`    Images: ${stats.imageFiles} files, ${formatBytes(stats.totalImageSize)} total`);
  console.log(`    Fonts:  ${stats.fontFiles} files, ${formatBytes(stats.totalFontSize)} total`);
  console.log();

  if (stats.largestJs.size > 0)
    console.log(`    Largest JS:    ${stats.largestJs.file} (${formatBytes(stats.largestJs.size)})`);
  if (stats.largestCss.size > 0)
    console.log(
      `    Largest CSS:   ${stats.largestCss.file} (${formatBytes(stats.largestCss.size)})`,
    );
  if (stats.largestImage.size > 0)
    console.log(
      `    Largest Image: ${stats.largestImage.file} (${formatBytes(stats.largestImage.size)})`,
    );
  console.log();

  // Pages with highest JS load
  const heaviestPages = pageStats
    .filter((p) => p.jsSize > 0)
    .sort((a, b) => b.jsSize - a.jsSize)
    .slice(0, 5);

  if (heaviestPages.length > 0) {
    console.log("  Heaviest Pages (by JS):");
    for (const p of heaviestPages) {
      console.log(`    ${formatBytes(p.jsSize).padStart(10)}  ${p.path}`);
    }
    console.log();
  }

  // Warnings
  if (allWarnings.length > 0) {
    const warnCount = allWarnings.filter((w) => w.severity === "warning").length;
    const infoCount = allWarnings.filter((w) => w.severity === "info").length;
    console.log(`  ⚠️  ${warnCount} warning(s), ${infoCount} info\n`);
    for (const w of allWarnings) {
      const icon = w.severity === "warning" ? "⚠️ " : "ℹ️ ";
      console.log(`    ${icon} ${w.message}`);
    }
    console.log();
  } else {
    console.log("  ✅ All assets within performance budgets!\n");
  }
}

main();
