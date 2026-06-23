import { cpSync, existsSync, mkdirSync, rmSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const publicDir = join(rootDir, "public");

const copyTargets = [
  "index.html",
  "about.html",
  "analytics.js",
  "blog-post.js",
  "case-pages.js",
  "project-drawer.js",
  "privacy-policy.html",
  "process.html",
  "robots.txt",
  "services.html",
  "sitemap.xml",
  "styles.css",
  "theme-toggle.js",
  "work.html",
  "assets",
  "blog",
  "cases"
];

rmSync(publicDir, { recursive: true, force: true });
mkdirSync(publicDir, { recursive: true });

for (const target of copyTargets) {
  const source = join(rootDir, target);
  const destination = join(publicDir, target);

  if (!existsSync(source)) continue;

  cpSync(source, destination, { recursive: true });
}

mkdirSync(join(publicDir, "about"), { recursive: true });
copyFileSync(join(rootDir, "about.html"), join(publicDir, "about", "index.html"));

