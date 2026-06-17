import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const contentDir = path.join(root, "content/blog");
const blogDir = path.join(root, "blog");
const siteUrl = "https://ailume.agency";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseScalar(value = "") {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Blog post is missing YAML frontmatter.");
  }

  const data = {};
  const lines = match[1].split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const topLevel = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);

    if (!topLevel) {
      index += 1;
      continue;
    }

    const [, key, rawValue = ""] = topLevel;

    if (rawValue.trim()) {
      data[key] = parseScalar(rawValue);
      index += 1;
      continue;
    }

    const list = [];
    index += 1;

    while (index < lines.length && lines[index].startsWith("  - ")) {
      const item = {};
      const first = lines[index].slice(4);
      const firstPair = first.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
      if (firstPair) item[firstPair[1]] = parseScalar(firstPair[2]);
      index += 1;

      while (index < lines.length && lines[index].startsWith("    ")) {
        const pair = lines[index].trim().match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (pair) item[pair[1]] = parseScalar(pair[2]);
        index += 1;
      }

      list.push(item);
    }

    data[key] = list;
  }

  return { data, body: match[2].trim() };
}

function inlineMarkdown(value = "") {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function renderCta() {
  return `
              <div class="blog-inline-cta">
                <div>
                  <h2>Scope the next useful step.</h2>
                  <p>Tell us what is slowing design down. We will map the leanest path forward.</p>
                </div>
                <a class="hero-cta" href="/contact" data-project-open>
                  <span class="button-text line-reveal">
                    <span class="line-inner" data-text="Start a project">Start a project</span>
                  </span>
                  <span class="cta-icon" aria-hidden="true">
                    <img src="/assets/arrow-up-right.svg" alt="" />
                  </span>
                </a>
              </div>`;
}

function renderMarkdown(markdown) {
  const blocks = markdown.split(/\n{2,}/);
  const html = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (trimmed === "{{ cta }}") {
      html.push(renderCta());
      continue;
    }

    const heading = trimmed.match(/^(#{2,3})\s+(.+?)(?:\s+\{#([A-Za-z0-9_-]+)\})?$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const id = heading[3] || slugify(text);
      html.push(`<h${level} id="${escapeHtml(id)}">${inlineMarkdown(text)}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith("> ")) {
      html.push(`<div class="blog-callout">${inlineMarkdown(trimmed.replace(/^>\s?/gm, ""))}</div>`);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const items = trimmed
        .split("\n")
        .filter((line) => line.startsWith("- "))
        .map((line) => `                <li>${inlineMarkdown(line.slice(2))}</li>`)
        .join("\n");
      html.push(`<ul>\n${items}\n              </ul>`);
      continue;
    }

    if (trimmed.includes("\n|") || trimmed.startsWith("|")) {
      const rows = trimmed
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("|") && line.endsWith("|"))
        .map((line) => line.slice(1, -1).split("|").map((cell) => cell.trim()));
      const dataRows = rows.filter((row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell)));
      const [head, ...body] = dataRows;
      const thead = head.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("");
      const tbody = body
        .map((row) => `                  <tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`)
        .join("\n");
      html.push(`<table class="blog-table">
                <thead>
                  <tr>${thead}</tr>
                </thead>
                <tbody>
${tbody}
                </tbody>
              </table>`);
      continue;
    }

    html.push(`<p>${inlineMarkdown(trimmed.replace(/\n/g, " "))}</p>`);
  }

  return html.join("\n\n              ");
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function renderDrawer() {
  return `
    <div class="project-drawer" id="project-form" aria-hidden="true" data-project-drawer>
      <aside class="project-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="project-drawer-title">
        <div class="project-drawer-head">
          <div>
            <h2 id="project-drawer-title">Let’s connect</h2>
            <p>Tell us what you're building and where design is slowing you down. We'll scope it with you and get moving fast.</p>
          </div>
          <button class="project-drawer-close" type="button" aria-label="Close project form" data-project-close>
            <span aria-hidden="true"></span>
          </button>
        </div>
        <div class="project-drawer-body">
          <form class="project-form" action="https://formsubmit.co/ajax/hello@ailume.agency" method="post" data-project-form>
            <div class="project-field-grid">
              <label class="project-field">
                <span>Email</span>
                <input class="project-input" type="email" name="email" placeholder="E-mail" required />
              </label>
              <label class="project-field">
                <span>Full name</span>
                <input class="project-input" type="text" name="name" placeholder="Full name" required />
              </label>
            </div>
            <label class="project-field">
              <span>Message</span>
              <textarea class="project-input" name="message" placeholder="Tell us about your product.&#10;What’s your goal, budget and timeline?" required></textarea>
            </label>
            <fieldset class="project-fieldset">
              <legend>How can we help you?</legend>
              <div class="project-chip-row">
                <label class="project-chip"><input type="checkbox" name="need" value="Design sprint" /><span>Design sprint</span></label>
                <label class="project-chip"><input type="checkbox" name="need" value="Embedded team" /><span>Embedded team</span></label>
                <label class="project-chip"><input type="checkbox" name="need" value="Design system" /><span>Design system</span></label>
                <label class="project-chip"><input type="checkbox" name="need" value="UX/UI audit" /><span>UX/UI audit</span></label>
                <label class="project-chip"><input type="checkbox" name="need" value="Prototype" /><span>Prototype</span></label>
              </div>
            </fieldset>
            <button class="project-submit" type="submit">
              <span class="button-text line-reveal">
                <span class="line-inner" data-text="Send a message">Send a message</span>
              </span>
              <span class="cta-icon" aria-hidden="true">
                <img src="/assets/arrow-up-right.svg" alt="" />
              </span>
            </button>
            <p class="project-drawer-note">
              By clicking send you accept our <a href="/privacy-policy.html">Privacy policy</a>.<br />
              Prefer email? <a href="mailto:hello@ailume.agency">hello@ailume.agency</a>
            </p>
          </form>
          <div class="project-success" hidden data-project-success></div>
        </div>
      </aside>
    </div>`;
}

function renderPost(post) {
  const { data, htmlBody } = post;
  const title = data.title;
  const seoTitle = data.seoTitle || title;
  const slug = data.slug;
  const canonical = `${siteUrl}/blog/${slug}/`;
  const description = data.description || data.lead;
  const ogDescription = data.ogDescription || description;
  const cover = data.cover || "/assets/hero-image.png";
  const coverAbsolute = cover.startsWith("http") ? cover : `${siteUrl}${cover}`;
  const toc = Array.isArray(data.toc) ? data.toc : [];
  const tocItems = toc
    .map((item) => `                <li><a href="#${escapeHtml(item.anchor)}">${escapeHtml(item.label)}</a></li>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>
      (() => {
        const key = "ailume-theme";
        const root = document.documentElement;
        let storedTheme = null;
        try {
          storedTheme = window.localStorage.getItem(key);
        } catch (error) {}
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : prefersDark ? "dark" : "light";
        root.dataset.theme = theme;
        root.style.colorScheme = theme;
      })();
    </script>
    <title>${escapeHtml(seoTitle)} | Ailume</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="${data.status === "published" ? "index, follow, max-image-preview:large" : "noindex, nofollow"}" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="theme-color" content="#0b0d12" media="(prefers-color-scheme: dark)" />
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Ailume" />
    <meta property="og:title" content="${escapeHtml(seoTitle)} | Ailume" />
    <meta property="og:description" content="${escapeHtml(ogDescription)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${escapeHtml(coverAbsolute)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="stylesheet" href="/styles.css?v=success-state-2" />
    <script type="application/ld+json">
      ${JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": canonical,
          mainEntityOfPage: canonical,
          headline: seoTitle,
          description,
          datePublished: data.date,
          author: {
            "@type": "Organization",
            name: "Ailume"
          },
          publisher: {
            "@type": "Organization",
            name: "Ailume",
            url: siteUrl
          },
          image: coverAbsolute
        },
        null,
        8
      )}
    </script>
  </head>
  <body>
    <header class="site-header">
      <div class="header-inner">
        <a class="logo line-reveal" href="/" aria-label="Ailume home">
          <span class="line-inner" data-text="Ailume">Ailume</span>
        </a>
        <div class="header-actions">
          <button class="theme-toggle" type="button" aria-label="Toggle color theme" data-theme-toggle>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7.11111" stroke="currentColor" stroke-width="1.77778" />
              <path d="M8.00011 3.55557C10.4547 3.55557 12.4446 5.54541 12.4446 8.00001C12.4446 10.4546 10.4547 12.4445 8.00011 12.4445L8.00011 3.55557Z" fill="currentColor" />
            </svg>
          </button>
          <a class="header-cta" href="/contact" data-project-open>
            <span class="button-text line-reveal">
              <span class="line-inner" data-text="Start a project">Start a project</span>
            </span>
            <span class="cta-icon" aria-hidden="true">
              <img src="/assets/arrow-up-right.svg" alt="" />
            </span>
          </a>
        </div>
      </div>
    </header>

    <main class="blog-post-main">
      <section class="blog-hero">
        <div class="blog-hero-inner">
          <ul class="blog-breadcrumbs" aria-label="Breadcrumbs">
            <li><a href="/">Home</a></li>
            <li>/</li>
            <li><a href="/blog/${escapeHtml(slug)}/">Blog</a></li>
            <li>/</li>
            <li>${escapeHtml(data.category || "Blog")}</li>
          </ul>
          <h1 data-blog-reveal>${escapeHtml(title)}</h1>
          <div class="blog-hero-meta" data-blog-reveal>
            <span>${escapeHtml(formatDate(data.date))}</span>
            <span>${escapeHtml(data.readTime || "6 min read")}</span>
            <span>${escapeHtml(data.category || "Product design")}</span>
          </div>
        </div>
      </section>

      <article class="blog-shell">
        <div class="blog-intro-grid" data-blog-reveal>
          <p class="blog-lead">${escapeHtml(data.lead || "")}</p>
          <aside class="blog-author-card" aria-label="Author">
            <span class="blog-author-avatar" aria-hidden="true"></span>
            <div>
              <strong>${escapeHtml(data.author || "Ailume team")}</strong>
              <span>${escapeHtml(data.authorRole || "AI-augmented product design agency")}</span>
            </div>
          </aside>
        </div>

        <div class="blog-content-grid">
          <aside class="blog-sidebar" data-blog-reveal>
            <nav class="blog-toc" aria-label="Table of contents">
              <strong>Table of contents</strong>
              <ol>
${tocItems}
              </ol>
            </nav>
            <div class="blog-sidebar-cta">
              <p>Need a scope you can actually use?</p>
              <a class="deliver-link" href="/contact" data-project-open>
                <span>Ask Ailume</span>
                <span class="mini-icon" aria-hidden="true">
                  <img src="/assets/arrow-up-right.svg" alt="" />
                </span>
              </a>
            </div>
          </aside>

          <div class="blog-article" data-blog-reveal>
            <figure class="blog-cover">
              <img src="${escapeHtml(cover)}" alt="${escapeHtml(data.coverAlt || title)}" width="1344" height="1240" />
              <figcaption>${escapeHtml(data.coverCaption || "")}</figcaption>
            </figure>

            <div class="blog-rich">
              ${htmlBody}
            </div>
          </div>
        </div>
      </article>
    </main>

${renderDrawer()}

    <footer class="site-footer">
      <div class="footer-meta">
        <span>2026 © Ailume. All rights reserved</span>
      </div>
      <div class="footer-side">
        <a class="footer-link" href="/privacy-policy.html">Privacy policy</a>
        <a class="footer-halo" href="https://www.halo-lab.com/" target="_blank" rel="noopener noreferrer">
          <span>Part of</span>
          <img src="/assets/halolab.svg" alt="Halo Lab" />
        </a>
      </div>
    </footer>
    <script src="/project-drawer.js?v=project-drawer-8" defer></script>
    <script src="/theme-toggle.js?v=1" defer></script>
    <script src="/blog-post.js?v=1" defer></script>
  </body>
</html>
`;
}

async function readPosts() {
  const files = (await readdir(contentDir)).filter((file) => file.endsWith(".md") && file !== "README.md");
  const posts = [];

  for (const file of files) {
    const source = await readFile(path.join(contentDir, file), "utf8");
    const { data, body } = parseFrontmatter(source);
    if (!data.slug) data.slug = slugify(data.title || file.replace(/\.md$/, ""));
    posts.push({ data, body, htmlBody: renderMarkdown(body) });
  }

  return posts;
}

async function renderSitemap(posts) {
  const staticUrls = [
    "",
    "about.html",
    "process.html",
    "privacy-policy.html",
    "cases/trafio/",
    "cases/flowapps/",
    "cases/clawerly/",
    "cases/asi/"
  ];
  const publishedPosts = posts.filter((post) => post.data.status === "published");
  const urls = [
    ...staticUrls.map((url) => ({ loc: `${siteUrl}/${url}`, lastmod: "2026-06-16" })),
    ...publishedPosts.map((post) => ({
      loc: `${siteUrl}/blog/${post.data.slug}/`,
      lastmod: post.data.date || "2026-06-16"
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  await writeFile(path.join(root, "sitemap.xml"), xml);
}

const posts = await readPosts();

for (const post of posts) {
  if (post.data.status !== "published") continue;
  const outputDir = path.join(blogDir, post.data.slug);
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), renderPost(post));
}

await renderSitemap(posts);
console.log(`Rendered ${posts.filter((post) => post.data.status === "published").length} published blog post(s).`);
