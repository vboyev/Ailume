# Blog editing

Blog posts are edited in Pages CMS and stored as Markdown files in this folder.

Publishing flow:

1. Open https://app.pagescms.org/ and connect the `Halo-Lab/ailume` repository.
2. Open the `Blog posts` collection.
3. Create or edit a post.
4. Set `Status` to `published` when it should appear on the site.
5. Save. Pages CMS commits the Markdown file to GitHub.

GitHub Actions runs `scripts/render-blog.mjs` after content changes and generates the static HTML page in `blog/{slug}/index.html`.

Use `{{ cta }}` in the article body to insert the standard Ailume CTA block.
