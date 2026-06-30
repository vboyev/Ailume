const summaryLinks = document.querySelectorAll("[data-ai-summary]");

if (summaryLinks.length) {
  const title = document.querySelector(".article-blog-hero h1")?.textContent?.trim() || document.title;
  const lead = document.querySelector(".article-blog-lead")?.textContent?.trim() || "";
  const sectionTitles = Array.from(document.querySelectorAll(".article-section h2"))
    .map((heading) => heading.textContent.trim())
    .filter(Boolean)
    .slice(0, 6)
    .join("; ");
  const articleUrl = window.location.href.split("#")[0];
  const prompt = [
    "Summarize this article in 5 concise bullets.",
    `Title: ${title}`,
    lead ? `Intro: ${lead}` : "",
    sectionTitles ? `Sections: ${sectionTitles}` : "",
    `URL: ${articleUrl}`
  ].filter(Boolean).join("\n\n");
  const encodedPrompt = encodeURIComponent(prompt);

  summaryLinks.forEach((link) => {
    const provider = link.dataset.aiSummary;
    link.href = provider === "perplexity"
      ? `https://www.perplexity.ai/search/new?q=${encodedPrompt}`
      : `https://chat.openai.com/?q=${encodedPrompt}`;
  });
}
