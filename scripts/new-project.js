/**
 * new-project.js
 *
 * Interactive CLI to initialize a new client project from the master template.
 * Resets client config, site data, and optionally removes sample content.
 *
 * Usage: npm run new-project
 */

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

/** Parse locales from siteSettings.json.ts */
function getLocales() {
  const settingsPath = path.resolve("src/config/siteSettings.json.ts");
  const content = fs.readFileSync(settingsPath, "utf-8");
  const match = content.match(/export const locales\s*=\s*\[([^\]]+)\]/);
  if (!match) return ["ko", "en"];
  return match[1].match(/"([^"]+)"/g).map((s) => s.replace(/"/g, ""));
}

/** Slugify a business name for package.json */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  console.log("\n🚀 New Client Project Setup\n");

  const locales = getLocales();
  console.log(`   Detected locales: ${locales.join(", ")}\n`);

  // 1. Gather info
  const businessName = await ask("Business name: ");
  const businessUrl = await ask("Website URL (e.g. https://example.com): ");
  const businessDescription = await ask("Business description (1 sentence): ");
  const businessType = await ask(
    "Business type [Organization/LocalBusiness/ProfessionalService]: ",
  );
  const contactEmail = await ask("Contact email (optional): ");
  const contactPhone = await ask("Contact phone (optional): ");

  const removeSamples = await ask(
    "\nRemove sample content? (blog, services, projects, etc.) [y/N]: ",
  );
  const shouldRemoveSamples = removeSamples.toLowerCase() === "y";

  // Confirm
  console.log("\n--- Summary ---");
  console.log(`  Name:        ${businessName || "(keep default)"}`);
  console.log(`  URL:         ${businessUrl || "(keep default)"}`);
  console.log(`  Description: ${businessDescription || "(keep default)"}`);
  console.log(`  Type:        ${businessType || "Organization"}`);
  if (contactEmail) console.log(`  Email:       ${contactEmail}`);
  if (contactPhone) console.log(`  Phone:       ${contactPhone}`);
  console.log(`  Remove samples: ${shouldRemoveSamples ? "Yes" : "No"}`);
  console.log("");

  const confirm = await ask("Proceed? [Y/n]: ");
  if (confirm.toLowerCase() === "n") {
    console.log("Aborted.");
    rl.close();
    return;
  }

  // 2. Update client-config/index.json
  const configPath = path.resolve("src/data/settings/client-config/index.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  config.businessName = businessName || config.businessName;
  config.businessUrl = businessUrl || config.businessUrl;
  config.businessDescription = businessDescription || config.businessDescription;
  config.businessType = businessType || "Organization";
  if (contactEmail) config.businessEmail = contactEmail;
  if (contactPhone) config.businessPhone = contactPhone;

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n", "utf-8");
  console.log("\n✅ Client config updated: src/data/settings/client-config/index.json");

  // 3. Update package.json name
  const pkgPath = path.resolve("package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  if (businessName) {
    pkg.name = slugify(businessName);
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
    console.log(`✅ package.json name updated to "${pkg.name}"`);
  }

  // 4. Update astro.config.mjs site URL
  if (businessUrl) {
    const astroConfigPath = path.resolve("astro.config.mjs");
    let astroConfig = fs.readFileSync(astroConfigPath, "utf-8");
    astroConfig = astroConfig.replace(
      /site:\s*"[^"]*"/,
      `site: "${businessUrl}"`,
    );
    fs.writeFileSync(astroConfigPath, astroConfig, "utf-8");
    console.log("✅ astro.config.mjs site URL updated");
  }

  // 5. Update siteData for all locales
  for (const locale of locales) {
    const siteDataPath = path.resolve(`src/config/${locale}/siteData.json.ts`);
    if (!fs.existsSync(siteDataPath)) continue;

    let siteData = fs.readFileSync(siteDataPath, "utf-8");
    if (businessName) {
      siteData = siteData.replace(/name:\s*"[^"]*"/, `name: "${businessName}"`);
    }
    fs.writeFileSync(siteDataPath, siteData, "utf-8");
    console.log(`✅ siteData updated: ${locale}`);
  }

  // 6. Update main-author name
  if (businessName) {
    const authorPath = path.resolve("src/data/authors/main-author/index.json");
    if (fs.existsSync(authorPath)) {
      const author = JSON.parse(fs.readFileSync(authorPath, "utf-8"));
      author.name = businessName;
      if (contactEmail) author.email = contactEmail;
      fs.writeFileSync(authorPath, JSON.stringify(author, null, 2) + "\n", "utf-8");
      console.log("✅ main-author updated");
    }
  }

  // 7. Remove sample content
  if (shouldRemoveSamples) {
    const sampleDirs = locales
      .flatMap((locale) => [
        `src/data/blog/${locale}`,
        `src/data/services/${locale}`,
        `src/data/projects/${locale}`,
        `src/data/careers/${locale}`,
      ])
      .concat(["src/data/candidates", "src/data/companies", "src/data/codeToggles"]);

    for (const dir of sampleDirs) {
      const fullPath = path.resolve(dir);
      if (fs.existsSync(fullPath)) {
        const entries = fs.readdirSync(fullPath, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            fs.rmSync(path.join(fullPath, entry.name), {
              recursive: true,
              force: true,
            });
          }
        }
        console.log(`🗑️  Cleared: ${dir}`);
      }
    }

    // Clear sample authors except main-author
    const authorsDir = path.resolve("src/data/authors");
    if (fs.existsSync(authorsDir)) {
      const authors = fs.readdirSync(authorsDir, { withFileTypes: true });
      for (const author of authors) {
        if (author.isDirectory() && author.name !== "main-author") {
          fs.rmSync(path.join(authorsDir, author.name), {
            recursive: true,
            force: true,
          });
        }
      }
      console.log("🗑️  Cleared extra authors (kept main-author)");
    }

    console.log("\n✅ Sample content removed. Create your own content in /admin (Keystatic).");
  }

  console.log("\n🎉 Project initialized! Next steps:");
  console.log("   1. npm run dev");
  console.log("   2. Visit /admin to configure Client Settings");
  console.log("   3. Update footer links in src/config/ko/footerData.json.ts");
  console.log("   4. Update navigation in src/config/ko/navData.json.ts");
  console.log("   5. Add your logo to public/logo.svg\n");

  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
