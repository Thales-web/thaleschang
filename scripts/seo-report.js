/**
 * seo-report.js
 *
 * Post-build SEO scorecard generator.
 * Scans dist/ HTML files and generates a summary report with:
 * - Title tag length analysis
 * - Meta description analysis
 * - Image alt text coverage
 * - Internal link count per page
 * - Heading structure validation
 * - JSON-LD presence
 * - Hreflang presence
 *
 * Usage: npm run seo-report
 * Output: dist/_seo-report.html (not indexed, for internal use)
 */

import fs from "node:fs";
import path from "node:path";

const DIST_DIR = path.resolve("dist");

// ============================================================
// HTML Analyzers
// ============================================================

function analyzeHtml(html, filePath) {
  const relPath = path.relative(DIST_DIR, filePath).replace(/\\/g, "/");

  // Skip admin/keystatic pages
  if (relPath.startsWith("keystatic/")) return null;

  const result = {
    path: "/" + relPath.replace(/index\.html$/, ""),
    title: "",
    titleLength: 0,
    description: "",
    descriptionLength: 0,
    h1Count: 0,
    h2Count: 0,
    imgTotal: 0,
    imgWithAlt: 0,
    internalLinks: 0,
    externalLinks: 0,
    hasJsonLd: false,
    jsonLdTypes: [],
    hasHreflang: false,
    hasCanonical: false,
    wordCount: 0,
    issues: [],
  };

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) {
    result.title = titleMatch[1].trim();
    result.titleLength = result.title.length;
  }

  // Meta description
  const descMatch = html.match(
    /<meta\s+(?:name=["']description["']\s+content=["']([^"']*)["']|content=["']([^"']*)["']\s+name=["']description["'])/i,
  );
  if (descMatch) {
    result.description = (descMatch[1] || descMatch[2] || "").trim();
    result.descriptionLength = result.description.length;
  }

  // Headings
  result.h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  result.h2Count = (html.match(/<h2[\s>]/gi) || []).length;

  // Images
  const imgs = html.match(/<img\s[^>]*>/gi) || [];
  result.imgTotal = imgs.length;
  result.imgWithAlt = imgs.filter((img) => /alt=["'][^"']+["']/i.test(img)).length;

  // Links
  const links = html.match(/<a\s[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
  for (const link of links) {
    const hrefMatch = link.match(/href=["']([^"']*)["']/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    if (href.startsWith("http") || href.startsWith("//")) {
      result.externalLinks++;
    } else if (href.startsWith("/") || href.startsWith("#")) {
      result.internalLinks++;
    }
  }

  // JSON-LD
  const jsonLdMatches = html.match(
    /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  if (jsonLdMatches) {
    result.hasJsonLd = true;
    for (const match of jsonLdMatches) {
      const content = match.replace(/<\/?script[^>]*>/gi, "");
      try {
        const schema = JSON.parse(content);
        if (schema["@type"]) result.jsonLdTypes.push(schema["@type"]);
      } catch {
        // ignore parse errors
      }
    }
  }

  // Hreflang
  result.hasHreflang = /<link[^>]*hreflang/i.test(html);

  // Canonical
  result.hasCanonical = /<link[^>]*rel=["']canonical["']/i.test(html);

  // Word count (rough: strip tags, count words in body)
  const bodyMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (bodyMatch) {
    const text = bodyMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    result.wordCount = text.split(" ").filter((w) => w.length > 0).length;
  }

  // Issues
  if (result.titleLength === 0) {
    result.issues.push("Missing title tag");
  } else if (result.titleLength < 30) {
    result.issues.push(`Title too short (${result.titleLength})`);
  } else if (result.titleLength > 60) {
    result.issues.push(`Title may truncate (${result.titleLength})`);
  }

  if (result.descriptionLength === 0) {
    result.issues.push("Missing meta description");
  } else if (result.descriptionLength < 120) {
    result.issues.push(`Description too short (${result.descriptionLength})`);
  } else if (result.descriptionLength > 160) {
    result.issues.push(`Description may truncate (${result.descriptionLength})`);
  }

  if (result.h1Count === 0) {
    result.issues.push("No H1 tag");
  } else if (result.h1Count > 1) {
    result.issues.push(`Multiple H1 tags (${result.h1Count})`);
  }

  if (result.imgTotal > 0 && result.imgWithAlt < result.imgTotal) {
    result.issues.push(
      `${result.imgTotal - result.imgWithAlt}/${result.imgTotal} images missing alt`,
    );
  }

  if (!result.hasCanonical) {
    result.issues.push("Missing canonical tag");
  }

  return result;
}

// ============================================================
// HTML Report Generator
// ============================================================

function generateReport(pages) {
  const totalPages = pages.length;
  const withIssues = pages.filter((p) => p.issues.length > 0).length;
  const avgWordCount = Math.round(pages.reduce((sum, p) => sum + p.wordCount, 0) / totalPages);
  const withJsonLd = pages.filter((p) => p.hasJsonLd).length;
  const withHreflang = pages.filter((p) => p.hasHreflang).length;

  // Score calculation (0-100)
  let score = 100;
  const totalIssues = pages.reduce((sum, p) => sum + p.issues.length, 0);
  score -= Math.min(50, totalIssues * 2);
  if (withJsonLd < totalPages) score -= Math.round(((totalPages - withJsonLd) / totalPages) * 20);
  if (withHreflang < totalPages)
    score -= Math.round(((totalPages - withHreflang) / totalPages) * 10);
  score = Math.max(0, score);

  const scoreColor = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="robots" content="noindex, nofollow">
<title>SEO Report</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; padding: 2rem; }
  .container { max-width: 1200px; margin: 0 auto; }
  h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
  .subtitle { color: #94a3b8; margin-bottom: 2rem; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .stat { background: #1e293b; border-radius: 0.75rem; padding: 1.25rem; }
  .stat-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; }
  .stat-value { font-size: 1.75rem; font-weight: 700; margin-top: 0.25rem; }
  .score { color: ${scoreColor}; }
  table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 0.75rem; overflow: hidden; }
  th { text-align: left; padding: 0.75rem 1rem; background: #334155; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; }
  td { padding: 0.5rem 1rem; border-top: 1px solid #334155; font-size: 0.875rem; }
  tr:hover td { background: #1e293b80; }
  .issue { color: #fbbf24; font-size: 0.75rem; }
  .pass { color: #22c55e; }
  .fail { color: #ef4444; }
  .badge { display: inline-block; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.625rem; font-weight: 600; }
  .badge-green { background: #22c55e20; color: #22c55e; }
  .badge-red { background: #ef444420; color: #ef4444; }
  .badge-yellow { background: #eab30820; color: #eab308; }
  .badge-blue { background: #3b82f620; color: #3b82f6; }
  .filter { margin-bottom: 1rem; }
  .filter input { background: #1e293b; border: 1px solid #334155; color: #e2e8f0; padding: 0.5rem 1rem; border-radius: 0.5rem; width: 100%; max-width: 400px; }
</style>
</head>
<body>
<div class="container">
  <h1>SEO Scorecard</h1>
  <p class="subtitle">Generated: ${new Date().toISOString().split("T")[0]} | ${totalPages} pages analyzed</p>

  <div class="stats">
    <div class="stat">
      <div class="stat-label">Overall Score</div>
      <div class="stat-value score">${score}/100</div>
    </div>
    <div class="stat">
      <div class="stat-label">Pages with Issues</div>
      <div class="stat-value">${withIssues}/${totalPages}</div>
    </div>
    <div class="stat">
      <div class="stat-label">JSON-LD Coverage</div>
      <div class="stat-value">${Math.round((withJsonLd / totalPages) * 100)}%</div>
    </div>
    <div class="stat">
      <div class="stat-label">Hreflang Coverage</div>
      <div class="stat-value">${Math.round((withHreflang / totalPages) * 100)}%</div>
    </div>
    <div class="stat">
      <div class="stat-label">Avg Word Count</div>
      <div class="stat-value">${avgWordCount}</div>
    </div>
  </div>

  <div class="filter">
    <input type="text" id="search" placeholder="Filter pages..." oninput="filterTable()">
  </div>

  <table id="report">
    <thead>
      <tr>
        <th>Page</th>
        <th>Title</th>
        <th>Desc</th>
        <th>H1</th>
        <th>Images</th>
        <th>Links</th>
        <th>Words</th>
        <th>Schema</th>
        <th>Issues</th>
      </tr>
    </thead>
    <tbody>
${pages
  .sort((a, b) => b.issues.length - a.issues.length)
  .map(
    (p) => `      <tr>
        <td title="${p.path}">${p.path.length > 40 ? "..." + p.path.slice(-37) : p.path}</td>
        <td><span class="badge ${p.titleLength >= 30 && p.titleLength <= 60 ? "badge-green" : p.titleLength === 0 ? "badge-red" : "badge-yellow"}">${p.titleLength}</span></td>
        <td><span class="badge ${p.descriptionLength >= 120 && p.descriptionLength <= 160 ? "badge-green" : p.descriptionLength === 0 ? "badge-red" : "badge-yellow"}">${p.descriptionLength}</span></td>
        <td><span class="${p.h1Count === 1 ? "pass" : "fail"}">${p.h1Count}</span></td>
        <td>${p.imgTotal > 0 ? `<span class="${p.imgWithAlt === p.imgTotal ? "pass" : "fail"}">${p.imgWithAlt}/${p.imgTotal}</span>` : "-"}</td>
        <td><span class="badge badge-blue">${p.internalLinks}</span> / ${p.externalLinks}</td>
        <td>${p.wordCount}</td>
        <td>${p.jsonLdTypes.length > 0 ? p.jsonLdTypes.map((t) => `<span class="badge badge-green">${t}</span>`).join(" ") : '<span class="badge badge-red">none</span>'}</td>
        <td>${p.issues.length > 0 ? p.issues.map((i) => `<span class="issue">${i}</span>`).join("<br>") : '<span class="pass">OK</span>'}</td>
      </tr>`,
  )
  .join("\n")}
    </tbody>
  </table>
</div>
<script>
function filterTable() {
  const q = document.getElementById('search').value.toLowerCase();
  document.querySelectorAll('#report tbody tr').forEach(tr => {
    tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}
</script>
</body>
</html>`;
}

// ============================================================
// Main
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

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error("❌ dist/ directory not found. Run `npm run build` first.");
    process.exit(1);
  }

  console.log("\n📊 SEO Scorecard Generator\n");

  const htmlFiles = findHtmlFiles(DIST_DIR);
  const pages = [];

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf-8");
    const result = analyzeHtml(html, file);
    if (result) pages.push(result);
  }

  console.log(`   Analyzed ${pages.length} pages`);

  const reportHtml = generateReport(pages);
  const reportPath = path.join(DIST_DIR, "_seo-report.html");
  fs.writeFileSync(reportPath, reportHtml, "utf-8");

  const issueCount = pages.reduce((sum, p) => sum + p.issues.length, 0);
  console.log(`   Issues found: ${issueCount}`);
  console.log(`   Report saved: ${reportPath}\n`);
  console.log(`   Open with: npx astro preview → /_seo-report.html\n`);
}

main();
